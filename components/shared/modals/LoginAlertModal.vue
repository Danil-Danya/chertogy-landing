<template>
    <div class="modal">
        <div class="modal__content">
            <h2 class="modal__title title">
                Ой! Нужно сначала войти в систему.
            </h2>

            <p class="modal__text text">
                Вы не можете записываться на события пока не авторизуетесь.
            </p>

            <div class="modal__actions">
                <a class="btn btn-green" href="https://xn----dtbbbhdau6cfpgt1e.xn--p1ai/panel/login">Войти</a>

                <button class="btn btn-gray" @click="onClose">
                    Понятно...
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
