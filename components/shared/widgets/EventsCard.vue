<template>
    <div class="events__card" :class="{
        'finished': isFinished,
        [statusColor]: statusColor
    }">
        <NuxtLink :to="`/events/${slug}`" class="events__card-closed" v-if="isFinished"></NuxtLink>
        <div class="events__card-content">
            <div class="events__card-top">
                <div class="events__card-head">
                    <h2 class="title events__card-title">
                        <NuxtLink :to="`/events/${slug}`">
                            {{ title }}
                        </NuxtLink>
                    </h2>
                </div>
                <div class="events__card-marks">
                    <p class="text events__card-type">{{ eventType }}</p>
                    <!-- <span class="events__card-mark" v-if="authorMark">{{ authorMark }}</span> -->
                </div>
                <div class="events__card-params" v-if="isMobile">
                    <div class="events__card-date">
                        <span class="events__card-icon" :class="statusColor">
                            <CalendarIcon />
                        </span>
                        <h3 class="events__card-date-title">{{ date }}</h3>
                    </div>
                    <div
                        class="events__card-subscribes"
                        v-if="isMobile"
                        :class="statusColor"
                    >
                        <span class="events__card-counter" :class="statusColor">
                            <SubscribeIcon />
                        </span>

                        <p class="events__card-counter" :class="statusColor">
                            {{ subscribers.length }}/{{ maxSubscribes }}
                        </p>
                    </div>
                </div>
            </div>
            <div class="events__card-center">
                <div class="events__card-right">
                    <NuxtLink :to="`/events/${slug}`">
                        <img :src="`https://api.чертоги-героев.рф/images/${image}`" alt="Картинка" class="events__card-img" ref="img">
                    </NuxtLink>
                    <div class="events__card-marks-block">
                        <span class="events__card-price" 
                            :class="{
                                'not-allowed': !isAllowed && !isDraft,
                                'closed': isFinished || isClosed
                            }"
                        >
                            <PriceIcon />
                            {{ price }} ₽
                            <span class="events__card-price-discount" v-if="originalPrice">
                                {{ originalPrice }} ₽
                            </span>
                        </span>
                        <span class="events__card-price sale" v-if="discount" 
                            :class="{
                                'not-allowed': !isAllowed && !isDraft,
                                'closed': isFinished || isClosed
                            }"
                        >
                            - {{ discount }} %
                        </span>
                    </div>
                    <span class="events__card-locked" v-if="isStaff">
                        <LockIcon v-if="registrationType === 'OPEN' && !isFinished" />
                        <UnlockIcon v-else />
                    </span>
                </div>
                <div class="events__card-left">
                    <div class="events__card-tags-container">
                        <ul class="events__card-list">
                            <li class="event__card-li" v-for="tag in tagsList" :key="tag">
                                <button class="events__card-tag"
                                    :class="`events__card-${categoryClassMap[tag.category]}`"
                                >
                                    {{ tag.short_name }}
                                </button>
                            </li>
                        </ul>
                    </div>
                    <div class="events__card-description">
                        <p class="events__card-text text">{{ description }}</p>
                    </div>
                </div>
            </div>
            <div class="events__card-bottom">
                <div class="events__card-date" v-if="!isMobile">
                    <span class="events__card-icon" :class="statusColor">
                        <CalendarIcon />
                    </span>
                    <h3 class="events__card-date-title">{{ date }}</h3>
                </div>
                <div class="events__card-bottom-block">
                    <div class="events__card-buttons">
                        <NuxtLink :to="`/events/${slug}`" class="events__card-link" v-if="!isFinished">Подробнее</NuxtLink>
                        <button class="events__card-button" @click="openCaptchaModal" v-if="!isCreator && !isSubscribed && !isWaiting && !isFinished && registrationType === 'OPEN'">
                            <span class="events__card-icon">
                                <EditIcon />
                            </span>
                            <span>Записаться</span>
                        </button>
                        <button class="events__card-button waiting" @click="openCaptchaModal" v-if="!isCreator && !isSubscribed && isWaiting && !isFinished && registrationType === 'OPEN'">
                            <span class="events__card-icon">
                                <ClockWaitIcon />
                            </span>
                            <span>Ожидать</span>
                        </button>
                        <button class="events__card-button bg-red"  @click="openUnsubscribeModal" v-if="!isCreator && isSubscribed && !isFinished && myStatus !== 'pending' && registrationType === 'OPEN'">
                            <span class="events__card-icon">
                                <UnSubscribeIcon />
                            </span>
                            <span>Отменить запись</span>
                        </button>
                        <button class="events__card-button waiting"  @click="openUnsubscribeModal" v-if="!isCreator && myStatus === 'pending' && !isFinished && registrationType === 'OPEN'">
                            <span>Отменить ожидание</span>
                        </button>
                        <button class="events__card-button closed" v-if="registrationType === 'CLOSED' && !isFinished && !isCreator">
                            <span class="events__card-icon">
                                <ClosedIcon />
                            </span>
                            <span>Запись закрыта</span>
                        </button>
                        <button class="events__card-button finished" @click="subscribeAction" v-if="isFinished">
                            <span>Событие завершено</span>
                        </button>
                        <button class="events__card-button" @click="toUpdate" v-if="isCreator && !isFinished && !isCanceled">
                            <span class="events__card-icon">
                                <EditIcon />
                            </span>
                            Редактировать
                        </button>
                    </div>
                    <div
                        class="events__card-subscribes"
                        v-if="!isMobile"
                        :class="statusColor"
                    >
                        <span class="events__card-counter" :class="statusColor">
                            <SubscribeIcon />
                        </span>

                        <p class="events__card-counter" :class="statusColor">
                            {{ subscribers.length }}/{{ maxSubscribes }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <Transition name="modal">
        <LoginAlertModal
            v-if="isShowLoginModal"
            @close="isShowLoginModal = false"
        />
    </Transition>
    <Transition name="modal">
        <CreatorModal
            v-if="isShowCreatorModal"
            @close="isShowCreatorModal = false"
        />
    </Transition>
    <Transition name="modal">
        <UnsubscribeModal
            v-if="isShowUnsubscribeModal"
            :status="myStatus"
            @confirm="handleUnsubscribeConfirm"
            @cancel="closeUnsubscribeModal"
        />
    </Transition>
    <Transition name="modal">
        <CaptchaModal
            v-if="isShowCaptchaModal"
            @confirm="handleCaptchaConfirm"
            @cancel="closeCaptchaModal"
        />
    </Transition>
    <Transition name="modal">
        <EventRejoinBlockedModal
            v-if="isShowRejoinBlockedModal"
            @close="closeRejoinBlockedModal"
        />
    </Transition>
</template>

<script setup>

    import { useIsMobile } from '@/composables/useIsMobile';
    import { useSubscriptionCaptcha } from '@/composables/useSubscriptionCaptcha';
    import { subscribeEvent, unSubscribeEvent } from '~/api/events';
    import { useUserStore } from '~/store/useUsers';
    import { useEventsStore } from '~/store/useEvents';
    import { useRoute } from 'vue-router';

    import LoginAlertModal from '../modals/LoginAlertModal.vue';
    import CreatorModal from '../modals/CreatorModal.vue';
    import UnsubscribeModal from '../modals/UnsubscribeModal.vue';
    import CaptchaModal from '../modals/CaptchaModal.vue';
    import EventRejoinBlockedModal from '../modals/EventRejoinBlockedModal.vue';
    
    const SubscribeIcon = defineAsyncComponent(() => import('~/components/icons/events/cards/Subscribes.vue'));
    const PriceIcon = defineAsyncComponent(() => import('~/components/icons/events/cards/Price.vue'));
    const CalendarIcon = defineAsyncComponent(() => import('~/components/icons/events/info/Calendar.vue'));
    const UnSubscribeIcon = defineAsyncComponent(() => import('~/components/icons/events/cards/Unsubscribe.vue'));
    const EditIcon = defineAsyncComponent(() => import('~/components/icons/events/cards/Edit.vue'));
    const ClockWaitIcon = defineAsyncComponent(() => import('@/components/icons/events/info/ClockWait.vue'));
    const ClosedIcon = defineAsyncComponent(() => import('@/components/icons/events/info/Closed.vue'));

    const LockIcon = defineAsyncComponent(() => import('@/components/icons/events/info/Lock.vue'));
    const UnlockIcon = defineAsyncComponent(() => import('@/components/icons/events/info/Unlock.vue'));
    

    const isMobile = useIsMobile();
    const userStore = useUserStore();
    const eventStore = useEventsStore();
    const route = useRoute();
    const router = useRouter();
    const {
        shouldRequireCaptcha,
        incrementUnsubscribeAttempts,
        clearUnsubscribeAttempts
    } = useSubscriptionCaptcha();

    const img = ref('img');

    const isShowLoginModal = ref(false);
    const isShowCreatorModal = ref(false);
    const isShowCaptchaModal = ref(false);
    const isShowRejoinBlockedModal = ref(false);

    const closeRejoinBlockedModal = () => {
        isShowRejoinBlockedModal.value = false;
    };

    const categoryClassMap = {
        "Длительность": "duration",
        "Сеттинг": "setting",
        "Система": "system",
        "Подготовка": "preparation",
        "Жанр": "genre",
        "Опыт игрока": "experience"
    };

    const fixImgToSquareByHeight = () => {
        if (isMobile.value) {
            const imgWidth = img.value.clientWidth;
            img.value.style = `height: ${imgWidth}px`;
        }
    }


    const isSubscribed = computed(() => {
        const userId = userStore.profile?.id;

        if (!props.subscribers.length) return false;
        
        return props.subscribers.some(sub => sub.id === userId);
    });

    const toUpdate = () => {
        router.replace({
            path: `/panel/events/update/${props.id}`,
            query: {
                event: `${props.type.toLowerCase()}_session`
            }
        })
    }
    

    const subscribeAction = async ({ resetCaptchaGate = false } = {}) => {
        const userId = userStore.profile?.id;
        const creatorId = props.creator.id;
        const eventId = props.id;

        const params = route.query;

        params.ordering = 'start_time';
        params.ordering_type = 'DESC';
        
        if (!userId) {
            isShowLoginModal.value = true;
            return;
        }

        if (creatorId === userId) {
            isShowCreatorModal.value = true;
            return;
        }

        if (isSubscribed.value) {
            const unSubscribed = await unSubscribeEvent({
                eventId,
                userId
            })

            if (unSubscribed) {
                incrementUnsubscribeAttempts({ eventId, userId });
                await eventStore.fetchEvents(params);
                return true;
            }
        } 
        else {
            const subscribed = await subscribeEvent({
                eventId,
                userId
            })

            if (subscribed?.errorCode === 'EVENT_REJOIN_BLOCKED') {
                isShowRejoinBlockedModal.value = true;
                return false;
            }

            if (subscribed) {
                if (resetCaptchaGate) {
                    clearUnsubscribeAttempts({ eventId, userId });
                }

                await eventStore.fetchEvents(params);
                return true;
            }
        }

        return false;
    };

    const isShowUnsubscribeModal = ref(false);

    const canOpenCaptchaModal = () => {
        const userId = userStore.profile?.id;
        const creatorId = props.creator?.id;

        if (!userId) {
            isShowLoginModal.value = true;
            return false;
        }

        if (creatorId === userId) {
            isShowCreatorModal.value = true;
            return false;
        }

        return true;
    };

    const openCaptchaModal = async () => {
        if (!canOpenCaptchaModal()) {
            return;
        }

        const userId = userStore.profile?.id;
        const eventId = props.id;

        if (!shouldRequireCaptcha({ eventId, userId })) {
            await subscribeAction();
            return;
        }

        isShowCaptchaModal.value = true;
    };

    const closeCaptchaModal = () => {
        isShowCaptchaModal.value = false;
    };
    
    const openUnsubscribeModal = () => {
        isShowUnsubscribeModal.value = true;
    };

    const closeUnsubscribeModal = () => {
        isShowUnsubscribeModal.value = false;
    };

    const handleUnsubscribeConfirm = async () => {
        closeUnsubscribeModal();

        await subscribeAction();
    };

    const handleCaptchaConfirm = async () => {
        closeCaptchaModal();

        await subscribeAction({ resetCaptchaGate: true });
    };

    onMounted(() => {
        fixImgToSquareByHeight();
    })


    const props = defineProps({
        slug: {
            type: String, 
            required: true
        },

        id: {
            type: String, 
            required: true
        },

        title: {
            type: String, 
            required: true
        },

        type: {
            type: String, 
            required: true
        },

        eventType: {
            type: String, 
            required: true
        },

        authorMark: {
            type: String, 
            required: true
        },

        image: {
            type: String, 
            required: true
        },

        price: {
            type: String, 
            required: true
        },

        tagsList: {
            type: Array, 
            required: true
        },

        description: {
            type: String,
            required: true
        },

        date: {
            type: String,
            required: true
        },

        subscribers: {
            type: Array,
            required: true
        },

        subscribes: {
            type: Number,
            required: true
        },
        
        maxSubscribes: {
            type: Number,
            required: true
        },
        
        subscribeStatus: {
            type: String,
            required: false
        },

        endTime: {
            type: String,
            required: false
        },

        isAllowed: {
            type: String,
            required: false
        },

        discount: {
            type: Number,
            required: false
        },

        originalPrice: {
            type: Number,
            required: false
        },

        creator: {
            type: Object,
            required: false
        },

        isFinished: {
            type: Boolean,
            required: false
        },

        registrationType: {
            type: String,
            required: true
        }
    })

    const isWaiting = computed(() => {
        return props.subscribers.length >= props.maxSubscribes;
    });

    const mySubscription = computed(() => {
        return props.subscribers.find((subscriber) => {
            return subscriber.id === userStore.profile?.id;
        }) ?? null;
    });

    const myStatus = computed(() => {
        return mySubscription.value?.eventSubscriptions?.status ?? null;
    });

    const statusColor = computed(() => {
        if (myStatus.value === 'pending') {
            return 'yellow';
        }

        if (isSubscribed.value) {
            return 'green';
        }

        return 'purple';
    });

    const toggleCreatorModal = () => {
        isShowCreatorModal.value = !isShowCreatorModal
    }

    const isClosed = computed(() => {
        return props.registrationType === 'CLOSED';
    });


    const isCreator = computed(() => {
        const userId = userStore.profile?.id;
        const creatorId = props.creator?.id;

        if (!userId || !creatorId) {
            return false;
        }

        return userId === creatorId;
    });

    const isStaff = computed(() => {
        const profile = userStore.profile;

        if (!profile) {
            return false;
        }

        const isCreator = profile.id === props.creator?.id;
        const isAdmin = profile.role === 'ADMIN';

        return isCreator || isAdmin;
    });

    onMounted(() => {
        fixImgToSquareByHeight()
    })

</script>
