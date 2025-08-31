<template>
    <div class="news">
        <div class="container">
            <div class="news__content">
                <h1 class="title nesw__title">Новости</h1>
            </div>
            <div class="news__container">
                <NewsCard 
                    v-for="item in newsStore.allNews.rows"
                    :title="truncateText(item.title, 50)"
                    :date="item.createdAt"
                    :text="truncateText(item.shortDescription, 130)"
                    :image="`https://api.чертоги-героев.рф/images/${item.previewPath}`"
                    :slug="item.slug"
                    :key="item"
                />
            </div>
            <div class="news__block">
                <Pagination 
                    page="news" 
                    :totalPages="newsStore.allNews.totalPages"
                />
            </div>
        </div>
    </div>
</template>

<script setup>

    import NewsCard from '@/components/shared/widgets/NewsCard.vue';
    import Pagination from '@/components/shared/instruments/Pagination.vue';

    import truncateText from '@/utils/truncateText.js';

    import { useRoute, useRouter } from 'vue-router';
    import { useNewsStore } from '@/store/useNews.js';

    const newsStore = useNewsStore();
    const route = useRoute();
    const router = useRouter();

    const fetchData = async () => {
        const path = route.path;
        const match = path.match(/page-(\d+)/);

        let page = 1;
        let limit = 4;

        if (match) {
            page = +match[1];
        }

        await newsStore.fetchAllNews(page, limit);
    };

    await fetchData()

    watch(() => route.path, fetchData);

</script>

<style lang="scss">
    @import '@/assets/styles/components/news.scss';
</style>
