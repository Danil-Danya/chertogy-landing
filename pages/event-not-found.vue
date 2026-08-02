<template>
    <div class="bg-general">
        <div class="not-found">
            <div class="container">
                <div class="not-found__content">
                    <h1 class="not-found__title">404</h1>
                    <h2 class="not-found__title-mini">Ой, событие не найдено или было удалено</h2>
                    <NuxtLink class="not-found__link" to="/events">Вернуться к событиям</NuxtLink>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    const route = useRoute();

    definePageMeta({ layout: 'site-layout' });

    // useHead({
    //     title: 'Чертоги Героев — событие не найдено',
    //     meta: [
    //         { name: 'description', content: 'Событие не найдено или было удалено. Посмотрите актуальные мероприятия клуба Чертоги Героев.' },
    //         { name: 'keywords', content: 'Чертоги Героев, события, мероприятия, D&D Москва, настольные ролевые игры' },
    //         { property: 'og:type', content: 'website' },
    //         { property: 'og:title', content: 'Чертоги Героев — событие не найдено' },
    //         { property: 'og:description', content: 'Событие не найдено или было удалено. Посмотрите актуальные мероприятия клуба Чертоги Героев.' },
    //         { property: 'og:image', content: 'https://xn----dtbbbhdau6cfpgt1e.xn--p1ai/images/logos/logo-nav.png' },
    //         { property: 'og:url', content: `https://xn----dtbbbhdau6cfpgt1e.xn--p1ai${route.path}` },
    //         { name: 'twitter:card', content: 'summary_large_image' },
    //         { name: 'twitter:title', content: 'Чертоги Героев — событие не найдено' },
    //         { name: 'twitter:description', content: 'Событие не найдено или было удалено. Посмотрите актуальные мероприятия клуба Чертоги Героев.' },
    //         { name: 'twitter:image', content: 'https://xn----dtbbbhdau6cfpgt1e.xn--p1ai/images/logos/logo-nav.png' }
    //     ]
    // });
</script>

<style lang="scss" scoped>
    @import '@/assets/styles/components/404.scss';
</style>
