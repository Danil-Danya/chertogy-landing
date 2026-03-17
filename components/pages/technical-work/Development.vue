<template>
    <section class="development">
        <div class="development__head">
            <span class="development__icon">
                <PenIcon />
            </span>
            <h2 class="development__head-text">Раздел находится в разработке</h2>
        </div>
        <div class="container">
            <div class="development__content">
                <!-- <h2 class="development__text text">Здесь вы найдёте все игры и события клуба</h2> -->
                <h2 class="development__title title">Записывайтесь на игры через наши социальные сети</h2>
                <div class="development__button-container">
                    <a target="_blank" rel="noopener noreferrer" :href="item.link" class="development__button" v-for="item in socialList" :key="item" :class="item.type">
                        <span class="development__button-icon">
                            <Component :is="item.icon" />
                        </span>
                        {{ item.title }}
                    </a>
                </div>
                <div class="development__button-test">
                    <div class="development__button-test">
                        <a target="_blank" rel="noopener noreferrer" href="https://xn----dtbbbhdau6cfpgt1e.xn--p1ai/events" class="development__button test">
                            Участвовать в тестировании
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>

    const VKIcon = defineAsyncComponent(() => import('@/components/icons/development/VK.vue'));
    const TGIcon = defineAsyncComponent(() => import('@/components/icons/development/Telegram.vue'));

    const PenIcon = defineAsyncComponent(() => import('@/components/icons/development/Pen.vue'));

    const socialList = ref([
        {
            title: 'Телеграм канал',
            link: 'https://t.me/ChertogiGeroev_Club',
            type: 'tg',
            icon: TGIcon
        },
        {
            title: 'Сообщество в ВК',
            link: 'https://vk.com/chertogi.club',
            type: 'vk',
            icon: VKIcon
        },
    ])

</script>


<style lang="scss">
    @import '@/assets/styles/components/development.scss';
</style>
