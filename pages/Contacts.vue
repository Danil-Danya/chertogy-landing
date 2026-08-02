<template>
    <div class="bg-general">
        <Contacts />
        <Navigator />
        <Vacancies />
    </div>
</template>

<script setup>
    
    import Contacts from "@/components/pages/contacts/Contacts.vue";
    import Navigator from '@/components/pages/contacts/Navigator.vue';
    import Vacancies from "@/components/pages/contacts/Vacancies.vue";
    
    const route = useRoute();

    definePageMeta({ layout: 'site-layout' });

    // useHead({
    //     title: 'Чертоги Героев — контакты',
    //     meta: [
    //         { name: 'description', content: 'Чертоги Героев — аутентичный клуб настольных ролевых игр (D&D, Pathfinder и другие) в центре Москвы. Уютная атмосфера, опытные мастера и незабываемые приключения.' },
    //         { name: 'keywords', content: 'Чертоги Героев, клуб D&D Москва, настольные ролевые игры, Dungeons and Dragons, Pathfinder, клуб настолок' },
    //         { property: 'og:type', content: 'website' },
    //         { property: 'og:title', content: 'Чертоги Героев — контакты' },
    //         { property: 'og:description', content: 'Чертоги Героев — аутентичный клуб настольных ролевых игр (D&D, Pathfinder и другие) в центре Москвы. Уютная атмосфера, опытные мастера и незабываемые приключения.' },
    //         { property: 'og:image', content: 'https://xn----dtbbbhdau6cfpgt1e.xn--p1ai/images/logos/logo-nav.png' },
    //         { property: 'og:url', content: `https://xn----dtbbbhdau6cfpgt1e.xn--p1ai${route.path}` },
    //         { name: 'twitter:card', content: 'summary_large_image' },
    //         { name: 'twitter:title', content: 'Чертоги Героев — контакты' },
    //         { name: 'twitter:description', content: 'Чертоги Героев — аутентичный клуб настольных ролевых игр (D&D, Pathfinder и другие) в центре Москвы. Уютная атмосфера, опытные мастера и незабываемые приключения.' },
    //         { name: 'twitter:image', content: 'https://xn----dtbbbhdau6cfpgt1e.xn--p1ai/images/logos/logo-nav.png' }
    //     ]
    // });
</script>
