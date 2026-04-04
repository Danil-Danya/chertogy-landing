<template>
    <div class="modal" @click.self="emit('cancel')">
        <div class="modal__content modal__content-captcha">
            <Captcha @success="emit('confirm')" />

            <div class="modal__actions">
                <button
                    type="button"
                    class="btn btn-gray"
                    @click="emit('cancel')"
                >
                    Отмена
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
    import Captcha from '../instruments/Captcha.vue';

    const emit = defineEmits(['confirm', 'cancel']);
</script>
