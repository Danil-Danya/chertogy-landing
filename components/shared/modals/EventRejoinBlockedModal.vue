<template>
    <div class="modal">
        <div class="modal__content">
            <h2 class="modal__title title">
                ВНИМАНИЕ!
            </h2>

            <p class="modal__text text">
                Ваша возможность записываться на данное событие временно ограничена его создателем.
            </p>

            <div class="modal__actions">
                <button class="btn btn-green" @click="onClose">
                    Понятно
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>

    const emit = defineEmits([
        'close',
    ]);

    const onClose = () => {
        emit('close');
    };

</script>
