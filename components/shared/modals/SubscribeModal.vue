<template>
    <div class="modal">
        <div class="modal__content">
            <h2 class="modal__title title">
                Записать пользователей
            </h2>

            <input
                type="text"
                class="modal__input input"
                placeholder="Поиск"
                v-model="params.search"
            >

            <div class="modal__filters">
                <div class="modal__filter">
                    <input
                        type="checkbox"
                        id="only-skeletons"
                        class="modal__filter-checkbox"
                        v-model="params.with_blank"
                    >
                    <label for="only-skeletons" class="modal__filter-label">
                        Показать только болванки
                    </label>
                </div>
            </div>

            <div class="modal__users">
                <div class="modal__users-item" v-for="user in filteredUsers" :key="user.id">
                    <div class="modal__filter-user">
                        <input
                            type="checkbox"
                            :id="`user-${user.id}`"
                            class="modal__filter-checkbox"
                            v-model="selectedUsers"
                            :value="user.id"
                        />

                        <label
                            :for="`user-${user.id}`"
                            class="modal__filter-label"
                        ></label>
                    </div>
                    <img :src="getImageUrl(user?.profile?.avatarPath)" alt="avatar" class="modal__users-avatar">
                    <p class="modal__user-text text">{{ user.login }}</p>
                </div>
            </div>

            <div class="modal__actions">
                <button class="btn btn-red" @click="onConfirm">
                    Записать
                </button>

                <button class="btn btn-gray" @click="onCancel">
                    Отмена
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>

    import { ref, watch, reactive } from 'vue';

    import { useUserStore } from '~/store/useUsers';
    import getImageUrl from '@/utils/getImageUrl.js';

    const emit = defineEmits([
        'confirm',
        'cancel',
    ]);

    const showOnlyUsers = ref(false);
    const showOnlySkeletons = ref(false);
    const selectedUsers = ref([]);

    const userStore = useUserStore();

    const params = reactive({
        page: 1,
        limit: 100,
        with_blank: false,
        ordering: 'login',
        orderingType: 'ASC',
        searchField: 'login',
        search: ''
    });

    await userStore.fetchUsers(params);

    const props = defineProps({
        includedUsers: {
            type: Array,
            required: true
        }
    })
    

    watch(() => params.with_blank, async (value) => {
        if (value) {
            await userStore.fetchUsers({
                ...params,
                with_blank: true,
                where: 'BLANK',
                whereField: 'role'
            });
        }
        else {
            await userStore.fetchUsers({
                ...params,
                with_blank: false,
                where: null,
                whereField: null
            });
        }
    });


    watch(() => params.search,
        async (value) => {
            await userStore.fetchUsers({
                ...params,
                search: value || null,
            });
        }
    );

    watch(showOnlyUsers, (value) => {
        if (value) {
            showOnlySkeletons.value = false;
        }
    });

    watch(showOnlySkeletons, (value) => {
        if (value) {
            showOnlyUsers.value = false;
        }
    });

    watch(() => props.includedUsers, () => {
        const excluded = new Set(props.includedUsers);

        selectedUsers.value = selectedUsers.value.filter((id) => {
            return !excluded.has(id);
        });
    }, { immediate: true });

    const excludedIds = computed(() => {
        return new Set(props.includedUsers);
    });

    const filteredUsers = computed(() => {
        const users = userStore.users ?? [];
        const selectedIds = new Set(selectedUsers.value);

        return users
            .filter((user) => {
                return !excludedIds.value.has(user.id);
            })
            .sort((firstUser, secondUser) => {
                const firstSelected = selectedIds.has(firstUser.id);
                const secondSelected = selectedIds.has(secondUser.id);

                if (firstSelected === secondSelected) {
                    return 0;
                }

                return firstSelected ? -1 : 1;
            });
    });

    

    const onConfirm = () => {
        emit('confirm', selectedUsers.value);
    };

    const onCancel = () => {
        emit('cancel');
    };

</script>

