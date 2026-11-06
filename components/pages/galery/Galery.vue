<template>
    <section class="gallery" :class="{ 'gallery--edit': isEditMode }">
        <div class="container">
            <div class="gallery__content">
                <div class="gallery__head">
                    <h1 class="title gallery__title">Галерея</h1>
                    <div class="gallery__controls" v-if="isAdmin">
                        <Transition name="gallery-upload">
                            <FileUploader
                                :is-loading="isUploading"
                                :max-file-size="MAX_FILE_SIZE"
                                :max-image-size="MAX_IMAGE_SIZE"
                                :message="uploadMessage"
                                v-if="isEditMode"
                                @select="selectImage"
                            />
                        </Transition>
                        <button
                            type="button"
                            class="gallery__edit-button"
                            :aria-label="isEditMode ? 'Завершить редактирование' : 'Редактировать галерею'"
                            :title="isEditMode ? 'Завершить редактирование' : 'Редактировать галерею'"
                            :aria-pressed="isEditMode"
                            @click="toggleEditMode"
                        >
                            <EditIcon />
                        </button>
                    </div>
                </div>
                <div class="gallery__list">
                    <div
                        class="gallery__item"
                        v-for="image in images"
                        :key="image.id || image.path"
                        :class="{
                            'gallery__item--editable': isEditMode && isAdmin && image.id,
                            'gallery__item--dragging': draggedImageId === image.id,
                            'gallery__item--drag-over': dragOverImageId === image.id
                        }"
                        :data-sort-id="image.id || undefined"
                        :draggable="isEditMode && isAdmin && Boolean(image.id) && !isSwappingImages"
                        @click="handleImageClick(image)"
                        @pointerdown="imageTouchDrag.start($event, image)"
                        @pointermove="imageTouchDrag.move"
                        @pointerup="imageTouchDrag.end"
                        @pointercancel="imageTouchDrag.cancel"
                        @dragstart.stop="startImageDrag($event, image)"
                        @dragenter.prevent="enterImageDrag(image)"
                        @dragover.prevent
                        @drop.stop.prevent="dropImage(image)"
                        @dragend="finishImageDrag"
                    >
                        <div class="gallery__item-content">
                            <img
                                :src="image.url"
                                alt="Фотография Чертогов Героев"
                                class="gallery__img"
                                draggable="false"
                            >
                            <template v-if="isEditMode && isAdmin && image.id">
                                <span class="gallery__item-edit-hint">Нажмите, чтобы редактировать</span>
                            </template>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </section>

    <Transition name="zoom">
        <ZoomSlider
            :images="zoomImages"
            :initial-index="zoomedImageIndex"
            v-if="zoomedImageIndex !== null && zoomImages.length"
            @close="closeImageZoom"
        />
    </Transition>

    <Teleport to="body">
        <Transition name="modal" appear>
            <ImageCropper
                :file="cropFile"
                :image-size="cropImageSize"
                :is-loading="isUploading"
                :max-output-size="MAX_IMAGE_SIZE"
                :message="uploadMessage"
                output-mode="crop"
                v-if="cropFile && cropImageSize"
                @confirm="uploadImage"
                @replace="selectImage"
                @cancel="closeCropper"
            />
        </Transition>

        <Transition name="modal" appear>
            <ImageCropper
                :file="editCropFile"
                :image-size="editCropImageSize"
                :initial-crop="editInitialCrop"
                :is-loading="isUpdatingImage || Boolean(deletingImage)"
                :message="editMessage"
                can-delete
                confirm-text="Сохранить"
                output-mode="crop"
                replace-text="Заменить фото"
                v-if="editedImage && editCropFile && editCropImageSize"
                @confirm="saveImageCrop"
                @delete="requestImageDelete"
                @replace="replaceEditedImage"
                @cancel="closeImageEditor"
            />
        </Transition>

        <Transition name="modal" appear>
            <DeleteConfirmation
                :is-loading="isDeletingImage"
                v-if="deletingImage"
                @confirm="confirmImageDelete"
                @cancel="cancelImageDelete"
            />
        </Transition>
    </Teleport>
</template>

<script setup>

    import FileUploader from '@/components/sections/ui/FileUploader.vue';
    import ImageCropper from '@/components/sections/ui/ImageCropper.vue';
    import DeleteConfirmation from '@/components/sections/ui/DeleteConfirmation.vue';
    import ZoomSlider from '@/components/shared/instruments/ZoomSlider.vue';
    import EditIcon from '@/components/icons/events/cards/Edit.vue';
    import {
        createGalleryImage,
        deleteGalleryImage,
        getGalleryImages,
        updateGalleryImage,
        swapGalleryImageWeight
    } from '@/api/gallery.js';
    import { useUserStore } from '@/store/useUsers.js';
    import createTouchDrag from '@/utils/createTouchDrag.js';
    import getImageUrl from '@/utils/getImageUrl.js';

    const MAX_FILE_SIZE = 10 * 1024 * 1024;
    const MAX_IMAGE_SIZE = 5000;
    const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

    const userStore = useUserStore();

    const images = ref([]);
    const cropFile = shallowRef(null);
    const cropImageSize = ref(null);
    const editedImage = ref(null);
    const editCropFile = shallowRef(null);
    const editCropImageSize = ref(null);
    const deletingImage = ref(null);
    const isEditMode = ref(false);
    const isUploading = ref(false);
    const isEditorLoading = ref(false);
    const isUpdatingImage = ref(false);
    const isDeletingImage = ref(false);
    const isReplacingImage = ref(false);
    const isSwappingImages = ref(false);
    const draggedImageId = ref(null);
    const dragOverImageId = ref(null);
    const zoomedImageIndex = ref(null);
    const uploadMessage = ref({ type: '', text: '' });
    const editMessage = ref({ type: '', text: '' });
    const nextGalleryWeight = ref(1);

    const isAdmin = computed(() => {
        return userStore.profile?.role === 'ADMIN' || userStore.profile?.role === 'SUPER_ADMIN';
    });

    const editInitialCrop = computed(() => {
        if (!editedImage.value || isReplacingImage.value) {
            return null;
        }

        return {
            x: editedImage.value.cropX,
            y: editedImage.value.cropY,
            size: editedImage.value.centerWidth
        };
    });

    let ignoreImageClickUntil = 0;

    const sortImagesByWeight = (galleryImages) => {
        return [...galleryImages].sort((firstImage, secondImage) => {
            const firstWeight = Number(firstImage.weight);
            const secondWeight = Number(secondImage.weight);

            if (!Number.isFinite(firstWeight) && !Number.isFinite(secondWeight)) {
                return 0;
            }

            if (!Number.isFinite(firstWeight)) {
                return 1;
            }

            if (!Number.isFinite(secondWeight)) {
                return -1;
            }

            return firstWeight - secondWeight;
        });
    };

    const toggleEditMode = () => {
        if (!isAdmin.value) {
            return;
        }

        isEditMode.value = !isEditMode.value;

        if (!isEditMode.value) {
            imageTouchDrag.cancel();
            finishImageDrag();
        }
    };

    const finishImageDrag = () => {
        if (draggedImageId.value) {
            ignoreImageClickUntil = Date.now() + 300;
        }

        draggedImageId.value = null;
        dragOverImageId.value = null;
    };

    const startImageDrag = (event, image) => {
        if (!isEditMode.value || !isAdmin.value || !image.id || isSwappingImages.value) {
            event.preventDefault();
            return;
        }

        ignoreImageClickUntil = Number.POSITIVE_INFINITY;
        draggedImageId.value = image.id;
        dragOverImageId.value = null;
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', image.id);
    };

    const enterImageDrag = (image) => {
        if (!draggedImageId.value || draggedImageId.value === image.id) {
            dragOverImageId.value = null;
            return;
        }

        dragOverImageId.value = image.id;
    };

    const dropImage = async (targetImage) => {
        const sourceImageId = draggedImageId.value;

        if (
            !sourceImageId
            || !targetImage.id
            || sourceImageId === targetImage.id
            || isSwappingImages.value
        ) {
            finishImageDrag();
            return;
        }

        const sourceImage = images.value.find((image) => image.id === sourceImageId);

        if (!sourceImage) {
            finishImageDrag();
            return;
        }

        const previousImages = images.value.map((image) => ({ ...image }));
        const sourceWeight = sourceImage.weight;

        sourceImage.weight = targetImage.weight;
        targetImage.weight = sourceWeight;
        images.value = sortImagesByWeight(images.value);
        isSwappingImages.value = true;
        uploadMessage.value = { type: '', text: '' };

        try {
            const response = await swapGalleryImageWeight(sourceImage.id, targetImage.id);

            if (!response?.first || !response?.second) {
                throw new Error('Не удалось изменить порядок изображений');
            }

            const updatedWeights = new Map([
                [response.first.id, response.first.weight],
                [response.second.id, response.second.weight]
            ]);

            images.value = sortImagesByWeight(images.value.map((image) => ({
                ...image,
                weight: updatedWeights.has(image.id)
                    ? updatedWeights.get(image.id)
                    : image.weight
            })));
        }
        catch (error) {
            console.log(error);
            images.value = previousImages;
            uploadMessage.value = { type: 'error', text: 'Не удалось изменить порядок изображений' };
        }
        finally {
            isSwappingImages.value = false;
            finishImageDrag();
        }
    };

    const imageTouchDrag = createTouchDrag({
        selector: '[data-sort-id]',
        getItemId: (image) => image.id,
        canStart: (image) => {
            return isEditMode.value
                && isAdmin.value
                && Boolean(image.id)
                && !isSwappingImages.value;
        },
        onStart: (image) => {
            ignoreImageClickUntil = Number.POSITIVE_INFINITY;
            draggedImageId.value = image.id;
            dragOverImageId.value = null;
        },
        onOver: (targetId) => {
            dragOverImageId.value = targetId;
        },
        onDrop: (targetId) => {
            const targetImage = images.value.find((image) => image.id === targetId);

            if (targetImage) {
                dropImage(targetImage);
                return;
            }

            finishImageDrag();
        },
        onCancel: finishImageDrag
    });

    const getImageSize = (file) => {
        return new Promise((resolve, reject) => {
            const image = new Image();
            const imageUrl = URL.createObjectURL(file);

            image.onload = () => {
                URL.revokeObjectURL(imageUrl);
                resolve({ width: image.naturalWidth, height: image.naturalHeight });
            };

            image.onerror = () => {
                URL.revokeObjectURL(imageUrl);
                reject(new Error('Не удалось прочитать изображение'));
            };

            image.src = imageUrl;
        });
    };

    const normalizeGalleryImage = (image, cacheKey = '') => {
        const imageUrl = getImageUrl(image.cropPath || image.path);

        return {
            ...image,
            url: cacheKey && imageUrl ? `${imageUrl}?v=${cacheKey}` : imageUrl
        };
    };

    const getOriginalImagePath = (path) => {
        if (/^gallery\/originals\//i.test(String(path || ''))) {
            return path;
        }

        const imageName = String(path || '').match(/^gallery\/cropped\/([0-9a-f-]{36})\.webp$/i)?.[1];
        return imageName ? `gallery/originals/${imageName}.original` : null;
    };

    const zoomImages = computed(() => {
        return images.value.map((image) => {
            const originalPath = getOriginalImagePath(image.path) || image.path;

            return getImageUrl(originalPath) || image.url;
        });
    });

    const openImageZoom = (image) => {
        if (Date.now() < ignoreImageClickUntil || draggedImageId.value) {
            return;
        }

        const imageIndex = images.value.findIndex((galleryImage) => galleryImage === image);

        if (imageIndex !== -1) {
            zoomedImageIndex.value = imageIndex;
        }
    };

    const handleImageClick = (image) => {
        if (Date.now() < ignoreImageClickUntil || draggedImageId.value) {
            return;
        }

        if (isEditMode.value && isAdmin.value) {
            openImageEditor(image);
            return;
        }

        openImageZoom(image);
    };

    const closeImageZoom = () => {
        zoomedImageIndex.value = null;
    };

    const getImageMimeType = async (blob) => {
        const bytes = new Uint8Array(await blob.slice(0, 12).arrayBuffer());
        const signature = String.fromCharCode(...bytes);

        if (bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF) {
            return 'image/jpeg';
        }

        if (
            bytes[0] === 0x89
            && bytes[1] === 0x50
            && bytes[2] === 0x4E
            && bytes[3] === 0x47
        ) {
            return 'image/png';
        }

        if (signature.startsWith('RIFF') && signature.slice(8, 12) === 'WEBP') {
            return 'image/webp';
        }

        if (signature.slice(4, 12).includes('ftypavif')) {
            return 'image/avif';
        }

        return 'application/octet-stream';
    };

    const validateImage = async (file) => {
        if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
            return { error: 'Доступны только изображения JPG, JPEG, PNG и WEBP' };
        }

        if (file.size > MAX_FILE_SIZE) {
            return { error: 'Изображение должно весить не более 10 МБ' };
        }

        const imageSize = await getImageSize(file);

        if (imageSize.width > MAX_IMAGE_SIZE || imageSize.height > MAX_IMAGE_SIZE) {
            return { error: `Ширина и высота изображения должны быть не более ${MAX_IMAGE_SIZE} px` };
        }

        return { error: '', imageSize };
    };

    const selectImage = async (file) => {
        if (!file || isUploading.value) {
            return;
        }

        uploadMessage.value = { type: '', text: '' };

        try {
            const validation = await validateImage(file);

            if (validation.error) {
                uploadMessage.value = { type: 'error', text: validation.error };
                return;
            }

            cropFile.value = file;
            cropImageSize.value = validation.imageSize;
        }
        catch (error) {
            console.log(error);
            uploadMessage.value = { type: 'error', text: 'Не удалось прочитать изображение' };
        }
    };

    const closeCropper = () => {
        if (isUploading.value) {
            return;
        }

        cropFile.value = null;
        cropImageSize.value = null;
    };

    const uploadImage = async ({ crop }) => {
        if (!cropFile.value || !crop || isUploading.value) {
            return;
        }

        uploadMessage.value = { type: '', text: '' };
        isUploading.value = true;

        try {
            const response = await createGalleryImage(cropFile.value, crop, nextGalleryWeight.value);
            const galleryImage = response?.path ? normalizeGalleryImage(response) : null;

            if (!galleryImage?.url) {
                uploadMessage.value = { type: 'error', text: 'Не удалось загрузить изображение' };
                return;
            }

            images.value.push(galleryImage);
            nextGalleryWeight.value += 1;
            cropFile.value = null;
            cropImageSize.value = null;
            uploadMessage.value = { type: '', text: '' };
        }
        catch (error) {
            console.log(error);
            uploadMessage.value = { type: 'error', text: 'Не удалось загрузить изображение' };
        }
        finally {
            isUploading.value = false;
        }
    };

    const openImageEditor = async (image) => {
        if (!isAdmin.value || !image.id || isEditorLoading.value || isUpdatingImage.value) {
            return;
        }

        const originalPath = getOriginalImagePath(image.path);

        if (!originalPath) {
            return;
        }

        isEditorLoading.value = true;
        editMessage.value = { type: '', text: '' };

        try {
            const response = await fetch(getImageUrl(originalPath));

            if (!response.ok) {
                throw new Error('Оригинал изображения не найден');
            }

            const blob = await response.blob();
            const mimeType = await getImageMimeType(blob);
            const originalFile = new File(
                [blob],
                `${image.id}.original`,
                { type: mimeType }
            );
            const imageSize = await getImageSize(originalFile);

            editedImage.value = image;
            editCropFile.value = originalFile;
            editCropImageSize.value = imageSize;
            isReplacingImage.value = false;
        }
        catch (error) {
            console.log(error);
            uploadMessage.value = { type: 'error', text: 'Не удалось открыть оригинал изображения' };
        }
        finally {
            isEditorLoading.value = false;
        }
    };

    const resetImageEditor = () => {
        editedImage.value = null;
        editCropFile.value = null;
        editCropImageSize.value = null;
        isReplacingImage.value = false;
        editMessage.value = { type: '', text: '' };
    };

    const closeImageEditor = () => {
        if (isUpdatingImage.value || isDeletingImage.value) {
            return;
        }

        resetImageEditor();
    };

    const saveImageCrop = async ({ crop }) => {
        if (!editedImage.value?.id || !crop || isUpdatingImage.value) {
            return;
        }

        isUpdatingImage.value = true;
        editMessage.value = { type: '', text: '' };
        let isUpdated = false;

        try {
            const response = await updateGalleryImage(
                editedImage.value.id,
                crop,
                editedImage.value.weight,
                isReplacingImage.value ? editCropFile.value : null
            );
            const updatedImage = response?.path
                ? normalizeGalleryImage(response, Date.now())
                : null;

            if (!updatedImage?.url) {
                editMessage.value = { type: 'error', text: 'Не удалось сохранить изображение' };
                return;
            }

            const imageIndex = images.value.findIndex((image) => image.id === updatedImage.id);

            if (imageIndex !== -1) {
                images.value[imageIndex] = updatedImage;
            }

            isUpdated = true;
        }
        catch (error) {
            console.log(error);
            editMessage.value = { type: 'error', text: 'Не удалось сохранить изображение' };
        }
        finally {
            isUpdatingImage.value = false;

            if (isUpdated) {
                resetImageEditor();
            }
        }
    };

    const replaceEditedImage = async (file) => {
        if (!file || isUpdatingImage.value || isDeletingImage.value) {
            return;
        }

        editMessage.value = { type: '', text: '' };

        try {
            const validation = await validateImage(file);

            if (validation.error) {
                editMessage.value = { type: 'error', text: validation.error };
                return;
            }

            editCropFile.value = file;
            editCropImageSize.value = validation.imageSize;
            isReplacingImage.value = true;
        }
        catch (error) {
            console.log(error);
            editMessage.value = { type: 'error', text: 'Не удалось прочитать изображение' };
        }
    };

    const requestImageDelete = () => {
        deletingImage.value = editedImage.value;
    };

    const cancelImageDelete = () => {
        if (!isDeletingImage.value) {
            deletingImage.value = null;
        }
    };

    const confirmImageDelete = async () => {
        if (!deletingImage.value?.id || isDeletingImage.value) {
            return;
        }

        isDeletingImage.value = true;
        editMessage.value = { type: '', text: '' };
        let isDeleted = false;

        try {
            const response = await deleteGalleryImage(deletingImage.value.id);

            if (!response) {
                editMessage.value = { type: 'error', text: 'Не удалось удалить изображение' };
                return;
            }

            images.value = images.value.filter((image) => image.id !== deletingImage.value.id);
            isDeleted = true;
        }
        catch (error) {
            console.log(error);
            editMessage.value = { type: 'error', text: 'Не удалось удалить изображение' };
        }
        finally {
            isDeletingImage.value = false;
            deletingImage.value = null;

            if (isDeleted) {
                resetImageEditor();
            }
        }
    };

    const fetchGalleryImages = async () => {
        const response = await getGalleryImages();
        const gallery = Array.isArray(response?.rows) ? response.rows : [];
        const uploadedImages = gallery
            .map((image) => normalizeGalleryImage(image))
            .filter((image) => image.url);
        const galleryWeights = gallery
            .map((image) => Number(image.weight))
            .filter(Number.isFinite);

        nextGalleryWeight.value = galleryWeights.length
            ? Math.max(...galleryWeights) + 1
            : 1;

        images.value = sortImagesByWeight(uploadedImages);
    };

    onMounted(async () => {
        if (!userStore.profile && localStorage.getItem('accessToken')) {
            await userStore.fetchProfile();
        }

        await fetchGalleryImages();
    });

    onBeforeUnmount(() => {
        imageTouchDrag.cancel();
    });

</script>

<style lang="scss">
    @import '@/assets/styles/components/gallery.scss';
</style>
