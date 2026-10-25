<template>
    <div class="comment-select" ref="select">
        <label :for="id" class="comment-select__label" v-if="label">{{ label }}</label>
        <button
            :id="id"
            type="button"
            class="comment-select__button"
            :class="{
                'active': isOpen,
                'error': message?.type === 'error'
            }"
            :aria-expanded="isOpen"
            @click="toggleSelect"
        >
            <span :class="{ 'selected': selectedOption }">
                {{ selectedOption?.label || placeholder }}
            </span>
            <ArrowIcon class="comment-select__arrow" :class="{ 'active': isOpen }" />
        </button>

        <Transition name="select-list">
            <ul class="comment-select__list" v-if="isOpen">
                <li class="comment-select__item" v-for="option in options" :key="option.value">
                    <button
                        type="button"
                        class="comment-select__option"
                        :class="{ 'selected': option.value === modelValue }"
                        @click="selectOption(option.value)"
                    >
                        {{ option.label }}
                    </button>
                </li>
                <li class="comment-select__empty" v-if="!options.length">Сыгранные игры не найдены</li>
            </ul>
        </Transition>
        <p class="comment-select__message" v-if="message">{{ message.text }}</p>
    </div>
</template>

<script setup>

    import ArrowIcon from '@/components/icons/masters/Arrow.vue';

    const props = defineProps({
        label: {
            type: String,
            default: ''
        },

        id: {
            type: String,
            default: ''
        },

        placeholder: {
            type: String,
            default: 'Выберите вариант'
        },

        options: {
            type: Array,
            default: () => []
        },

        message: {
            type: Object,
            default: null
        },

        modelValue: {
            type: String,
            default: ''
        }
    });

    const emit = defineEmits(['update:modelValue']);

    const select = ref(null);
    const isOpen = ref(false);

    const selectedOption = computed(() => {
        return props.options.find((option) => option.value === props.modelValue);
    });

    const toggleSelect = () => {
        isOpen.value = !isOpen.value;
    };

    const selectOption = (value) => {
        emit('update:modelValue', value);
        isOpen.value = false;
    };

    const closeSelect = (event) => {
        if (!select.value?.contains(event.target)) {
            isOpen.value = false;
        }
    };

    onMounted(() => {
        document.addEventListener('click', closeSelect);
    });

    onBeforeUnmount(() => {
        document.removeEventListener('click', closeSelect);
    });

</script>

<style lang="scss" scoped>
    .comment-select {
        position: relative;
        width: 100%;

        &__label {
            display: block;
            margin-bottom: 12px;
            color: #EEE0F1;
            font-family: Alegreya;
            font-size: 22px;
            line-height: 120%;
        }

        &__button {
            width: 100%;
            min-height: 57px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 15px;
            padding: 14px 12px;
            border: 1px solid #1A1520;
            border-radius: 5px;
            background: #1D1A1E;
            color: #625D67;
            font-family: Alegreya;
            font-size: 20px;
            line-height: 120%;
            text-align: left;
            cursor: pointer;
            transition: border-color 300ms;

            &.active {
                border-color: #86489C;
            }

            &.error {
                border-color: #C95959;
            }

            & span {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            & span.selected {
                color: #EEE0F1;
            }
        }

        &__arrow {
            width: 24px;
            height: 24px;
            flex-shrink: 0;
            transition: transform 300ms;

            &.active {
                transform: rotate(180deg);
            }
        }

        &__list {
            position: absolute;
            top: calc(100% - 1px);
            left: 0;
            z-index: 10;
            width: 100%;
            max-height: 210px;
            overflow-y: auto;
            border: 1px solid #86489C;
            border-radius: 0 0 5px 5px;
            background: #1D1A1E;
        }

        &__option,
        &__empty {
            width: 100%;
            padding: 12px;
            border: 0;
            background: transparent;
            color: #D5B0E4;
            font-family: Alegreya;
            font-size: 18px;
            line-height: 120%;
            text-align: left;
        }

        &__option {
            cursor: pointer;
            transition: background 300ms;

            &:hover,
            &.selected {
                background: #2B2033;
            }
        }

        &__empty {
            color: #625D67;
        }

        &__message {
            margin-top: 8px;
            color: #C95959;
            font-family: Alegreya;
            font-size: 14px;
            line-height: 120%;
        }
    }

    .select-list-enter-active,
    .select-list-leave-active {
        transition: opacity 200ms ease, transform 200ms ease;
        transform-origin: top;
    }

    .select-list-enter-from,
    .select-list-leave-to {
        opacity: 0;
        transform: translateY(-5px);
    }
</style>
