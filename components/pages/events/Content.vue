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
                            <div class="content__events">
                                <template v-if="mappedEvents.length">
                                    <EventsCard
                                        v-for="event in mappedEvents"
                                        :key="event.id"
                                        v-bind="event"
                                        :attention-active="String(event.id) === activeAttentionEventId"
                                    />
                                </template>
                                <h2 v-else class="content__event-title title">События не были найдены</h2>

                                <div class="content__events-footer">
                                    <WeekNavigation
                                        :events-length="mappedEvents.length"
                                        :show-view-toggle="false"
                                    />
                                </div>
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
    import WeekNavigation from './WeekNavigation.vue';
    
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
    const activeAttentionEventId = ref(null);

    let attentionAnimationFrame = null;
    let attentionMutationObserver = null;
    let attentionResizeObserver = null;

    const updateActiveAttentionCard = () => {
        attentionAnimationFrame = null;

        if (!content.value) {
            activeAttentionEventId.value = null;
            return;
        }

        const targets = content.value.querySelectorAll('[data-event-attention-id]');
        const viewportCenter = window.innerHeight / 2;
        let closestEventId = null;
        let closestDistance = Number.POSITIVE_INFINITY;

        for (const target of targets) {
            const rect = target.getBoundingClientRect();

            if (rect.width === 0 || rect.height === 0) {
                continue;
            }

            const targetCenter = rect.top + rect.height / 2;
            const distance = Math.abs(targetCenter - viewportCenter);

            if (distance < closestDistance) {
                closestDistance = distance;
                closestEventId = target.dataset.eventAttentionId ?? null;
            }
        }

        activeAttentionEventId.value = closestEventId;
    };

    const scheduleAttentionUpdate = () => {
        if (!process.client || attentionAnimationFrame !== null) {
            return;
        }

        attentionAnimationFrame = window.requestAnimationFrame(updateActiveAttentionCard);
    };

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
                    show_meetings: route.query.show_meetings ? route.query.show_meetings : true,
                    week_shift: 0
                }
            })
        }

        //defineActiveFilter();

        await nextTick();
        calculateEventContentSections();

        window.addEventListener('scroll', scheduleAttentionUpdate, { passive: true });
        window.addEventListener('resize', scheduleAttentionUpdate, { passive: true });

        attentionMutationObserver = new MutationObserver(scheduleAttentionUpdate);
        attentionMutationObserver.observe(content.value, {
            childList: true,
            subtree: true
        });

        attentionResizeObserver = new ResizeObserver(scheduleAttentionUpdate);
        attentionResizeObserver.observe(content.value);

        scheduleAttentionUpdate();
    })

    onBeforeUnmount(() => {
        window.removeEventListener('scroll', scheduleAttentionUpdate);
        window.removeEventListener('resize', scheduleAttentionUpdate);

        attentionMutationObserver?.disconnect();
        attentionResizeObserver?.disconnect();

        if (attentionAnimationFrame !== null) {
            window.cancelAnimationFrame(attentionAnimationFrame);
        }
    });

</script>

<style lang="scss">
    @import '@/assets/styles/components/events.scss';

    .content__events-footer {
        margin-top: 10px;
    }
</style>
