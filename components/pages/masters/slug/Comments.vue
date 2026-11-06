<template>
    <section class="comments">
        <div class="container">
            <div class="comments__content">
                <div class="comments__filter">
                    <div class="comments__filter-left">
                        <h2 class="comments__filter-title">Отзывы</h2>
                        <div class="comments__filter-switch" @click="toggleCommentsSort">
                            <div class="comments__filter-switch-option" v-if="commentsSort === 'NEW'">
                                <span class="comment__filter-switch-icon">
                                    <FilterNewIcon />
                                </span>
                                <p class="comment__filter-switch-text">Сначала показывать новые</p>
                            </div>
                            <div class="comments__filter-switch-option" v-else>
                                <span class="comment__filter-switch-icon">
                                    <FilterOldIcon />
                                </span>
                                <p class="comment__filter-switch-text">Сначала показывать старые</p>
                            </div>
                        </div>
                    </div>
                    <div class="comments__filter-right">
                        <button
                            type="button"
                            class="comments__filter-button"
                            :title="commentButtonHint"
                            :disabled="isOwnMaster || (!canLeaveComment && !isAuthenticationRequired)"
                            @click="openCommentModal"
                        >
                            {{ commentButtonText }}
                        </button>
                    </div>
                </div>
                <div class="comments__container">
                    <CommentsCard v-for="comment in comments"
                        :source="comment.source"
                        :user-id="comment.userId"
                        :profile-url="comment.profileUrl"
                        :player="comment.player"
                        :avatar="comment.avatar"
                        :event="comment.event"
                        :text="comment.text"
                        :date="comment.date"
                        :is-visible="comment.isVisible"
                        :is-admin="isAdmin"
                        :moderated="comment.moderated"
                        :can-moderate="comment.canModerate"
                        :is-updating="updatingCommentId === comment.id"
                        :key="`${comment.source}-${comment.id}-${comment.userId || comment.profileUrl}`"
                        @approve="approveComment(comment)"
                        @reject="rejectComment(comment)"
                        @toggle-visibility="toggleCommentVisibility(comment)"
                        @delete="openDeleteConfirmation(comment)"
                    />
                    <p class="comments__empty" v-if="isCommentsLoading">Загружаем отзывы...</p>
                    <p class="comments__empty" v-else-if="!comments.length">Отзывов пока нет</p>
                </div>
            </div>
        </div>
        <Transition name="modal">
            <MasterCommentModal
                :master-name="master.name"
                :master-id="master.id"
                :events="eligibleEvents"
                v-if="isCommentModalOpen"
                @close="closeCommentModal"
            />
        </Transition>
        <Transition name="modal">
            <LoginAlertModal
                title="Пожалуйста, авторизуйтесь."
                description="К сожалению, Вы не можете оставлять отзыв пока не авторизуетесь. Спасибо за понимание!"
                v-if="isLoginModalOpen"
                @close="isLoginModalOpen = false"
            />
        </Transition>
        <Teleport to="body">
            <Transition name="modal" appear>
                <DeleteConfirmation
                    title="Удалить отзыв?"
                    description="Отзыв будет удалён безвозвратно. Это действие нельзя отменить."
                    :is-loading="isDeleting"
                    v-if="commentToDelete"
                    @confirm="deleteComment"
                    @cancel="closeDeleteConfirmation"
                />
            </Transition>
        </Teleport>
    </section>
</template>

<script setup>

    import CommentsCard from '@/components/shared/widgets/CommentsCard.vue';
    import MasterCommentModal from '@/components/shared/modals/MasterCommentModal.vue';
    import LoginAlertModal from '@/components/shared/modals/LoginAlertModal.vue';
    import DeleteConfirmation from '@/components/sections/ui/DeleteConfirmation.vue';

    import FilterNewIcon from '@/components/icons/masters/comments/FilterNew.vue';
    import FilterOldIcon from '@/components/icons/masters/comments/FilterOld.vue';

    import { useMastersStore } from '~/store/useMasters';
    import { useCommentsStore } from '~/store/useComments';
    import { useVkCommentsStore } from '~/store/useVkComments';
    import { useUserStore } from '~/store/useUsers';

    import getImageUrl from '@/utils/getImageUrl';

    const masterStore = useMastersStore();
    const commentsStore = useCommentsStore();
    const vkCommentsStore = useVkCommentsStore();
    const userStore = useUserStore();

    const master = computed(() => masterStore.oneMaster);

    const commentsSort = ref('NEW'); // NEW || OLD
    const isCommentModalOpen = ref(false);
    const isLoginModalOpen = ref(false);
    const updatingCommentId = ref(null);
    const commentToDelete = ref(null);
    const isDeleting = ref(false);
    const isCommentsLoading = ref(true);

    commentsStore.$reset();
    vkCommentsStore.$reset();

    const comments = computed(() => {
        const rows = Array.isArray(commentsStore.masterComments?.rows)
            ? commentsStore.masterComments.rows
            : [];
        const vkRows = Array.isArray(vkCommentsStore.masterVkComments?.rows)
            ? vkCommentsStore.masterVkComments.rows
            : [];
        const canModerate = isAdmin.value
            && commentsStore.masterComments?.commentReadAccess?.canModerate === true;

        const formattedComments = rows.map((comment) => ({
            id: comment.id,
            source: 'SITE',
            userId: comment.author?.id || comment.authorId || '',
            profileUrl: '',
            player: comment.author?.profile?.name || comment.author?.login || 'Пользователь',
            avatar: getImageUrl(comment.author?.profile?.avatarPath) || '/images/masters/comments/1.png',
            date: new Date(comment.createdAt).toLocaleDateString('ru-RU'),
            timestamp: new Date(comment.createdAt).getTime() || 0,
            event: comment.event?.title || '',
            text: String(comment.content || '').split(/\r?\n+/).filter(Boolean),
            isVisible: comment.isVisible !== false,
            moderated: comment.moderated !== false,
            canModerate
        }));

        const formattedVkComments = vkRows.map((comment) => ({
            id: comment.id,
            source: 'VK',
            userId: '',
            profileUrl: comment.vkMasterLink || '',
            player: `${comment.vkFirstName || ''} ${comment.vkLastName || ''}`.trim() || 'Пользователь VK',
            avatar: '/images/masters/comments/vk-dog.png',
            date: new Date(comment.createdAt).toLocaleDateString('ru-RU'),
            timestamp: new Date(comment.createdAt).getTime() || 0,
            event: comment.event?.title || '',
            text: String(comment.content || '').split(/\r?\n+/).filter(Boolean),
            isVisible: comment.isVisible !== false,
            moderated: comment.moderated !== false,
            canModerate: isAdmin.value
        }));

        return [...formattedComments, ...formattedVkComments].sort((a, b) => {
            return commentsSort.value === 'OLD'
                ? a.timestamp - b.timestamp
                : b.timestamp - a.timestamp;
        });
    });

    const isAdmin = computed(() => {
        return userStore.profile?.role === 'ADMIN' || userStore.profile?.role === 'SUPER_ADMIN';
    });

    const commentAccess = computed(() => {
        return commentsStore.masterComments?.commentAccess || {};
    });

    const masterUserId = computed(() => {
        return master.value.userId || master.value.user?.id || '';
    });

    const isOwnMaster = computed(() => {
        return Boolean(masterUserId.value)
            && masterUserId.value === userStore.profile?.id;
    });

    const canLeaveComment = computed(() => {
        return commentAccess.value.canComment === true
            || commentAccess.value.reason === 'NO_STARTED_MASTER_EVENTS';
    });

    const isAuthenticationRequired = computed(() => {
        return commentAccess.value.reason === 'AUTH_REQUIRED';
    });

    const eligibleEvents = computed(() => {
        return Array.isArray(commentAccess.value.eligibleEvents)
            ? commentAccess.value.eligibleEvents
            : [];
    });

    const commentButtonText = computed(() => {
        if (isOwnMaster.value) {
            return 'Нельзя оставить отзыв самому себе';
        }

        switch (commentAccess.value.reason) {
            case 'COMMENT_ALREADY_EXISTS':
                return 'Отзыв уже оставлен';
            default:
                return 'Оставить отзыв';
        }
    });

    const commentButtonHint = computed(() => {
        if (isOwnMaster.value) {
            return 'Мастер не может оставить отзыв самому себе';
        }

        switch (commentAccess.value.reason) {
            case 'COMMENT_ALREADY_EXISTS':
                return 'Каждый пользователь может оставить мастеру только один отзыв';
            default:
                return '';
        }
    });

    const toggleCommentsSort = () => {
        commentsSort.value = commentsSort.value === 'NEW' ? 'OLD' : 'NEW';
    };

    const openCommentModal = () => {
        if (isOwnMaster.value) {
            return;
        }

        if (isAuthenticationRequired.value) {
            isLoginModalOpen.value = true;
            return;
        }

        if (!canLeaveComment.value) {
            return;
        }

        isCommentModalOpen.value = true;
    };

    const closeCommentModal = () => {
        isCommentModalOpen.value = false;
    };

    const toggleCommentVisibility = async (comment) => {
        if (!isAdmin.value || updatingCommentId.value) {
            return;
        }

        updatingCommentId.value = comment.id;
        if (comment.source === 'VK') {
            await vkCommentsStore.updateMasterVkCommentVisibility(comment.id, !comment.isVisible);
        }
        else {
            await commentsStore.updateMasterCommentVisibility(comment.id, !comment.isVisible);
        }
        updatingCommentId.value = null;
    };

    const approveComment = async (comment) => {
        if (!comment.canModerate || updatingCommentId.value) {
            return;
        }

        updatingCommentId.value = comment.id;
        if (comment.source === 'VK') {
            await vkCommentsStore.updateMasterVkCommentModeration(comment.id, true);
        }
        else {
            await commentsStore.updateMasterCommentModeration(comment.id, true);
        }
        updatingCommentId.value = null;
    };

    const rejectComment = async (comment) => {
        if (!comment.canModerate || updatingCommentId.value) {
            return;
        }

        updatingCommentId.value = comment.id;

        const visibilityResult = comment.source === 'VK'
            ? await vkCommentsStore.updateMasterVkCommentVisibility(comment.id, false)
            : await commentsStore.updateMasterCommentVisibility(comment.id, false);

        if (visibilityResult) {
            if (comment.source === 'VK') {
                await vkCommentsStore.updateMasterVkCommentModeration(comment.id, true);
            }
            else {
                await commentsStore.updateMasterCommentModeration(comment.id, true);
            }
        }

        updatingCommentId.value = null;
    };

    const openDeleteConfirmation = (comment) => {
        if (!isAdmin.value) {
            return;
        }

        commentToDelete.value = comment;
    };

    const closeDeleteConfirmation = () => {
        if (!isDeleting.value) {
            commentToDelete.value = null;
        }
    };

    const deleteComment = async () => {
        if (!commentToDelete.value || isDeleting.value) {
            return;
        }

        isDeleting.value = true;
        const isDeleted = commentToDelete.value.source === 'VK'
            ? await vkCommentsStore.removeMasterVkComment(commentToDelete.value.id)
            : await commentsStore.removeMasterComment(commentToDelete.value.id);
        isDeleting.value = false;

        if (isDeleted) {
            commentToDelete.value = null;
        }
    };

    onMounted(async () => {
        try {
            const requests = [
                commentsStore.fetchMasterComments(master.value.id),
                vkCommentsStore.fetchMasterVkComments(master.value.id)
            ];

            if (localStorage.getItem('accessToken') && !userStore.profile) {
                requests.push(userStore.fetchProfile());
            }

            await Promise.all(requests);
        }
        finally {
            isCommentsLoading.value = false;
        }
    });

</script>

<style lang="scss" scoped>

</style>
