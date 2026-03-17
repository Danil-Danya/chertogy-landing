import { defineStore } from "pinia";
import { getAllUsers, getProfile } from "@/api/users";

export const useUserStore = defineStore('users', {
    state: () => ({
        profile: null,
        users: []
    }),

    actions: {
        async fetchProfile () {
            const profile = await getProfile();
            this.profile = profile?.data;
        },

        async fetchUsers (params) {
            const users = await getAllUsers(params);
            this.users = users.rows;
        }
    }
})