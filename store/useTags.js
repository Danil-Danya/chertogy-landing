import { defineStore } from 'pinia';
import { getTagsWithCategories, getOneTagById } from '~/api/tags';

export const useTagsStore = defineStore('tags', {
    state: () => ({
        tagsWithCategories: [],
        tags: {},
    }),

    actions: {
        async fetchTagsWithCategories(page = 1, limit = 100) {
            try {
                const data = await getTagsWithCategories(page, limit);
                this.tagsWithCategories = data || [];
            } 
            catch (error) {
                console.log(error);
            } 
        },

        async fetchOneTag(id) {
            try {
                const data = await getOneTagById(id);
                this.tags = data || {};
            } 
            catch (error) {
                console.log(error);
            } 
        }
    }
});
