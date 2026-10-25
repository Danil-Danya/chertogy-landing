<template>
    <div class="modal">
        <div class="modal__content">
            <h2 class="modal__title title">
                ВЫ ЗАПИСАЛИСЬ
            </h2>

            <p class="modal__text text">
                Внимание! Мастеру потребуется связаться с Вами перед игрой!
            </p>

            <p class="modal__text modal__subscribe-text text">
                Убедитесь, что в Вашем профиле указаны актуальные ссылки на соц. сети для связи с Вами и открыты личные сообщения.
            </p>

            <p class="modal__text modal__notifications-text text">
                В настройках также можно включить уведомления, чтобы не пропустить ценную информацию.
            </p>

            <div class="modal__actions">
                <button
                    type="button"
                    class="btn btn-gray"
                    @click="onNotificationsSettings"
                >
                    К настройкам
                </button>

                <button
                    type="button"
                    class="btn btn-green"
                    @click="onClose"
                >
                    Хорошо
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>

    const SETTINGS_URL = 'https://xn----dtbbbhdau6cfpgt1e.xn--p1ai/panel/settings';

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

    const onNotificationsSettings = () => {
        window.location.href = SETTINGS_URL;
    };

</script>

<style lang="scss" scoped>

    .modal__notifications-text {
        margin-top: 16px;

        @include media ($md) {
            font-size: 14px;
        }
    }

    .modal__subscribe-text  {
        @include media ($md) {
            font-size: 14px;
        }
    }

</style>
