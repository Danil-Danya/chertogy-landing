import { defineStore } from 'pinia';
import { getMasterComments, createMasterComment } from '@/api/comments.js';

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
        }
    }
});
