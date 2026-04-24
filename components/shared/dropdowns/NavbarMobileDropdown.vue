<template>
    <div class="navbar__dropdown">
        <div class="container">
            <div class="navbar__dropdown-content">
                <ul class="navbar__dropdown-list">
                    <li class="navbar__dropdown-li" v-for="link in navLinks" :key="link">
                        <NuxtLink :to="link.path" class="navbar__dropdown-link" @click="emit('closeDropdown')">{{ link.text }}</NuxtLink>
                        <span class="navbar__dropdown-icon">
                            <Component :is="link.icon" width="32px" height="32px" />
                        </span>
                    </li>
                </ul>
                <ul class="navbar__dropdown-list" v-if="profile">
                    <li class="navbar__dropdown-li flex gap-[20px] text-right items-center justify-end" v-for="link in profileLinks" :key="link">
                        <a :href="link.path" class="navbar__dropdown-link !m-0" @click="emit('closeDropdown')">
                            {{ link.text }}
                        </a>
                        <span class="navbar__dropdown-icon">
                            <Component :is="link.icon" width="32px" height="32px" />
                        </span>
                    </li>
                </ul>
                <ul class="navbar__dropdown-list" v-if="profile?.role === 'MASTER' || profile?.role === 'ADMIN' || profile?.role === 'SUPER_ADMIN'">
                    <li class="navbar__dropdown-li flex gap-[20px] text-right items-center justify-end" v-for="link in masterLinks" :key="link">
                        <a :href="link.path" class="navbar__dropdown-link !m-0" @click="emit('closeDropdown')">
                            {{ link.text }}
                        </a>
                        <span class="navbar__dropdown-icon">
                            <Component :is="link.icon" />
                        </span>
                    </li>
                </ul>
                <ul class="navbar__dropdown-list" v-if="profile?.role === 'ADMIN' || profile?.role === 'SUPER_ADMIN'">
                    <li class="navbar__dropdown-li flex gap-[20px] text-right items-center justify-end" v-for="link in adminLinks" :key="link">
                        <a :href="link.path" class="navbar__dropdown-link !m-0" @click="emit('closeDropdown')">
                            {{ link.text }}
                        </a>
                        <span class="navbar__dropdown-icon">
                            <Component :is="link.icon" width="32px" height="32px" />
                        </span>
                    </li>
                </ul>

                <div class="navbar__dropdown-bottom">
                    <div class="navbar__dropdown-help" v-if="profile">
                        <div class="navbar__dropdown-help-link !mt-[150px]" @click="logout">
                            <p class="navbar__dropdown-help-text navbar__dropdown-help-orange">Выйти из аккаунта</p>
                            <span class="navbar__dropdown-help-icon">
                                <LogoutIcon width="32px" height="32px" />
                            </span>
                        </div>
                    </div>
                    <div class="navbar__dropdown-help" v-if="profile?.role === 'USER' || !profile">
                        <a href="https://t.me/ChertogiGeroev" class="navbar__dropdown-help-link">
                            <p class="navbar__dropdown-help-text">Помогите мне</p>
                            <span class="navbar__dropdown-help-icon">
                                <HelpIcon width="32px" height="32px" />
                            </span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>

    import HelpIcon from '@/components/icons/navbar/Help.vue';

    import ProfileIcon from '@/components/icons/navbar/login/Profile.vue';
    import SettingsIcon from '@/components/icons/navbar/login/Settings.vue';
    import NotificationIcon from '@/components/icons/navbar/login/Notification.vue';
    import FollowingMastersIcon from '@/components/icons/navbar/login/FollowingMasters.vue';
    import LogoutIcon from '@/components/icons/navbar/login/Logout.vue';
    import MyEventsIcon from '@/components/icons/profile/sidebar/MyEvents.vue';
    import MasterEventIcon from '@/components/icons/profile/sidebar/MasterEvent.vue'
    import EditNewsIcon from '@/components/icons/profile/sidebar/EditNews.vue';
    import EditTagsIcon from '@/components/icons/profile/sidebar/EditTags.vue';
    import ApplyNotificationIcon from '@/components/icons/profile/sidebar/ApplyNotification.vue';
    import AboutIcon from '@/components/icons/navbar/login/About.vue';
    import TariffIcon from '~/components/icons/navbar/login/Tariff.vue';
    import TravelIcon from '~/components/icons/navbar/login/Travel.vue';
    import NewsIcon from '~/components/icons/navbar/login/News.vue';
    import ContactsIcon from '~/components/icons/navbar/login/Contacts.vue';

    import { useUserStore } from '~/store/useUsers';

    const userStore = useUserStore();

    const profile = computed(() => userStore.profile);

    const emit = defineEmits(['closeDropdown']);
    
    const BASE_URL = 'https://чертоги-героев.рф/panel';

    const navLinks = ref([
        { text: 'О клубе', path: '/', icon: AboutIcon },
        { text: 'Тарифы', path: '/tariffs', icon: TariffIcon },
        { text: 'К приключениям', path: '/events', icon: TravelIcon },
        { text: 'Новости', path: '/news', icon: NewsIcon },
        { text: 'Контакты', path: '/contacts', icon: ContactsIcon },
    ])



    const profileLinks = ref([
        { text: 'Профиль', path: `${BASE_URL}/profile`, icon: ProfileIcon },
        { text: 'Мои события', path: `${BASE_URL}/my-events`, icon: MyEventsIcon },
        { text: 'Уведомления', path: `${BASE_URL}/notifications`, icon: NotificationIcon },
        { text: 'Избранные мастера', path: `${BASE_URL}/favorites-masters`, icon: FollowingMastersIcon },
        { text: 'Настройки', path: `${BASE_URL}/settings`, icon: SettingsIcon },
    ])

    const masterLinks = ref([
        {
            text: 'Созданные события',
            icon: MasterEventIcon,
            path: `${BASE_URL}/master-events`,
        },
    ])

    const adminLinks = ref([
        {
            text: 'База пользователей',
            icon: ProfileIcon,
            path: `${BASE_URL}/users`,
        },
        {
            text: 'Редактирование новостей',
            path: `${BASE_URL}/news`,
            icon: EditNewsIcon,
        },
        {
            text: 'Редактирование тегов',
            path: `${BASE_URL}/tags`,
            icon: EditTagsIcon,
        },
        {
            text: 'Утверждение событий',
            path: `${BASE_URL}/events/approval`,
            icon: ApplyNotificationIcon,
        },
    ])

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');

        emit('closeDropdown');
        userStore.$reset();
        window.location.href = 'https://xn----dtbbbhdau6cfpgt1e.xn--p1ai/panel/login';
    }

    onMounted(async () => {
        await userStore.fetchProfile();
    })

</script>
