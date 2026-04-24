<template>
    <section class="footer">
        <div class="container">
            <div class="footer__content">
                <div class="footer__left">
                    <img loading="lazy" class="footer__logo" src="/images/logos/logo-footer.png" alt="Лого футер" format="webp" />
                </div>
                <div class="footer__right">
                    <div class="footer__item" v-for="item in footerContent" :key="item">
                        <div class="footer__item-content">
                            <h3 class="footer__title">{{ item.title }}</h3>
                            <div class="footer__item-block" v-for="block in item.content" :key="block">
                                <h4 class="footer__item-title" v-if="block.title">{{ block.title }}</h4>
                                <a target="_blank" rel="noopener noreferrer" :href="block.link" class="text footer__text">
                                    <p class="text footer__text">{{ block.text }}</p>
                                </a>
                            </div>
                        </div>
                        <div class="footer__social">
                            <a target="_blank" rel="noopener noreferrer" :href="item.link" class="footer__link">
                                <span class="footer__icon">
                                    <Component :is="item.icon" />
                                </span>
                                <p class="footer__text">{{ item.text }}</p>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="footer__container">
                <p class="footer__bottom-text">ИП АЛЕКСАНДРОВ НИКОЛАЙ АЛЕКСАНДРОВИЧ ОГРНИП 324774600682026</p>
                <p class="footer__bottom-text">
                    <a class="footer__bottom-text" target="_blank" rel="noopener noreferrer" href="https://xn----dtbbbhdau6cfpgt1e.xn--p1ai/panel/privacy-policy">Политика обработки персональных данных и конфиденциальности</a>
                </p>
            </div>
        </div>
    </section>
</template>

<script setup>

    const VKIcon = defineAsyncComponent(() => import('@/components/icons/footer/VK.vue'));
    const TGIcon = defineAsyncComponent(() => import('@/components/icons/footer/Telegram.vue'));

    const footerContent = ref([
        {
            title: 'Мы находимся',
            content: [
                { 
                    text: 'г. Москва, м. Арбатская Малый Николопесковский переулок, 6',
                    link: 'https://yandex.ru/maps/org/chertogi_geroyev/133180006455/'
                }
            ],
            icon: TGIcon,
            text: 'Телеграм канал',
            link: 'https://t.me/ChertogiGeroev_Club'
        },
        {
            title: 'Часы работы',
            content: [
                { title: 'ПН-ПТ: ', text: 'с 18:00 до 23:30' },
                { title: 'СБ-ВС:', text: 'с 12:00 до 23:30' }
            ],
            icon: VKIcon,
            text: 'Сообщество в ВК',
            link: 'https://vk.com/chertogi.club'
        },
    ])

</script>

<style lang="scss" scoped>
    @import url('@/assets/styles/components/footer.scss');
</style>
