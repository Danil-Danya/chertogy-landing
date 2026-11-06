<template>
    <div class="comments__card" :class="{ 'comments__card--hidden': !isVisible }">
        <div class="comments__card-content">
            <div class="comments__card-left">
                <component
                    :key="`${source}-${profileLink}`"
                    :is="profileLink ? 'a' : 'div'"
                    :href="profileLink || undefined"
                    :target="isVkComment && profileLink ? '_blank' : undefined"
                    :rel="isVkComment && profileLink ? 'noopener noreferrer' : undefined"
                    class="comments__card-profile"
                >
                    <h3 class="comments__card-player">{{ player }}</h3>
                    <img
                        :key="`${source}-${avatar}`"
                        :src="avatar"
                        :alt="`Аватар пользователя ${player}`"
                        class="comments__card-img"
                    >
                </component>
            </div>
            <div class="comments__card-right">
                <div class="comments__card-info-row">
                    <div class="comments__info-container">
                        <div class="comments__card-info-el">
                            <p class="comments__card-info-text">{{ date }}</p>
                        </div>
                        <div class="comments__card-info-el" v-if="event">
                            <p class="comments__card-info-text">{{ event }}</p>
                        </div>
                        <div class="comments__card-status comments__card-status--moderation" v-if="!moderated">На модерации</div>
                        <div class="comments__card-status" v-if="!isVisible">Скрыт</div>
                    </div>
                    <div class="comments__card-actions" v-if="isAdmin">
                        <div class="comments__card-moderation" v-if="canModerate && !moderated">
                            <button
                                type="button"
                                class="comments__card-moderation-button comments__card-moderation-button--approve"
                                :disabled="isUpdating"
                                @click="$emit('approve')"
                            >
                                Разрешить отзыв
                            </button>
                            <button
                                type="button"
                                class="comments__card-moderation-button comments__card-moderation-button--reject"
                                :disabled="isUpdating"
                                @click="$emit('reject')"
                            >
                                Запретить
                            </button>
                        </div>
                        <button
                            type="button"
                            class="comments__card-action comments__card-action--visibility"
                            :aria-label="isVisible ? 'Скрыть отзыв' : 'Показать отзыв'"
                            :disabled="isUpdating"
                            @click="$emit('toggleVisibility')"
                        >
                            <EyeOpenIcon v-if="isVisible" />
                            <EyeClosedIcon v-else />
                        </button>
                        <button
                            type="button"
                            class="comments__card-action comments__card-action--delete"
                            aria-label="Удалить отзыв"
                            :disabled="isUpdating"
                            @click="$emit('delete')"
                        >
                            <TrashIcon />
                        </button>
                    </div>
                </div>
                <div class="comments__card-text-container">
                    <p class="comments__card-text" v-for="string in text" :key="string">{{ string }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>

    import TrashIcon from '@/components/icons/masters/comments/Trash.vue';
    import EyeOpenIcon from '@/components/icons/masters/EyeOpen.vue';
    import EyeClosedIcon from '@/components/icons/masters/EyeClosed.vue';

    import panelBaseUrl from '@/utils/panelUrl';

    const props = defineProps({
        source: {
            type: String,
            required: true
        },

        profileUrl: {
            type: String,
            default: ''
        },

        userId: {
            type: String,
            default: ''
        },

        player: {
            type: String,
            required: true
        },

        avatar: {
            type: String,
            required: true
        },

        date: {
            type: String,
            required: true
        },

        event: {
            type: String,
            default: ''
        },

        text: {
            type: Array,
            required: true
        },

        isVisible: {
            type: Boolean,
            default: true
        },

        isAdmin: {
            type: Boolean,
            default: false
        },

        moderated: {
            type: Boolean,
            default: true
        },

        canModerate: {
            type: Boolean,
            default: false
        },

        isUpdating: {
            type: Boolean,
            default: false
        }
    });

    defineEmits(['toggleVisibility', 'delete', 'approve', 'reject']);

    const isVkComment = computed(() => props.source === 'VK');

    const profileLink = computed(() => {
        if (isVkComment.value) {
            return props.profileUrl || '';
        }

        return props.userId
            ? `${panelBaseUrl}/user/${props.userId}`
            : '';
    });

</script>
