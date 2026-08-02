<template>
    <div class="bg-general">
        <Development />
    </div>
</template>

<script setup>
    
    import Development from "@/components/pages/technical-work/Development.vue";
    const route = useRoute();

    definePageMeta({ layout: 'site-layout' });

    // useHead({
    //     title: 'Чертоги Героев — Технические работы',
    //     meta: [
    //         { name: 'description', content: 'Чертоги Героев — аутентичный клуб настольных ролевых игр (D&D, Pathfinder и другие) в центре Москвы. Уютная атмосфера, опытные мастера и незабываемые приключения.' },
    //         { name: 'keywords', content: 'Чертоги Героев, клуб D&D Москва, настольные ролевые игры, Dungeons and Dragons, Pathfinder, клуб настолок' },
    //         { property: 'og:type', content: 'website' },
    //         { property: 'og:title', content: 'Чертоги Героев — Технические работы' },
    //         { property: 'og:description', content: 'Чертоги Героев — аутентичный клуб настольных ролевых игр (D&D, Pathfinder и другие) в центре Москвы. Уютная атмосфера, опытные мастера и незабываемые приключения.' },
    //         { property: 'og:image', content: 'https://xn----dtbbbhdau6cfpgt1e.xn--p1ai/images/logos/logo-nav.png' },
    //         { property: 'og:url', content: `https://xn----dtbbbhdau6cfpgt1e.xn--p1ai${route.path}` },
    //         { name: 'twitter:card', content: 'summary_large_image' },
    //         { name: 'twitter:title', content: 'Чертоги Героев — Технические работы' },
    //         { name: 'twitter:description', content: 'Чертоги Героев — аутентичный клуб настольных ролевых игр (D&D, Pathfinder и другие) в центре Москвы. Уютная атмосфера, опытные мастера и незабываемые приключения.' },
    //         { name: 'twitter:image', content: 'https://xn----dtbbbhdau6cfpgt1e.xn--p1ai/images/logos/logo-nav.png' }
    //     ]
    // });
    
</script>
