<template>
    <div class="bg-general">
        <Post 
            :title="newsStore.oneNews.title"
            :date="newsStore.oneNews.createdAt"
            :text="description"
            :image="previewImage"
        />
        <NewsSlider />
    </div>
</template>

<script setup>

    import { computed, watchEffect, onMounted } from 'vue';
    import { useRoute } from 'vue-router';
    import { useNewsStore } from '@/store/useNews.js';

    import Post from "@/components/pages/news/slug/Post.vue";
    import NewsSlider from "@/components/pages/news/slug/NewsSlider.vue";

    definePageMeta({ layout: 'site-layout' });

    const route = useRoute();
    const newsStore = useNewsStore();

    const slug = computed(() => route.params.slug);

    await newsStore.fetchOneNews(slug.value);

    const previewImage = computed(() => {
        const path = newsStore.oneNews?.previewPath;
        return path ? `https://api.чертоги-героев.рф/images/${path}` : null;
    });


    const description = computed(() => {
        const text = newsStore.oneNews?.description;

        if (!text) {
            return [];
        }

        return text
            .replace(/\r\n/g, '\n')
            .replace(/\r/g, '\n')
            .split('\n')
            .map(line => line.trim())
            .filter(Boolean);
    });


    watchEffect(() => {
        if (newsStore.oneNews) {
            useHead({
                title: newsStore.oneNews.title || 'Чертоги Героев',
                meta: [
                    { name: 'description', content: newsStore.oneNews.shortDescription || 'Чертоги Героев — аутентичный клуб настольных ролевых игр.' },
                    { name: 'keywords', content: 'Чертоги Героев, клуб D&D Москва, настольные ролевые игры, Dungeons and Dragons, клуб настолок' },
                    { property: 'og:title', content: newsStore.oneNews.title || 'Чертоги Героев — клуб настольных ролевых игр в Москве' },
                    { property: 'og:description', content: newsStore.oneNews.shortDescription || 'Аутентичный клуб настольных ролевых игр в центре Москвы.' }
                ]
            });
        }
    });

    watch(slug, async (newSlug) => {
        if (newSlug) {
            if (process.client) {
                await newsStore.fetchOneNews(newSlug);
            }
        }
    }, { immediate: true });

    onMounted(async () => {
        await newsStore.fetchOneNews(slug.value);
    })

</script>
