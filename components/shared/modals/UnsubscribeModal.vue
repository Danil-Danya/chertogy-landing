<template>
    <div class="modal">
        <div class="modal__content">
            <h2 class="modal__title title">
                {{ titleText }}
            </h2>

            <p class="modal__text text">
                {{ bodyText }}
            </p>

            <div class="modal__actions">
                <button class="btn btn-red" @click="onConfirm">
                    <span class="btn__icon">
                        <DeleteIcon />
                    </span>
                    {{ confirmText }}
                </button>

                <button class="btn btn-gray" @click="onCancel">
                    Назад
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { computed } from 'vue';
    import DeleteIcon from '~/components/icons/modals/Delete.vue';

    const props = defineProps({
        status: {
            type: [String, null],
            default: null
        }
    });

    const emit = defineEmits([
        'confirm',
        'cancel',
    ]);

    const normalizedStatus = computed(() => {
        return (props.status ?? '').toString().toUpperCase();
    });

    const isPending = computed(() => {
        return normalizedStatus.value === 'PENDING';
    });

    const titleText = computed(() => {
        if (isPending.value) {
            return 'Вы уверены, что хотите отменить ожидание?';
        }

        return 'Вы уверены, что хотите отменить запись?';
    });

    const bodyText = computed(() => {
        if (isPending.value) {
            return 'Вы покинете очередь ожидания, а Ваше место может быть занято кем-то другим.';
        }

        return 'Вы перестанете быть участником события, а Ваше место может быть занято кем-то другим.';
    });

    const confirmText = computed(() => {
        if (isPending.value) {
            return 'Отменить ожидание';
        }

        return 'Отменить запись';
    });


    const onConfirm = () => {
        emit('confirm');
    };

    const onCancel = () => {
        emit('cancel');
    };
</script>
