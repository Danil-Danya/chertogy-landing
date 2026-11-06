<template>
    <div class="delete-confirmation" @pointerdown.self="cancelDelete">
            <div class="delete-confirmation__content modal-transition__content">
                <h2 class="delete-confirmation__title">{{ title }}</h2>
                <p class="delete-confirmation__description">
                    {{ description }}
                </p>
                <div class="delete-confirmation__actions">
                    <button
                        type="button"
                        class="delete-confirmation__button delete-confirmation__button--secondary"
                        :disabled="isLoading"
                        @click="cancelDelete"
                    >
                        Отмена
                    </button>
                    <button
                        type="button"
                        class="delete-confirmation__button delete-confirmation__button--delete"
                        :disabled="isLoading"
                        @click="$emit('confirm')"
                    >
                        {{ isLoading ? 'Удаляем...' : 'Удалить' }}
                    </button>
                </div>
            </div>
    </div>
</template>

<script setup>

    const props = defineProps({
        title: {
            type: String,
            default: 'Удалить изображение?'
        },

        description: {
            type: String,
            default: 'Изображение и его оригинал будут удалены безвозвратно. Это действие нельзя отменить.'
        },

        isLoading: {
            type: Boolean,
            default: false
        }
    });

    const emit = defineEmits(['confirm', 'cancel']);

    const cancelDelete = () => {
        if (props.isLoading) {
            return;
        }

        emit('cancel');
    };

    const closeByEscape = (event) => {
        if (event.key === 'Escape') {
            cancelDelete();
        }
    };

    onMounted(() => {
        window.addEventListener('keydown', closeByEscape);
    });

    onBeforeUnmount(() => {
        window.removeEventListener('keydown', closeByEscape);
    });

</script>

<style lang="scss" scoped>
    @import '@/assets/styles/components/delete-confirmation.scss';
</style>
