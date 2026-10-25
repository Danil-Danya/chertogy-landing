<template>
    <div class="comment-textarea">
        <label :for="id" class="comment-textarea__label" v-if="label">{{ label }}</label>
        <textarea
            :id="id"
            :value="modelValue"
            :placeholder="placeholder"
            :maxlength="maxlength"
            class="comment-textarea__field"
            @input="onInput"
            @blur="$emit('blur')"
        ></textarea>
        <div class="comment-textarea__bottom">
            <p
                class="comment-textarea__message"
                :class="{ 'error': message?.type === 'error' }"
            >
                {{ message?.text || `Не более ${maxlength} символов` }}
            </p>
            <p class="comment-textarea__counter">{{ modelValue.length }}/{{ maxlength }}</p>
        </div>
    </div>
</template>

<script setup>

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
            default: ''
        },

        maxlength: {
            type: Number,
            default: 1000
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

    const emit = defineEmits(['update:modelValue', 'blur']);

    const onInput = (event) => {
        emit('update:modelValue', event.target.value);
    };

</script>

<style lang="scss" scoped>
    .comment-textarea {
        width: 100%;

        &__label {
            display: block;
            margin-bottom: 10px;
            color: #EEE0F1;
            font-family: Alegreya;
            font-size: 20px;
        }

        &__field {
            display: block;
            width: 100%;
            min-height: 76px;
            padding: 12px 10px;
            resize: vertical;
            border: 1px solid #1A1520;
            border-radius: 5px;
            outline: none;
            background: #1D1A1E;
            color: #EEE0F1;
            font-family: Alegreya;
            font-size: 20px;
            line-height: 120%;
            transition: border-color 300ms;

            &::placeholder {
                color: #625D67;
            }

            &:focus {
                border-color: #86489C;
            }
        }

        &__bottom {
            display: flex;
            justify-content: space-between;
            gap: 15px;
            margin-top: 8px;
        }

        &__message,
        &__counter {
            color: #625D67;
            font-family: Alegreya;
            font-size: 14px;
            line-height: 120%;
        }

        &__message.error {
            color: #C95959;
        }

        &__counter {
            flex-shrink: 0;
        }
    }
</style>
