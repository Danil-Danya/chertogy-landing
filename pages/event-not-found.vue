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
    definePageMeta({ layout: 'site-layout' });
</script>

<style lang="scss" scoped>
    @import '@/assets/styles/components/404.scss';
</style>
