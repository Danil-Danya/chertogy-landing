<template>
    <section class="about">
        <div class="container">
            <div class="about__content">
            <h2 class="title about__title title-sticked">У нас вы найдете</h2>
                <div class="about__content-left">
                    <h3 class="about__content-title">Уникальное сообщество</h3>
                    <div class="about__content-item" v-for="item in contentList" :key="item">
                        <NuxtImg loading="lazy" :src="item.icon" alt="Иконка" class="about__content-icon" format="webp" />
                        <p class="text about__content-text">{{ item.text }}</p>
                    </div>
                </div>
                <div class="about__content-right">
                    <NuxtImg loading="lazy" src="/images/about/about.png" alt="Картинка" class="about__content-img" format="webp" @click="toggleIsZoomed" />
                </div>
            </div>
            <div class="about__container">
                <div class="about__container-item" v-for="item in containerList" :key="item">
                    <h3 class="about__container-title">{{ item.title }}</h3>
                    <div class="about__container-block" v-for="block in item.list" :key="block">
                        <NuxtImg loading="lazy" :src="block.icon" alt="Иконка" class="about__container-icon" format="webp" />
                        <p class="text about__container-text">{{ block.text }}</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <Transition name="zoom">
        <ZoomImage 
            image="/images/about/about.png" 
            v-if="isZoomed && !isMobile"
            @close="toggleIsZoomed" 
        />
    </Transition>
</template>

<script setup>

    import ZoomImage from '@/components/shared/instruments/ZoomImage.vue';

    import { useIsMobile } from '@/composables/useIsMobile.js';

    const isMobile = useIsMobile();

    const contentList = ref([
        { icon: '/images/about/Variant70.png', text: 'Команда опытных и харизматичных Мастеров, горящих своим делом' },
        { icon: '/images/about/MaskHappy.png', text: 'Дружное сообщество, увлечённых настольными ролевыми играми' },
        { icon: '/images/about/Ranking.png', text: 'Конкурсы, акции и возможность участвовать в жизни клуба для всех' },
    ])

    const containerList = ref([
        {
            title: 'Погружение в атмосферу:',
            list: [
                { icon: '/images/about/CastleTurret.png', text: 'Звукоизолированные комнаты в разном стиле' },
                { icon: '/images/about/Sword.png', text: 'Аутентичный интерьер с элементами фэнтези' },
                { icon: '/images/about/MusicNotesSimple.png', text: 'Несколько уровней управления освещением' },
            ]
        },
        {
            title: 'Максимальный комфорт:',
            list: [
                { icon: '/images/about/Couch.png', text: 'Отдельная зона отдыха с напитками и закусками' },
                { icon: '/images/about/Rss.png', text: 'Бесплатный Wi-Fi для всех и выделенный для Мастеров' },
                { icon: '/images/about/TreasureChest.png', text: 'Необходимый игровой инвентарь и оборудование' },
            ]
        },
        {
            title: 'Поддержка для новичков:',
            list: [
                { icon: '/images/about/HandsPraying.png', text: 'Мастера помогут быстро освоить правила' },
                { icon: '/images/about/PersonArmsSpread.png', text: 'Дружелюбный персонал ответит на любые вопросы' },
                { icon: '/images/about/SmileyWink.png', text: 'Простая и понятная система записи на игры и встречи' },
            ]
        }
    ])

    const isZoomed = ref(false);

    const toggleIsZoomed = () => {
        isZoomed.value = !isZoomed.value;
    }

</script>

<style lang="scss" scoped>
    @import '@/assets/styles/components/about.scss';
</style>
