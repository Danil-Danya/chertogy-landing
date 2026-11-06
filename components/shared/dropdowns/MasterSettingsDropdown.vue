<template>
    <div class="masters__dropdown" ref="dropdown">
        <div class="masters__dropdown-control">
            <button
                type="button"
                class="button masters__button-system"
                :class="{ 'active': isActive }"
                :aria-expanded="isActive"
                @click.stop="toggleDropdown"
            >
                <span
                    class="masters__button-icon"
                    v-if="!isActive"
                >
                    <ArrowIcon />
                </span>
                <span class="masters__button-text" v-if="!isActive">Выбрать систему</span>
            </button>

            <input
                ref="searchInput"
                v-model="searchQuery"
                type="search"
                class="masters__dropdown-search"
                placeholder="Поиск системы"
                aria-label="Поиск системы"
                autocomplete="off"
                @click.stop
                @keydown.esc.stop.prevent="closeDropdown"
                v-if="isActive"
            />
            <button
                type="button"
                class="masters__dropdown-close"
                aria-label="Закрыть фильтр"
                @click.stop="closeDropdown"
                v-if="isActive"
            >
                <CloseIcon />
            </button>
        </div>

        <Transition name="tags">
            <div class="masters__dropdown-content" v-if="isActive">
                <ul class="masters__dropdown-list" v-if="filteredSettings.length">
                    <li
                        class="masters__dropdown-item"
                        v-for="setting in filteredSettings"
                        :key="setting.id"
                    >
                        <input
                            type="checkbox"
                            class="masters__dropdown-checkbox"
                            :id="`master-setting-${setting.id}`"
                            :value="setting.shortName"
                            v-model="selectedSettings"
                        />
                        <label
                            class="masters__dropdown-label"
                            :for="`master-setting-${setting.id}`"
                        >
                            {{ setting.fullName || setting.shortName }}
                        </label>
                    </li>
                </ul>

                <p class="masters__dropdown-empty" v-else>Системы не найдены</p>
            </div>
        </Transition>
    </div>
</template>

<script setup>

    import ArrowIcon from '@/components/icons/masters/Arrow.vue';
    import CloseIcon from '@/components/icons/events/filters/Close.vue';

    const props = defineProps({
        settings: {
            type: Array,
            default: () => []
        },

        modelValue: {
            type: Array,
            default: () => []
        }
    });

    const emit = defineEmits(['update:modelValue']);

    const dropdown = ref(null);
    const searchInput = ref(null);
    const isActive = ref(false);
    const searchQuery = ref('');

    const selectedSettings = ref([]);

    const filteredSettings = computed(() => {
        const query = searchQuery.value.trim().toLocaleLowerCase('ru-RU');
        const selected = new Set(selectedSettings.value);

        return props.settings.filter((setting) => {
            const fullName = String(setting.fullName || '').toLocaleLowerCase('ru-RU');
            const shortName = String(setting.shortName || '').toLocaleLowerCase('ru-RU');

            return !query || fullName.includes(query) || shortName.includes(query);
        }).sort((firstSetting, secondSetting) => {
            const isFirstSelected = selected.has(firstSetting.shortName);
            const isSecondSelected = selected.has(secondSetting.shortName);

            return Number(isSecondSelected) - Number(isFirstSelected);
        });
    });

    const toggleDropdown = () => {
        if (isActive.value) {
            closeDropdown();
            return;
        }

        selectedSettings.value = [...props.modelValue];
        searchQuery.value = '';
        isActive.value = true;
        nextTick(() => searchInput.value?.focus());
    };

    const closeDropdown = () => {
        if (!isActive.value) {
            return;
        }

        isActive.value = false;
        searchQuery.value = '';
        emit('update:modelValue', [...selectedSettings.value]);
    };

    const closeDropdownOnOutsideClick = (event) => {
        if (!dropdown.value?.contains(event.target)) {
            closeDropdown();
        }
    };

    watch(
        () => props.modelValue,
        (value) => {
            if (!isActive.value) {
                selectedSettings.value = [...value];
            }
        },
        { immediate: true, deep: true }
    );

    onMounted(() => {
        document.addEventListener('click', closeDropdownOnOutsideClick);
    });

    onBeforeUnmount(() => {
        document.removeEventListener('click', closeDropdownOnOutsideClick);
    });

</script>
