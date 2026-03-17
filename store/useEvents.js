import { defineStore } from 'pinia';

import {
    getEvents, 
    getEventsBySlug, 
    getEventsCalendar 
} from '~/api/events';

export const useEventsStore = defineStore('events', {
    state: () => ({
        allEvents: [],
        oneEvent: {},
        calendarEvents: {}
    }),

    actions: {
        async fetchEvents(filter) {
            try {
                const data = await getEvents(filter);
                this.allEvents = data || {};
                
            } 
            catch (error) {
                console.log(error);
            } 
        },

        async fetchEventsCalendar (params) {
            try {
                const data = await getEventsCalendar(params);
                this.calendarEvents = data || [];
            }
            catch (error) {
                console.log(error);
            }
        },

        async fetchOneEvent(slug) {
            try {
                const data = await getEventsBySlug(slug);
                this.oneEvent = data || {};
            } 
            catch (error) {
                console.log(error);
            } 
        }
    }
});
