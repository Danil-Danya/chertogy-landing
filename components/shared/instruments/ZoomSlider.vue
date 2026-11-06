<template>
    <section class="zoom-slider" @click="$emit('close')">
        <div class="container zoom-slider__layout">
            <div class="zoom-slider__container">
                <Swiper
                    :slides-per-view="1"
                    :initial-slide="initialIndex"
                    :navigation="{
                        nextEl: '.zoom-slider__button-next',
                        prevEl: '.zoom-slider__button-prev'
                    }"
                    :modules="modules"
                    :loop="images.length > 1"
                    class="zoom-slider__swiper"
                >
                    <SwiperSlide
                        v-for="(image, index) in images"
                        :key="`${image}-${index}`"
                        class="zoom-slider__slide"
                    >
                        <img
                            :src="image"
                            alt="Картинка увеличенная"
                            class="zoom-slider__img"
                            @click.stop
                        >
                    </SwiperSlide>
                </Swiper>
                <template v-if="images.length > 1">
                    <button
                        type="button"
                        class="zoom-slider__button zoom-slider__button-prev"
                        aria-label="Предыдущее изображение"
                        @click.stop
                    >
                        <PrevIcon />
                    </button>
                    <button
                        type="button"
                        class="zoom-slider__button zoom-slider__button-next"
                        aria-label="Следующее изображение"
                        @click.stop
                    >
                        <NextIcon />
                    </button>
                </template>
            </div>
        </div>
    </section>
</template>

<script setup>

    import { Swiper, SwiperSlide } from 'swiper/vue';
    import { Navigation } from 'swiper/modules';

    import 'swiper/css';
    import 'swiper/css/navigation';

    const PrevIcon = defineAsyncComponent(() => import('@/components/icons/news/PrevArrow.vue'));
    const NextIcon = defineAsyncComponent(() => import('@/components/icons/news/NextArrow.vue'));

    const emit = defineEmits(['close']);

    defineProps({
        images: {
            type: Array,
            required: true
        },

        initialIndex: {
            type: Number,
            default: 0
        }
    });

    const modules = [Navigation];

    const closeOnEscape = (event) => {
        if (event.key === 'Escape') {
            emit('close');
        }
    };

    onMounted(() => {
        window.addEventListener('keydown', closeOnEscape);
    });

    onUnmounted(() => {
        window.removeEventListener('keydown', closeOnEscape);
    });

</script>

<style lang="scss">
    @import '@/assets/styles/components/zoom-slider.scss';

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
