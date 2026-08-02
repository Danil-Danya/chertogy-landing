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

    import { computed, onMounted } from 'vue';
    import { useRoute } from 'vue-router';
    import { useNewsStore } from '@/store/useNews.js';
    import getImageUrl from '@/utils/getImageUrl.js';

    import Post from "@/components/pages/news/slug/Post.vue";
    import NewsSlider from "@/components/pages/news/slug/NewsSlider.vue";

    definePageMeta({ layout: 'site-layout' });

    const route = useRoute();
    const newsStore = useNewsStore();

    const slug = computed(() => route.params.slug);

    await newsStore.fetchOneNews(slug.value);

    // useHead(() => {
    //     const title = newsStore.oneNews?.title || 'Чертоги Героев';
    //     const description = newsStore.oneNews?.shortDescription || 'Чертоги Героев — аутентичный клуб настольных ролевых игр.';
    //     const url = `https://xn----dtbbbhdau6cfpgt1e.xn--p1ai/news/${slug.value}`;
    //     const image = newsStore.oneNews?.previewPath
    //         ? `https://xn----dtbbbhdau6cfpgt1e.xn--p1ai/share-images/${newsStore.oneNews.previewPath}`
    //         : 'https://xn----dtbbbhdau6cfpgt1e.xn--p1ai/images/logos/logo-nav.png';

    //     return {
    //         title,
    //         meta: [
    //             { name: 'description', content: description },
    //             { name: 'keywords', content: 'Чертоги Героев, клуб D&D Москва, настольные ролевые игры, Dungeons and Dragons, клуб настолок' },
    //             { property: 'og:type', content: 'website' },
    //             { property: 'og:title', content: title },
    //             { property: 'og:description', content: description },
    //             { property: 'og:url', content: url },
    //             { property: 'og:image', content: image },
    //             { property: 'og:image:width', content: '1200' },
    //             { property: 'og:image:height', content: '630' },
    //             { name: 'twitter:card', content: 'summary_large_image' },
    //             { name: 'twitter:title', content: title },
    //             { name: 'twitter:description', content: description },
    //             { name: 'twitter:image', content: image }
    //         ]
    //     };
    // });

    const previewImage = computed(() => getImageUrl(newsStore.oneNews?.previewPath));


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
