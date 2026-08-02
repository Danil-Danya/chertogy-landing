<template>
    <div class="bg-general">
        <Tariffs />
        <Coast />
        <Types />
        <Conditions />
    </div>
</template>

<script setup>
    
    import Conditions from '@/components/pages/tariffs/Conditions.vue';
    import Tariffs from "@/components/pages/tariffs/Tariffs.vue";
    import Coast from '@/components/pages/tariffs/Coast.vue';
    import Types from '@/components/pages/tariffs/Types.vue';
    const route = useRoute();

    definePageMeta({ layout: 'site-layout' });

    // useHead({
    //     title: 'Чертоги Героев — тарифы',
    //     meta: [
    //         { name: 'description', content: 'Чертоги Героев — аутентичный клуб настольных ролевых игр (D&D, Pathfinder и другие) в центре Москвы. Уютная атмосфера, опытные мастера и незабываемые приключения.' },
    //         { name: 'keywords', content: 'Чертоги Героев, клуб D&D Москва, настольные ролевые игры, Dungeons and Dragons, Pathfinder, клуб настолок' },
    //         { property: 'og:type', content: 'website' },
    //         { property: 'og:title', content: 'Чертоги Героев — тарифы' },
    //         { property: 'og:description', content: 'Чертоги Героев — аутентичный клуб настольных ролевых игр (D&D, Pathfinder и другие) в центре Москвы. Уютная атмосфера, опытные мастера и незабываемые приключения.' },
    //         { property: 'og:image', content: 'https://xn----dtbbbhdau6cfpgt1e.xn--p1ai/images/logos/logo-nav.png' },
    //         { property: 'og:url', content: `https://xn----dtbbbhdau6cfpgt1e.xn--p1ai${route.path}` },
    //         { name: 'twitter:card', content: 'summary_large_image' },
    //         { name: 'twitter:title', content: 'Чертоги Героев — тарифы' },
    //         { name: 'twitter:description', content: 'Чертоги Героев — аутентичный клуб настольных ролевых игр (D&D, Pathfinder и другие) в центре Москвы. Уютная атмосфера, опытные мастера и незабываемые приключения.' },
    //         { name: 'twitter:image', content: 'https://xn----dtbbbhdau6cfpgt1e.xn--p1ai/images/logos/logo-nav.png' }
    //     ]
    // });
</script>
