<template>
    <section class="master">
        <div class="container">
            <div class="master__content">
                <div class="master__head">
                    <div class="master__head-title">
                        <h1 class="master__head-name title">{{ master.name }}</h1>
                    </div>
                    <div class="master__head-buttons">
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
                                :class="{ 'master__image--with-sign': master.history }"
                                @click="toggleIsZoomed"
                            >
                                <img :src="masterImage" :alt="master.name" class="master__image-img">
                                <div class="master__image-sign" v-if="master.history">
                                    <p class="master__image-sign-text">{{ master.history }}</p>
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
                                    <p class="master__stats-skill-text">{{ master.ultimate }}</p>
                                </div>
                            </div>
                        </div>
                        <div class="master__right">
                            <div class="master__right-content">
                                <div class="master__data">
                                    <ul class="master__data-list">
                                        <li class="master__data-li" v-for="info in masterInfo" :key="info.name">
                                            <h3 class="master__data-subtitle">{{ info.name }}</h3>
                                            <p class="master__data-text">{{ info.value }}</p>
                                        </li>
                                    </ul>
                                </div>
                                <div class="master__systems" v-if="systems.length">
                                    <ul class="master__systems-list">
                                        <li class="master__systems-tag" v-for="system in systems" :key="system">{{ system }}</li>
                                    </ul>
                                </div>
                                <div class="master__description">
                                    <div class="master__description-item" v-if="master.about">
                                        <h3 class="master__description-title">О себе как о мастере:</h3>
                                        <p class="master__description-text">{{ master.about }}</p>
                                    </div>
                                    <div class="master__description-item" v-if="master.expectationsOfPlayers">
                                        <h3 class="master__description-title">Что мастер ждет от игроков:</h3>
                                        <p class="master__description-text">{{ master.expectationsOfPlayers }}</p>
                                    </div>
                                </div>
                            </div>
                            <div class="master__buttons">
                                <button class="master__button master__button-dark">Список игр мастера</button>
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
                :image="masterImage"
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
    import ProgressBar from '@/components/shared/widgets/ProgressBar.vue';
    import ZoomImage from '@/components/shared/instruments/ZoomImage.vue';
    import SocialModal from '@/components/shared/modals/SocialModal.vue';

    import fallbackImage from '@/assets/images/masters/pic.png';

    import { computed } from 'vue';

    import { useMastersStore } from '~/store/useMasters';

    import getImageUrl from '@/utils/getImageUrl';

    const masterStore = useMastersStore();
    const router = useRouter();

    const master = computed(() => masterStore.oneMaster);

    const masterImage = computed(() => getImageUrl(master.value.avatarPath) || fallbackImage);

    const masterInfo = computed(() => [
        {
            name: 'Возраст',
            value: master.value.age
        },
        {
            name: 'Опыт в НРИ',
            value: master.value.experience
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
