import { defineStore } from 'pinia';
import {
    deleteMasterVkComment,
    getMasterVkComments,
    setMasterVkCommentModeration,
    setMasterVkCommentVisibility,
} from '@/api/vkComments.js';

export const useVkCommentsStore = defineStore('vkComments', {
    state: () => ({
        masterVkComments: {
            rows: []
        }
    }),

    actions: {
        async fetchMasterVkComments(masterId, page = 1, limit = 10) {
            try {
                const data = await getMasterVkComments(masterId, page, limit);
                this.masterVkComments = data || { rows: [] };
            }
            catch (error) {
                console.log(error);
            }
        },

        async updateMasterVkCommentVisibility(id, isVisible) {
            try {
                const data = await setMasterVkCommentVisibility(id, isVisible);

                if (!data) {
                    return false;
                }

                const comment = this.masterVkComments?.rows?.find((item) => item.id === id);
                if (comment) {
                    comment.isVisible = data.isVisible;
                }

                return data;
            }
            catch (error) {
                console.log(error);
                return false;
            }
        },

        async updateMasterVkCommentModeration(id, moderated) {
            try {
                const data = await setMasterVkCommentModeration(id, moderated);

                if (!data) {
                    return false;
                }

                const comment = this.masterVkComments?.rows?.find((item) => item.id === id);
                if (comment) {
                    comment.moderated = data.moderated;
                }

                return data;
            }
            catch (error) {
                console.log(error);
                return false;
            }
        },

        async removeMasterVkComment(id) {
            try {
                const data = await deleteMasterVkComment(id);

                if (!data) {
                    return false;
                }

                const rows = this.masterVkComments?.rows || [];
                this.masterVkComments.rows = rows.filter((item) => item.id !== id);
                this.masterVkComments.totalItems = Math.max(0, Number(this.masterVkComments.totalItems || 0) - 1);

                return data;
            }
            catch (error) {
                console.log(error);
                return false;
            }
        }
    }
});
