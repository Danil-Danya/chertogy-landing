import { defineStore } from 'pinia';
import { getTagsWithCategories, getOneTagById } from '~/api/tags';

let tagsWithCategoriesRequest = null;

export const useTagsStore = defineStore('tags', {
    state: () => ({
        tagsWithCategories: [],
        tags: {},
    }),

    getters: {
        tagInfoLookup: (state) => {
            const categories = Array.isArray(state.tagsWithCategories?.rows) ? state.tagsWithCategories.rows : [];
            const normalizeLookupKey = (value) => typeof value === 'string' ? value.trim().toLowerCase() : '';
            const getLookupKey = (categoryName, tagName) => {
                const normalizedCategory = normalizeLookupKey(categoryName);
                const normalizedTagName = normalizeLookupKey(tagName);

                if (!normalizedCategory || !normalizedTagName) {
                    return '';
                }

                return `${normalizedCategory}::${normalizedTagName}`;
            };

            return categories.reduce((acc, category) => {
                const categoryName = typeof category?.name === 'string' ? category.name.trim() : '';
                const tags = Array.isArray(category?.tags) ? category.tags : [];

                tags.forEach((tag) => {
                    const shortName = typeof tag?.shortName === 'string' ? tag.shortName.trim() : '';
                    const fullName = typeof tag?.fullName === 'string' ? tag.fullName.trim() : '';
                    const description = typeof tag?.description === 'string' ? tag.description.trim() : '';

                    if (!categoryName || !shortName) {
                        return;
                    }

                    const tagInfo = {
                        category: categoryName,
                        shortName,
                        fullName: fullName || shortName,
                        description
                    };

                    const shortNameKey = getLookupKey(categoryName, shortName);

                    if (shortNameKey) {
                        acc[shortNameKey] = tagInfo;
                    }

                    const fullNameKey = getLookupKey(categoryName, fullName);

                    if (fullNameKey) {
                        acc[fullNameKey] = tagInfo;
                    }
                });

                return acc;
            }, {});
        }
    },

    actions: {
        async fetchTagsWithCategories(page = 1, limit = 100) {
            try {
                const data = await getTagsWithCategories(page, limit);
                this.tagsWithCategories = data || [];
                return this.tagsWithCategories;
            } 
            catch (error) {
                console.log(error);
                return this.tagsWithCategories;
            } 
        },

        async ensureTagsWithCategories(page = 1, limit = 100) {
            const hasRows = Array.isArray(this.tagsWithCategories?.rows) && this.tagsWithCategories.rows.length > 0;

            if (hasRows) {
                return this.tagsWithCategories;
            }

            if (!tagsWithCategoriesRequest) {
                tagsWithCategoriesRequest = this.fetchTagsWithCategories(page, limit)
                    .finally(() => {
                        tagsWithCategoriesRequest = null;
                    });
            }

            await tagsWithCategoriesRequest;

            return this.tagsWithCategories;
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
