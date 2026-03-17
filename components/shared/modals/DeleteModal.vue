<template>
    <div class="modal">
        <div class="modal__content">
            <h2 class="modal__title title">
                Вы уверены, что хотите удалить выбранных участников из События?
            </h2>

            <p class="modal__text text">
                Участники будут удалены из События. Это действия нельзя будет отменить.
            </p>

            <div class="modal__actions">
                <button class="btn btn-red" @click="onConfirm">
                    <span class="btn__icon">
                        <DeleteIcon />
                    </span>
                    Удалить с события
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