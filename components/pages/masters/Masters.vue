<template>
    <section class="masters bg-masters">
        <div class="container">
            <div class="masters__content">
                <div class="masters__head">
                    <div class="masters__head-top">
                        <h1 class="masters__title title">Наши мастера</h1>
                        <p class="masters__subtitle">Сердце нашего клуба - опытные и харизматичные проводники в мир приключений</p>
                    </div>
                    <div class="masters__line-container">
                        <img src="@/assets/images/masters/line.png" alt="" class="masters__line">
                    </div>
                    <div class="masters__head-bottom">
                        <button type="button" class="button masters__button-call" @click="openSocialModal">
                            <span class="masters__button-text">Подобрать мастера</span>
                        </button>
                        <MasterSettingsDropdown
                            :settings="settings"
                            :model-value="selectedSettings"
                            @update:model-value="updateSelectedSettings"
                        />
                        <NuxtLink
                            to="/panel/masters/create"
                            class="button masters__button-create"
                            v-if="isAdmin"
                        >
                            <EditIcon />
                            <span>Добавить мастера</span>
                        </NuxtLink>
                    </div>
                </div>
                <div class="masters__main">
                    <div class="masters__list" v-if="masters.length">
                        <MastersCard 
                            v-for="master in masters" 
                            :key="master.id" 
                            :id="master.id"
                            :name="master.name"
                            :history="master.history"
                            :systems="(master.settings || []).slice(0, 3)"
                            :image="getImageUrl(master.avatarPath) || fallbackImage"
                            :description="master.shortDescription"
                            :link="master.slug"
                            :is-visible="master.isVisible"
                            :is-admin="isAdmin"
                            :is-updating="updatingMasterId === master.id"
                            @toggle-visibility="toggleMasterVisibility(master)"
                        />
                    </div>
                    <div
                        ref="loadMoreTrigger"
                        class="masters__loader"
                        :class="{ active: isLoading }"
                    >
                        <template v-if="isLoading">
                            <span class="masters__loader-spinner"></span>
                            <p class="masters__loader-text">Загрузка</p>
                        </template>
                    </div>
                </div>
            </div>
        </div>
        <Transition name="modal">
            <SocialModal
                v-if="isSocialModalOpen"
                @close="closeSocialModal"
            />
        </Transition>
    </section>
</template>

<script setup>

    import MastersCard from '@/components/shared/widgets/MastersCard.vue';
    import MasterSettingsDropdown from '@/components/shared/dropdowns/MasterSettingsDropdown.vue';
    import SocialModal from '@/components/shared/modals/SocialModal.vue';
    import EditIcon from '@/components/icons/events/cards/Edit.vue';
    import fallbackImage from '@/assets/images/masters/pic.png';

    import { useMastersStore } from '~/store/useMasters';
    import { useTagsStore } from '~/store/useTags';
    import { useUserStore } from '~/store/useUsers';
    import { useRoute, useRouter } from 'vue-router';
    
    import getImageUrl from '@/utils/getImageUrl';

    const masterStore = useMastersStore();
    const tagsStore = useTagsStore();
    const userStore = useUserStore();

    const route = useRoute();
    const router = useRouter();

    const isSocialModalOpen = ref(false);
    const isLoading = ref(false);
    const currentPage = ref(1);
    const loadMoreTrigger = ref(null);
    const updatingMasterId = ref(null);
    const mastersLimit = 4;

    let observer = null;

    const openSocialModal = () => {
        isSocialModalOpen.value = true;
    };

    const closeSocialModal = () => {
        isSocialModalOpen.value = false;
    };

    const getRouteSettings = () => {
        const routeSettings = Array.isArray(route.query.systems) ? route.query.systems : [route.query.systems];

        return routeSettings.filter((item) => typeof item === 'string' && item);
    };

    await Promise.all([
        masterStore.fetchAllMasters(1, mastersLimit, getRouteSettings()),
        tagsStore.fetchTagsWithCategories()
    ]);

    const settings = computed(() => {
        const categories = tagsStore.tagsWithCategories?.rows;

        if (!Array.isArray(categories)) {
            return [];
        }

        const settingsCategory = categories.find((item) => item.name === 'Система');

        return Array.isArray(settingsCategory?.tags) ? settingsCategory.tags : [];
    });

    const selectedSettings = computed(() => {
        const querySettings = Array.isArray(route.query.systems) ? route.query.systems : [route.query.systems];
        const availableSettings = new Set(settings.value.map((item) => item.shortName));

        return querySettings.filter((item) => availableSettings.has(item));
    });

    const updateSelectedSettings = async (value) => {
        const currentSettings = selectedSettings.value;
        const isSameSettings = currentSettings.length === value.length
            && currentSettings.every((item) => value.includes(item));

        if (isSameSettings) {
            return;
        }

        const query = {
            ...route.query
        };

        if (value.length) {
            query.systems = value;
        }
        else {
            delete query.systems;
        }

        await router.replace({ query });
    };

    const hasMore = computed(() => {
        return currentPage.value < Number(masterStore.allMasters?.totalPages || 0);
    });

    const isAdmin = computed(() => {
        return userStore.profile?.role === 'ADMIN' || userStore.profile?.role === 'SUPER_ADMIN';
    });

    const toggleMasterVisibility = async (master) => {
        if (updatingMasterId.value) {
            return;
        }

        updatingMasterId.value = master.id;
        await masterStore.updateMasterVisibility(master.id, !master.isVisible);
        updatingMasterId.value = null;
    };

    const loadMoreMasters = async () => {
        if (isLoading.value || !hasMore.value) {
            return;
        }

        isLoading.value = true;

        const nextPage = currentPage.value + 1;
        const [result] = await Promise.all([
            masterStore.fetchAllMasters(nextPage, mastersLimit, selectedSettings.value, true, isAdmin.value),
            new Promise((resolve) => setTimeout(resolve, 1000))
        ]);

        if (result) {
            currentPage.value = nextPage;
        }

        isLoading.value = false;
    };

    const resetMasters = async () => {
        isLoading.value = true;
        currentPage.value = 1;
        await masterStore.fetchAllMasters(1, mastersLimit, selectedSettings.value, false, isAdmin.value);
        isLoading.value = false;
    };

    const masters = computed(() => {
        const rows = masterStore.allMasters?.rows;

        return Array.isArray(rows) ? rows : [];
    });

    watch(() => selectedSettings.value.join(','), resetMasters);

    onMounted(async () => {
        if (!userStore.profile && localStorage.getItem('accessToken')) {
            await userStore.fetchProfile();
        }

        if (isAdmin.value) {
            currentPage.value = 1;
            await masterStore.fetchAllMasters(1, mastersLimit, selectedSettings.value, false, true);
        }

        observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                loadMoreMasters();
            }
        });

        if (loadMoreTrigger.value) {
            observer.observe(loadMoreTrigger.value);
        }
    });

    onBeforeUnmount(() => {
        observer?.disconnect();
    });
</script>

<style lang="scss">
    @import '@/assets/styles/components/masters.scss';
</style>
