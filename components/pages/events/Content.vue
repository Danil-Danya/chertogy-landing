<template>
    <section class="content" ref="content">
        <div class="container">
            <div class="content__content">
                <div class="content__container">
                    <div class="content__list" v-if="route.query.view === 'list'">
                        <div class="content__filter-action">
                            <button class="content__filter-button button" @click="toggleActiveFilter" v-if="isMobile">
                                <FilterIcon />
                                <span class="text">Выбрать фильтры</span>
                            </button>
                        </div>
                        <div class="content__data">
                            <Transition name="filter">
                                <div ref="filter" class="content__filter">
                                    <ContentFilter v-show="isActiveFilter"
                                        :class="{ 'mobile': isMobile }"
                                        @close="toggleActiveFilter"
                                    />
                                </div>
                            </Transition>
                            <div class="content__events" v-if="mappedEvents.length">
                                <EventsCard
                                    v-for="event in mappedEvents"
                                    :key="event.id"
                                    v-bind="event"
                                />
                            </div>

                            <div class="content__events" v-else>
                                <h2 class="content__event-title title">События не были найдены</h2>
                            </div>
                        </div>
                    </div>
                    <div class="content__calendar" v-else>
                        <Date />
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>

    import { useIsMobile } from '#imports';
    import { useRoute, useRouter } from 'vue-router';

    import { mapEventToCard } from '@/utils/eventMapper';

    import { useEventsStore } from '~/store/useEvents';
    
    import EventsCard from '~/components/shared/widgets/EventsCard.vue';
    import Date from './Date.vue';
    
    const ContentFilter = defineAsyncComponent(() => import('@/components/shared/filters/ContentFilter.vue'));
    const FilterIcon = defineAsyncComponent(() => import('@/components/icons/events/filters/Filters.vue'));
    
    const route = useRoute();
    const router = useRouter();
    
    const eventsStore = useEventsStore();

    const isMobile = useIsMobile();
    const isActiveFilter = ref(!isMobile.value);
    
    watch(
        () => isMobile.value,
        (val) => {
            if (val) {
                isActiveFilter.value = false;
            }
            else {
                isActiveFilter.value = true;
            }
        },
        { immediate: true }
    );

    const filter = ref(null);
    const content = ref(null);

    const { events } = defineProps({
        events: {
            type: Object,
            required: true
        }
    });

    const calculateEventContentSections = () => {
        if (!isMobile.value) {
            const filterEl = filter.value;
            const contentEl = content.value;

            const height = filterEl.getBoundingClientRect().height + 60;

            contentEl.style.minHeight = `${height}px`;
        }
    }

    const observeFilter = () => {
        if (!filter.value) return;

        const resizeObserver = new ResizeObserver(() => {
            calculateEventContentSections();
        });

        resizeObserver.observe(filter.value);

        calculateEventContentSections();
    };

    watch(
        () => filter.value,
        (val) => {
            if (val) {
                observeFilter();
            }
        },
        { flush: 'post' }
    );


    watch(
        () => events,
        (newValue, oldValue) => {
            console.log('events обновились', { newValue, oldValue });
        },
        { deep: true }
    );

    const mappedEvents = computed(() => {
        const rows = eventsStore.allEvents?.rows;

        if (!Array.isArray(rows)) {
            return [];
        }

        return rows.map((event) => {
            return {
                id: event.id,
                ...mapEventToCard(event)
            };
        });
    });
        

    // const defineActiveFilter = () => {
    //     if (isMobile.value) {
    //         isActiveFilter.value = false;
    //     }
    // }

    const toggleActiveFilter = () => {
        isActiveFilter.value = !isActiveFilter.value;
    }

    onMounted(async () => {
        if (!route.query.view) {
            router.replace({
                query: {
                    view: 'list',
                    closed: route.query.closed ? route.query.closed : false,
                    lasted: route.query.lasted ? route.query.lasted : true,
                    week_shift: 0
                }
            })
        }

        //defineActiveFilter();

        await nextTick();
        calculateEventContentSections();
    })

</script>

<style lang="scss">
    @import '@/assets/styles/components/events.scss';
</style>