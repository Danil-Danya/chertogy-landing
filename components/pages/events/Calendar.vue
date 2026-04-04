<template>
    <section class="calendar">
        <div class="container">
            <div class="calendar__content">
                <div class="calendar__left">
                    <div class="calendar__button-container">
                        <button class="button calendar__button" @click="countDate('PREV')">
                            <PrevIcon />
                        </button>
                        <button class="button calendar__button" @click="countDate('NEXT')">
                            <NextIcon />
                        </button>
                    </div>
                    <div class="calendar__info">
                        <h3 class="title calendar__from calendar__split">{{ translateDateISOToWordsNoYear(dateFrom) }}</h3>
                        <span class="calendar__split title">-</span>
                        <h3 class="title calendar__to calendar__split">{{ translateDateISOToWordsNoYear(dateTo) }}</h3>
                    </div>
                </div>
                <div class="calendar__right">
                    <div
                        v-if="activeView === 'calendar'"
                        class="calendar__type"
                        @click="setView('list')"
                    >
                        <span class="calendar__icon">
                            <ListIcon />
                        </span>
                        <p class="calendar__text">Расписание в виде списка</p>
                    </div>
                    <div
                        v-else
                        class="calendar__type"
                        @click="setView('calendar')"
                        >
                    <span class="calendar__icon">
                            <CalendarIcon />
                        </span>
                        <p class="calendar__text">Расписание в виде календаря</p>
                    </div>

                    <div class="calendar__right-content">
                        <h3 class="calendar__count">{{ eventsLength }} событий</h3>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>

    const EVENTS_WEEK_SCROLL_STATE_KEY = 'events-week-scroll-state';

    const PrevIcon = defineAsyncComponent(() => import('@/components/icons/events/calendary/Prev.vue'));
    const NextIcon = defineAsyncComponent(() => import('@/components/icons/events/calendary/Next.vue'));

    const CalendarIcon = defineAsyncComponent(() => import('~/components/icons/events/info/Calendar.vue'));
    const ListIcon = defineAsyncComponent(() => import('~/components/icons/events/info/List.vue'));

    import { translateDateISOToWordsNoYear } from '@/utils/dateHelper';
    import { useRoute, useRouter } from 'vue-router';

    import { startOfWeek, addWeeks, endOfWeek } from 'date-fns';

    const route = useRoute();
    const router = useRouter();

    const weekShift = computed(() => {
        return +route.query.week_shift || 0;
    });

    const props = defineProps({
        eventsLength: {
            type: Number,
            required: true
        }
    })

    const activeView = computed(() => {
        return route.query.view === 'calendar'
            ? 'calendar'
            : 'list';
    });

    const setView = (view) => {
        router.replace({
            query: {
                ...route.query,
                view
            }
        });
    };

    const date = new Date();

    const dateFrom = computed(() => {
        const base = addWeeks(new Date(), weekShift.value);
        return startOfWeek(base, { weekStartsOn: 1 }).toISOString();
    });

    const dateTo = computed(() => {
        const base = addWeeks(new Date(), weekShift.value);
        return endOfWeek(base, { weekStartsOn: 1 }).toISOString();
    });


    const countDate = (btn) => {
        if (process.client) {
            window.sessionStorage.setItem(
                EVENTS_WEEK_SCROLL_STATE_KEY,
                JSON.stringify({
                    source: 'events-week-navigation',
                    x: window.scrollX,
                    y: window.scrollY
                })
            );
        }

        const nextShift = btn === 'NEXT' ? weekShift.value + 1 : weekShift.value - 1;

        router.replace({
            query: {
                ...route.query,
                week_shift: nextShift
            }
        });
    };


</script>

<style lang="scss">
    @import '@/assets/styles/components/calendar.scss';
</style>
