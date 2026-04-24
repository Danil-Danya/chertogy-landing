<template>
    <section class="tariffs">
        <div class="container">
            <div class="tariffs__content">
                <h1 class="title tariffs__title">Тарифы</h1>
            </div>
            <Transition name="modal">
                <SocialModal
                    v-if="isSocialModalOpen"
                    @close="closeSocialModal"
                />
            </Transition>
            <Swiper
                :breakpoints="swiperBreakpoints"
                :space-between="16"
                :slides-per-view="1.08"
                :watch-overflow="true"
                class="tariffs__slider"
            >
                <SwiperSlide
                    v-for="(item, index) in tariffsList"
                    :key="item.title"
                    class="tariffs__slide"
                >
                    <article
                        class="tariffs__item"
                        :class="`tariffs__item-${index}`"
                    >
                        <div class="tariffs__item-top">
                            <h3 class="tariffs__item-title">{{ item.title }}</h3>
                            <p class="tariffs__item-description text">{{ item.description }}</p>
                        </div>
                        <div class="tariffs__item-center">
                            <p class="tariffs__item-price">{{ item.price }}</p>
                            <p class="tariffs__item-rate">{{ item.rate }}</p>
                        </div>
                        <ul class="tariffs__item-notes">
                            <li
                                v-for="note in item.notes"
                                :key="note"
                                class="tariffs__item-note text"
                            >
                                {{ note }}
                            </li>
                        </ul>
                        <a
                            v-if="item.action.modal"
                            href="#"
                            class="tariffs__item-link"
                            @click.prevent="openSocialModal"
                        >
                            <span class="tariffs__item-icon">
                                <Component :is="item.action.icon" />
                            </span>
                            <span>{{ item.action.text }}</span>
                        </a>
                        <a
                            v-else-if="item.action.external"
                            :href="item.action.href"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="tariffs__item-link"
                        >
                            <span class="tariffs__item-icon">
                                <Component :is="item.action.icon" />
                            </span>
                            <span>{{ item.action.text }}</span>
                        </a>
                        <NuxtLink
                            v-else
                            :to="item.action.href"
                            class="tariffs__item-link"
                        >
                            <span class="tariffs__item-icon">
                                <Component :is="item.action.icon" />
                            </span>
                            <span>{{ item.action.text }}</span>
                        </NuxtLink>
                    </article>
                </SwiperSlide>
            </Swiper>
        </div>
    </section>
</template>

<script setup>
    import { Swiper, SwiperSlide } from 'swiper/vue';
    import 'swiper/css';

    import BookIcon from '@/components/icons/tariffs/Book.vue';
    import SearchIcon from '@/components/icons/tariffs/Search.vue';
    import RoomIcon from '@/components/icons/tariffs/Room.vue';

    import SocialModal from '~/components/shared/modals/SocialModal.vue';

    const isSocialModalOpen = ref(false);

    const openSocialModal = () => {
        isSocialModalOpen.value = true;
    };

    const closeSocialModal = () => {
        isSocialModalOpen.value = false;
    };

    const swiperBreakpoints = {
        576: {
            slidesPerView: 1.15,
            spaceBetween: 16,
        },
        768: {
            slidesPerView: 2.1,
            spaceBetween: 18,
        },
        992: {
            slidesPerView: 3,
            spaceBetween: 20,
            allowTouchMove: false,
        },
    };

    const tariffsList = [
        {
            title: 'Игра с Мастером',
            description: 'Участие в игре под руководством нашего Мастера, куда может прийти любой желающий.',
            price: 'от 2200₽',
            rate: 'за сессию с игрока',
            notes: [
                'финальная стоимость всегда указана в анонсе События',
                'сессия длится около 4,5 часов',
            ],
            action: {
                text: 'Подобрать игру',
                icon: RoomIcon,
                href: '/events',
                external: false,
            },
        },
        {
            title: 'Аренда комнаты',
            description: 'Бронирование игровой комнаты для вашей компании, в том числе для игры со своим Мастером.',
            price: 'от 5000₽',
            rate: 'за 4,5 часа с группы',
            notes: [
                'финальную стоимость и условия уточните при бронировании, возможно согласование',
            ],
            action: {
                text: 'Забронировать комнату',
                icon: BookIcon,
                href: '#',
                external: false,
                modal: true,
            },
        },
        {
            title: 'Заказная игра',
            description: 'Игра под ключ для вашей компании от профессионального ведущего — нашего Мастера.',
            price: 'от 10 000₽',
            rate: 'за сессию с группы',
            notes: [
                'финальную стоимость и условия уточняйте при заказе',
                'сессия длится около 4,5 часов',
            ],
            action: {
                text: 'Заказать приключение',
                icon: SearchIcon,
                href: '#',
                external: false,
                modal: true,
            },
        },
    ];
</script>

<style lang="scss">
    @import '@/assets/styles/components/tariffs.scss';
</style>
