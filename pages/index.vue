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
            { name: 'description', content: 'Самый аутентичный клуб настольных ролевых игр в центре Москвы (Арбат). Погрузитесь в захватывающие миры вместе с лучшими Мастерам! Приходите сами, зовите друзей или заводите новых у нас! Вы можете поиграть D&D (ДнД), Vampire: The Masquerade, Fate, Daggerheart, Call of Cthulhu, Клинки во Тьме, Delta Green, 10 свечей, Warhammer и другие системы.' },
            { name: 'keywords', content: 'Чертоги Героев, клуб D&D Москва, настольные ролевые игры, Dungeons and Dragons, Pathfinder, клуб настолок' },
        ]
    });

</script>
