<template>
    <div class="navigator">
        <div class="container">
            <div class="navigator__content">
                <h1 class="navigator__title title">Как добраться?</h1>
            </div>
            <div class="navigator__container">
                <Swiper
                    class="navigator__swiper"
                    :modules="modules"
                    :slides-per-view="slidesCount"
                    :space-between="10"
                    @swiper="onSwiper"
                    @slideChange="onSlideChange"
                >
                    <SwiperSlide
                        v-for="(slide, index) in sliderList"
                        :key="index"
                        class="navigator__slide"
                    >
                        <img
                            :src="slide.image"
                            format="webp"
                            alt="Slide image"
                            class="navigator__slider-img"
                        />
                        <div class="navigator__slider-top">
                            <h3 class="navigator__slider-title" v-html="slide.title"></h3>
                        </div>
                        <div class="navigator__slider-bottom">
                            <div class="navigator__slider-item" v-for="item in slide.text" :key="item">
                                <span class="navigator__slider-icon">
                                    <ArrowIcon />
                                </span>
                                <p class="navigator__slider-text" v-html="item"></p>
                            </div>
                        </div>
                    </SwiperSlide>
                </Swiper>
            </div>
        </div>
    </div>
</template>

<script setup>

    import { Swiper, SwiperSlide } from 'swiper/vue';
    import { Navigation, Autoplay } from 'swiper/modules';

    import 'swiper/css';
    import 'swiper/css/navigation';

    const ArrowIcon = defineAsyncComponent(() => import('@/components/icons/navigator/Arrow.vue'));

    const modules = [Navigation, Autoplay];

    const sliderList = ref([
        {
            title: 'Метро Арбатская:',
            text: [
                '<span class="blue-dark">Арбатско-покровская</span> Выход 8',
                '<span class="blue">Филёвская</span> Выход 1'
            ],
            image: '/images/navigator/1.png'
        },
        {
            title: 'Далее около 10 минут пешком:',
            text: [
                'по Новому Арбату (быстрее)',
                'по Старому Арбату (интереснее)'
            ],
            image: '/images/navigator/2.png'
        },
        {
            title: 'Поворот в Серебрянный переулок',
            text: [
                'налево (и вниз) с Нового Арбата',
                'направо со Старого Арбата'
            ],
            image: '/images/navigator/3.png'
        },
        {
            title: 'Поворот во двор на углу желтого дома «Арбат, 18/1с2»',
            image: '/images/navigator/4.png'
        },
    ]);

    let slidesCount = ref(4);

    const checkSlidesCountInResize = () => {
        const windowWidth = window.innerWidth;

        switch (true) {
            case (windowWidth <= 570): 
                slidesCount.value = 1.2;
                break;

            case (windowWidth <= 768): 
                slidesCount.value = 2.2;
                break;

            case (windowWidth <= 992): 
                slidesCount.value = 3.2;
                break;

            default:
                slidesCount.value = 4; 
                break;
        }
    };

    onMounted(() => {
        checkSlidesCountInResize();
        window.addEventListener('resize', checkSlidesCountInResize);
    });

    onUnmounted(() => {
        window.removeEventListener('resize', checkSlidesCountInResize);
    });

</script>

<style lang="scss">
    @import '@/assets/styles/components/navigator.scss';
</style>
