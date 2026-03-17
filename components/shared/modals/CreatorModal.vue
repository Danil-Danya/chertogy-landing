<template>
    <div class="modal">
        <div class="modal__content">
            <h2 class="modal__title title">
                Вы являетесь создателем события
            </h2>

            <p class="modal__text text">
                Автор события не может записаться или встать в ожидание на собственное событие.
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
