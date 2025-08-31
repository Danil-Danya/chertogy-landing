<template>
    <section class="zoom" @click="$emit('close')">
        <div class="container">
            <div class="zoom__container">
                <NuxtImg class="zoom__img" alt="Картинка увеличенная" :src="image" />
            </div>
        </div>
    </section>
</template>

<script setup>

    const props = defineProps({
        image: {
            type: String,
            required: true
        }
    })

    defineEmits(['close']);

</script>

<style lang="scss">
    @import '@/assets/styles/components/zoom-image.scss';

    .zoom-enter-active, .zoom-leave-active {
        transition: all 0.3s ease;
    }
    .zoom-enter-from, .zoom-leave-to {
        opacity: 0;
        transform: scale(0.9);
    }
    .zoom-enter-to, .zoom-leave-from {
        opacity: 1;
        transform: scale(1);
    }
</style>
