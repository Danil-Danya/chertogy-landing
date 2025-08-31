<template>
    <div class="bg-general">
        <Post 
            :title="newsStore.oneNews.title"
            :date="newsStore.oneNews.createdAt"
            :text="description"
            :image="`https://api.чертоги-героев.рф/images/${newsStore.oneNews.previewPath}`"
        />
        <NewsSlider />
    </div>
</template>

<script setup>
    
    import Post from "@/components/pages/news/slug/Post.vue";
    import NewsSlider from "@/components/pages/news/slug/NewsSlider.vue";

    import { useNewsStore } from '@/store/useNews.js';
    import { storeToRefs } from 'pinia';
    import { useRoute } from 'vue-router';

    const route = useRoute();
    const newsStore = useNewsStore();
    const { oneNews } = storeToRefs(newsStore);

    definePageMeta({ layout: 'site-layout' });

    const slug = computed(() => route.params.slug);
    await newsStore.fetchOneNews(slug);

    const description = computed(() => {
        if (!newsStore.oneNews?.description) {
            return [];
        }

        return newsStore.oneNews.description
            .replace(/\\n/g, '\n') 
            .split('\n')
            .filter(line => line.trim() !== '');
    });

    watchEffect(async () => {
        if (slug.value) {
            await newsStore.fetchOneNews(slug.value);
        }
    });

    useHead({
        title: newsStore.oneNews.title,
        meta: [
            { name: 'description', content: 'Чертоги Героев — аутентичный клуб настольных ролевых игр (D&D, Pathfinder и другие) в центре Москвы. Уютная атмосфера, опытные мастера и незабываемые приключения.' },
            { name: 'keywords', content: 'Чертоги Героев, клуб D&D Москва, настольные ролевые игры, Dungeons and Dragons, Pathfinder, клуб настолок' },
            { property: 'og:title', content: 'Чертоги Героев — клуб настольных ролевых игр в Москве' },
            { property: 'og:description', content: 'Аутентичный клуб настольных ролевых игр в центре Москвы.' }
        ]
    });
</script>