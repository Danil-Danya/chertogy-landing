<template>
    <div class="modal">
        <div class="modal__content">
            <h2 class="modal__title title">
                Вы уверены, что хотите отменить событие?
            </h2>

            <p class="modal__text text">
                Событие будет отменено и станет недоступным для участников.
                <br />
                Восстановить его сможет только администратор или автор события через административную панель.
            </p>

            <div class="modal__actions">
                <button class="btn btn-red" @click="onConfirm">
                    <span class="btn__icon">
                        <DeleteIcon />
                    </span>
                    Отменить событие
                </button>

                <button class="btn btn-gray" @click="onCancel">
                    Назад
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>

    import DeleteIcon from '~/components/icons/modals/Delete.vue';

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
