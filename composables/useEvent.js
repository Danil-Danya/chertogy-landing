import { useRoute, useRouter } from 'vue-router';
import { useEventsStore } from '~/store/useEvents';
import { useUserStore } from '~/store/useUsers';
import { subscribeEvent, unSubscribeEvent, updateEventStatus, updateGame, updateMeeting } from '~/api/events';
import { useSubscriptionCaptcha } from '@/composables/useSubscriptionCaptcha';
import { useSubscriptionSuccessModal } from '@/composables/useSubscriptionSuccessModal';

export const useEvent = () => {
    const eventStore = useEventsStore();
    const userStore = useUserStore();
    const {
        incrementUnsubscribeAttempts,
        clearUnsubscribeAttempts
    } = useSubscriptionCaptcha();
    const {
        isSubscriptionSuccessModalOpen,
        openSubscriptionSuccessModal,
        closeSubscriptionSuccessModal,
    } = useSubscriptionSuccessModal();

    const router = useRouter();
    const route = useRoute();
    const isRejoinBlockedModalOpen = ref(false);

    const openRejoinBlockedModal = () => {
        isRejoinBlockedModalOpen.value = true;
    };

    const closeRejoinBlockedModal = () => {
        isRejoinBlockedModalOpen.value = false;
    };

    const getEventTimeData = () => {
        const event = eventStore.oneEvent;
        const startRaw = event?.startTime ?? event?.start_time;
        const endRaw = event?.endTime ?? event?.end_time;
        const startMs = startRaw ? new Date(startRaw).getTime() : Number.NaN;
        const endMs = endRaw ? new Date(endRaw).getTime() : Number.NaN;

        return {
            hasValidStart: Number.isFinite(startMs),
            hasValidEnd: Number.isFinite(endMs),
            startMs,
            endMs,
        };
    };

    const isFinished = computed(() => {
        const { hasValidEnd, endMs } = getEventTimeData();

        if (!hasValidEnd) {
            return false;
        }

        return Date.now() > endMs;
    });

    const isInProgress = computed(() => {
        const { hasValidStart, hasValidEnd, startMs } = getEventTimeData();

        if (!hasValidStart || !hasValidEnd) {
            return false;
        }

        return Date.now() >= startMs && !isFinished.value;
    });

    const canSubscribe = computed(() => {
        const event = eventStore.oneEvent;
        const profile = userStore.profile;

        if (!profile || !event) {
            return false;
        }

        return (
            profile.id !== event?.creator?.id &&
            event.isAllowed &&
            !event.isDraft &&
            !isEventClosed.value &&
            !isInProgress.value &&
            !isFinished.value
        );
    });

    const canManageSubscription = computed(() => {
        const event = eventStore.oneEvent;
        const profile = userStore.profile;

        if (!profile || !event) {
            return false;
        }

        if (profile.id === event?.creator?.id) {
            return false;
        }

        if (isInProgress.value) {
            return false;
        }

        if (!event.isAllowed || event.isDraft || isFinished.value || event.isCanceled) {
            return false;
        }

        return isSubscribed.value || canSubscribe.value;
    });


    const isEventClosed = computed(() => {
        const event = eventStore.oneEvent;

        if (!event) {
            return true;
        }

        if (event.registrationType === 'CLOSED') {
            return true;
        }

        if (event.isCanceled) {
            return true;
        }

        return false;
    });


    const isWaiting = computed(() => {
        const event = eventStore.oneEvent;

        if (!event?.subscribers || !event?.maxPlayers) {
            return false;
        }

        return event.subscribers.length >= event.maxPlayers;
    });

    const isPending = () => {
        const event = eventStore.oneEvent;
    }


    const isSubscribed = computed(() => {
        const event = eventStore.oneEvent;
        const userId = userStore.profile?.id;

        if (!event?.subscribers?.length) return false;

        return event.subscribers.some(sub => sub.id === userId);
    });

    
    const mySubscription = computed(() => {
        const userId = userStore.profile?.id;
        const subs = eventStore.oneEvent?.subscribers ?? [];

        if (!userId) {
            return null;
        }

        return subs.find((sub) => {
            return sub.id === userId;
        }) ?? null;
    });

    const myStatus = computed(() => mySubscription.value?.eventSubscriptions?.status ?? null);

    const isStaff = computed(() => {
        const event = eventStore.oneEvent;
        const profile = userStore.profile;

        if (!event || !profile) {
            return false;
        }

        const isCreator = profile.id === event.creator?.id;
        const isAdmin = profile.role === 'ADMIN';

        return isCreator || isAdmin;
    });

    const isFollowingCreator = computed(() => {
        const creatorId = eventStore.oneEvent?.creator?.id;
        const profile = userStore.profile;
        const following = profile?.following;

        if (!creatorId || !profile) {
            return false;
        }

        if (profile.id === creatorId) {
            return true;
        }

        if (!Array.isArray(following)) {
            return false;
        }

        return following.some((user) => user?.id === creatorId);
    });


    const subscribeAction = async ({ resetCaptchaGate = false } = {}) => {
        const userId = userStore.profile?.id;
        const eventId = eventStore.oneEvent?.id;

        if (!userId || !eventId) {
            return false;
        }

        if (isInProgress.value || isFinished.value) {
            return false;
        }

        if (isSubscribed.value) {
            const unSubscribed = await unSubscribeEvent({
                eventId,
                userId
            })

            if (unSubscribed) {
                incrementUnsubscribeAttempts({ eventId, userId });
                await eventStore.fetchOneEvent(route.params.slug);
                return true;
            }
        } 
        else {
            const subscribed = await subscribeEvent({
                eventId,
                userId
            })

            if (subscribed?.errorCode === 'EVENT_REJOIN_BLOCKED') {
                openRejoinBlockedModal();
                return false;
            }

            if (subscribed) {
                if (resetCaptchaGate) {
                    clearUnsubscribeAttempts({ eventId, userId });
                }

                await eventStore.fetchOneEvent(route.params.slug);
                openSubscriptionSuccessModal();
                return true;
            }
        }

        return false;
    };

    const cancelEvent = async () => {
        const event = eventStore.oneEvent;

        const changedEvent = { ...event, isCanceled: true }; 

        if (event.type === 'GAME') {
            const updatedEvent = await updateGame(event.id, event.game.id, changedEvent);

            // if (updatedEvent) {
            //     router.replace('/events')
            // }
        }
        else {
            const updatedEvent = await updateMeeting(event.id, changedEvent);
            
            // if (updatedEvent) {
            //     router.replace('/events')
            // }
        }
    }

    const myGlow = computed(() => {
        if (!isSubscribed.value) {
            return null;
        }

        const status = (myStatus.value ?? '').toString().toUpperCase();

        if (status === 'PENDING') {
            return 'yellow';
        }

        if (status === 'APPROVED') {
            return 'green';
        }

        return null;
    });

    const showClosedRegistrationNotice = computed(() => {
        return isEventClosed.value && !isInProgress.value && !isFinished.value && !isSubscribed.value;
    });

    
    return {
        canSubscribe,
        canManageSubscription,
        isSubscribed,
        isWaiting,
        myStatus,
        isStaff,
        isFollowingCreator,
        isEventClosed,
        showClosedRegistrationNotice,
        eventStore,
        userStore,
        route,
        isInProgress,
        isFinished,
        subscribeAction,
        cancelEvent,
        isRejoinBlockedModalOpen,
        closeRejoinBlockedModal,
        isSubscriptionSuccessModalOpen,
        closeSubscriptionSuccessModal,
    }
}
