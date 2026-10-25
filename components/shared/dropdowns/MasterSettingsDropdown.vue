<template>
    <div class="masters__dropdown" ref="dropdown">
        <button
            type="button"
            class="button masters__button-system"
            :class="{ 'active': isActive }"
            :aria-expanded="isActive"
            @click="toggleDropdown"
        >
            <span
                class="masters__button-icon"
                :class="{ 'active': isActive }"
            >
                <ArrowIcon />
            </span>
            <span class="masters__button-text">Выбрать систему</span>
        </button>

        <Transition name="tags">
            <div class="masters__dropdown-content" v-if="isActive">
                <ul class="masters__dropdown-list" v-if="settings.length">
                    <li
                        class="masters__dropdown-item"
                        v-for="setting in settings"
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
                            {{ setting.shortName }}
                        </label>
                    </li>
                </ul>

                <p class="masters__dropdown-empty" v-else>Сеттинги не найдены</p>
            </div>
        </Transition>
    </div>
</template>

<script setup>

    import ArrowIcon from '@/components/icons/masters/Arrow.vue';

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
    const isActive = ref(false);

    const selectedSettings = ref([]);

    const toggleDropdown = () => {
        if (isActive.value) {
            closeDropdown();
            return;
        }

        selectedSettings.value = [...props.modelValue];
        isActive.value = true;
    };

    const closeDropdown = () => {
        if (!isActive.value) {
            return;
        }

        isActive.value = false;
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
