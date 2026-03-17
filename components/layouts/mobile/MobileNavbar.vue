<template>
    <section class="navbar">
        <div class="container">
            <div class="navbar__content">
                <div class="navbar__left">
                    <div class="navbar__logo">
                        <a href="/">
                            <img loading="lazy" class="navbar__logo-img" src="@/assets/images/logos/logo-nav.png" alt="logo" />
                        </a>
                    </div>
                    <div class="navbar__socials">
                        <a :href="link.path" class="navbar__socials-link" v-for="link in navbarSocialLinks" :key="link">
                            <span class="navbar__socials-icon">
                                <Component :is="link.icon" />
                            </span>
                        </a>
                    </div>
                </div>
                <div class="navbar__right">
                    <div class="navbar__button-container">
                        <a href="/panel/notifications" class="navbar__button" v-if="profile">
                            <span class="navbar__login-dot" v-if="notificationsStore?.unreadNotifications?.length"></span>
                            <span>
                                <NotificationsIcon />
                            </span>
                        </a>
                        <a href="https://xn----dtbbbhdau6cfpgt1e.xn--p1ai/panel/login" class="navbar__button" v-if="!profile">
                            <span class="navbar__button-icon">
                                <UserIcon />
                            </span>
                            <p class="navbar__buttons-text">Войти</p>
                        </a>
                        <a href="https://xn----dtbbbhdau6cfpgt1e.xn--p1ai/panel/profile" class="navbar__button-link" v-if="profile">
                            <img :src="`${imageUrl}/${profile.profile.avatarPath}`" alt="Аватарка" class="navbar__button-img">
                        </a>
                        <TransitionGroup name="nav-button">
                            <button class="navbar__button" v-show="!isActiveDropDown" @click="toggleActiveDropdown">
                                <span class="navbar__button-icon">
                                    <ToggleOpenIcon />
                                </span>
                            </button>
                            <button class="navbar__button" @click="toggleActiveDropdown" v-show="isActiveDropDown">
                                <span class="navbar__buttons-icon">
                                    <ToggleCloseIcon />
                                </span>
                            </button>
                        </TransitionGroup>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <Transition name="nav-dropdown">
        <NavbarMobileDropDown v-show="isActiveDropDown" @closeDropdown="isActiveDropDown=false" />
        <!-- <NavbarMobileDropdownProfile v-show="isActiveDropDown" @closeDropdown="isActiveDropDown=false" v-else /> -->
    </Transition>
</template>

<script setup>

    import { ref, computed, onMounted } from 'vue';
    import { useRouter } from 'vue-router';
    import { useUserStore } from '@/store/useUsers';
    import { useNotificationsStore } from '~/store/notification';

    import NavbarMobileDropDown from '@/components/shared/dropdowns/NavbarMobileDropdown.vue';
    //import NavbarMobileDropdownProfile from '@/widgets/dropdowns/NavbarMobileDropdownProfile.vue';

    import VKIcon from '@/components/icons/navbar/VK.vue';
    import TGIcon from '@/components/icons/navbar/Telegram.vue';
    import ToggleOpenIcon from '@/components/icons/navbar/ToggleOpen.vue';
    import ToggleCloseIcon from '@/components/icons/navbar/ToggleClose.vue';
    import UserIcon from '@/components/icons/navbar/User.vue';
    import NotificationsIcon from '@/components/icons/navbar/Notifications.vue';

    const userStore = useUserStore();
    const notificationsStore = useNotificationsStore();
    const router = useRouter();

    await notificationsStore.fetchNotifications();

    const profile = computed(() => userStore.profile);

    const imageUrl = import.meta.env.VITE_APP_IMAGE_URL;

    const isActiveDropDown = ref(false);

    onMounted(async () => await userStore.fetchProfile());

    const navbarSocialLinks = ref([
        { icon: VKIcon, path: 'https://vk.com/chertogi.club' },
        { icon: TGIcon, path: 'https://t.me/ChertogiGeroev_Club' },
    ])

    const toggleActiveDropdown = () => {
        isActiveDropDown.value = !isActiveDropDown.value;
    }

</script>

<style lang="scss">
    @import '@/assets/styles/components/navbar.scss';
</style>