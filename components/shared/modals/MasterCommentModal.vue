<template>
    <div class="modal comment-modal" @click.self="onClose">
        <div
            class="modal__content comment-modal__content"
            :class="{ 'comment-modal__content-success': isSubmitted }"
        >
            <template v-if="!isSubmitted">
                <button type="button" class="comment-modal__close" @click="onClose" aria-label="Закрыть">
                    <CloseIcon />
                </button>

                <h2 class="comment-modal__title">
                    Оставить отзыв на мастера<br>{{ masterName }}
                </h2>

                <form class="comment-modal__form" @submit.prevent="onSubmit">
                    <CommentTextarea
                        id="master-comment"
                        v-model="comment"
                        placeholder="Чем бы вы хотели поделиться?"
                        :maxlength="1000"
                        :message="commentMessage"
                        @blur="validateComment"
                    />

                    <CommentSelect
                        id="master-comment-event"
                        v-model="selectedEvent"
                        label="Указать игру (не обязательно)"
                        placeholder="Выбрать сыгранную игру у мастера"
                        :options="eventOptions"
                    />

                    <p class="comment-modal__error" v-if="submitError">{{ submitError }}</p>

                    <button type="submit" class="comment-modal__submit" :disabled="isSubmitting">
                        {{ isSubmitting ? 'Отправляем...' : 'Отправить' }}
                    </button>
                </form>
            </template>

            <div class="comment-modal__success" v-else>
                <h2 class="comment-modal__success-title">Спасибо!</h2>
                <p class="comment-modal__success-text">Ваш отзыв отправлен на модерацию</p>
                <HeartIcon />
            </div>
        </div>
    </div>
</template>

<script setup>

    import CloseIcon from '@/components/icons/development/Close.vue';
    import HeartIcon from '@/components/icons/masters/comments/Heart.vue';
    import CommentTextarea from '@/components/shared/form/CommentTextarea.vue';
    import CommentSelect from '@/components/shared/form/CommentSelect.vue';

    import { useUserStore } from '~/store/useUsers';
    import { useCommentsStore } from '~/store/useComments';

    const props = defineProps({
        masterName: {
            type: String,
            required: true
        },

        masterId: {
            type: String,
            required: true
        }
    });

    const emit = defineEmits(['close', 'submit']);

    const userStore = useUserStore();
    const commentsStore = useCommentsStore();

    const comment = ref('');
    const selectedEvent = ref('');
    const commentMessage = ref(null);
    const submitError = ref('');
    const isSubmitting = ref(false);
    const isSubmitted = ref(false);

    const eventOptions = computed(() => {
        const events = userStore.profile?.subscribedEvents;

        if (!Array.isArray(events)) {
            return [];
        }

        return events
            .filter((event) => event.id && event.title)
            .map((event) => ({
                value: event.id,
                label: event.title
            }));
    });

    const validateComment = () => {
        commentMessage.value = comment.value.trim()
            ? null
            : { type: 'error', text: 'Напишите отзыв' };

        return !commentMessage.value;
    };

    const onSubmit = async () => {
        if (!validateComment()) {
            return;
        }

        submitError.value = '';
        isSubmitting.value = true;

        const result = await commentsStore.addMasterComment(props.masterId, {
            content: comment.value.trim(),
            eventId: selectedEvent.value || null
        });

        isSubmitting.value = false;

        if (!result) {
            submitError.value = 'Не удалось отправить отзыв. Попробуйте ещё раз.';
            return;
        }

        await commentsStore.fetchMasterComments(props.masterId);
        emit('submit', result);
        isSubmitted.value = true;
    };

    const onClose = () => {
        emit('close');
    };

    watch(comment, () => {
        if (commentMessage.value) {
            validateComment();
        }
    });

    onMounted(async () => {
        if (!userStore.profile && localStorage.getItem('accessToken')) {
            await userStore.fetchProfile();
        }
    });

</script>

<style lang="scss" scoped>
    .comment-modal {
        &__content {
            width: 100%;
            max-width: 520px;
            padding: 42px 28px 48px;
            border: 1px solid #18121C;
            border-radius: 15px;
            background: #0A060C;
            box-shadow: 0 12px 30px rgba(0, 0, 0, 0.35);

            &-success {
                max-width: 435px;
                padding: 42px 30px 32px;
            }

            @include media($sm) {
                padding: 42px 20px 30px;
            }
        }

        &__close {
            position: absolute;
            top: 18px;
            right: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 28px;
            height: 28px;
            padding: 0;
            border: 0;
            background: transparent;
            cursor: pointer;
        }

        &__title {
            margin-bottom: 32px;
            color: #EEE0F1;
            font-family: Alegreya SC;
            font-size: 32px;
            font-weight: 500;
            line-height: 115%;
            text-align: center;
            text-transform: uppercase;

            @include media($sm) {
                font-size: 25px;
            }
        }

        &__form {
            display: flex;
            flex-direction: column;
            gap: 30px;
        }

        &__submit {
            width: 100%;
            padding: 15px 20px;
            border: 0;
            border-radius: 10px;
            background: #86489C;
            color: #FFFFFF;
            font-family: Alegreya SC;
            font-size: 20px;
            font-weight: 500;
            line-height: 120%;
            text-transform: uppercase;
            cursor: pointer;
            transition: background 300ms;

            &:hover {
                background: #653775;
            }

            &:disabled {
                opacity: 0.6;
                cursor: default;
            }
        }

        &__error {
            margin-top: -15px;
            color: #C95959;
            font-family: Alegreya;
            font-size: 15px;
            line-height: 120%;
            text-align: center;
        }

        &__success {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;

            &-title {
                color: #EEE0F1;
                font-family: Alegreya SC;
                font-size: 32px;
                font-weight: 500;
                line-height: 115%;
                text-transform: uppercase;
            }

            &-text {
                margin: 10px 0 12px;
                color: #EEE0F1;
                font-family: Alegreya SC;
                font-size: 20px;
                font-weight: 500;
                line-height: 120%;
                text-transform: uppercase;
            }
        }
    }
</style>
