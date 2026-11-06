<template>
    <section
        class="masters bg-masters"
        :class="{
            'masters--reorder': isReorderMode,
            'masters--empty': hasNoMasters
        }"
    >
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
                        <MasterSettingsDropdown
                            :settings="settings"
                            :model-value="selectedSettings"
                            @update:model-value="updateSelectedSettings"
                        />
                        <button
                            type="button"
                            class="button masters__button-call"
                            @click="openSocialModal"
                            v-if="!isAdmin"
                        >
                            <span class="masters__button-text">Подобрать мастера</span>
                        </button>
                        <button
                            type="button"
                            class="masters__button-reorder"
                            :class="{ active: isReorderMode }"
                            :aria-label="isReorderMode ? 'Завершить перестановку мастеров' : 'Изменить порядок мастеров'"
                            :title="isReorderMode ? 'Завершить перестановку мастеров' : 'Изменить порядок мастеров'"
                            :aria-pressed="isReorderMode"
                            @click="toggleReorderMode"
                            v-else
                        >
                            <ReorderIcon />
                            <span>Свайпнуть карточки</span>
                        </button>
                        <a
                            :href="`${panelBaseUrl}/masters/create`"
                            class="masters__button-create"
                            aria-label="Добавить мастера"
                            title="Добавить мастера"
                            v-if="isAdmin"
                        >
                            <PlusIcon />
                            <span>Добавить мастера</span>
                        </a>
                    </div>
                    <p class="masters__reorder-message" v-if="reorderMessage">{{ reorderMessage }}</p>
                </div>
                <div class="masters__main">
                    <div class="masters__list" v-if="masters.length">
                        <MastersCard 
                            v-for="master in masters" 
                            :key="master.id" 
                            :id="master.id"
                            :name="master.name"
                            :history="master.history"
                            :systems="(master.settings || []).slice(0, 4)"
                            :image="getImageUrl(master.avatarPath || master.avatar) || fallbackImage"
                            :description="master.shortDescription"
                            :link="master.slug"
                            :is-visible="master.isVisible"
                            :is-admin="isAdmin"
                            :is-updating="updatingMasterId === master.id"
                            :class="{
                                'masters__card--reorder': isReorderMode && isAdmin,
                                'masters__card--dragging': draggedMasterId === master.id,
                                'masters__card--drag-over': dragOverMasterId === master.id
                            }"
                            :data-sort-id="master.id"
                            :draggable="isReorderMode && isAdmin && !isSwappingMasters"
                            @pointerdown="masterTouchDrag.start($event, master)"
                            @pointermove="masterTouchDrag.move"
                            @pointerup="masterTouchDrag.end"
                            @pointercancel="masterTouchDrag.cancel"
                            @dragstart.stop="startMasterDrag($event, master)"
                            @dragenter.prevent="enterMasterDrag(master)"
                            @dragover.prevent
                            @drop.stop.prevent="dropMaster(master)"
                            @dragend="finishMasterDrag"
                            @toggle-visibility="toggleMasterVisibility(master)"
                        />
                    </div>
                    <div class="masters__empty" v-else-if="hasNoMasters">
                        <h2 class="title">Мастера по данным параметрам не были найдены</h2>
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
    import PlusIcon from '@/components/icons/gallery/Plus.vue';
    import ReorderIcon from '@/components/icons/masters/Reorder.vue';
    import fallbackImage from '@/assets/images/masters/pic.png';

    import { useMastersStore } from '~/store/useMasters';
    import { useTagsStore } from '~/store/useTags';
    import { useUserStore } from '~/store/useUsers';
    import { useRoute, useRouter } from 'vue-router';
    import { swapMasterWeight } from '@/api/masters.js';
    
    import createTouchDrag from '@/utils/createTouchDrag.js';
    import getImageUrl from '@/utils/getImageUrl';
    import panelBaseUrl from '@/utils/panelUrl';

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
    const isReorderMode = ref(false);
    const isSwappingMasters = ref(false);
    const draggedMasterId = ref(null);
    const dragOverMasterId = ref(null);
    const reorderMessage = ref('');
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

    const sortMastersByWeight = (items) => {
        return [...items].sort((firstMaster, secondMaster) => {
            const firstWeight = Number(firstMaster.weight);
            const secondWeight = Number(secondMaster.weight);

            if (!Number.isFinite(firstWeight) && !Number.isFinite(secondWeight)) {
                return 0;
            }

            if (!Number.isFinite(firstWeight)) {
                return 1;
            }

            if (!Number.isFinite(secondWeight)) {
                return -1;
            }

            return firstWeight - secondWeight;
        });
    };

    const finishMasterDrag = () => {
        draggedMasterId.value = null;
        dragOverMasterId.value = null;
    };

    const toggleReorderMode = () => {
        if (!isAdmin.value || isSwappingMasters.value) {
            return;
        }

        isReorderMode.value = !isReorderMode.value;
        reorderMessage.value = '';

        if (!isReorderMode.value) {
            masterTouchDrag.cancel();
            finishMasterDrag();
        }
    };

    const startMasterDrag = (event, master) => {
        if (!isReorderMode.value || !isAdmin.value || !master.id || isSwappingMasters.value) {
            event.preventDefault();
            return;
        }

        draggedMasterId.value = master.id;
        dragOverMasterId.value = null;
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', master.id);
    };

    const enterMasterDrag = (master) => {
        if (!draggedMasterId.value || draggedMasterId.value === master.id) {
            dragOverMasterId.value = null;
            return;
        }

        dragOverMasterId.value = master.id;
    };

    const dropMaster = async (targetMaster) => {
        const sourceMasterId = draggedMasterId.value;
        const rows = masterStore.allMasters?.rows;

        if (
            !sourceMasterId
            || !targetMaster.id
            || sourceMasterId === targetMaster.id
            || isSwappingMasters.value
            || !Array.isArray(rows)
        ) {
            finishMasterDrag();
            return;
        }

        const sourceMaster = rows.find((master) => master.id === sourceMasterId);

        if (!sourceMaster) {
            finishMasterDrag();
            return;
        }

        const previousMasters = rows.map((master) => ({ ...master }));
        const sourceWeight = sourceMaster.weight;

        sourceMaster.weight = targetMaster.weight;
        targetMaster.weight = sourceWeight;
        masterStore.allMasters.rows = sortMastersByWeight(rows);
        isSwappingMasters.value = true;
        reorderMessage.value = '';

        try {
            const response = await swapMasterWeight(sourceMaster.id, targetMaster.id);

            if (!response?.first || !response?.second) {
                throw new Error('Не удалось изменить порядок мастеров');
            }

            const updatedWeights = new Map([
                [response.first.id, response.first.weight],
                [response.second.id, response.second.weight]
            ]);

            masterStore.allMasters.rows = sortMastersByWeight(masterStore.allMasters.rows.map((master) => ({
                ...master,
                weight: updatedWeights.has(master.id)
                    ? updatedWeights.get(master.id)
                    : master.weight
            })));
        }
        catch (error) {
            console.log(error);
            masterStore.allMasters.rows = previousMasters;
            reorderMessage.value = 'Не удалось изменить порядок мастеров';
        }
        finally {
            isSwappingMasters.value = false;
            finishMasterDrag();
        }
    };

    const masterTouchDrag = createTouchDrag({
        selector: '[data-sort-id]',
        getItemId: (master) => master.id,
        canStart: (master) => {
            return isReorderMode.value
                && isAdmin.value
                && Boolean(master.id)
                && !isSwappingMasters.value;
        },
        onStart: (master) => {
            draggedMasterId.value = master.id;
            dragOverMasterId.value = null;
        },
        onOver: (targetId) => {
            dragOverMasterId.value = targetId;
        },
        onDrop: (targetId) => {
            const targetMaster = masterStore.allMasters?.rows?.find((master) => master.id === targetId);

            if (targetMaster) {
                dropMaster(targetMaster);
                return;
            }

            finishMasterDrag();
        },
        onCancel: finishMasterDrag
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
        if (isLoading.value || isSwappingMasters.value || !hasMore.value) {
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
        masterTouchDrag.cancel();
        finishMasterDrag();
        isLoading.value = true;
        currentPage.value = 1;
        await masterStore.fetchAllMasters(1, mastersLimit, selectedSettings.value, false, isAdmin.value);
        isLoading.value = false;
    };

    const masters = computed(() => {
        const rows = masterStore.allMasters?.rows;

        return Array.isArray(rows) ? rows : [];
    });

    const hasNoMasters = computed(() => !isLoading.value && !masters.value.length);

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
        masterTouchDrag.cancel();
        observer?.disconnect();
    });
</script>

<style lang="scss">
    @import '@/assets/styles/components/masters.scss';
</style>
