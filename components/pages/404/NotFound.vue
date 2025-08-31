<template>
    <div class="not-found">
        <div class="container">
            <div class="not-found__content">
                <h1 class="not-found__title">404</h1>
                <h2 class="not-found__title-mini">Страница не найдена</h2>
                <p class="not-found__text text">
                    Проверьте подключение к интернету, убедитесь что маршрут введён верно, 
                    либо у вас может быть недостаточно прав доступа к этой странице.
                </p>
                <NuxtLink class="not-found__link" to="/">Вернуться на главную</NuxtLink>
            </div>
        </div>
    </div>
</template>


<style lang="scss" scoped>
    @import '@/assets/styles/components/404.scss';
</style>