import { defineStore } from 'pinia';
import { getAllNews, getOneNewsBySlug } from '@/api/news.js'; 

export const useNewsStore = defineStore('news', {
    state: () => ({
        allNews: [],
        oneNews: {},
    }),

    actions: {
        async fetchAllNews(page = 1, limit = 10) {
            try {
                const data = await getAllNews(page, limit);
                this.allNews = data || [];
            } 
            catch (error) {
                console.log(error);
            } 
        },

        async fetchOneNews(slug) {
            try {
                const data = await getOneNewsBySlug(slug);
                this.oneNews = data || {};
            } 
            catch (error) {
                console.log(error);
            } 
        }
    }
});
