<template>
    <section class="contacts">
        <div class="container">
            <div class="contacts__content">
                <h2 class="title contacts__title">Ждём вас в гости!</h2>
            </div>
            <div class="contacts__container">
                <div class="contacts__left">
                    <div class="contacts__info">
                        <div class="contacts__info-top">
                            <div class="contacts__info-top-item">
                                <h3 class="contacts__info-title">Мы находимся</h3>
                                <a target="_blank" rel="noopener noreferrer" href="https://yandex.ru/maps/-/CHVGAFl1" class="contacts__link text">г. Москва, малый Николопесковский пер. 6</a>
                            </div>
                            <div class="contacts__info-top-item">
                                <h3 class="contacts__info-title">Часы работы</h3>
                                <p class="contacts__info-text text">
                                    <span class="contacts__info-text-bold">
                                        ПН-ПТ:
                                    </span>
                                    с 18:00 до 23:30
                                </p>
                                <p class="contacts__info-text text">
                                    <span class="contacts__info-text-bold">
                                        СБ-ВС:
                                    </span>
                                    с 12:00 до 23:30
                                </p>
                            </div>
                        </div>
                        <div class="contacts__info-bottom">
                            <div class="contacts__info-bottom-item">
                                <h3 class="contacts__info-title">Администратор</h3>
                                <a target="_blank" rel="noopener noreferrer" href="https://t.me/ChertogiGeroev" class="contacts__link text">Написать в телеграм</a>
                                <p class="contacts__info-alert">Отвечаем с 10:00 до 22:00 в любой день</p>
                            </div>
                            <div class="contacts__info-bottom-item">
                                <h3 class="contacts__info-title">Телефон клуба</h3>
                                <a href="tel:+79932738565" class="contacts__link text">+7 (993) - 273 - 85 - 65</a>
                                <p class="contacts__info-alert">Звонить в случае крайней неоходимости</p>
                            </div>
                        </div>
                        <!-- <iframe class="contacts__reviews" src="https://yandex.ru/sprav/widget/rating-badge/133180006455?type=rating&theme=dark" width="150" height="50" frameborder="0"></iframe> -->
                    </div>
                    <div class="contacts__line">
                        <img class="contacts__line-img" src="/images/contacts/line.png" alt="line" format="webp" />
                    </div>
                    <div class="contacts__socials">
                        <div class="contacts__socials-item" v-for="item in socialsLinks" :key="item">
                            <div class="contacts__socials-top">
                                <a target="_blank" rel="noopener noreferrer" :href="item.link" class="contacts__socials-link">
                                    <span class="contacts__socials-icon">
                                        <Component :is="item.icon" />
                                    </span>
                                    <h3 class="contacts__socials-title">{{ item.title }}</h3>
                                </a>
                            </div>
                            <div class="contacts__socials-bottom">
                                <p class="text contacts__socials-text">{{ item.text }}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="contacts__right">
                    <iframe 
                        src="https://yandex.ru/map-widget/v1/?um=constructor%3A5b77f609313a687144cdfd8e883f3e0ec9d993fed1c6344ba96ce997b873033b&amp;source=constructor"
                        frameborder="0"
                        class="contacts__map"
                    >
                    </iframe>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>

// Тут в рамках макета не получилось стандартизировать все выерхние ссылки,
// так как они слишком разные, по этому стандартизирую внутри js только нижние

const VKIcon = defineAsyncComponent(() => import('@/components/icons/contacts/VK.vue'));
const TGIcon = defineAsyncComponent(() => import('@/components/icons/contacts/Telegram.vue'));

const socialsLinks = ref([
    {
        icon: TGIcon,
        title: 'Наш телеграм канал',
        text: 'Здесь мы делимся короткими новостями о жизни проекта и его команды, делаем интересные анонсы (и вбросы), и конечно же не против немного подурачиться.',
        link: 'https://t.me/ChertogiGeroev_Club'
    },

    {
        icon: VKIcon,
        title: 'Наше сообщество в ВК',
        text: 'Тут публикуется только самое важное, в том числе анонсы мероприятий, организационные вопросы, а также проводятся конкурсы и розыгрыши.',
        link: 'https://vk.com/chertogi.club'
    },
])

</script>

<style lang="scss">
    @import '@/assets/styles/components/contacts.scss';
</style>