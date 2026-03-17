import { useRoute, useRouter } from 'vue-router';
import { useEventsStore } from '~/store/useEvents';
import { useUserStore } from '~/store/useUsers';
import { subscribeEvent, unSubscribeEvent, updateEventStatus, updateGame, updateMeeting } from '~/api/events';

export const useEvent = () => {
    const eventStore = useEventsStore();
    const userStore = useUserStore();

    const router = useRouter();
    const route = useRoute();

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
            !isFinished.value
        );
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


    const subscribeAction = async () => {
        const userId = userStore.profile?.id;
        const eventId = eventStore.oneEvent.id;

        if (isSubscribed.value) {
            const unSubscribed = await unSubscribeEvent({
                eventId,
                userId
            })

            if (unSubscribed) {
                await eventStore.fetchOneEvent(route.params.slug);
            }
        } 
        else {
            const subscribed = await subscribeEvent({
                eventId,
                userId
            })

            if (subscribed) {
                await eventStore.fetchOneEvent(route.params.slug);
            }
        }
    };

    const isFinished = computed(() => {
        const event = eventStore.oneEvent;

        if (!event?.startTime) {
            return false;
        }

        const startMs = new Date(event.startTime).getTime();

        if (!Number.isFinite(startMs)) {
            return false;
        }

        return Date.now() > startMs;
    });


    const cancelEvent = async () => {
        const event = eventStore.oneEvent;

        const changedEvent = { ...event, isCanceled: true }; 

        if (event.type === 'GAME') {
            const updatedEvent = await updateGame(event.id, event.game.id, changedEvent);

            if (updatedEvent) {
                router.replace('/events')
            }
        }
        else {
            const updatedEvent = await updateMeeting(event.id, changedEvent);
            
            if (updatedEvent) {
                router.replace('/events')
            }
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

    
    return {
        canSubscribe,
        isSubscribed,
        isWaiting,
        myStatus,
        isStaff,
        isEventClosed,
        eventStore,
        userStore,
        route,
        isFinished,
        subscribeAction,
        cancelEvent,
    }
}