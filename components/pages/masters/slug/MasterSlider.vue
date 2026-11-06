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
                            v-for="(image, index) in images"
                            :key="image.id"
                        >
                            <img
                                :src="image.preview"
                                alt="Картинка"
                                class="master__slider-img"
                                @click="openZoom(index)"
                            >
                        </SwiperSlide>
                        <button type="button" class="master__slider-button master__slider-button-prev">
                            <span class="master__slider-button-icon">
                                <PrevIcon />
                            </span>
                        </button>
                        <button type="button" class="master__slider-button master__slider-button-next">
                            <span class="master__slider-button-icon">
                                <NextIcon />
                            </span>
                        </button>
                    </Swiper>
                </ClientOnly>
            </div>
        </div>
        <Transition name="zoom">
            <ZoomSlider
                :images="zoomImages"
                :initial-index="zoomedImageIndex"
                v-if="isZoomed"
                @close="closeZoom"
            />
        </Transition>
    </section>
</template>

<script setup>

    import { Swiper, SwiperSlide } from 'swiper/vue';
    import { Navigation, Autoplay } from 'swiper/modules';
    import ZoomSlider from '@/components/shared/instruments/ZoomSlider.vue';

    import { useMastersStore } from '~/store/useMasters';
    import getImageUrl from '@/utils/getImageUrl';

    import 'swiper/css';
    import 'swiper/css/navigation';

    const PrevIcon = defineAsyncComponent(() => import('@/components/icons/slider/Prev.vue'));
    const NextIcon = defineAsyncComponent(() => import('@/components/icons/slider/Next.vue'));

    const masterStore = useMastersStore();

    const modules = [Navigation, Autoplay];

    const images = computed(() => {
        const gallery = masterStore.oneMaster?.gallery;

        if (!Array.isArray(gallery)) {
            return [];
        }

        return gallery.map((image) => {
            const preview = getImageUrl(image);
            const original = getImageUrl(image?.path || image);

            return {
                id: image?.id || original,
                preview,
                original
            };
        }).filter((image) => image.preview && image.original);
    });

    const zoomImages = computed(() => images.value.map((image) => image.original));

    const isZoomed = ref(false);
    const zoomedImageIndex = ref(0);

    const openZoom = (index) => {
        zoomedImageIndex.value = index;
        isZoomed.value = true;
    }

    const closeZoom = () => {
        isZoomed.value = false;
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

