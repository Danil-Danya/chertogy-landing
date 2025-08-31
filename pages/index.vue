<template>
    <Head />
    <div class="bg-about">
        <About />
        <Interior />
    </div>
    <div class="bg-slogan">
        <Slogan />
        <Mission />
    </div>
    <div class="bg-faq">
        <FAQ />
    </div>
</template>

<script setup>
    import FAQ from '@/components/pages/index/FAQ.vue'
    import Head from "@/components/pages/index/Head.vue";
    import About from "@/components/pages/index/About.vue";
    import Slogan from "@/components/pages/index/Slogan.vue";
    import Mission from "@/components/pages/index/Mission.vue";
    import Interior from "@/components/pages/index/Interior.vue";

    definePageMeta({ layout: 'site-layout' });

    useHead({
    title: 'Чертоги Героев — клуб настольных ролевых игр в Москве',
        meta: [
            { name: 'description', content: 'Чертоги Героев — аутентичный клуб настольных ролевых игр (D&D, Pathfinder и другие) в центре Москвы. Уютная атмосфера, опытные мастера и незабываемые приключения.' },
            { name: 'keywords', content: 'Чертоги Героев, клуб D&D Москва, настольные ролевые игры, Dungeons and Dragons, Pathfinder, клуб настолок' },
            { property: 'og:title', content: 'Чертоги Героев — клуб настольных ролевых игр в Москве' },
            { property: 'og:description', content: 'Аутентичный клуб настольных ролевых игр в центре Москвы.' }
        ]
    });
</script>
