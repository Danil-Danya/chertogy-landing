<template>
    <div class="event__container-center">
        <div class="event__followers">
            <h2 class="event__center-title">Участники</h2>
            <div class="event__followers-data"
                :class="{
                    'yellow': myStatus === 'pending',
                    'green': isSubscribed,
                }"
            >
                <span class="event__followers-icon">
                    <SubscribeIcon />
                </span>
                <p class="event__followers-text">{{ eventStore.oneEvent.subscribers.length }}/{{ eventStore.oneEvent.maxPlayers }}</p>
            </div>
        </div>
        <div class="event__author">
            <h2 class="event__center-title">Мастер</h2>
            <div class="event__author-data">
                <a :href="`https://чертоги-героев.рф/panel/user/${eventStore.oneEvent.creator.id}`" class="event__author-data">
                    <img :src="getImageUrl(eventStore.oneEvent.creator.profile?.avatarPath)" alt="avatar" class="event__author-avatar">
                    <p class="event__author-name">{{ eventStore.oneEvent.creator.profile?.name }}</p>
                </a>
                <span class="start__icon">
                    <StarIcon v-if="isFollowingCreator" />
                    <!-- <CrownIcon v-else /> -->
                </span>
            </div>
        </div>
        <div class="event__action" v-if="canManageSubscription">
            <button class="event__button-action" @click="openCaptchaModal" v-if="canSubscribe && !isSubscribed && !isWaiting && !isCanceled">
                <span class="event__button-icon">
                    <EditIcon />
                </span>
                <span>Записаться</span>
            </button>
            <button class="event__button-action waiting" @click="openCaptchaModal" v-if="canSubscribe && !isSubscribed && isWaiting && !isCanceled">
                <span class="event__button-icon">
                    <ClockWaitIcon />
                </span>
                <span>Ожидать</span>
            </button>
            <button class="event__button-action bg-red" @click="openUnsubscribeModal" v-if="isSubscribed && myStatus !== 'pending' && !isCanceled">
                <span class="event__button-icon">
                    <UnSubscribeIcon />
                </span>
                <span>Отменить запись</span>
            </button>
            <button class="event__button-action waiting" @click="openUnsubscribeModal" v-if="myStatus === 'pending' && !isCanceled">
                <span class="event__button-icon">
                    <ClockWaitIcon />
                </span>
                <span>Отменить ожидание</span>
            </button>
        </div>
        <button class="event__button-action locked" v-if="isInProgress && !isCanceled" type="button" data-state="in-progress">
            <span class="event__button-icon">
                <ClockWaitIcon />
            </span>
            <span>Событие идет</span>
        </button>
        <button class="event__button-action locked" v-if="isFinished && !isCanceled" type="button">
            <span class="event__button-icon">
                <ClosedIcon />
            </span>
            <span>Событие завершено</span>
        </button>
        <button
            class="event__button-action locked"
            v-if="showClosedRegistrationNotice && !isCanceled"
            type="button"
        >
            <span class="event__button-icon">
                <ClosedIcon />
            </span>
            <span>Запись закрыта</span>
        </button>
        <div class="event__center-status" v-if="isCanceled">
                <button class="event__center-status-button red" type="button">
                    <span>Событие отменено</span>
                </button>
            </div>
        <div class="event__subscribers" v-if="!isCanceled">
            <div class="event__subscribers-item" v-for="subscriber in eventStore.oneEvent.subscribers" :key="subscriber">
                <a :href="`https://чертоги-героев.рф/panel/user/${subscriber.id}`" 
                    class="event__subscribers-link blue" 
                    :class="{ 
                        'green': subscriber.id === userStore.profile?.id,
                        'yellow': subscriber.eventSubscriptions.status === 'pending',
                        'yellow-green': subscriber?.id === userStore.profile?.id && myStatus === 'pending'
                    }"
                >
                    {{ subscriber.login }}
                </a>
            </div>
        </div>
    </div>
    <Transition name="modal">
        <UnsubscribeModal
            v-if="isUnSubscribe"
            :status="myStatus"
            @confirm="handleUnsubscribeConfirm"
            @cancel="closeUnsubscribeModal"
        />
    </Transition>
    <Transition name="modal">
        <CaptchaModal
            v-if="isCaptchaOpen"
            @confirm="handleCaptchaConfirm"
            @cancel="closeCaptchaModal"
        />
    </Transition>
    <Transition name="modal">
        <EventRejoinBlockedModal
            v-if="isRejoinBlockedModalOpen"
            @close="closeRejoinBlockedModal"
        />
    </Transition>
    <Transition name="modal">
        <SubscriptionSuccessModal
            v-if="isSubscriptionSuccessModalOpen"
            @close="closeSubscriptionSuccessModal"
        />
    </Transition>
</template>

<script setup>

    import { useEvent } from '@/composables/useEvent';
    import { useSubscriptionCaptcha } from '@/composables/useSubscriptionCaptcha';
    import getImageUrl from '@/utils/getImageUrl.js';
    import EventRejoinBlockedModal from '../shared/modals/EventRejoinBlockedModal.vue';
    import SubscriptionSuccessModal from '../shared/modals/SubscriptionSuccessModal.vue';
    import UnsubscribeModal from '../shared/modals/UnsubscribeModal.vue';
    import CaptchaModal from '../shared/modals/CaptchaModal.vue';
import { is } from 'date-fns/locale';

    const SubscribeIcon = defineAsyncComponent(() => import('~/components/icons/events/cards/Subscribes.vue'));

    const UnSubscribeIcon = defineAsyncComponent(() => import('~/components/icons/events/cards/Unsubscribe.vue'));
    const EditIcon = defineAsyncComponent(() => import('~/components/icons/events/cards/Edit.vue'));

    const ClockWaitIcon = defineAsyncComponent(() => import('@/components/icons/events/info/ClockWait.vue'));
    const StarIcon = defineAsyncComponent(() => import('@/components/icons/events/page/Star.vue'));
    const CrownIcon = defineAsyncComponent(() => import('@/components/icons/events/page/Crown.vue'));
    const ClosedIcon = defineAsyncComponent(() => import('@/components/icons/events/info/Closed.vue'));


    const {
        canSubscribe,
        canManageSubscription,
        isSubscribed,
        isWaiting,
        myStatus,
        subscribeAction,
        eventStore,
        userStore,
        showClosedRegistrationNotice,
        isInProgress,
        isFinished,
        isFollowingCreator,
        isRejoinBlockedModalOpen,
        closeRejoinBlockedModal,
        isSubscriptionSuccessModalOpen,
        closeSubscriptionSuccessModal,
    } = useEvent();
    const { shouldRequireCaptcha } = useSubscriptionCaptcha();
    
    const isUnSubscribe = ref(false);
    const isCaptchaOpen = ref(false);

    const openUnsubscribeModal = () => {
        isUnSubscribe.value = true;
    };

    const closeUnsubscribeModal = () => {
        isUnSubscribe.value = false;
    };

    const handleUnsubscribeConfirm = async () => {
        closeUnsubscribeModal();

        await subscribeAction();
    };

    const openCaptchaModal = async () => {
        const userId = userStore.profile?.id;
        const eventId = eventStore.oneEvent?.id;

        if (isInProgress.value || isFinished.value) {
            return;
        }

        if (!shouldRequireCaptcha({ eventId, userId })) {
            await subscribeAction();
            return;
        }

        isCaptchaOpen.value = true;
    };

    const closeCaptchaModal = () => {
        isCaptchaOpen.value = false;
    };

    const handleCaptchaConfirm = async () => {
        closeCaptchaModal();

        await subscribeAction({ resetCaptchaGate: true });
    };

    const isCanceled = computed(() => {
        return eventStore.oneEvent.isCanceled;
    });

</script>
