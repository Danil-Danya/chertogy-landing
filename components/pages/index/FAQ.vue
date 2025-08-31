<template>
    <section class="faq">
        <div class="container">
            <div class="faq__container">
                <h2 class="title faq__title">Часто задаваемые вопросы</h2>
                <div class="faq__accordion">
                    <div 
                        class="faq__item" 
                        v-for="(item, index) in faqQuestionsList" 
                        :key="index"
                        @click="toggle(index)"
                    >
                        <div class="faq__visible">
                            <h3 
                                class="faq__visible-title" 
                                :class="{ 'faq__visible-title-active': openIndex === index }"
                            >
                                {{ item.title }}
                            </h3>
                            <span 
                                class="faq__visible-icon" 
                                :class="{ 'faq__visible-icon-active': openIndex === index }"
                            >
                                <ToggleIcon />
                            </span>
                        </div>

                        <Transition
                            @before-enter="beforeEnter"
                            @enter="enter"
                            @before-leave="beforeLeave"
                            @leave="leave"
                        >
                            <div 
                                v-show="openIndex === index" 
                                class="faq__invisible"
                                :class="{ 'faq__invisible-active': openIndex === index }"
                            >
                                <p class="text faq__text">{{ item.text }}</p>
                            </div>
                        </Transition>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
<script setup>

    const ToggleIcon = defineAsyncComponent(() => import('@/components/icons/accordion/Toggle.vue'));

    const faqQuestionsList = ref([
        { 
            title: 'Что такое настольные ролевые игры (НРИ)?',
            text: 'Это игры, где вы создаёте персонажа и далее разыгрываете его историю в вымышленном мире вместе с другими участниками: исследуете локации, решаете загадки, сражаетесь с чудовищами и героически влипаете в приключения.'
        },
        { 
            title: 'Никогда не играл, смогу ли разобраться?',
            text: 'Да! Опыт не нужен — достаточно включенности и желания узнавать новое. У игр есть ведущий — Мастер игры, который всё объяснит и поможет быстро влиться в процесс.'
        },
        { 
            title: 'Как попасть на игру?',
            text: 'В разделе «К приключениям» выберите подходящее событие из списка и нажмите «записаться». Пользуйтесь фильтрами, а если что-то непонятно — пишите Смотрителю (администратору).'
        },
        { 
            title: 'Какие игры проводятся в клубе?',
            text: 'Чаще всего Dungeons & Dragons, но также Vampire: The Masquerade, Fate, Daggerheart, Call of Cthulhu, 10 свечей и другие. Жанры разные — от эпического фэнтези до хоррора.'
        },
        { 
            title: 'Нужно ли приносить что-то с собой?',
            text: 'Только хорошее настроение! Книги, кубики, миниатюры, дайстреи, листы персонажей, канцелярка — у нас всё есть. Но если хотите, можете принести свой любимый набор к игре.'
        },
        { 
            title: 'Сколько стоит участие в игре?',
            text: 'Зависит от дня недели, времени и типа игры (иногда от количества участников). Примерные цены есть в разделе «Тарифы», а точная стоимость всегда указана в анонсе конкретной игры. Есть скидки на День Рождения и система абонементов.'
        },
        { 
            title: 'Сколько длится одна сессия?',
            text: 'Обычно около 4 часов, но бывает быстрее или дольше — зависит от сюжета и системы, а также непредвиденных обстоятельств за игровым столом. В анонсе указано всё время начала игры и её ожидаемая длительность.'
        },
        { 
            title: 'Можно прийти своей командой?',
            text: 'Нужно! Нет ничего лучше, чем играть с друзьями! Просто забронируйте комнату под игру со своим Мастером или закажите игру под ключ у нас — напишите Смотрителю (администратору), и мы всё устроим.'
        },
        { 
            title: 'Могу ли провести свою игру как Мастер?',
            text: 'Да, мы всегда рады новым Мастерам в нашем клубе. Вы можете сотрудничать с нами как внешний Мастер, арендуя комнату для своих групп игроков, или попробовать попасть в команду, пройдя отбор — напишите нам на почту или в личные сообщения (см. раздел «Контакты»).'
        },
        { 
            title: 'Можно просто заглянуть без записи?',
            text: 'Конечно, мы открыты к знакомству и гостеприимны. Даже если Вы не участвуете в играх, приходите посмотреть, познакомиться с нами и атмосферой клуба. Только лучше заранее уточните у Смотрителя, что мы в это время открыты.'
        },
    ])

    const openIndex = ref(null)

    const toggle = (index) => {
        openIndex.value = openIndex.value === index ? null : index
    }

    const beforeEnter = (el) => {
        el.style.height = '0'
    }

    const enter = (el) => {
        el.style.height = el.scrollHeight + 28 + 'px'
    }

    const beforeLeave = (el) => {
        el.style.height = el.scrollHeight + 28 + 'px'
    }

    const leave = (el) => {
        el.style.height = '0'
    }


</script>

<style lang="scss" scoped>
    @import '@/assets/styles/components/faq.scss';
</style>
