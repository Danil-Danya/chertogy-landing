import { defineStore } from "pinia";
import { getNotificationById, getNotifications } from "../api/notifications";

const normalizeNotifications = (notifications) => {
    if (Array.isArray(notifications)) {
        return { rows: notifications };
    }

    if (notifications && Array.isArray(notifications.rows)) {
        return notifications;
    }

    return {
        ...(notifications && typeof notifications === 'object' ? notifications : {}),
        rows: []
    };
};

export const useNotificationsStore = defineStore('notifications', {
    state: () => ({
        notifications: {
            rows: []
        },
        notification: null
    }),

    getters: {
        unreadNotifications: (state) => normalizeNotifications(state.notifications).rows.filter(
            (notification) => notification.users?.[0]?.isReadNotification?.isRead === false
        ),
        readNotifications: (state) => normalizeNotifications(state.notifications).rows.filter(
            (notification) => notification.users?.[0]?.isReadNotification?.isRead === true
        ),
        allNotifications: (state) => state.notifications
    },

    actions: {
        async fetchNotifications () {
            this.notifications = normalizeNotifications(await getNotifications());
        },

        async fetchOneNotification (id) {
            this.notification = await getNotificationById(id);
        }
    }
});
