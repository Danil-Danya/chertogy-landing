<template>
    <div class="modal" @click.self="onClose">
        <div class="modal__content modal__content-system-info">
            <h2 class="modal__title title">{{ title }}</h2>

            <p class="modal__text modal__text-system-info text">
                {{ description }}
            </p>

            <div class="modal__actions">
                <button type="button" class="btn btn-green" @click="onClose">
                    Понятно
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>

    defineProps({
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        }
    });

    const emit = defineEmits([
        'close'
    ]);

    const onClose = () => {
        emit('close');
    };

</script>

<style scoped lang="scss">
    .modal__content-system-info {
        max-width: 560px;
        width: 100%;
        background: #130d17;
        border: 1px solid #6a3b7baf;
        box-shadow: 0 0 24px rgba(74, 117, 72, 0.2);
    }

    .modal__text-system-info {
        text-align: center;
        white-space: pre-line;
    }
</style>
