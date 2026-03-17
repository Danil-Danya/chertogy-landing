<template>
    <div class="content__filter-container">
        <div class="content__filter-close" @click="closeFilter" v-if="isMobile">
            <CloseIcon />
        </div>
        <div class="content__filter-head">
            <h2 class="title content__filter-title">Фильтры</h2>
            <span class="content__filter-default" @click="clearFilter">Сбросить</span>
        </div>
        <div class="content__filter-type">
            <TransitionGroup name="tags">
                <div class="content__filter-type-container" v-if="isTypeActive">
                    <div class="content__filter-type-item">
                        <input
                            type="checkbox"
                            id="type-event"
                            class="content__filter-checkbox"
                            v-model="filters.show_meetings"
                        />
                        <label for="type-event" class="content__filter-label">
                            Показать и мероприятия
                        </label>
                    </div>
                </div>
                <div class="content__filter-checkbox-container">
                    <input
                        type="checkbox"
                        id="filter-lasted"
                        class="content__filter-checkbox"
                        v-model="filters.lasted"
                    />
                    <label for="filter-lasted" class="content__filter-label">
                        Показать и прошедшие
                    </label>
                </div>
                <div class="content__filter-checkbox-container">
                    <input
                        type="checkbox"
                        id="filter-closed"
                        class="content__filter-checkbox"
                        v-model="filters.closed"
                    />
                    <label for="filter-closed" class="content__filter-label">
                        Показать и закрытые
                    </label>
                </div>
            </TransitionGroup>
        </div>
        <div class="content__filter-price">
            <h3 class="content__filter-subtitle">Стоимость игры</h3>
            <div class="content__filter-price-container">
                <input
                    type="number"
                    class="content__filter-input"
                    placeholder="от 300 ₽"
                    v-model.number="filters.min_price"
                />

                <input
                    type="number"
                    class="content__filter-input"
                    placeholder="до 50000 ₽"
                    v-model.number="filters.max_price"
                />
            </div>
        </div>
        <div class="content__filter-tags-container" v-if="allTags">
            <div class="content__filter-tags-item" v-for="(tagsCat, index) in allTags" :key="tagsCat.name">
                <div
                    class="content__filter-tags-head"
                    :class="{ 'selected': hasSelectedInCategory(tagsCat) }"
                    @click="toggleTagsInCategory(index)"
                >
                    <h2 class="content__filter-tags-category">{{ tagsCat.name }}</h2>

                    <span
                        class="content__filter-icon"
                        :class="{
                            'active': tagsCat.isActive,
                            'selected': hasSelectedInCategory(tagsCat)
                        }"
                    >
                        <ArrowIcon />
                    </span>
                </div>

                <TransitionGroup name="tags">
                    <div class="content__filter-tags-body" v-if="tagsCat.isActive">
                        <div class="content__filter-tags-checkbox-container" v-for="(tag) in tagsCat.tags" :key="tag.id">
                            <input
                                type="checkbox"
                                :id="tag.id"
                                class="content__filter-checkbox"
                                :value="tag.shortName"
                                v-model="filters[tagsCat.apiKey]"
                            />
                            {{ tagsCat.code }}
                            <label :for="tag.id" class="content__filter-label">{{ tag.shortName }}</label>
                        </div>
                    </div>
                </TransitionGroup>
            </div>
        </div>
        <div class="content__filter-button-container">
            <button
                class="content__filter-button"
                @click="applyFilters"
            >
                Применить фильтры
            </button>
        </div>
    </div>
</template>

<script setup>

    import { useTagsStore } from '~/store/useTags';
    import { useEventsStore } from '~/store/useEvents';
    import { useRoute, useRouter } from 'vue-router';
    // import { useIsMobile } from '#imports';

    const CloseIcon = defineAsyncComponent(() => import('~/components/icons/events/filters/Close.vue'));
    const ArrowIcon = defineAsyncComponent(() => import('~/components/icons/events/filters/Arrow.vue'));

    const tags = useTagsStore();
    const eventsStore = useEventsStore();

    const isMobile = useIsMobile();

    const route = useRoute();
    const router = useRouter();

    await tags.fetchTagsWithCategories();

    const emit = defineEmits(['close']);

    const allTags = ref([]);

    const isTypeActive = ref(true);

    const filters = ref({
        type: null,
        system: [],
        skill: [],
        genre: [],
        setting: [],
        duration: [],
        player_level: [],
        necessary_player_preparation: [],
        min_price: null,
        max_price: null,
        lasted: true,
        closed: false
        // page: 1,
        // limit: 10,
        // ordering: "created_at",
        // orderingType: "asc"
    });

    allTags.value = tags.tagsWithCategories.rows.map((item, index) => ({
        ...item,
    }));

    const hasSelectedInCategory = (tagsCat) => {
        const key = tagsCat?.apiKey;

        if (!key) {
            return false;
        }

        const value = filters.value[key];

        return Array.isArray(value) && value.length > 0;
    };


    const toggleType = () => {
        isTypeActive.value = !isTypeActive.value;
    }

    const toggleTagsInCategory = (index) => {
        allTags.value[index].isActive = !allTags.value[index].isActive;
    };

    const closeFilter = () => {
        emit('close');
    };

    const CATEGORY_TO_API_KEY = {
        "Система": "system",
        "Жанр": "genre",
        "Сеттинг": "setting",
        "Длительность": "duration",
        "Подготовка": "necessary_player_preparation",
        "Опыт игрока": "player_level"
    };

    allTags.value = tags.tagsWithCategories.rows
        .map((item, index) => {
            const apiKey = CATEGORY_TO_API_KEY[item.name];
            if (!apiKey) return null;

            if (!Array.isArray(filters.value[apiKey])) {
                filters.value[apiKey] = [];
            }

            return {
                ...item,
                apiKey,
            };
        })
        .filter(Boolean);


    const buildQuery = () => {
        const query = {};

        Object.entries(filters.value).forEach(([key, value]) => {
            if (Array.isArray(value) && value.length) {
                query[key] = value;
            }
            else if (!Array.isArray(value) && value !== null && value !== "") {
                query[key] = value;
            }
        });

        return query;
    };


    const applyFilters = async () => {
        const filter = buildQuery();

        filter.orderingType = 'DESC';
        filter.ordering = 'start_time';

        if (route.query.week_shift) {
            filter.week_shift = route.query.week_shift;
        }
        
        router.push({
            query: {
                ...route.query,
                ...filter
            }
        });
        
        await eventsStore.fetchEvents(filter);

        if (isMobile.value) {
            closeFilter();
        }
    };


    const clearFilter = () => {
        const cleanUrl = route.path;

        window.location.replace(cleanUrl);
    };


    onMounted(() => {
        const query = route.query;

        Object.keys(filters.value).forEach((key) => {
            if (Array.isArray(filters.value[key]) && query[key]) {
                filters.value[key] = Array.isArray(query[key])
                    ? [...query[key]]
                    : [query[key]];
            }

            if (!Array.isArray(filters.value[key]) && query[key] !== undefined) {
                filters.value[key] = query[key];
            }
        });
    });

</script>

<style lang="scss">
    @import '@/assets/styles/components/content.scss';
</style>