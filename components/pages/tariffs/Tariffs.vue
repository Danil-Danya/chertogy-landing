<template>
    <section class="tariffs">
        <div class="container">
            <div class="tariffs__content">
                <h1 class="title tariffs__title">Тарифы</h1>
            </div>
            <div class="tariffs__container">
                <Swiper
                    :slides-per-view="slidesCount"
                    :space-between="20"
                    :modules="modules"
                    @swiper="onSwiper"
                    @slideChange="onSlideChange"
                    class="tariffs__slider"
                    loop
                >
                    <SwiperSlide 
                        v-for="item in tariffsList"
                        :key="item"
                    >
                        <div class="tariffs__item">
                            <NuxtImg :src="item.image" alt="фон" format="webp" class="tariffs__item-img" />
                            <div class="tariffs__item-top">
                                <h3 class="tariffs__item-title">
                                    {{ item.title }}
                                </h3>
                            </div>
                            <div class="tariffs__item-center">
                                <div class="tariffs__item-type">
                                    <h4 class="tariffs__item-date">В будние дни:</h4>
                                    <div class="tariffs__item-block">
                                        <p class="tariffs__item-text text">{{ item.type }}</p>
                                        <p class="tariffs__item-price">{{ item.types.weekends.price }}</p>
                                    </div>
                                </div>
                                <div class="tariffs__item-type">
                                    <h4 class="tariffs__item-date">В пятницу:</h4>
                                    <div class="tariffs__item-block">
                                        <p class="tariffs__item-text text">{{ item.type }}</p>
                                        <p class="tariffs__item-price">{{ item.types.friday.price }}</p>
                                    </div>
                                </div>
                                <div class="tariffs__item-type">
                                    <h4 class="tariffs__item-date">В выходные:</h4>
                                    <div class="tariffs__item-block">
                                        <p class="tariffs__item-text text">{{ item.type }}</p>
                                        <p class="tariffs__item-price">{{ item.types.weekdays.price }}</p>
                                    </div>
                                </div>
                            </div>
                            <div class="tariffs__item-bottom">
                                <p class="tariffs__item-alert text">
                                    <span class="red">*</span>
                                    {{ item.alert }}
                                </p>
                            </div>
                        </div>
                    </SwiperSlide>
                </Swiper>
            </div>
        </div>
    </section>
</template>

<script setup>

    import { Swiper, SwiperSlide } from 'swiper/vue';
    import { Navigation, Autoplay } from 'swiper/modules';

    import 'swiper/css';
    import 'swiper/css/navigation';

    const modules = [Navigation, Autoplay];
    
    const tariffsList = ref([
        {
            title: 'Игра c Мастером',
            alert: 'финальная цена всегда указана в анонсе События.',
            types: {
                weekends: {
                    price: 'от 2000₽',
                },
                weekdays: {
                    price: 'от 2200₽',
                },
                friday: {
                    price: 'от 2100₽',
                }
            },
            type: 'с игрока',
            image: '/images/tariffs/tariffs1.png'
        },
        {
            title: 'Аренды комнаты',
            alert: 'уточняйте стоимость и условия аренды у Смотрителя.',
            types: {
                weekends: {
                    price: 'от 5000₽',
                },
                weekdays: {
                    price: 'от 7000₽',
                },
                friday: {
                    price: 'от 6000₽',
                }
            },
            type: 'с группы',
            image: '/images/tariffs/tariffs2.png'
        },
        {
            title: 'Заказная игра',
            alert: 'цена зависит от даты, Мастера и предпочтений группы.',
            types: {
                weekends: {
                    price: 'от 9000₽',
                },
                weekdays: {
                    price: 'от 11000₽',
                },
                friday: {
                    price: 'от 10000₽',
                }
            },
            type: 'с группы',
            image: '/images/tariffs/tariffs1.png'
        },
    ])

    const onSwiper = (swiper) => {
        console.log('Swiper instance:', swiper);
    }

    const onSlideChange = () => {
        console.log('Slide changed');
    }

    let slidesCount = ref(3);

    const checkSlidesCountInResize = () => {
        const windowWidth = window.innerWidth;

        switch (true) {
            case (windowWidth <= 768): 
                slidesCount.value = 1.1;
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
    });

</script>


<style lang="scss">
    @import '@/assets/styles/components/tariffs.scss';
</style>
