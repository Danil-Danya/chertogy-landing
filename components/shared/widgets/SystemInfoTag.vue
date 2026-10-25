<template>
    <component
        :is="isClickable ? 'button' : 'span'"
        v-bind="controlAttributes"
        :class="[baseClass, modifierClass, 'system-info-tag', { 'is-clickable': isClickable }]"
        @click="openModal"
    >
        <span class="system-info-tag__text">{{ tag?.short_name }}</span>

        <span v-if="isClickable" class="system-info-tag__icon" aria-hidden="true">
            <InfoIcon />
        </span>
    </component>

    <Teleport to="body">
        <Transition name="modal">
            <SystemInfoModal
                v-if="isModalOpen && systemInfo"
                :title="systemInfo.title"
                :description="systemInfo.description"
                @close="closeModal"
            />
        </Transition>
    </Teleport>
</template>

<script setup>

    import { useTagsStore } from '~/store/useTags';

    const InfoIcon = defineAsyncComponent(() => import('@/components/icons/events/info/Info.vue'));
    import SystemInfoModal from '@/components/shared/modals/SystemInfoModal.vue';

    const tagsStore = useTagsStore();

    await tagsStore.ensureTagsWithCategories();

    const props = defineProps({
        tag: {
            type: Object,
            required: true
        },
        baseClass: {
            type: String,
            required: true
        },
        modifierClass: {
            type: String,
            default: ''
        }
    });

    const isModalOpen = ref(false);

    const normalizeLookupKey = (value) => typeof value === 'string' ? value.trim().toLowerCase() : '';

    const resolvedTagInfo = computed(() => {
        const category = typeof props.tag?.category === 'string'
            ? props.tag.category.trim()
            : '';

        const shortName = typeof props.tag?.short_name === 'string'
            ? props.tag.short_name.trim()
            : typeof props.tag?.shortName === 'string'
                ? props.tag.shortName.trim()
                : '';

        if (!category || !shortName) {
            return null;
        }

        const shortNameLookupKey = `${normalizeLookupKey(category)}::${normalizeLookupKey(shortName)}`;
        const tagInfo = tagsStore.tagInfoLookup[shortNameLookupKey];
        const description = typeof tagInfo?.description === 'string' ? tagInfo.description.trim() : '';

        if (!description) {
            return null;
        }

        return {
            title: tagInfo?.fullName || shortName,
            description
        };
    });

    const systemInfo = computed(() => resolvedTagInfo.value);

    const isClickable = computed(() => Boolean(systemInfo.value?.description));

    const controlAttributes = computed(() => {
        if (!isClickable.value) {
            return {};
        }

        return {
            type: 'button',
            title: `Открыть описание тега ${systemInfo.value.title}`,
            'aria-label': `Открыть описание тега ${systemInfo.value.title}`
        };
    });

    const openModal = () => {
        if (!isClickable.value) {
            return;
        }

        isModalOpen.value = true;
    };

    const closeModal = () => {
        isModalOpen.value = false;
    };

</script>

<style scoped lang="scss">
    .system-info-tag {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        max-width: 100%;
        text-align: left;
        transition: filter 300ms ease, box-shadow 300ms ease;
    }

    .system-info-tag.is-clickable {
        cursor: pointer;
    }

    .system-info-tag.is-clickable:hover {
        filter: brightness(1.08);
        box-shadow: 0 0 16px rgba(255, 255, 255, 0.08);
    }

    .system-info-tag.is-clickable:focus-visible {
        outline: 2px solid rgba(255, 255, 255, 0.85);
        outline-offset: 2px;
        filter: brightness(1.08);
    }

    .system-info-tag__text {
        min-width: 0;
        overflow-wrap: anywhere;
    }

    .system-info-tag__icon {
        width: 16px;
        height: 16px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        color: #FFFFFF;
        flex-shrink: 0;
    }

    .system-info-tag__icon :deep(svg) {
        width: 100%;
        height: 100%;
        display: block;
    }
</style>
