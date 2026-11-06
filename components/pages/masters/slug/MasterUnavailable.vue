<template>
    <section class="not-found master-unavailable">
        <div class="container">
            <div class="not-found__content">
                <h1 class="not-found__title">404</h1>
                <h2 class="not-found__title-mini">Мастер «{{ name }}» временно недоступен</h2>
                <p class="not-found__text text">
                    Профиль мастера временно скрыт. Вернитесь к списку мастеров, чтобы выбрать другого ведущего.
                </p>
                <NuxtLink class="not-found__link" to="/masters">Вернуться к мастерам</NuxtLink>
            </div>
        </div>
    </section>
</template>

<script setup>

    defineProps({
        name: {
            type: String,
            required: true
        }
    });

</script>

<style lang="scss" scoped>
    @import '@/assets/styles/components/master-unavailable.scss';
</style>
