<template>
    <div class="development__head events">
        <span class="development__icon">
            <PenIcon />
        </span>
        <h2 class="development__head-text">Раздел находится в разработке</h2>
    </div>
    <section class="alert">
        <div class="container">
            <div class="alert__container">
                <h1 class="title">Все игры и события клуба</h1>
            </div>
            <div class="alert__content">
                <div class="alert__information">
                    <div class="alert__information-item" v-for="item in information" :key="item">
                        <span class="alert__icon">
                            <Component :is="item.icon" />
                        </span>
                        <p class="alert__text text" v-html="item.text"></p>
                    </div>
                </div>
                <div class="alert__help" v-if="role === 'USER' || role === 'GUEST'">
                    <img src="@/assets/images/events/bg.png" alt="bg" class="alert__help-bg">
                    <h2 class="alert__help-title">Теряетесь?</h2>
                    <p class="text alert__help-text">Жмите кнопку снизу, и мы поможем подобрать вам игру!</p>
                    <a target="_blank" rel="noopener noreferrer" href="https://t.me/ChertogiGeroev" class="alert__help-button">Помогите, я новичок!</a>
                </div>
                <div class="alert__help" v-else>
                    <img src="@/assets/images/events/bg.png" alt="bg" class="alert__help-bg">
                    <h2 class="alert__help-title">Нет подходящего события?</h2>
                    <p class="text alert__help-text">Так создайте его сами!</p>
                    <a target="_blank" rel="noopener noreferrer" href="https://xn----dtbbbhdau6cfpgt1e.xn--p1ai/panel/events/create?event=game_session" class="alert__help-button green">
                        <span class="alert__help-icon">
                            <Plus />
                        </span>
                        Создать событие
                    </a>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>

    import Clock from '~/components/icons/events/alerts/Clock.vue';
    import Filter from '~/components/icons/events/alerts/Filter.vue';
    import Message from '~/components/icons/events/alerts/Message.vue';
    import Like from '~/components/icons/events/alerts/Like.vue';
    import Pen from '~/components/icons/events/alerts/Pen.vue';
    import Heart from '~/components/icons/events/alerts/Heart.vue';
    import Plus from '~/components/icons/events/alerts/Plus.vue';

    const PenIcon = defineAsyncComponent(() => import('@/components/icons/development/Pen.vue'));
    
    import { useUserStore } from '~/store/useUsers';
    
    const userStore = useUserStore();
    await userStore.fetchProfile();

    const role = computed(() => {
        return userStore.profile?.role || 'GUEST';
    });

    const information = [
        {
            icon: Like,
            text: 'Используйте <span class="alert__text-purple">Стрелки &lt;&gt;</span> для навигации по календарю'
        },
        {
            icon: Filter,
            text: 'Выбирайте <span class="alert__text-purple">Фильтры</span> для подбора подходящего <span class="alert__text-purple">События</span>'
        },
        {
            icon: Message,
            text: 'Нажимайте на <span class="alert__text-purple">Событие</span> для отображения подробной информации'
        },
        {
            icon: Heart,
            text: 'Обратите внимание на тип <span class="alert__text-purple">События</span> — Игровая сессия или Мероприятие'
        },
        {
            icon: Pen,
            text: 'Кнопка <span class="alert__text-dark">Записаться</span> добавит вас в список участников <span class="alert__text-purple">События</span>, если есть места'
        },
        {
            icon: Clock,
            text: 'Кнопка <span class="alert__text-orange">Ожидать</span> заявит о желании участвовать в <span class="alert__text-purple">Событии</span>, если появятся места'
        }
    ]

</script>

<style lang="scss">
    @import '@/assets/styles/components/alert.scss';
    @import '@/assets/styles/components/development.scss';
</style>
