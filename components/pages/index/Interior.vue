<template>
    <section class="interior">
        <div class="container">
            <div class="interior__content">
                <h2 class="title interior__title title-sticked">Наш интерьер</h2>
                <div class="interior__content-slider">
                    <div class="interior__paginate">
                        <div class="interior__swiper-paginate" ref="paginateContainer">
                            <button 
                                class="interior__paginate-button" 
                                :class="index === activeSectionIndex ? 'interior__paginate-button-active' : null"
                                v-for="(item, index) in sections"
                                :key="item"
                                ref="paginate"
                                @click="changeSection(index)"
                            >
                                {{ item.name }}
                            </button>
                        </div>
                    </div>
                    <Swiper
                        class="interior__swiper"
                        :modules="modules"
                        :slides-per-view="1"
                        :space-between="0"
                        :autoplay="{ delay: 3000, disableOnInteraction: false }"
                        :navigation="{
                            nextEl: '.interior__button-next',
                            prevEl: '.interior__button-prev'
                        }"
                        @swiper="onSwiper"
                        @slideChange="onSlideChange"
                        loop
                    >
                        <SwiperSlide
                            v-for="(slide, index) in slidesImagesList"
                            :key="index"
                            class="interior__slide"
                        >
                            <img
                                @click="openZoom(slide)"
                                :src="slide"
                                format="webp"
                                alt="Slide image"
                                class="interior__slide-img"
                            >
                        </SwiperSlide>
                        <button class="interior__button-prev interior__button">
                            <span class="interior__button-icon">
                                <PrevIcon />
                            </span>
                        </button>
                        <button class="interior__button-next interior__button">
                            <span class="interior__button-icon">
                                <NextIcon />
                            </span>
                        </button>
                    </Swiper>
                </div>
            </div>
        </div>
        <Transition name="zoom">
            <ZoomImage 
                :image="zoomedImage" 
                v-if="isZoomed && !isMobile"
                @close="toggleIsZoomed" 
            />
        </Transition>
    </section>
</template>

<script setup>

    import ZoomImage from '@/components/shared/instruments/ZoomImage.vue';

    import { Swiper, SwiperSlide } from 'swiper/vue';
    import { Navigation, Autoplay } from 'swiper/modules';
    import { useIsMobile } from '@/composables/useIsMobile.js';

    import 'swiper/css';
    import 'swiper/css/navigation';

    const NextIcon = defineAsyncComponent(() => import('@/components/icons/slider/Next.vue'));
    const PrevIcon = defineAsyncComponent(() => import('@/components/icons/slider/Prev.vue'));


    const isMobile = useIsMobile();

    const modules = [Navigation, Autoplay];

    const slidesAllZone = [
        '/images/interior/all_zone/IMG_4615.png',
        '/images/interior/all_zone/IMG_4927.png',
        '/images/interior/all_zone/IMG_4929.png',
        '/images/interior/all_zone/IMG_4939.png',
        '/images/interior/all_zone/IMG_5169.png',
    ];

    const slidesGreenZone = [
        '/images/interior/green_zone/IMG_4935.jpg',
    ];

    const slidesPurpleZone = [
        '/images/interior/purple_zone/IMG_4933.jpg',
    ];

    const slidesTaverna = [
        '/images/interior/taverna/IMG_5218.png',
        '/images/interior/taverna/IMG_5219.png',
        '/images/interior/taverna/IMG_5220.png',
        '/images/interior/taverna/IMG_5223.png',
    ];

    const slidesZamok = [
        '/images/interior/zamok/camphoto_544561601.jpg',
        '/images/interior/zamok/IMG_5977.jpg',
        '/images/interior/zamok/photo_2025-03-25_20-57-37 (4).jpg',
    ];

    const sections = ref([
        { name: 'Таверна', slides: slidesTaverna },
        { name: 'Замок', slides: slidesZamok },
        { name: 'Фиолетовая', slides: slidesPurpleZone },
        { name: 'Зеленая', slides: slidesGreenZone },
        { name: 'Общая зона', slides: slidesAllZone },
    ]);


    const swiperInstance = ref(null);
    
    const paginateContainer = ref(null);
    const paginate = ref([]);

    const scrollToActiveButton = (index) => {
        const button = paginate.value[index];

        if (!button) {
            return;
        }

        button.scrollIntoView({
            behavior: 'smooth',
            inline: 'center',
            block: 'nearest',
        });
    };




    const onSwiper = (swiper) => {
        console.log('Swiper instance:', swiper);
        swiperInstance.value = swiper;
    }

    const onSlideChange = () => {
        console.log('Slide changed');
    }

    const activeSectionIndex = ref(0);

    const slidesImagesList = computed(() => sections.value[activeSectionIndex.value].slides);

    const changeSection = (index) => {
        activeSectionIndex.value = index;
        
        if (isMobile.value) {
            nextTick(() => {
                scrollToActiveButton(index);
            });
        }
    }

    const isZoomed = ref(false);
    const zoomedImage = ref(null);

    const openZoom = (image) => {
        zoomedImage.value = image
        isZoomed.value = true
    }

    const toggleIsZoomed = () => {
        isZoomed.value = !isZoomed.value
    }

</script>


<style lang="scss" scoped>
    @import '@/assets/styles/components/interior.scss';
</style>
