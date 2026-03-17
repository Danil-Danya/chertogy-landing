<template>
    <div class="modal">
        <div class="modal__content">
            <h2 class="modal__title title">
                Вы уверены, что хотите утвердить всех ожидающих пользователей на текущее событие?
            </h2>

            <p class="modal__text text">
                После подтверждения пользователи будут добавлены в список участников события.
            </p>

            <div class="modal__actions">
                <button class="btn btn-green" @click="onConfirm">
                    Подтвердить
                </button>

                <button class="btn btn-blue" @click="onCancel">
                    Отмена
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>

    const emit = defineEmits([
        'confirm',
        'cancel',
    ]);

    const onConfirm = () => {
        emit('confirm');
    };

    const onCancel = () => {
        emit('cancel');
    };

</script>
