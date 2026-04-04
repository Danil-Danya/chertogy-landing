<template>
    <ClientOnly>
        <div class="bg-events">
            <Alert />
            <Calendar :events-length="route.query.view === 'list' ? eventsStore.allEvents.rows?.length : calendarEvents" />
            <Content :events="eventsStore.allEvents" />
        </div>
    </ClientOnly>
</template>

<script setup>
    import { onMounted, watch, computed } from 'vue';
    import { useRoute } from 'vue-router';
    import { useEventsStore } from '~/store/useEvents';

    import Alert from '@/components/pages/events/Alert.vue';
    import Calendar from '~/components/pages/events/Calendar.vue';
    import Content from '~/components/pages/events/Content.vue';

    const eventsStore = useEventsStore();
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

    const buildFilterFromQuery = () => {
        const query = route.query;
        const filter = {};

        filter.orderingType = 'DESC';
        filter.ordering = 'start_time';

        const multiKeys = [
            'duration',
            'system',
            'genre',
            'setting',
            'player_level'
        ];

        multiKeys.forEach(key => {
            if (query[key]) {
                filter[key] = Array.isArray(query[key]) ? query[key] : [query[key]];
            }
        });

        const parseBool = (v) => {
            if (v === true || v === 'true' || v === 1 || v === '1') {
                return true;
            }

            return false;
        };

        if (query.min_price) filter.min_price = Number(query.min_price);
        if (query.max_price) filter.max_price = Number(query.max_price);

        filter.week_shift = Number(query.week_shift) || 0;

        if (query.closed !== undefined) filter.closed = parseBool(query.closed);
        filter.lasted = query.lasted !== undefined ? parseBool(query.lasted) : true;
        if (query.show_meetings) filter.show_meetings = String(query.show_meetings);

        return filter;
    };

    onMounted(async () => {
        const filter = buildFilterFromQuery();
        await eventsStore.fetchEvents(filter);
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

</script>
