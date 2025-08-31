<template>
    <section class="conditions">
        <div class="container">
            <div class="conditions__content">
                <h2 class="title conditions__title">Условия посещения клуба</h2>
            </div>
            <div class="conditions__container">
                <div class="conditions__item" v-for="item in conditionsList" :key="item">
                    <p class="conditions__text text">{{ item.text }}</p>
                    <NuxtImg loading="lazy" :src="item.image" alt="Декорация" class="conditions__img" format="webp" />
                </div>
            </div>
            <div class="conditions__banner">
                <div class="conditions__banner-block">
                    <h3 class="conditions__banner-slogan">Хотите посетить клуб на особых условиях? Обращайтесь к <a href="https://t.me/ChertogiGeroev" class="red">Смотрителю</a></h3>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>

    const conditionsList = ref([
        {
            text: 'Участие в событиях (играх) происходит только по предварительной записи',
            image: '/images/conditions/Pencil.png'
        },
        {
            text: 'Комнаты бронируются минимум на 4,5 часа в рабочие часы клуба',
            image: '/images/conditions/DiceFour.png'
        },
        {
            text: 'Максимальное количество участников — 8 человек (для некоторых комнат не более 6)',
            image: '/images/conditions/UsersThree.png'
        },
        {
            text: 'Соблюдение чистоты, пунктуальность и уважение к другим гостям',
            image: '/images/conditions/Handshake.png'
        },
    ])

</script>

<style lang="scss">
    @import '@/assets/styles/components/conditions.scss';
</style>
