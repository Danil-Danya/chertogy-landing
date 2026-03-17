<template>
    <section class="date">
        <div class="date__container">
            <div class="date__head">
                <ul class="date__head-list">
                    <li
                        class="date__head-days"
                        v-for="day in daysList"
                        :key="day.date"
                        :class="{ 'is-active': day.isActive }"
                    >
                        <p class="text">{{ day.label }}</p>
                    </li>
                </ul>
            </div>
            <div class="date__item-container">
                <div class="date__item" v-for="item in daysList" :key="item">
                    <div class="date__day">
                        <h2 class="date__day" :class="{ 'is-active': item.isActive }">{{ item.dateText }}</h2>
                    </div>
                    <div class="date__item-events" v-if="item.events.length">
                        <div class="date__item-event" v-for="event in item.events" :key="event">
                            <RouterLink :to="`/events/${event.slug}`" v-if="event">
                                <p class="text">{{ formatTime(event.startTime) }} - {{ formatTime(event.endTime) }}</p>
                                <h3 class="date__item-title">{{ truncateText(event.title, 10) }}</h3>
                                <div class="date__item-marks">
                                    <span class="date__item-setting date__item-mark" v-if="event?.game?.system">
                                        {{ event.game.system.split(' ')[0] }}
                                    </span>
                                    <span class="date__item-duration date__item-mark" v-if="event?.game?.duration">
                                        {{ event?.game?.duration }}
                                    </span>
                                </div>
                                <p class="text date__item-text">
                                    <span class="date__item-icon">
                                        <StarIcon />
                                    </span>
                                    {{ event?.creator?.profile.name }}
                                </p>
                                <p class="text date__item-text">
                                    <span class="date__item-icon">
                                        <SubscribeIcon />
                                    </span>
                                    {{ event?.subscribers.length }} / {{ event.maxPlayers }}
                                </p>
                                <p class="text date__item-text">
                                    <span class="date__item-icon">
                                        <DoorIcon />
                                    </span>
                                    {{ event?.place }}
                                </p>
                            </RouterLink>
                        </div>
                    </div>
                    <div class="date__item-event" v-else>
                        <div class="date__day">
                            <h3 class="date__item-title">Нет запланированных игр</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>

    import { ref, watch } from 'vue';
    import { useRoute } from 'vue-router';
    import { startOfWeek, addDays, isSameDay, format, addWeeks } from 'date-fns';
    import { ru, enUS } from 'date-fns/locale';

    import { useEventsStore } from '~/store/useEvents';

    const StarIcon = defineAsyncComponent(() => import('@/components/icons/events/info/Star.vue'));
    const SubscribeIcon = defineAsyncComponent(() => import('~/components/icons/events/cards/Subscribes.vue'));
    const DoorIcon = defineAsyncComponent(() => import('~/components/icons/events/info/Door.vue'));
    const CrownIcon = defineAsyncComponent(() => import('~/components/icons/events/page/Crown.vue'));

    const eventsStore = useEventsStore();
    const route = useRoute();

    const today = new Date();
    const daysList = ref([]);

    const formatTime = (iso) => format(new Date(iso), 'HH:mm');

    const buildDaysList = (weekShift = 0) => {
        const monday = startOfWeek(addWeeks(today, Number(weekShift)), { weekStartsOn: 1 });

        const list = Array.from({ length: 7 }).map((_, index) => {
            const date = addDays(monday, index);
            return {
                key: format(date, 'yyyy-MM-dd'),
                label: format(date, 'EEEE', { locale: ru }),
                dateText: format(date, 'd MMMM', { locale: ru }),
                isActive: isSameDay(date, today),
                events: []
            };
        });

        daysList.value = list;
    };

    watch(
        () => eventsStore.calendarEvents,
        (calendar) => {
            if (!calendar) {
                return;
            }

            const allEvents = Object.values(calendar).flat().map((event) => {
                return {
                    ...event,
                    startTime: event.startTime ?? event.start_time,
                    endTime: event.endTime ?? event.end_time,
                    maxPlayers: event.maxPlayers ?? event.max_players,
                };
            });

            daysList.value = daysList.value.map((day) => {
                const dayEvents = allEvents
                    .filter(event => event.startTime && format(new Date(event.startTime), 'yyyy-MM-dd') === day.key)
                    .slice(0, 3);

                while (dayEvents.length < 3) {
                    dayEvents.push(null);
                }

                return {
                    ...day,
                    events: dayEvents
                };
            });
        },
        { immediate: true }
    );

    watch(
        () => route.query.week_shift,
        async (newShift) => {
            const shift = Number(newShift) || 0;
            buildDaysList(shift);
            await eventsStore.fetchEventsCalendar({ week_shift: shift });
        },
        { immediate: true }
    );



    onMounted(async () => {
        await eventsStore.fetchEventsCalendar({ ...route.query });
    })

</script>

<style lang="scss">
    @import '@/assets/styles/components/date.scss';
</style>
