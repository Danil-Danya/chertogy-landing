<template>
    <div class="pagination" v-if="totalPages > 1">
        <div class="pagination__container">
            <NuxtLink
                :to="prevTo"
                class="pagination__button pagination__button-arrow"
                :class="{ 'disabled': currentPage <= 1 }"
                aria-label="Предыдущая страница"
            >
                <span class="pagination__button-icon">
                    <ArrowPrevIcon />
                </span>
            </NuxtLink>

            <div class="pagination__counter">
                <template v-for="item in items" :key="item.key">
                    <span v-if="item.type === 'dots'" class="pagination__space">...</span>

                    <NuxtLink
                        v-else
                        :to="item.to"
                        class="pagination__button"
                        :class="{ 'active': item.page === currentPage }"
                    >
                        {{ formatPage(item.page) }}
                    </NuxtLink>
                </template>
            </div>

            <NuxtLink
                :to="nextTo"
                class="pagination__button pagination__button-arrow"
                :class="{ 'disabled': currentPage >= totalPages }"
                aria-label="Следующая страница"
            >
                <span class="pagination__button-icon">
                    <ArrowNextIcon />
                </span>
            </NuxtLink>
        </div>
    </div>
</template>

<script setup>
    import { computed, ref, watch } from 'vue';
    import { useRoute } from 'vue-router';

    const ArrowPrevIcon = defineAsyncComponent(() => import('@/components/icons/pagination/ArrowPrev.vue'));
    const ArrowNextIcon = defineAsyncComponent(() => import('@/components/icons/pagination/ArrowNext.vue'));

    const route = useRoute();

    const props = defineProps({
        page: {
            type: String,
            required: true
        },
        totalPages: {
            type: Number,
            required: true
        }
    });

    const currentPage = ref(1);

    const parsePageFromRoute = () => {
        const match = route.path.match(/page-(\d+)/);
        let page = match ? Number(match[1]) : 1;

        if (!Number.isFinite(page) || page < 1) {
            page = 1;
        }

        if (page > props.totalPages) {
            page = props.totalPages;
        }

        currentPage.value = page;
    };

    parsePageFromRoute();

    watch(() => route.path, () => {
        parsePageFromRoute();
    });

    const buildTo = (p) => {
        if (p <= 1) {
            return `/${props.page}`;
        }

        return `/${props.page}/page-${p}`;
    };

    const prevTo = computed(() => {
        const target = Math.max(1, currentPage.value - 1);
        return buildTo(target);
    });

    const nextTo = computed(() => {
        const target = Math.min(props.totalPages, currentPage.value + 1);
        return buildTo(target);
    });

    const formatPage = (p) => {
        if (p < 10) {
            return `0${p}`;
        }

        return String(p);
    };

    const isMobile = ref(false);

const updateIsMobile = () => {
    isMobile.value = window.matchMedia('(max-width: 520px)').matches;
};

onMounted(() => {
    updateIsMobile();
    window.addEventListener('resize', updateIsMobile);
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', updateIsMobile);
});

const items = computed(() => {
    const total = props.totalPages;
    const cur = currentPage.value;

    const makePage = (p) => {
        return {
            type: 'page',
            page: p,
            to: buildTo(p),
            key: `p-${p}`
        };
    };

    const makeDots = (key) => {
        return {
            type: 'dots',
            key
        };
    };

    const maxNumbers = isMobile.value ? 4 : 7;

    if (total <= maxNumbers) {
        const all = [];
        for (let p = 1; p <= total; p += 1) {
            all.push(makePage(p));
        }
        return all;
    }

    if (isMobile.value) {
        const result = [];

        if (cur <= 2) {
            result.push(makePage(1));
            result.push(makePage(2));
            result.push(makePage(3));
            result.push(makeDots('dots-right'));
            result.push(makePage(total));
            return result;
        }

        if (cur >= total - 1) {
            result.push(makePage(1));
            result.push(makeDots('dots-left'));
            result.push(makePage(total - 2));
            result.push(makePage(total - 1));
            result.push(makePage(total));
            return result;
        }

        result.push(makePage(1));
        result.push(makeDots('dots-left'));
        result.push(makePage(cur));
        result.push(makePage(cur + 1));
        result.push(makeDots('dots-right'));
        result.push(makePage(total));

        return result;
    }

    const result = [];

    if (cur <= 3) {
        result.push(makePage(1));
        result.push(makePage(2));
        result.push(makePage(3));
        result.push(makePage(4));
        result.push(makePage(5));
        result.push(makeDots('dots-right'));
        result.push(makePage(total));
        return result;
    }

    if (cur >= total - 2) {
        result.push(makePage(1));
        result.push(makeDots('dots-left'));
        result.push(makePage(total - 4));
        result.push(makePage(total - 3));
        result.push(makePage(total - 2));
        result.push(makePage(total - 1));
        result.push(makePage(total));
        return result;
    }

    result.push(makePage(1));
    result.push(makeDots('dots-left'));
    result.push(makePage(cur - 1));
    result.push(makePage(cur));
    result.push(makePage(cur + 1));
    result.push(makeDots('dots-right'));
    result.push(makePage(total));

    return result;
});
</script>

<style lang="scss" scoped>
    @import '@/assets/styles/components/pagination.scss';

    .pagination__button.disabled {
        pointer-events: none;
        opacity: 0.5;
    }
</style>