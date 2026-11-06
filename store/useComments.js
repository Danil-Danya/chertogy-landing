import { defineStore } from 'pinia';
import {
    createMasterComment,
    deleteMasterComment,
    getMasterComments,
    setMasterCommentModeration,
    setMasterCommentVisibility,
} from '@/api/comments.js';

export const useCommentsStore = defineStore('comments', {
    state: () => ({
        masterComments: {
            rows: []
        }
    }),

    actions: {
        async fetchMasterComments(masterId, page = 1, limit = 10) {
            try {
                const data = await getMasterComments(masterId, page, limit);
                this.masterComments = data || { rows: [] };
            }
            catch (error) {
                console.log(error);
            }
        },

        async addMasterComment(masterId, data) {
            try {
                return await createMasterComment(masterId, data);
            }
            catch (error) {
                console.log(error);
                return false;
            }
        },

        async updateMasterCommentVisibility(id, isVisible) {
            try {
                const data = await setMasterCommentVisibility(id, isVisible);

                if (!data) {
                    return false;
                }

                const comment = this.masterComments?.rows?.find((item) => item.id === id);
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

        async updateMasterCommentModeration(id, moderated) {
            try {
                const data = await setMasterCommentModeration(id, moderated);

                if (!data) {
                    return false;
                }

                const comment = this.masterComments?.rows?.find((item) => item.id === id);
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

        async removeMasterComment(id) {
            try {
                const data = await deleteMasterComment(id);

                if (!data) {
                    return false;
                }

                const rows = this.masterComments?.rows || [];
                this.masterComments.rows = rows.filter((item) => item.id !== id);
                this.masterComments.totalItems = Math.max(0, Number(this.masterComments.totalItems || 0) - 1);

                return data;
            }
            catch (error) {
                console.log(error);
                return false;
            }
        }
    }
});
