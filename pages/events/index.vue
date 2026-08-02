<template>
    <ClientOnly>
        <div class="bg-events">
            <Alert v-if="myRole !== 'ADMIN' && myRole !== 'MASTER'" />
            <Calendar :events-length="route.query.view === 'list' ? eventsStore.allEvents.rows?.length : calendarEvents" :class="myRole === 'ADMIN' || myRole === 'MASTER' ? 'admin-calendar' : ''" />
            <Content :events="eventsStore.allEvents" />
        </div>
    </ClientOnly>
</template>

<script setup>
    import { onMounted, watch, computed } from 'vue';
    import { useRoute } from 'vue-router';
    import { useEventsStore } from '~/store/useEvents';
    import { useUserStore } from '~/store/useUsers';

    import Alert from '@/components/pages/events/Alert.vue';
    import Calendar from '~/components/pages/events/Calendar.vue';
    import Content from '~/components/pages/events/Content.vue';

    const eventsStore = useEventsStore();
    const userStore = useUserStore();

    const route = useRoute();

    const calendarEvents = computed(() => {
        let events = [];

        for (const key in eventsStore.calendarEvents) {
            eventsStore.calendarEvents[key].forEach((event) => {
                events.push(event);
            })
        }

        return events.length;
    })

    const getQueryValue = (value) => {
        if (Array.isArray(value)) {
            return value[value.length - 1];
        }

        return value;
    };

    const parseBool = (value) => {
        return value === true || value === 'true' || value === 1 || value === '1';
    };

    const myRole = computed(() => userStore.profile?.role);

    const buildFilterFromQuery = () => {
        const query = route.query;
        const filter = {};

        filter.orderingType = 'DESC';
        filter.ordering = 'start_time';

        const multiKeys = [
            'duration',
            'system',
            'skill',
            'genre',
            'setting',
            'player_level'
        ];

        multiKeys.forEach(key => {
            if (query[key]) {
                filter[key] = Array.isArray(query[key]) ? query[key] : [query[key]];
            }
        });

        const minPrice = getQueryValue(query.min_price);
        const maxPrice = getQueryValue(query.max_price);
        const weekShift = getQueryValue(query.week_shift);

        if (minPrice !== undefined && minPrice !== '') filter.min_price = Number(minPrice);
        if (maxPrice !== undefined && maxPrice !== '') filter.max_price = Number(maxPrice);

        filter.week_shift = Number(weekShift) || 0;

        if (query.closed !== undefined) filter.closed = parseBool(query.closed);
        filter.lasted = query.lasted !== undefined ? parseBool(query.lasted) : true;
        filter.show_meetings = query.show_meetings !== undefined ? parseBool(query.show_meetings) : true;

        return filter;
    };

    onMounted(async () => {
        const filter = buildFilterFromQuery();

        await eventsStore.fetchEvents(filter);
        await userStore.fetchProfile();
    });

    watch(
        () => route.query,
        async () => {
            const filter = buildFilterFromQuery();

            await Promise.all([
                eventsStore.fetchEvents(filter),
                eventsStore.fetchEventsCalendar({ week_shift: filter.week_shift })
            ]);
        },
        { deep: true }
    );

    definePageMeta({ 
        layout: 'site-layout',
    });

    // useHead({
    //     title: 'Чертоги Героев — мероприятия',
    //     meta: [
    //         { name: 'description', content: 'Чертоги Героев — расписание мероприятий и игровых сессий клуба настольных ролевых игр в Москве.' },
    //         { name: 'keywords', content: 'Чертоги Героев, мероприятия, игровые сессии, D&D Москва, настольные ролевые игры' },
    //         { property: 'og:type', content: 'website' },
    //         { property: 'og:title', content: 'Чертоги Героев — мероприятия' },
    //         { property: 'og:description', content: 'Чертоги Героев — расписание мероприятий и игровых сессий клуба настольных ролевых игр в Москве.' },
    //         { property: 'og:image', content: 'https://xn----dtbbbhdau6cfpgt1e.xn--p1ai/images/logos/logo-nav.png' },
    //         { property: 'og:url', content: `https://xn----dtbbbhdau6cfpgt1e.xn--p1ai${route.path}` },
    //         { name: 'twitter:card', content: 'summary_large_image' },
    //         { name: 'twitter:title', content: 'Чертоги Героев — мероприятия' },
    //         { name: 'twitter:description', content: 'Чертоги Героев — расписание мероприятий и игровых сессий клуба настольных ролевых игр в Москве.' },
    //         { name: 'twitter:image', content: 'https://xn----dtbbbhdau6cfpgt1e.xn--p1ai/images/logos/logo-nav.png' }
    //     ]
    // });

</script>
