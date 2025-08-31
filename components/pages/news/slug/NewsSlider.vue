<template>
    <div class="news news__slider-sect">
        <div class="container">
            <div class="news__slider-content">
                <h2 class="news__title title">К другим новостям</h2>
                <div class="news__slider-buttons" v-if="!IsMobile">
                    <button class="news__button-prev news__button">
                        <span class="news__button-icon">
                            <ArrowPrevIcon />
                        </span>
                    </button>
                    <button class="news__button-next news__button">
                        <span class="news__button-icon">
                            <ArrowNextIcon />
                        </span>
                    </button>
                </div>
            </div>
            <div class="news__slider">
                 <Swiper
                    :slides-per-view="slidesCount"
                    :space-between="20"
                    :navigation="{
                        nextEl: '.news__button-next',
                        prevEl: '.news__button-prev'
                    }"
                    :modules="modules"
                    @swiper="onSwiper"
                    @slideChange="onSlideChange"
                    class="news__slider"
                    loop
                >
                    <SwiperSlide 
                        v-for="item in newsStore.allNews.rows"
                        :key="item.id"
                    >
                        <NewsCard 
                            :title="truncateText(item.title, 36)"
                            :date="item.createdAt"
                            :text="truncateText(item.shortDescription, 100)"
                            :image="`https://api.чертоги-героев.рф/images/${item.previewPath}`"
                            :slug="item.slug"
                            class="news__card-slider"
                            isSlider="true"
                        />
                    </SwiperSlide>
                </Swiper>
            </div>
        </div>
    </div>
</template>

<script setup>

    import { Swiper, SwiperSlide } from 'swiper/vue';
    import { Navigation, Autoplay } from 'swiper/modules';

    import { useNewsStore } from '@/store/useNews.js';
    import { useIsMobile } from '@/composables/useIsMobile.js';
    import { useRoute } from 'vue-router';

    import NewsCard from '@/components/shared/widgets/NewsCard.vue';

    import truncateText from '@/utils/truncateText.js';

    import 'swiper/css';
    import 'swiper/css/navigation';

    const ArrowPrevIcon = defineAsyncComponent(() => import('@/components/icons/news/PrevArrow.vue'));
    const ArrowNextIcon = defineAsyncComponent(() => import('@/components/icons/news/NextArrow.vue'));

    const modules = [Navigation, Autoplay];

    const newsStore = useNewsStore(); 
    const isMobile = useIsMobile();
    const route = useRoute();

    const onSwiper = (swiper) => {
        console.log('Swiper instance:', swiper);
    }

    const onSlideChange = () => {
        console.log('Slide changed');
    }

    const fetchData = async () => {
        await newsStore.fetchAllNews(1, 4);
    };

    await fetchData();

    watch(() => route.fullPath, async () => await fetchData());

    let slidesCount = ref(3);

    const checkSlidesCountInResize = () => {
        const windowWidth = window.innerWidth;

        switch (true) {
            case (windowWidth <= 420): 
                slidesCount.value = 1.1;
                break;

            case (windowWidth <= 768): 
                slidesCount.value = 2.2;
                break;

            case (windowWidth <= 992): 
                slidesCount.value = 2.5;
                break;

            default:
                slidesCount.value = 3; 
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
    @import '@/assets/styles/components/news.scss';
</style>
