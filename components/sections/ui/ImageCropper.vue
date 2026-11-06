<template>
    <div class="image-cropper" @pointerdown.self="cancelCrop">
            <div class="image-cropper__content modal-transition__content">
                <div class="image-cropper__head">
                    <h2 class="image-cropper__title">Обрезка изображения</h2>
                    <button
                        type="button"
                        class="image-cropper__close"
                        aria-label="Закрыть"
                        :disabled="isLoading || isProcessing"
                        @click="cancelCrop"
                    >
                        <CloseIcon />
                    </button>
                </div>

                <p class="image-cropper__description">
                    Перемещайте квадратную рамку и тяните за её углы, чтобы выбрать область изображения
                </p>

                <div
                    ref="cropAreaRef"
                    class="image-cropper__area"
                    @pointermove="changeCrop"
                    @pointerup="stopCropChange"
                    @pointercancel="stopCropChange"
                >
                    <img
                        ref="imageRef"
                        :src="imageUrl"
                        :style="imageStyle"
                        alt="Изображение для обрезки"
                        class="image-cropper__image"
                        draggable="false"
                        @load="initializeImage"
                    >

                    <div
                        class="image-cropper__frame"
                        :class="{ 'image-cropper__frame--moving': interactionType === 'move' }"
                        :style="cropStyle"
                        @pointerdown.stop="startCropMove"
                    >
                        <span
                            class="image-cropper__handle image-cropper__handle--north-west"
                            @pointerdown.stop="startCropResize($event, 'north-west')"
                        ></span>
                        <span
                            class="image-cropper__handle image-cropper__handle--north-east"
                            @pointerdown.stop="startCropResize($event, 'north-east')"
                        ></span>
                        <span
                            class="image-cropper__handle image-cropper__handle--south-west"
                            @pointerdown.stop="startCropResize($event, 'south-west')"
                        ></span>
                        <span
                            class="image-cropper__handle image-cropper__handle--south-east"
                            @pointerdown.stop="startCropResize($event, 'south-east')"
                        ></span>
                    </div>
                </div>

                <input
                    ref="replaceInputRef"
                    type="file"
                    :accept="accept"
                    class="image-cropper__replace-input"
                    @change="replaceImage"
                >
                <button
                    type="button"
                    class="image-cropper__replace"
                    :disabled="isLoading || isProcessing"
                    v-if="canReplace"
                    @click="openFilePicker"
                >
                    {{ replaceText }}
                </button>

                <p class="image-cropper__message" v-if="displayedMessage">
                    {{ displayedMessage }}
                </p>

                <div class="image-cropper__actions">
                    <button
                        type="button"
                        class="image-cropper__button image-cropper__button--delete"
                        :disabled="isLoading || isProcessing"
                        v-if="canDelete"
                        @click="deleteImage"
                    >
                        Удалить
                    </button>
                    <button
                        type="button"
                        class="image-cropper__button image-cropper__button--secondary"
                        :disabled="isLoading || isProcessing"
                        @click="cancelCrop"
                    >
                        Отмена
                    </button>
                    <button
                        type="button"
                        class="image-cropper__button image-cropper__button--primary"
                        :disabled="isLoading || isProcessing || !isImageReady"
                        @click="confirmCrop"
                    >
                        {{ confirmButtonText }}
                    </button>
                </div>
            </div>
    </div>
</template>

<script setup>

    import CloseIcon from '@/components/icons/development/Close.vue';

    const props = defineProps({
        file: {
            type: Object,
            required: true
        },

        imageSize: {
            type: Object,
            required: true
        },

        isLoading: {
            type: Boolean,
            default: false
        },

        message: {
            type: Object,
            default: () => ({ type: '', text: '' })
        },

        maxOutputSize: {
            type: Number,
            default: 5000
        },

        initialCrop: {
            type: Object,
            default: null
        },

        outputMode: {
            type: String,
            default: 'file',
            validator: (value) => ['file', 'crop'].includes(value)
        },

        confirmText: {
            type: String,
            default: ''
        },

        canDelete: {
            type: Boolean,
            default: false
        },

        canReplace: {
            type: Boolean,
            default: true
        },

        replaceText: {
            type: String,
            default: 'Выбрать другое фото'
        },

        accept: {
            type: String,
            default: 'image/jpeg,image/png,image/webp'
        }
    });

    const emit = defineEmits(['confirm', 'cancel', 'delete', 'replace']);

    const cropAreaRef = ref(null);
    const imageRef = ref(null);
    const replaceInputRef = ref(null);
    const imageUrl = ref('');
    const viewportWidth = ref(0);
    const viewportHeight = ref(0);
    const isImageReady = ref(false);
    const isProcessing = ref(false);
    const cropError = ref('');
    const interactionType = ref('');

    const crop = reactive({
        x: 0,
        y: 0,
        size: 0
    });

    let resizeObserver = null;
    let cropInteraction = null;
    let previousBodyOverflow = '';

    const imageBounds = computed(() => {
        if (!viewportWidth.value || !viewportHeight.value) {
            return {
                left: 0,
                top: 0,
                width: 0,
                height: 0,
                scale: 1
            };
        }

        const scale = Math.min(
            viewportWidth.value / props.imageSize.width,
            viewportHeight.value / props.imageSize.height
        );
        const width = props.imageSize.width * scale;
        const height = props.imageSize.height * scale;

        return {
            left: (viewportWidth.value - width) / 2,
            top: (viewportHeight.value - height) / 2,
            width,
            height,
            scale
        };
    });

    const imageStyle = computed(() => {
        return {
            width: `${imageBounds.value.width}px`,
            height: `${imageBounds.value.height}px`,
            left: `${imageBounds.value.left}px`,
            top: `${imageBounds.value.top}px`
        };
    });

    const cropStyle = computed(() => {
        return {
            width: `${crop.size}px`,
            height: `${crop.size}px`,
            left: `${crop.x}px`,
            top: `${crop.y}px`
        };
    });

    const displayedMessage = computed(() => {
        return cropError.value || props.message.text;
    });

    const confirmButtonText = computed(() => {
        if (props.isLoading) {
            return props.outputMode === 'crop' ? 'Сохраняем...' : 'Загружаем...';
        }

        if (isProcessing.value) {
            return 'Обрезаем...';
        }

        return props.confirmText || 'Обрезать и загрузить';
    });

    const clamp = (value, min, max) => {
        return Math.min(Math.max(value, min), max);
    };

    const getMaxCropSize = () => {
        return Math.min(imageBounds.value.width, imageBounds.value.height);
    };

    const getMinCropSize = () => {
        return Math.min(120, getMaxCropSize());
    };

    const initializeCropFrame = () => {
        const maxSize = getMaxCropSize();

        if (!maxSize) {
            return;
        }

        const initialCrop = props.initialCrop;
        const initialSize = Number(initialCrop?.size);
        const initialX = Number(initialCrop?.x);
        const initialY = Number(initialCrop?.y);

        if (
            Number.isFinite(initialSize)
            && Number.isFinite(initialX)
            && Number.isFinite(initialY)
            && initialSize > 0
        ) {
            const size = clamp(
                initialSize * imageBounds.value.scale,
                getMinCropSize(),
                maxSize
            );
            const imageRight = imageBounds.value.left + imageBounds.value.width;
            const imageBottom = imageBounds.value.top + imageBounds.value.height;

            crop.size = size;
            crop.x = clamp(
                imageBounds.value.left + initialX * imageBounds.value.scale,
                imageBounds.value.left,
                imageRight - size
            );
            crop.y = clamp(
                imageBounds.value.top + initialY * imageBounds.value.scale,
                imageBounds.value.top,
                imageBottom - size
            );
            return;
        }

        crop.size = maxSize;
        crop.x = imageBounds.value.left + (imageBounds.value.width - maxSize) / 2;
        crop.y = imageBounds.value.top + (imageBounds.value.height - maxSize) / 2;
    };

    const updateViewportSize = () => {
        if (!cropAreaRef.value) {
            return;
        }

        const width = cropAreaRef.value.clientWidth;
        const height = cropAreaRef.value.clientHeight;
        const isChanged = width !== viewportWidth.value || height !== viewportHeight.value;

        viewportWidth.value = width;
        viewportHeight.value = height;

        if (isChanged && isImageReady.value) {
            nextTick(initializeCropFrame);
        }
    };

    const initializeImage = () => {
        isImageReady.value = true;
        updateViewportSize();
        nextTick(initializeCropFrame);
    };

    const startCropInteraction = (event, type, corner = '') => {
        if (!isImageReady.value || props.isLoading || isProcessing.value) {
            return;
        }

        event.preventDefault();
        cropAreaRef.value.setPointerCapture?.(event.pointerId);
        interactionType.value = type;
        cropInteraction = {
            pointerId: event.pointerId,
            startX: event.clientX,
            startY: event.clientY,
            corner,
            crop: {
                x: crop.x,
                y: crop.y,
                size: crop.size
            }
        };
    };

    const startCropMove = (event) => {
        startCropInteraction(event, 'move');
    };

    const startCropResize = (event, corner) => {
        startCropInteraction(event, 'resize', corner);
    };

    const moveCropFrame = (event) => {
        const nextX = cropInteraction.crop.x + event.clientX - cropInteraction.startX;
        const nextY = cropInteraction.crop.y + event.clientY - cropInteraction.startY;
        const right = imageBounds.value.left + imageBounds.value.width;
        const bottom = imageBounds.value.top + imageBounds.value.height;

        crop.x = clamp(nextX, imageBounds.value.left, right - crop.size);
        crop.y = clamp(nextY, imageBounds.value.top, bottom - crop.size);
    };

    const getResizeDelta = (event) => {
        const moveX = event.clientX - cropInteraction.startX;
        const moveY = event.clientY - cropInteraction.startY;
        const horizontalMove = cropInteraction.corner.includes('west') ? -moveX : moveX;
        const verticalMove = cropInteraction.corner.includes('north') ? -moveY : moveY;

        return Math.abs(horizontalMove) > Math.abs(verticalMove)
            ? horizontalMove
            : verticalMove;
    };

    const getResizeLimit = () => {
        const originalCrop = cropInteraction.crop;
        const right = originalCrop.x + originalCrop.size;
        const bottom = originalCrop.y + originalCrop.size;
        const imageRight = imageBounds.value.left + imageBounds.value.width;
        const imageBottom = imageBounds.value.top + imageBounds.value.height;

        if (cropInteraction.corner === 'north-west') {
            return Math.min(right - imageBounds.value.left, bottom - imageBounds.value.top);
        }

        if (cropInteraction.corner === 'north-east') {
            return Math.min(imageRight - originalCrop.x, bottom - imageBounds.value.top);
        }

        if (cropInteraction.corner === 'south-west') {
            return Math.min(right - imageBounds.value.left, imageBottom - originalCrop.y);
        }

        return Math.min(imageRight - originalCrop.x, imageBottom - originalCrop.y);
    };

    const resizeCropFrame = (event) => {
        const originalCrop = cropInteraction.crop;
        const nextSize = clamp(
            originalCrop.size + getResizeDelta(event),
            getMinCropSize(),
            getResizeLimit()
        );
        const sizeDifference = originalCrop.size - nextSize;

        crop.size = nextSize;

        if (cropInteraction.corner.includes('north')) {
            crop.y = originalCrop.y + sizeDifference;
        }
        else {
            crop.y = originalCrop.y;
        }

        if (cropInteraction.corner.includes('west')) {
            crop.x = originalCrop.x + sizeDifference;
        }
        else {
            crop.x = originalCrop.x;
        }
    };

    const changeCrop = (event) => {
        if (!cropInteraction || event.pointerId !== cropInteraction.pointerId) {
            return;
        }

        if (interactionType.value === 'move') {
            moveCropFrame(event);
            return;
        }

        resizeCropFrame(event);
    };

    const stopCropChange = (event) => {
        if (!cropInteraction || event.pointerId !== cropInteraction.pointerId) {
            return;
        }

        if (cropAreaRef.value?.hasPointerCapture?.(event.pointerId)) {
            cropAreaRef.value.releasePointerCapture(event.pointerId);
        }
        interactionType.value = '';
        cropInteraction = null;
    };

    const getSourceCrop = () => {
        const scale = imageBounds.value.scale;
        const sourceX = clamp(
            Math.round((crop.x - imageBounds.value.left) / scale),
            0,
            props.imageSize.width - 1
        );
        const sourceY = clamp(
            Math.round((crop.y - imageBounds.value.top) / scale),
            0,
            props.imageSize.height - 1
        );
        const maxSourceSize = Math.min(
            props.imageSize.width - sourceX,
            props.imageSize.height - sourceY
        );
        const sourceSize = clamp(Math.round(crop.size / scale), 1, maxSourceSize);

        return {
            x: sourceX,
            y: sourceY,
            size: sourceSize
        };
    };

    const createCroppedFile = async () => {
        const sourceCrop = getSourceCrop();
        const sourceSize = sourceCrop.size;
        const outputSize = Math.min(props.maxOutputSize, Math.max(1, Math.round(sourceSize)));
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        if (!context) {
            throw new Error('Не удалось подготовить изображение');
        }

        canvas.width = outputSize;
        canvas.height = outputSize;
        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = 'high';
        context.drawImage(
            imageRef.value,
            sourceCrop.x,
            sourceCrop.y,
            sourceSize,
            sourceSize,
            0,
            0,
            outputSize,
            outputSize
        );

        const blob = await new Promise((resolve) => {
            canvas.toBlob(resolve, 'image/webp', 0.92);
        });

        if (!blob) {
            throw new Error('Не удалось обрезать изображение');
        }

        const fileName = props.file.name.replace(/\.[^.]+$/, '');

        return {
            file: new File([blob], `${fileName}-cropped.webp`, { type: 'image/webp' }),
            imageSize: {
                width: outputSize,
                height: outputSize
            }
        };
    };

    const confirmCrop = async () => {
        if (!isImageReady.value || props.isLoading || isProcessing.value) {
            return;
        }

        cropError.value = '';
        isProcessing.value = true;

        try {
            if (props.outputMode === 'crop') {
                emit('confirm', { crop: getSourceCrop() });
                return;
            }

            const croppedImage = await createCroppedFile();
            emit('confirm', croppedImage);
        }
        catch (error) {
            console.log(error);
            cropError.value = error.message || 'Не удалось обрезать изображение';
        }
        finally {
            isProcessing.value = false;
        }
    };

    const cancelCrop = () => {
        if (props.isLoading || isProcessing.value) {
            return;
        }

        emit('cancel');
    };

    const deleteImage = () => {
        if (props.isLoading || isProcessing.value) {
            return;
        }

        emit('delete');
    };

    const openFilePicker = () => {
        if (props.isLoading || isProcessing.value) {
            return;
        }

        replaceInputRef.value?.click();
    };

    const replaceImage = (event) => {
        const file = event.target.files?.[0];

        if (file) {
            emit('replace', file);
        }

        event.target.value = '';
    };

    const updateImageUrl = (file) => {
        if (imageUrl.value) {
            URL.revokeObjectURL(imageUrl.value);
        }

        isImageReady.value = false;
        interactionType.value = '';
        cropInteraction = null;
        imageUrl.value = file ? URL.createObjectURL(file) : '';
    };

    const closeByEscape = (event) => {
        if (event.key === 'Escape') {
            cancelCrop();
        }
    };

    watch(() => props.file, (file) => {
        updateImageUrl(file);
    });

    onMounted(() => {
        updateImageUrl(props.file);
        previousBodyOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', closeByEscape);

        resizeObserver = new ResizeObserver(updateViewportSize);

        if (cropAreaRef.value) {
            resizeObserver.observe(cropAreaRef.value);
        }

        nextTick(updateViewportSize);
    });

    onBeforeUnmount(() => {
        if (imageUrl.value) {
            URL.revokeObjectURL(imageUrl.value);
        }

        resizeObserver?.disconnect();
        window.removeEventListener('keydown', closeByEscape);
        document.body.style.overflow = previousBodyOverflow;
    });

</script>

<style lang="scss" scoped>
    @import '@/assets/styles/components/image-cropper.scss';
</style>
