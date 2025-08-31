<template>
    <div class="bg-general">
        <News />
    </div>
</template>

<script setup>
    
    import News from "@/components/pages/news/News.vue";

    definePageMeta({ layout: 'site-layout' });

    useHead({
        title: 'Чертоги Героев — новости',
        meta: [
            { name: 'description', content: 'Чертоги Героев — аутентичный клуб настольных ролевых игр (D&D, Pathfinder и другие) в центре Москвы. Уютная атмосфера, опытные мастера и незабываемые приключения.' },
            { name: 'keywords', content: 'Чертоги Героев, клуб D&D Москва, настольные ролевые игры, Dungeons and Dragons, Pathfinder, клуб настолок' },
            { property: 'og:title', content: 'Чертоги Героев — клуб настольных ролевых игр в Москве' },
            { property: 'og:description', content: 'Аутентичный клуб настольных ролевых игр в центре Москвы.' }
        ]
    });
</script>