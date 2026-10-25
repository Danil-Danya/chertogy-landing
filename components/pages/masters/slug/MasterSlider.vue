<template>
    <section class="master__slider" v-if="images.length">
        <div class="container">
            <div class="master__slider-content">
                <ClientOnly>
                    <Swiper
                        :slides-per-view="slidesCount"
                        :space-between="spaceBetween"
                        :navigation="{
                            nextEl: '.master__slider-button-next',
                            prevEl: '.master__slider-button-prev'
                        }"
                        :modules="modules"
                        :loop="images.length > slidesCount"
                        @swiper="onSwiper"
                        @slideChange="onSlideChange"
                        class="master__slider-swiper"
                    >
                        <SwiperSlide 
                            v-for="image in images"
                            :key="image"
                        >
                            <img :src="image" alt="Картинка" class="master__slider-img" @click="openZoom(image)">
                        </SwiperSlide>
                    </Swiper>
                </ClientOnly>
                <div class="master__slider-buttons">
                    <button class="master__slider-button master__slider-button-prev">
                        <ArrowPrevIcon />
                    </button>
                    <button class="master__slider-button master__slider-button-next">
                        <ArrowNextIcon />
                    </button>
                </div>
            </div>
        </div>
        <Transition name="zoom">
            <ZoomImage
                :image="zoomedImage"
                v-if="isZoomed"
                @close="toggleIsZoomed"
            />
        </Transition>
    </section>
</template>

<script setup>

    import { Swiper, SwiperSlide } from 'swiper/vue';
    import { Navigation, Autoplay } from 'swiper/modules';
    import ZoomImage from '@/components/shared/instruments/ZoomImage.vue';

    import { useMastersStore } from '~/store/useMasters';
    import getImageUrl from '@/utils/getImageUrl';

    import 'swiper/css';
    import 'swiper/css/navigation';

    const ArrowPrevIcon = defineAsyncComponent(() => import('@/components/icons/news/PrevArrow.vue'));
    const ArrowNextIcon = defineAsyncComponent(() => import('@/components/icons/news/NextArrow.vue'));

    const masterStore = useMastersStore();

    const modules = [Navigation, Autoplay];

    const images = computed(() => {
        const gallery = masterStore.oneMaster?.gallery;

        if (!Array.isArray(gallery)) {
            return [];
        }

        return gallery.map((image) => getImageUrl(image.path)).filter(Boolean);
    });

    const isZoomed = ref(false);
    const zoomedImage = ref('');

    const openZoom = (image) => {
        zoomedImage.value = image;
        isZoomed.value = true;
    }

    const toggleIsZoomed = () => {
        isZoomed.value = !isZoomed.value;
    }

    const slidesCount = ref(3);
    let spaceBetween = ref(10);

    const onSwiper = (swiper) => {
        console.log('Swiper instance:', swiper);
    }

    const onSlideChange = () => {
        console.log('Slide changed');
    }

    const checkSlidesCountInResize = () => {
        const windowWidth = window.innerWidth;

        switch (true) {
            case (windowWidth <= 992): 
                slidesCount.value = 1;
                spaceBetween.value = 0;
                break;

            default:
                slidesCount.value = 3; 
                spaceBetween.value = 20;
                break;
        }
    };

    onMounted(async () => {
        checkSlidesCountInResize();
        window.addEventListener('resize', checkSlidesCountInResize);
    });

    onUnmounted(() => {
        window.removeEventListener('resize', checkSlidesCountInResize);
    });

</script>

