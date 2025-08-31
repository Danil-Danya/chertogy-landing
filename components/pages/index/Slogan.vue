<template>
    <section class="slogan">
        <div class="container">
            <div class="slogan__content">
                <h2 class="title slogan__title">Следуйте этим советам и все получится!</h2>
                <div class="slogan__container">
                    <div class="slogan__divider">
                        <NuxtImg loading="lazy" class="slogan__divider-img" src="/images/slogan/divider.png" alt="Делитель" format="webp" v-if="!isMobile" />
                    </div>
                    <div class="slogan__item" v-for="item in sloganList" :key="item">
                        <NuxtImg loading="lazy" class="slogan__item-number" :src="item.number" alt="Нумерация" format="webp" />
                        <div class="slogan__item-top">
                            <h3 class="slogan__item-title">{{ item.title }}</h3>
                            <NuxtImg loading="lazy" class="slogan__item-icon" :src="item.icon" alt="Иконка" format="webp" />
                        </div>
                        <div class="slogan__item-bottom">
                            <p class="text slogan__item-text" v-html="item.text" />
                        </div>
                    </div>
                </div>
                <div class="slogan__block">
                    <div class="slogan__block-item">
                        <p class="slogan__block-text">Наш клуб всегда рад новичкам и готов помочь вам сделать первые шаги в удивительный мир настольных ролевых игр!</p>
                        <NuxtImg loading="lazy" class="slogan__block-img" src="/images/logos/logo-slogan.png" alt="Лого" format="webp"/>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>

    import { useIsMobile } from '@/composables/useIsMobile.js';

    const sloganList = ref([
        {
            icon: '/images/slogan/PencilSimpleLine.png',
            number: '/images/slogan/1.png',
            title: 'Запишитесь на игру',
            text: 'Выберите игру в расписании или обратитесь к <span>Смотрителю</span> — мы подберем для Вас наиболее подходящую игру.'
        },
        {
            icon: '/images/slogan/Users.png',
            number: '/images/slogan/2.png',
            title: 'Поговорите с Мастером',
            text: 'Перед игрой ваш Мастер ответит на любые вопросы, объяснит правила и поможет с созданием персонажа.'
        },
        {
            icon: '/images/slogan/Component 10.png',
            number: '/images/slogan/3.png',
            title: 'Создайте персонажа',
            text: 'Это ваш герой для игры. Его можно сделать вместе с Мастером или выбрать из готовых, чтобы быстрее включиться в игру.'
        },
        {
            icon: '/images/slogan/DiceThree.png',
            number: '/images/slogan/4.png',
            title: 'Вникайте по ходу игры',
            text: 'Чтобы начать играть не нужно знать правила. Мастер будет подсказывать вам, что можно сделать в каждой ситуации.'
        },
        {
            icon: '/images/slogan/Smiley.png',
            number: '/images/slogan/5.png',
            title: 'Наслаждайтесь процессом!',
            text: 'Самое важное — это просто расслабиться и получать удовольствие. Не бойтесь задавать вопросы и экспериментировать!'
        },
    ])


    const isMobile = useIsMobile();

</script>

<style lang="scss" scoped>
    @import '@/assets/styles/components/slogan.scss';
</style>
