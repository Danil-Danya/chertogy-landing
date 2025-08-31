<template>
    <section class="mission">
        <div class="container">
            <div class="mission__content">
                <h2 class="title mission__title title-sticked">Наша миссия</h2>
                <div class="mission__container">
                    <div class="mission__block" v-if="!isMobile">
                        <p class="mission__block-text text">Сформировать пространство, где люди смогут вместе погружаться в миры приключений, переживать уникальный опыт и развивать культуру настольных ролевых игр.</p>
                    </div>
                    <div class="mission__item" v-for="item in missionList" :key="item">
                        <h3 class="mission__item-title">{{ item.title }}</h3>
                        <p class="text mission__item-text">{{ item.text }}</p>
                        <NuxtImg loading="lazy" class="mission__img" :src="item.image" alt="Задний фон" format="webp" />
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>

    import { useIsMobile } from '@/composables/useIsMobile.js';

    const missionList = ref([
        {
            image: '/images/mission/1.png',
            title: 'Объединение людей',
            text: 'Создание условий, где игроки разного опыта и увлечённые ремеслом Мастера смогут легко находить друг друга для создания уникальных совместных игровых переживаний.'
        },
        {
            image: '/images/mission/2.png',
            title: 'Погружение в миры приключений',
            text: 'Обеспечение максимально комфортных условий и вдохновляющей атмосферы, которые будут способствовать наилучшему погружению в захватывающие миры приключений.'
        },
        {
            image: '/images/mission/3.png',
            title: 'Развитие культуры ролевых игр',
            text: 'Продвижение культуры настольных ролевых игр через объединение неравнодушных увлечённых людей и предоставление им возможности формировать будущий образ клуба.'
        }
    ])


    const isMobile = useIsMobile();

</script>


<style lang="scss" scoped>
    @import '@/assets/styles/components/mission.scss';
</style>

