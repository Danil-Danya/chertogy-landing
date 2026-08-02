<template>
    <ClientOnly>
        <Event />
    </ClientOnly>
</template>

<script setup>
    import Event from "~/components/pages/events/Event.vue";

    definePageMeta({ layout: "site-layout" });

    const route = useRoute();

    // const slug = computed(() => {
    //     return Array.isArray(route.params.slug)
    //         ? route.params.slug[0]
    //         : route.params.slug;
    // });

    // const { data } = await useFetch(
    //     () => `https://api.xn----dtbbbhdau6cfpgt1e.xn--p1ai/server-api/events/${slug.value}`,
    //     {
    //         key: () => `event-seo-${slug.value}`,
    //         server: true,
    //         lazy: import.meta.client
    //     }
    // );

    // const title = computed(() => {
    //     return data.value?.title || "Чертоги Героев";
    // });

    // const description = computed(() => {
    //     return data.value?.shortDescription || "Чертоги Героев — аутентичный клуб настольных ролевых игр.";
    // });

    // const previewPath = computed(() => {
    //     return data.value?.previewPath || data.value?.preview_path || null;
    // });

    // const ogImage = computed(() => {
    //     if (!previewPath.value) {
    //         return "https://xn----dtbbbhdau6cfpgt1e.xn--p1ai/images/logos/logo-nav.png";
    //     }

    //     if (previewPath.value.startsWith("http")) {
    //         return previewPath.value;
    //     }

    //     return `https://xn----dtbbbhdau6cfpgt1e.xn--p1ai/share-images/${previewPath.value}`;
    // });

    // const url = computed(() => {
    //     return `https://xn----dtbbbhdau6cfpgt1e.xn--p1ai/events/${slug.value}`;
    // });

    // useSeoMeta({
    //     title,
    //     description,
    //     keywords: "Чертоги Героев, события, мероприятия, D&D Москва, настольные ролевые игры",

    //     ogType: "website",
    //     ogTitle: title,
    //     ogDescription: description,
    //     ogUrl: url,
    //     ogImage,

    //     twitterCard: "summary_large_image",
    //     twitterTitle: title,
    //     twitterDescription: description,
    //     twitterImage: ogImage
    // });

    // useHead({
    //     meta: [
    //         { property: "og:image:width", content: "1200" },
    //         { property: "og:image:height", content: "630" }
    //     ]
    // });
</script>