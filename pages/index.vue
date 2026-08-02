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
    
    const route = useRoute();

    definePageMeta({ layout: 'site-layout' });

    // useHead({
    //     title: 'Чертоги Героев — клуб настольных ролевых игр в Москве',
    //     meta: [
    //         { name: 'description', content: 'Самый аутентичный клуб настольных ролевых игр в центре Москвы (Арбат). Погрузитесь в захватывающие миры вместе с лучшими Мастерам! Приходите сами, зовите друзей или заводите новых у нас! Вы можете поиграть D&D (ДнД), Vampire: The Masquerade, Fate, Daggerheart, Call of Cthulhu, Клинки во Тьме, Delta Green, 10 свечей, Warhammer и другие системы.' },
    //         { name: 'keywords', content: 'Чертоги Героев, клуб D&D Москва, настольные ролевые игры, Dungeons and Dragons, Pathfinder, клуб настолок' },
    //         { property: 'og:type', content: 'website' },
    //         { property: 'og:title', content: 'Чертоги Героев — клуб настольных ролевых игр в Москве' },
    //         { property: 'og:description', content: 'Самый аутентичный клуб настольных ролевых игр в центре Москвы (Арбат). Погрузитесь в захватывающие миры вместе с лучшими Мастерам! Приходите сами, зовите друзей или заводите новых у нас! Вы можете поиграть D&D (ДнД), Vampire: The Masquerade, Fate, Daggerheart, Call of Cthulhu, Клинки во Тьме, Delta Green, 10 свечей, Warhammer и другие системы.' },
    //         { property: 'og:image', content: 'https://xn----dtbbbhdau6cfpgt1e.xn--p1ai/images/logos/logo-nav.png' },
    //         { property: 'og:url', content: `https://xn----dtbbbhdau6cfpgt1e.xn--p1ai${route.path}` },
    //         { name: 'twitter:card', content: 'summary_large_image' },
    //         { name: 'twitter:title', content: 'Чертоги Героев — клуб настольных ролевых игр в Москве' },
    //         { name: 'twitter:description', content: 'Самый аутентичный клуб настольных ролевых игр в центре Москвы (Арбат). Погрузитесь в захватывающие миры вместе с лучшими Мастерам! Приходите сами, зовите друзей или заводите новых у нас! Вы можете поиграть D&D (ДнД), Vampire: The Masquerade, Fate, Daggerheart, Call of Cthulhu, Клинки во Тьме, Delta Green, 10 свечей, Warhammer и другие системы.' },
    //         { name: 'twitter:image', content: 'https://xn----dtbbbhdau6cfpgt1e.xn--p1ai/images/logos/logo-nav.png' }
    //     ]
    // });

</script>
