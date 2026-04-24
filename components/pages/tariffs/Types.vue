<template>
    <section class="types">
        <div class="container">
            <div class="types__content">
                <h2 class="title types__title">Какие бывают типы игр?</h2>
                <div class="types__slider-buttons" v-if="isMobile">
                    <button class="types__button-prev types__button">
                        <span class="types__button-icon">
                            <ArrowPrevIcon />
                        </span>
                    </button>
                    <button class="types__button-next types__button">
                        <span class="types__button-icon">
                            <ArrowNextIcon />
                        </span>
                    </button>
                </div>
            </div>
            <div class="types__container" v-if="!isMobile">
                <div class="types__item" v-for="item in typesList" :key="item">
                    <div class="types__item-top">
                        <h3 class="types__item-title">{{ item.title }}</h3>
                        <span class="types__item-mark">{{ item.mark }}</span>
                    </div>
                    <div class="types__item-center">
                        <p class="text types__item-text" v-for="text in item.texts" :key="text">{{ text }}</p>
                    </div>
                    <div class="types__item-bottom">
                        <NuxtLink :to="item.link" class="types__item-link">
                            <p>Подобрать игру</p>
                            <span class="types__item-icon">
                                <ArrowIcon />
                            </span>
                        </NuxtLink>
                    </div>
                </div>
            </div>
            <div class="types__slider" v-else>
                <Swiper
                    :slides-per-view="slidesCount"
                    :space-between="20"
                    :modules="modules"
                    @swiper="onSwiper"
                    @slideChange="onSlideChange"
                    class="types__slider"
                    :navigation="{
                        nextEl: '.types__button-next',
                        prevEl: '.types__button-prev'
                    }"
                    loop
                >
                    <SwiperSlide v-for="item in typesList" :key="item">
                        <div class="types__item">
                            <div class="types__item-top">
                                <h3 class="types__item-title">{{ item.title }}</h3>
                                <span class="types__item-mark">{{ item.mark }}</span>
                            </div>
                            <div class="types__item-center">
                                <p class="text types__item-text" v-for="text in item.texts" :key="text">{{ text }}</p>
                            </div>
                            <div class="types__item-bottom">
                                <NuxtLink :to="item.link" class="types__item-link">
                                    <p>Подобрать игру</p>
                                    <span class="types__item-icon">
                                        <ArrowIcon />
                                    </span>
                                </NuxtLink>
                            </div>
                        </div>
                    </SwiperSlide>
                </Swiper>
            </div>
        </div>
    </section>
</template>

<script setup>

    import { useIsMobile } from '@/composables/useIsMobile.js';

    import { Swiper, SwiperSlide } from 'swiper/vue';
    import { Navigation, Autoplay } from 'swiper/modules';

    import 'swiper/css';
    import 'swiper/css/navigation';

    const ArrowPrevIcon = defineAsyncComponent(() => import('@/components/icons/news/PrevArrow.vue'));
    const ArrowNextIcon = defineAsyncComponent(() => import('@/components/icons/news/NextArrow.vue'));

    const modules = [Navigation, Autoplay];

    const isMobile = useIsMobile();

    const ArrowIcon = defineAsyncComponent(() => import('@/components/icons/types/Arrow.vue'));

    const typesList = ref([
        {
            title: 'Нулевая сессия',
            mark: 'около 2 часов',
            texts: [
                'Подготовительная встреча перед началом приключения, чаще длительной кампании. Здесь создаются персонажи, обсуждаются ожидания, правила и детали.',
                'Отличный способ познакомиться с Мастером и игроками. Может проводиться бесплатно в клубе или онлайн.'
            ],
            link: '/events'
        },
        {
            title: 'Ваншот',
            mark: 'около 4 часов',
            texts: [
                'Приключение на 1 игровую сессию (Oneshot) — идеально тем, кто хочет погрузиться в историю и завершить её за один раз, испытав сразу всю гамму эмоций от хорошей истроии.',
                'Такие игры часто имеют более динамичный сюжет и четкие цели, и пользуются большой популярностью, позволяя пробовать каждый раз что-то новое.'
            ],
            link: '/events'
        },
        {
            title: 'Серия',
            mark: 'несколько сессий',
            texts: [
                'Некоторые приключения требуют больше одной сессии. Это позволяет глубже погрузиться в сюжет и персонажей, при этом сохраняя относительно короткий срок игры.',
                'Эти игры могут иметь несколько частей или эпизодов (Дуошот, Тришот или Мини-кампейн), которые логично завершатся в течение нескольких встреч.',
            ],
            link: '/events'
        },
        {
            title: 'Кампейн',
            mark: '> 5 сессий',
            texts: [
                'Кампания — это длительное приключение, которое развивается на протяжении многих встреч. Игроки постепенно исследуют мир, развивают своих персонажей и взаимодействуют с сюжетными арками.',
                'Кампании требуют регулярных встреч и обычно сильно погружают в игровой процесс и историю.',
            ],
            link: '/events'
        },
    ])


    const onSwiper = (swiper) => {
        console.log('Swiper instance:', swiper);
    }

    const onSlideChange = () => {
        console.log('Slide changed');
    }

    let slidesCount = ref(2);

    const checkSlidesCountInResize = () => {
        const windowWidth = window.innerWidth;

        switch (true) {
            case (windowWidth <= 420): 
                slidesCount.value = 1;
                break;

            case (windowWidth <= 768): 
                slidesCount.value = 1.2;
                break;

            case (windowWidth <= 992): 
                slidesCount.value = 1.5;
                break;

            default:
                slidesCount.value = 2; 
                break;
        }
    };

    onMounted(() => {
        checkSlidesCountInResize();
    });

</script>

<style lang="scss">
    @import '@/assets/styles/components/types.scss';
</style>