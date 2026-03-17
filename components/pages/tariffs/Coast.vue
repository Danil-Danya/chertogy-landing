<template>
    <section class="coast">
        <div class="container">
            <div class="coast__content">
                <h2 class="title coast__item-title">Что входит в стоимость</h2>
            </div>
            <div class="coast__container">
                <div class="coast__item" v-for="item in coastList" :key="item">
                    <img loading="lazy" :src="item.image" alt="bg" format="webp" class="coast__item-bg" />
                    <p class="text coast__item-text">{{ item.text }}</p>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>

    const coastList = ref([
        {
            text: 'Доступ к выбранной комнате со звукоизоляцией и тематическим оформлением',
            image: '/images/coast/image1.png'
        },
        {
            text: 'Любой игровой инвентарь клуба: от кубиков до портативных экранов',
            image: '/images/coast/image2.png'
        },
        {
            text: 'Системы управления светом, звуком и изображением для полного погружения',
            image: '/images/coast/image3.png'
        },
        {
            text: 'Вкусный черный и зеленый чай, ароматный кофе и разнообразные снеки',
            image: '/images/coast/image4.png'
        },
        {
            text: 'Посещение комфортной общей зоны отдыха на всё время визита клуба',
            image: '/images/coast/image5.png'
        },
    ])

</script>

<style lang="scss" scoped>
    @import '@/assets/styles/components/coast.scss';
</style>
