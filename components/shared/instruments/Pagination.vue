<template>
    <div class="pagination">
        <div class="pagination__container">
            <NuxtLink :to="`/${page}/${prevPage ? `page-${prevPage}` : ''}`" class="pagination__button">
                <span class="pagination__button-icon">
                    <ArrowPrevIcon />
                </span>
            </NuxtLink>

            <div class="pagination__counter">
                <NuxtLink 
                    :to="`/${page}/${index >= 1 ? `page-${index + 1}` : ''}`"
                    class="pagination__button"
                    :class="currentPage === index + 1 ? 'active' : null"
                    v-for="(item, index) in 2"
                    :key="item"
                >
                    0{{ item }}
                </NuxtLink>

                <span class="pagination__space">...</span>

                <NuxtLink 
                    :to="`/${page}/${`page-${totalPages}`}`"
                    :class="currentPage === totalPages ? 'active' : null"
                    class="pagination__button"
                    :key="item"
                >
                    0{{ totalPages }}
                </NuxtLink>
            </div>

            <NuxtLink :to="`/${page}/${nextPage ? `page-${nextPage}` : ''}`" class="pagination__button">
                <span class="pagination__button-icon">
                    <ArrowNextIcon />
                </span>
            </NuxtLink>
        </div>
    </div>
</template>

<script setup>

    import { useRoute, useRouter } from 'vue-router';

    const ArrowPrevIcon = defineAsyncComponent(() => import('@/components/icons/pagination/ArrowPrev.vue'));
    const ArrowNextIcon = defineAsyncComponent(() => import('@/components/icons/pagination/ArrowNext.vue'));

    const route = useRoute();
    const router = useRouter();

    const currentPage = ref(1);
    const prevPage = ref(0);
    const nextPage = ref(2);

    const props = defineProps({
        page: {
            type: String,
            required: true
        },

        totalPages: {
            type: Number,
            required: true
        }
    })

    const updatePagination = () => {
        const path = route.path;
        const match = path.match(/page-(\d+)/);

        let page = match ? +match[1] : 1;

        if (page < 1) {
            page = 1;
        }

        if (page > props.totalPages) {
            page = props.totalPages;
        }

        currentPage.value = page;
        prevPage.value = page > 1 ? page - 1 : 0;
        nextPage.value = page < props.totalPages ? page + 1 : 0;
    };

    updatePagination();

    watch(() => route.path, () => {
        updatePagination();
    });

</script>

<style lang="scss" scoped>
    @import '@/assets/styles/components/pagination.scss';
</style>
