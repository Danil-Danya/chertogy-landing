<template>
    <div class="modal">
        <div class="modal__content">
            <h2 class="modal__title title">
                ВЫ ЗАПИСАЛИСЬ
            </h2>

            <p class="modal__text text">
                Убедитесь, что у Вас в профиле УКАЗАНЫ корректные ссылки на соц. сети, а также ОТКРЫТЫ личные сообщения. 
            </p>

            <p class="modal__text modal__subscribe-text text">
                Это нужно, чтобы Мастер мог связаться с вам перед игрой. Спасибо!
            </p>

            <div class="modal__actions">
                <button class="btn btn-green" @click="onClose">
                    Хорошо
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>

    const props = defineProps({
        buttonType: {
            type: String,
            default: 'primary',
        },
    })

    const emit = defineEmits([
        'close',
    ]);

    const onClose = () => {
        emit('close');
    };

</script>
