<template>
    <div class="masters__card" :class="{ 'not-visible': !isVisible }">
        <div class="masters__card-head" :class="{ admin: isAdmin }">
            <button
                type="button"
                class="masters__card-action masters__card-action-visibility"
                :aria-label="isVisible ? 'Скрыть мастера' : 'Показать мастера'"
                :disabled="isUpdating"
                @click="toggleVisibility"
                v-if="isAdmin"
            >
                <EyeOpenIcon v-if="isVisible" />
                <EyeClosedIcon v-else />
            </button>
            <div class="masters__card-heading">
                <h2 class="masters__card-name">{{ name }}</h2>
                <p class="masters__card-history">{{ history }}</p>
            </div>
            <button
                type="button"
                class="masters__card-action masters__card-action-edit"
                aria-label="Редактировать мастера"
                @click="toUpdate"
                v-if="isAdmin"
            >
                <EditIcon />
            </button>
        </div>
        <div class="masters__card-systems">
            <img src="@/assets/images/masters/d20.svg" alt="" class="masters__card-decoration">
            <p class="masters__card-systems-designation">Топ 3 системы:</p>
            <ul class="masters__card-systems-list">
                <li class="masters__card-systems-tag" v-for="system in systems" :key="system">{{ system }}</li>
            </ul>
        </div>
        <div class="masters__card-content">
            <div class="masters__card-left">
                <img :src="image" alt="Фото мастера" class="masters__card-img">
            </div>
            <div class="masters__card-right">
                <p class="masters__card-text">"{{ description }}"</p>
                <div class="masters__card-button-container">
                    <a
                        :href="`/masters/${link}`"
                        class="masters__card-link"
                        :class="{ disabled: !isVisible }"
                        @click="preventHiddenLink"
                    >
                        <span class="masters__card-link-button">Подробнее о мастере</span>
                        <span class="masters__card-link-icon">
                            <ArrowRightIcon />
                        </span>
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>

    import ArrowRightIcon from '@/components/icons/masters/ArrowRight.vue';
    import EyeOpenIcon from '@/components/icons/masters/EyeOpen.vue';
    import EyeClosedIcon from '@/components/icons/masters/EyeClosed.vue';
    import EditIcon from '@/components/icons/events/cards/Edit.vue';

    const router = useRouter();

    const emit = defineEmits(['toggleVisibility']);

    const props = defineProps({
        name: {
            type: String,
            required: true
        },

        history: {
            type: String,
            required: true
        },

        systems: {
            type: Array,
            required: true
        },

        image: {
            type: String,
            required: true
        },

        description: {
            type: String,
            required: true
        },

        link: {
            type: String,
            required: true
        },

        id: {
            type: String,
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

        isUpdating: {
            type: Boolean,
            default: false
        }
    })

    const toggleVisibility = () => {
        emit('toggleVisibility');
    };

    const toUpdate = () => {
        router.replace(`/panel/masters/update/${props.id}`);
    };

    const preventHiddenLink = (event) => {
        if (!props.isVisible) {
            event.preventDefault();
        }
    };

</script>
