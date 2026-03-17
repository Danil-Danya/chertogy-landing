<template>
    <div class="event__container-center">
        <div class="event__center-top">
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
            <div class="event__center-status" v-if="eventStore.oneEvent.registrationType === 'OPEN' && !isFinished">
                <button class="event__center-status-button red" @click="updatedRegistrationType">
                    <span class="event__center-status-icon">
                        <AlertIcon />
                    </span>
                    <span>Закрыть запись</span>
                </button>
            </div>
            <div class="event__center-status" v-else-if="!isFinished">
                <button class="event__center-status-button green" @click="updatedRegistrationType">
                    <span class="event__center-status-icon">
                        <KeyIcon />
                    </span>
                    <span>Открыть запись</span>
                </button>
            </div>
            <button class="event__center-cancel" @click="toggleCancel" v-if="!isFinished">
                <span class="event__center-status-icon">
                    <CancelIcon />
                </span>
                <span>Отменить событие</span>
            </button>
        </div>
        <div class="event__author">
            <h2 class="event__center-title">Мастер</h2>
            <div class="event__author-data">
                <a :href="`https://чертоги-героев.рф/panel/user/${eventStore.oneEvent.creator.id}`" class="event__author-data">
                    <img :src="`https://api.чертоги-героев.рф/images/${eventStore.oneEvent.creator.profile?.avatarPath}`" alt="avatar" class="event__author-avatar">
                    <p class="event__author-name">{{ eventStore.oneEvent.creator.profile?.name }}</p>
                </a>
                <span class="start__icon">
                    <StarIcon />
                </span>
            </div>
        </div>
        <div class="event__subscribers" v-if="eventStore.oneEvent.subscribers && userStore.profile">
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
                <input
                    class="event__subscribers-checkbox"
                    type="checkbox"
                    :id="`subscriber-${subscriber.id}`"
                    :value="subscriber.id"
                    v-model="selectedUsers"
                />

                <label
                    class="event__subscribers-label"
                    :for="`subscriber-${subscriber.id}`"
                > 
                </label>
            </div>
            <button class="event__center-status-button dark delete" @click="toggleDelete" v-if="hasSelectedUsers && !isFinished">
                <span class="event__center-status-icon">
                    <UnSubscribeIcon />
                </span>
                <span>Отменить записи</span>
            </button>
            <button
                class="event__center-status-button dark delete"
                v-if="hasSelectedPendingUsers && !isFinished"
                @click="toggleApply"
            >
                <span class="event__center-status-icon green">
                    <ApplyWaitingIcon />
                </span>
                <span>Утвердить ожидающих</span>
            </button>
            <button class="event__button-action" @click="toggleSubscribe" v-if="!isFinished">
                <span class="event__button-icon">
                    <UserIcon />
                </span>
                <span>Добавить игрока</span>
            </button>
            <div class="event__action" v-if="canSubscribe">
                <button class="event__button-action" @click="subscribeAction" v-if="!isSubscribed && !isWaiting && !isFinished && canSubscribe">
                    <span class="event__button-icon">
                        <EditIcon />
                    </span>
                    <span>Записаться</span>
                </button>
                <button class="event__button-action waiting" @click="subscribeAction" v-if="!isSubscribed && isWaiting && canSubscribe">
                    <span class="event__button-icon">
                        <ClockWaitIcon />
                    </span>
                    <span>Ожидать</span>
                </button>
                <button class="event__button-action bg-red" @click="openUnsubscribeModal" v-if="isSubscribed && myStatus !== 'pending' && canSubscribe">
                    <span class="event__button-icon">
                        <UnSubscribeIcon />
                    </span>
                    <span>Отменить запись</span>
                </button>
                <button class="event__button-action waiting" @click="openUnsubscribeModal" v-if="myStatus === 'pending' && isSubscribed && canSubscribe">Отменить ожидание</button>
            </div>
            <button class="event__button-action locked" v-if="isFinished" type="button">
                <span class="event__button-icon">
                    <ClosedIcon />
                </span>
                <span>Событие завершено</span>
            </button>
            <button
                class="event__button-action locked"
                v-if="isEventClosed && !isFinished"
                type="button"
            >
                <span class="event__button-icon">
                    <ClosedIcon />
                </span>
                <span>Запись закрыта</span>
            </button>
        </div>
    </div>
    <Transition name="modal">
        <DeleteModal 
            v-if="isDelete" 
            @confirm="handleDelete"
            @cancel="toggleDelete"
        />
    </Transition>
    <Transition name="modal">
        <SubscribeModal 
            :included-users="includedUserIds"
            v-if="isSubscribe" 
            @confirm="handleSubscribe"
            @cancel="toggleSubscribe"
        />
    </Transition>
    <Transition name="modal">
        <ApplyWaitingModal 
            v-if="isApprove" 
            @confirm="handleSubscribeWaiting"
            @cancel="toggleApply"
        />
    </Transition>
    <Transition name="modal">
        <CancelModal 
            v-if="isCancel" 
            @confirm="handleCloseEvent"
            @cancel="toggleCancel"
        />
    </Transition>
    <Transition name="modal">
        <UnsubscribeModal
            v-if="isUnSubscribe"
            :status="myStatus"
            @confirm="handleUnsubscribeConfirm"
            @cancel="closeUnsubscribeModal"
        />
    </Transition>

</template>

<script setup>

    import DeleteModal from '~/components/shared/modals/DeleteModal.vue';
    import SubscribeModal from '~/components/shared/modals/SubscribeModal.vue';
    import ApplyWaitingModal from '../shared/modals/ApplyWaitingModal.vue';
    import CancelModal from '../shared/modals/CancelModal.vue';
    import UnsubscribeModal from '../shared/modals/UnsubscribeModal.vue';

    import { applySubscribe, subscribeEvent, unSubscribeEvent, updateEventStatus } from '~/api/events';
    import { useEvent } from '@/composables/useEvent';

    const SubscribeIcon = defineAsyncComponent(() => import('~/components/icons/events/cards/Subscribes.vue'));

    const AlertIcon = defineAsyncComponent(() => import('@/components/icons/events/info/Alert.vue'));
    const LockIcon = defineAsyncComponent(() => import('@/components/icons/events/info/Lock.vue'));

    const KeyIcon = defineAsyncComponent(() => import('@/components/icons/events/info/Key.vue'));
    const UnlockIcon = defineAsyncComponent(() => import('@/components/icons/events/info/Unlock.vue'));

    const UserIcon = defineAsyncComponent(() => import('@/components/icons/events/info/User.vue'));
    const CancelIcon = defineAsyncComponent(() => import('@/components/icons/events/info/Canclel.vue'));

    const UnSubscribeIcon = defineAsyncComponent(() => import('~/components/icons/events/cards/Unsubscribe.vue'));
    const EditIcon = defineAsyncComponent(() => import('~/components/icons/events/cards/Edit.vue'));

    const ClockWaitIcon = defineAsyncComponent(() => import('@/components/icons/events/info/ClockWait.vue'));
    const StarIcon = defineAsyncComponent(() => import('@/components/icons/events/page/Star.vue'));
    const ApplyWaitingIcon = defineAsyncComponent(() => import('@/components/icons/events/info/ApplyWaitings.vue'));
    const ClosedIcon = defineAsyncComponent(() => import('@/components/icons/events/info/Closed.vue'));

    const selectedUsers = ref([]);

    const isDelete = ref(false);
    const isSubscribe = ref(false);
    const isApprove = ref(false);
    const isCancel = ref(false);

    const hasSelectedUsers = computed(() => {
        return selectedUsers.value.length > 0;
    });

    const updatedRegistrationType = async () => {
        const updatedStatus = await updateEventStatus(eventStore.oneEvent.id);
        if (updatedStatus) {
            await eventStore.fetchOneEvent(eventStore.oneEvent.slug);
        }
    }

    const handleSubscribe = async (users) => {
        for (const userId of users) {
            await subscribeEvent({
                eventId: eventStore.oneEvent.id,
                userId,
            });
        }

        await eventStore.fetchOneEvent(route.params.slug);
        toggleSubscribe();
    };

    const handleDelete = async () => {
        for (const user of selectedUsers.value) {
            await unSubscribeEvent({
                eventId: eventStore.oneEvent.id,
                userId: user,
            });
        }

        location.reload();
    };

    const handleSubscribeWaiting = async () => {
        for (const user of selectedUsers.value) {
            await applySubscribe({
                eventId: eventStore.oneEvent.id,
                userId: user,
            })
        }

        location.reload();
    }

    const handleCloseEvent = async () => {
        await cancelEvent();
    }

    const toggleDelete = () => {
        isDelete.value = !isDelete.value;
    }

    const toggleSubscribe = () => {
        isSubscribe.value = !isSubscribe.value;
    }

    const toggleApply = () => {
        isApprove.value = !isApprove.value;
    }

    const toggleCancel = () => {
        isCancel.value = !isCancel.value;
    }

    const {
        canSubscribe,
        isSubscribed,
        isWaiting,
        myStatus,
        subscribeAction,
        cancelEvent,
        eventStore,
        userStore,
        isEventClosed,
        isFinished,
        route
    } = useEvent();

    const hasSelectedPendingUsers = computed(() => {
        const selected = selectedUsers.value;

        if (!Array.isArray(selected) || selected.length === 0) {
            return false;
        }

        const subscribers = eventStore.oneEvent?.subscribers;

        if (!Array.isArray(subscribers) || subscribers.length === 0) {
            return false;
        }

        const selectedSet = new Set(selected);

        for (const subscriber of subscribers) {
            if (!selectedSet.has(subscriber.id)) {
                continue;
            }

            if (subscriber?.eventSubscriptions?.status === 'pending') {
                return true;
            }
        }

        return false;
    });

    const includedUserIds = computed(() => {
        const ids = new Set();

        const subscribers = eventStore.oneEvent?.subscribers ?? [];
        for (const s of subscribers) {
            ids.add(s.id);
        }

        const creatorId = eventStore.oneEvent?.creator?.id || eventStore.oneEvent?.creator_id;
        if (creatorId) {
            ids.add(creatorId);
        }

        return [...ids];
    });
    

    const isUnSubscribe = ref(false);

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
    
</script>