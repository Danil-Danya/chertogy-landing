<template>
    <section class="event">
        <div class="container">
            <div class="event__content">
                <div class="event__head">
                    <div class="event__head-info">
                        <h1 class="title event__title">{{ eventStore.oneEvent.title }}</h1>
                        <h2 class="event__type">{{ eventStore.oneEvent.type === 'GAME' ? 'Игровая сессия' : 'Мероприятие' }}</h2>
                    </div>
                    <div class="event__head-button">
                        <NuxtLink to="/events" class="event__button-back" @click.prevent.stop="goBack()">
                            <span class="event__button-icon">
                                <BigArrowIcon />
                            </span>
                        </NuxtLink>
                        <a :href="`https://xn----dtbbbhdau6cfpgt1e.xn--p1ai/panel/events/update/${eventStore.oneEvent.id}`" class="event__update" v-if="isStaff && !isFinished && !eventStore.oneEvent.isCanceled">
                            <span class="event__update-icon">
                                <EditIcon />
                            </span>
                        </a>
                    </div>
                </div>
                <div class="event__container">
                    <div class="event__container-top">
                        <div class="event__top-left">
                            <div class="event__container-img">
                                <img :src="`${imageUrl}/${eventStore.oneEvent.previewPath}`" alt="Картинка" class="event__container-img" ref="img">
                                <div class="event__container-glass" v-if="isFinished"></div>
                                <div class="event__price-list">
                                    <template v-if="eventStore.oneEvent.discount && eventStore.oneEvent.discount > 0">
                                        <span 
                                            class="event__price-original"
                                            :class="isEventClosed || isFinished ? 'closed' : null"
                                        >
                                            <PriceIcon />
                                            {{ priceWithDiscount }} ₽
                                            <div class="event__price-discount">
                                                {{ eventStore.oneEvent.price }} ₽
                                            </div>
                                        </span>

                                        <span 
                                            class="event__price-sale"
                                            :class="isEventClosed || isFinished ? 'closed' : null"
                                        >
                                            - {{ eventStore.oneEvent.discount }} %
                                        </span>
                                    </template>

                                    <template v-else>
                                        <span 
                                            class="event__price-original"
                                            :class="isEventClosed || isFinished ? 'closed' : null"
                                        >
                                            <PriceIcon />
                                            {{ eventStore.oneEvent.price }} ₽
                                        </span>
                                    </template>
                                </div>
                                <span class="event__locked" v-if="isStaff">
                                    <LockIcon v-if="eventStore.oneEvent.registrationType === 'OPEN' && !isFinished" />
                                    <UnlockIcon v-else />
                                </span>
                            </div>
                        </div>
                        <div class="event__top-right">
                            <!-- <h2 class="title event__title-mini">{{ eventStore.oneEvent.game?.system }}</h2> -->
                            <div class="event__tag-container">
                                <ul class="event__tag-list" v-if="eventTags.length" :class="isStaff ? 'creator' : null">
                                    <li class="event-tag" v-for="tag in eventTags" :key="tag">
                                        <button class="event__tag-button"
                                            :class="`event__tag-button-${categoryClassMap[tag.category]}`"
                                        >
                                            {{ tag.short_name }}
                                        </button>
                                    </li>
                                </ul>
                            </div>
                            <div class="event__info">
                                <ul class="event__info-list">
                                    <li 
                                        class="event__info-li" 
                                        v-for="info in eventInfoIcons" 
                                        :key="info.text"
                                    >
                                        <h3 class="event__data">
                                            <span v-if="info.data.icon" class="event__data-icon">
                                                <Component :is="info.data.icon" />
                                            </span>
                                        </h3>

                                        <p class="text event__text">{{ info.text }}</p>
                                    </li>
                                </ul>
                                <ul class="event__info-list" v-if="eventStore.oneEvent.type === 'GAME'">
                                    <li 
                                        class="event__info-li" 
                                        v-for="info in eventInfoTitles" 
                                        :key="info.data.title"
                                    >
                                        <h3 class="event__data">
                                            <h3 class="event__data-title">{{ info.data.title }}</h3>
                                        </h3>

                                        <p class="text event__text">{{ info.text }}</p>
                                    </li>
                                </ul>
                            </div>
                            <div class="event__description">
                                <p class="event__text text">{{ eventStore.oneEvent.shortDescription }}</p>
                            </div>
                        </div>
                    </div>
                    <div class="events__container-actions">
                        <EventStaffAction v-if="isStaff" />
                        <EventUserAction v-else />
                    </div>
                    <!-- <div class="event__players">
                        <div class="event__players-item" v-for="subscriber in eventStore.oneEvent?.subscribers ?? []" :key="subscriber.id">
                            <h3 class="event__players-title">{{ subscriber.login }}</h3>
                        </div>
                    </div> -->
                    <div class="event__container-bottom">
                        <div class="event__bottom-action">
                            <div class="event__bottom-action">
                                <button
                                    class="event__button-bottom"
                                    :class="{ 'event__button-bottom-disactive': activeTab !== 'description' }"
                                    @click="activeTab = 'description'"
                                >
                                    Описание
                                </button>

                                <button
                                    class="event__button-bottom"
                                    :class="{ 'event__button-bottom-disactive': activeTab !== 'master' }"
                                    @click="activeTab = 'master'"
                                >
                                    О&nbsp;мастере
                                </button>
                            </div>
                        </div>
                        <div class="events__bottom-content">
                            <template v-if="activeTab === 'description'">
                                <p
                                    class="text event__text"
                                    v-for="text in eventDescription"
                                    :key="text"
                                >
                                    {{ text }}
                                </p>
                            </template>

                            <template v-else>
                                <p
                                    class="text event__text"
                                    v-for="text in masterDescription"
                                    :key="text"
                                >
                                    {{ text }}
                                </p>
                            </template>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>

    // компонент вышел перегруженный, возиожно разгружу на поддержке

    import { useIsMobile } from '@/composables/useIsMobile';
    import { useEventsStore } from '@/store/useEvents';
    import { useRoute, useRouter } from 'vue-router';
    import { useUserStore } from '@/store/useUsers';
    import { useEvent } from '@/composables/useEvent';
    import { subscribeEvent, unSubscribeEvent, updateEventStatus } from '~/api/events';

    import EventStaffAction from '~/components/actions/EventStaffAction.vue';
    import EventUserAction from '~/components/actions/EventUserAction.vue';
    import EditIcon from '~/components/icons/events/cards/Edit.vue';
    import Unlock from '@/components/icons/events/info/Unlock.vue';

    const CalendarIcon = defineAsyncComponent(() => import('@/components/icons/events/info/Calendar.vue'));
    const ClockIcon = defineAsyncComponent(() => import('@/components/icons/events/info/Clock.vue'));
    const DoorIcon = defineAsyncComponent(() => import('@/components/icons/events/info/Door.vue'));

    const BigArrowIcon = defineAsyncComponent(() => import('@/components/icons/events/page/BigArrow.vue'));
    const PriceIcon = defineAsyncComponent(() => import('~/components/icons/events/cards/Price.vue'));
    const ClosedIcon = defineAsyncComponent(() => import('@/components/icons/events/info/Closed.vue'));

    const LockIcon = defineAsyncComponent(() => import('@/components/icons/events/info/Lock.vue'));
    const UnlockIcon = defineAsyncComponent(() => import('@/components/icons/events/info/Unlock.vue'));

    const isMobile = useIsMobile();
    const eventStore = useEventsStore();
    const userStore = useUserStore();
    const route = useRoute();
    const router = useRouter();

    const getRouteSlug = () => Array.isArray(route.params.slug) ? route.params.slug[0] : route.params.slug;

    await eventStore.fetchOneEvent(getRouteSlug());

    const imageUrl = import.meta.env.VITE_APP_IMAGE_URL;

    const eventTags = ref([]);
    const eventInfoIcons = ref([]);
    const eventInfoTitles = ref([]);
    const eventDescription = ref([]);
    const masterDescription = ref([]);

    const img = ref('img');

    const activeTab = ref('description');

    const categoryClassMap = {
        'Длительность': 'duration',
        'Сеттинг': 'setting',
        'Система': 'system',
        'Подготовка': 'preparation',
        'Жанр': 'genre',
        'Опыт игрока': 'experience'
    };

    const normalizeTextList = (value) => {
        if (Array.isArray(value)) {
            return value
                .filter((item) => typeof item === 'string')
                .map((item) => item.trim())
                .filter((item) => item.length > 0);
        }

        if (typeof value === 'string') {
            return value
                .split(',')
                .map((item) => item.trim())
                .filter((item) => item.length > 0);
        }

        return [];
    };

    const splitDescription = (value) => {
        if (typeof value !== 'string') {
            return [];
        }

        return value
            .split('\n')
            .map((item) => item.replace('\r', '').trim())
            .filter((item) => item.length > 0);
    };

    const priceWithDiscount = computed(() => {
        const event = eventStore.oneEvent;

        if (!event?.price) {
            return 0;
        }

        const price = event.price;
        const discount = event.discount ?? 0;

        if (discount <= 0) {
            return price;
        }

        return Math.ceil( price - (price * discount) / 100);
    });

    watch(
        () => getRouteSlug(),
        async (slug, prevSlug) => {
            if (!slug || slug === prevSlug) {
                return;
            }

            await eventStore.fetchOneEvent(slug);
        }
    );
    
    watch(
        () => eventStore.oneEvent,
        (event) => {
            if (!event) {
                return;
            }

            const game = {
                ...(event.game ?? {}),
                skill: normalizeTextList(event.game?.skill),
                genre: normalizeTextList(event.game?.genre)
            };

            const startRaw = event.startTime ?? event.start_time;
            const endRaw = event.endTime ?? event.end_time;

            const start = startRaw ? new Date(startRaw) : null;
            const end = endRaw ? new Date(endRaw) : null;

            eventInfoIcons.value = [
                {
                    data: { icon: CalendarIcon },
                    text: start
                        ? start.toLocaleDateString('ru-RU', {
                            day: 'numeric',
                            month: 'long'
                        })
                        : 'Дата не указана'
                },
                {
                    data: { icon: ClockIcon },
                    text:
                        start && end
                            ? `${start.toLocaleTimeString('ru-RU', {
                                hour: '2-digit',
                                minute: '2-digit'
                            })} - ${end.toLocaleTimeString('ru-RU', {
                                hour: '2-digit',
                                minute: '2-digit'
                            })}`
                            : 'Время не указано'
                },
                {
                    data: { icon: DoorIcon },
                    text: event.place || 'Локация не указана'
                }
            ];
            eventInfoTitles.value = [
                {
                    data: { title: 'Опыт игроков:' },
                    text: game?.skill.join(', ') || 'Не указано'
                },
                {
                    data: { title: 'Подготовка к игре:' },
                    text:
                        game?.necessaryPlayerPreparation ||
                        'Не указано'
                    },
                    {
                        data: { title: 'Уровень персонажа:' },
                        text: game?.playerLevel || 'Не указано'
                    
                }
            ];

            const tags = [
                { category: 'Система', short_name: game?.system || null },
                { category: 'Длительность', short_name: game?.duration || null },
                { category: 'Сеттинг', short_name: game?.setting || null },
            ];

            if (Array.isArray(game?.genre)) {
                for (const genre of game?.genre) {
                    tags.push({
                        category: 'Жанр',
                        short_name: genre
                    });
                }
            }

            eventTags.value = tags.filter((tag) => tag.short_name);

            const fullDescription = event.fullDescription ?? event.fullDescription ?? '';
            eventDescription.value = splitDescription(fullDescription);

            const rawMasterDescription = event?.aboutCreator ?? '';
        
            masterDescription.value = splitDescription(rawMasterDescription);
        },
        { immediate: true }
    );

    const fixImgToSquareByHeight = () => {
        if (isMobile.value) {
            const imgWidth = img.value.clientWidth;
            img.value.style = `height: ${imgWidth}px`;
        }
    }

    onMounted(async () => {
        await userStore.fetchProfile();
        fixImgToSquareByHeight()
    })

    const {
        isStaff,
        isEventClosed,
        isFinished
    } = useEvent();

    const goBack = () => {
        router.go(-1)
    }



</script>

<style lang="scss">
    @import '@/assets/styles/components/event.scss';
</style>
