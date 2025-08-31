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

    definePageMeta({ layout: 'site-layout' });

    useHead({
        title: 'Чертоги Героев — тарифы',
        meta: [
            { name: 'description', content: 'Чертоги Героев — аутентичный клуб настольных ролевых игр (D&D, Pathfinder и другие) в центре Москвы. Уютная атмосфера, опытные мастера и незабываемые приключения.' },
            { name: 'keywords', content: 'Чертоги Героев, клуб D&D Москва, настольные ролевые игры, Dungeons and Dragons, Pathfinder, клуб настолок' },
            { property: 'og:title', content: 'Чертоги Героев — клуб настольных ролевых игр в Москве' },
            { property: 'og:description', content: 'Аутентичный клуб настольных ролевых игр в центре Москвы.' }
        ]
    });
</script>