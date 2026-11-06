<template>
    <section class="master">
        <div class="container">
            <div class="master__content">
                <div class="master__head">
                    <div class="master__head-title">
                        <h1 class="master__head-name title">{{ master.name }}</h1>
                    </div>
                    <div class="master__head-buttons">
                        <a
                            :href="masterUpdateUrl"
                            class="master__button master__button-edit"
                            aria-label="Редактировать мастера"
                            title="Редактировать мастера"
                            v-if="isAdmin && master.id"
                        >
                            <EditIcon />
                        </a>
                        <button
                            type="button"
                            class="master__button master__button-back"
                            @click="goBack"
                        >
                            <ArrowBack />
                        </button>
                    </div>
                </div>
                <div class="master__block">
                    <div class="master__block-container">
                        <div class="master__left">
                            <div
                                class="master__image"
                                @click="toggleIsZoomed"
                            >
                                <img :src="masterImage" :alt="master.name" class="master__image-img">
                                <div class="master__image-gradient" aria-hidden="true"></div>
                                <div class="master__image-sign" v-if="master.history">
                                    <div class="master__image-sign-text formatted-text" v-html="master.history"></div>
                                </div>
                            </div>
                            <div class="master__stats" v-if="masterStats.length || master.ultimate">
                                <div class="master__stats-head">
                                    <img src="@/assets/images/masters/d20.svg" alt="Кубик" class="master__stats-img">
                                    <h2 class="master__stats-title">Статы мастера:</h2>
                                </div>
                                <ul class="master__stats-list">
                                    <li class="master__stats-item" v-for="(stat, index) in masterStats" :key="stat.name">
                                        <ProgressBar :title="stat.name" :value="stat.value" :delay="index * 150" />
                                    </li>
                                </ul>
                                <div class="master__stats-bottom" v-if="master.ultimate">
                                    <img src="@/assets/images/masters/primogem.svg" alt="Кубик" class="master__stats-img">
                                    <h2 class="master__stats-title">Ультимативная способность:</h2>
                                </div>
                                <div class="master__stats-skill" v-if="master.ultimate">
                                    <div class="master__stats-skill-text formatted-text" v-html="master.ultimate"></div>
                                </div>
                            </div>
                        </div>
                        <div class="master__right">
                            <div class="master__right-content">
                                <div class="master__data">
                                    <ul class="master__data-list">
                                        <li class="master__data-li" v-for="info in masterInfo" :key="info.name">
                                            <h3 class="master__data-subtitle">{{ info.name }}</h3>
                                            <div class="master__data-text formatted-text" v-html="info.value"></div>
                                        </li>
                                    </ul>
                                </div>
                                <div class="master__systems" v-if="systems.length">
                                    <ul class="master__systems-list">
                                        <li v-for="system in systems" :key="system">
                                            <SystemInfoTag
                                                :tag="{ category: 'Система', short_name: system }"
                                                base-class="master__systems-tag"
                                            />
                                        </li>
                                    </ul>
                                </div>
                                <div class="master__description">
                                    <div class="master__description-item" v-if="master.about">
                                        <h3 class="master__description-title">О себе как о мастере:</h3>
                                        <div class="master__description-text formatted-text" v-html="master.about"></div>
                                    </div>
                                    <div class="master__description-item" v-if="master.expectationsOfPlayers">
                                        <h3 class="master__description-title">Что мастер ждет от игроков:</h3>
                                        <div
                                            class="master__description-text formatted-text"
                                            v-html="master.expectationsOfPlayers"
                                        ></div>
                                    </div>
                                </div>
                            </div>
                            <div class="master__buttons">
                                <a
                                    :href="masterProfileUrl"
                                    class="master__button master__button-dark"
                                    v-if="masterProfileUrl"
                                >
                                    Список игр мастера
                                </a>
                                <button
                                    type="button"
                                    class="master__button master__button-light"
                                    @click="openSocialModal"
                                >
                                    Заказать игру с мастером
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Transition name="zoom">
            <ZoomImage
                :image="masterZoomImage"
                v-if="isZoomed"
                @close="toggleIsZoomed"
            />
        </Transition>
        <Transition name="modal">
            <SocialModal
                v-if="isSocialModalOpen"
                @close="closeSocialModal"
            />
        </Transition>
    </section>
</template>

<script setup>

    import ArrowBack from '@/components/icons/masters/ArrowBack.vue';
    import EditIcon from '@/components/icons/events/cards/Edit.vue';
    import ProgressBar from '@/components/shared/widgets/ProgressBar.vue';
    import SystemInfoTag from '@/components/shared/widgets/SystemInfoTag.vue';
    import ZoomImage from '@/components/shared/instruments/ZoomImage.vue';
    import SocialModal from '@/components/shared/modals/SocialModal.vue';

    import fallbackImage from '@/assets/images/masters/pic.png';

    import { computed } from 'vue';

    import { useMastersStore } from '~/store/useMasters';
    import { useUserStore } from '~/store/useUsers';

    import getImageUrl from '@/utils/getImageUrl';
    import panelBaseUrl from '@/utils/panelUrl';

    const masterStore = useMastersStore();
    const userStore = useUserStore();
    const router = useRouter();

    const master = computed(() => masterStore.oneMaster);

    const masterUpdateUrl = computed(() => {
        return master.value.id ? `${panelBaseUrl}/masters/update/${master.value.id}` : '';
    });

    const masterProfileUrl = computed(() => {
        const userId = master.value.userId || master.value.user?.id;

        return userId ? `${panelBaseUrl}/user/${userId}` : '';
    });

    const isAdmin = computed(() => {
        return userStore.profile?.role === 'ADMIN' || userStore.profile?.role === 'SUPER_ADMIN';
    });

    const masterAvatar = computed(() => master.value.avatarPath || master.value.avatar);

    const masterImage = computed(() => getImageUrl(masterAvatar.value) || fallbackImage);

    const masterZoomImage = computed(() => {
        return getImageUrl(masterAvatar.value?.path || masterAvatar.value) || masterImage.value;
    });

    const masterInfo = computed(() => [
        {
            name: 'Возраст:',
            value: master.value.age
        },
        {
            name: 'Опыт в НРИ:',
            value: master.value.experience
        },
        {
            name: 'Любимые жанры и сеттинги:',
            value: master.value.favoriteGenresAndSettings
        }
    ].filter((item) => item.value));

    const masterStats = computed(() => {
        return Array.isArray(master.value.stats) ? master.value.stats : [];
    });

    const systems = computed(() => {
        return Array.isArray(master.value.settings) ? master.value.settings : [];
    });

    const isZoomed = ref(false);
    const isSocialModalOpen = ref(false);

    const toggleIsZoomed = () => {
        isZoomed.value = !isZoomed.value;
    }

    const openSocialModal = () => {
        isSocialModalOpen.value = true;
    };

    const closeSocialModal = () => {
        isSocialModalOpen.value = false;
    };

    const goBack = () => {
        router.go(-1);
    };

</script>

<style lang="scss">
    @import '@/assets/styles/components/master.scss';
</style>
