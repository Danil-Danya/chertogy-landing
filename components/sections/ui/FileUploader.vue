<template>
    <div class="file-uploader">
        <label
            class="file-uploader__area"
            :class="{
                'file-uploader__area--dragging': isDragging,
                'file-uploader__area--loading': isLoading
            }"
            :title="uploaderLabel"
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @drop.prevent="selectDroppedFile"
        >
            <input
                type="file"
                :accept="accept"
                class="file-uploader__input"
                :disabled="isLoading"
                @change="selectFile"
            >
            <PlusIcon class="file-uploader__icon" />
            <span class="file-uploader__description">{{ uploaderLabel }}</span>
            <span class="file-uploader__loading" v-if="isLoading">Загрузка...</span>
        </label>
        <p
            class="file-uploader__message"
            :class="`file-uploader__message--${message.type}`"
            v-if="message.text"
        >
            {{ message.text }}
        </p>
    </div>
</template>

<script setup>

    import PlusIcon from '@/components/icons/gallery/Plus.vue';

    const props = defineProps({
        isLoading: {
            type: Boolean,
            default: false
        },

        message: {
            type: Object,
            default: () => ({ type: '', text: '' })
        },

        accept: {
            type: String,
            default: 'image/jpeg,image/png,image/webp'
        },

        maxFileSize: {
            type: Number,
            default: 10 * 1024 * 1024
        },

        maxImageSize: {
            type: Number,
            default: 5000
        }
    });

    const emit = defineEmits(['select']);

    const isDragging = ref(false);

    const maxFileSizeMb = computed(() => {
        return Math.floor(props.maxFileSize / 1024 / 1024);
    });

    const uploaderLabel = computed(() => {
        return `Добавить изображение JPG, JPEG, PNG или WEBP до ${maxFileSizeMb.value} МБ и ${props.maxImageSize} на ${props.maxImageSize} px`;
    });

    const selectFile = (event) => {
        emit('select', event.target.files?.[0]);
        event.target.value = '';
    };

    const selectDroppedFile = (event) => {
        isDragging.value = false;
        emit('select', event.dataTransfer?.files?.[0]);
    };

</script>

<style lang="scss" scoped>
    @import '@/assets/styles/components/file-uploader.scss';
</style>
