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
                        <button type="button" class="comments__filter-button" @click="openCommentModal">Оставить отзыв</button>
                    </div>
                </div>
                <div class="comments__container">
                    <CommentsCard v-for="comment in comments"
                        :player="comment.player"
                        :avatar="comment.avatar"
                        :event="comment.event"
                        :text="comment.text"
                        :date="comment.date"
                        :key="comment.id"
                    />
                    <p class="comments__empty" v-if="!comments.length">Отзывов пока нет</p>
                </div>
            </div>
        </div>
        <Transition name="modal">
            <MasterCommentModal
                :master-name="master.name"
                :master-id="master.id"
                v-if="isCommentModalOpen"
                @close="closeCommentModal"
            />
        </Transition>
    </section>
</template>

<script setup>

    import CommentsCard from '@/components/shared/widgets/CommentsCard.vue';
    import MasterCommentModal from '@/components/shared/modals/MasterCommentModal.vue';

    import FilterNewIcon from '@/components/icons/masters/comments/FilterNew.vue';
    import FilterOldIcon from '@/components/icons/masters/comments/FilterOld.vue';

    import { useMastersStore } from '~/store/useMasters';
    import { useCommentsStore } from '~/store/useComments';

    import getImageUrl from '@/utils/getImageUrl';

    const masterStore = useMastersStore();
    const commentsStore = useCommentsStore();

    const master = computed(() => masterStore.oneMaster);

    const commentsSort = ref('NEW'); // NEW || OLD
    const isCommentModalOpen = ref(false);

    await commentsStore.fetchMasterComments(master.value.id);

    const comments = computed(() => {
        const rows = commentsStore.masterComments?.rows;

        if (!Array.isArray(rows)) {
            return [];
        }

        const formattedComments = rows.map((comment) => ({
            id: comment.id,
            player: comment.author?.profile?.name || comment.author?.login || 'Пользователь',
            avatar: getImageUrl(comment.author?.profile?.avatarPath) || '/images/masters/comments/1.png',
            date: new Date(comment.createdAt).toLocaleDateString('ru-RU'),
            event: comment.event?.title || '',
            text: String(comment.content || '').split(/\r?\n+/).filter(Boolean)
        }));

        return commentsSort.value === 'OLD' ? [...formattedComments].reverse() : formattedComments;
    });

    const toggleCommentsSort = () => {
        commentsSort.value = commentsSort.value === 'NEW' ? 'OLD' : 'NEW';
    };

    const openCommentModal = () => {
        isCommentModalOpen.value = true;
    };

    const closeCommentModal = () => {
        isCommentModalOpen.value = false;
    };

</script>

<style lang="scss" scoped>

</style>
