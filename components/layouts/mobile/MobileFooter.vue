<template>
    <section class="footer">
        <div class="container">
            <div class="footer__content">
                <div class="footer__top">
                    <div class="footer__logo">
                        <img loading="lazy" class="footer__logo-img" src="/images/logos/logo-footer-mobile.png" alt="Лого" format="webp" />
                    </div>
                </div>
                <div class="footer__center">
                    <div class="footer__item" v-for="item in footerContent" :key="item">
                        <div class="footer__item-content">
                            <h3 class="footer__title">{{ item.title }}</h3>
                            <div class="footer__item-block" v-for="block in item.content" :key="block">
                                <h4 class="footer__item-title" v-if="block.title">{{ block.title }}</h4>
                                <p class="text footer__text">{{ block.text }}</p>
                            </div>
                        </div>
                    </div>
                    <div class="footer__socials">
                        <a target="_blank" rel="noopener noreferrer" :href="item.link" class="footer__socials-link" v-for="item in footerSocials" :key="item">
                            <span class="footer__socials-icon">
                                <Component :is="item.icon" />
                            </span>
                            <p class="footer__socials-text">{{ item.title }}</p>
                        </a>
                    </div>
                </div>
                <div class="footer__bottom">
                    <p class="footer__bottom-text">ИП АЛЕКСАНДРОВ НИКОЛАЙ АЛЕКСАНДРОВИЧ ОГРНИП 324774600682026</p>
                    <p class="footer__bottom-text">Политика обработки персональных данных и конфиденциальности</p>
                </div>
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
                { text: 'г. Москва, м. Арбатская Малый Николопесковский переулок, 6' }
            ]
        },
        {
            title: 'Часы работы',
            content: [
                { title: 'ПН-ПТ: ', text: 'с 18:00 до 23:30' },
                { title: 'СБ-ВС:', text: 'с 12:00 до 23:30' }
            ]
        },
    ])

    const footerSocials = ref([
        {
            icon: TGIcon,
            title: 'Телеграм канал',
            link: 'https://t.me/ChertogiGeroev_Club'
        },
        {
            icon: VKIcon,
            title: 'Сообщество в ВК',
            link: 'https://vk.com/chertogi.club'
        },
    ])

</script>

<style lang="scss" scoped>
    @import url('@/assets/styles/components/footer.scss');
</style>