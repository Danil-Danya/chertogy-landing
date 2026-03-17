import { defineStore } from "pinia";
import { getNotificationById, getNotifications } from "../api/notifications";

export const useNotificationsStore = defineStore('notifications', {
    state: () => ({
        notifications: [],
        notification: null
    }),

    getters: {
        unreadNotifications: (state) => {
            console.log(state.notifications);
            
            return state.notifications?.rows?.filter(
                n => n.users[0]?.isReadNotification?.isRead === false
            );
        },
        readNotifications: (state) => {
            return state.notifications?.rows?.filter(
                n => n.users[0]?.isReadNotification?.isRead === true
            );
        },
        allNotifications: (state) => state.notifications
    },

    actions: {
        async fetchNotifications () {
            this.notifications = await getNotifications();
        },

        async fetchOneNotification (id) {
            this.notification = await getNotificationById(id);
        }
    }
});
