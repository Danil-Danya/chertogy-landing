import api from "./api.init";

const getEvents = async (filter) => {
    try {
        const response = await api.post('/events', filter);
        return response.data;
    }
    catch (error) {
        console.log(error);
    }
}

const getEventsCalendar = async (params) => {
    try {
        const response = await api.get(`/calendar`, {
            params: {
                type: 'monday',
                ...params
            }
        });
        return response.data;
    }
    catch (error) {
        console.log(error);
    }
}

const getEventsBySlug = async (slug) => {
    try {
        const response = await api.get(`/events/${slug}`);
        return response.data;
    }
    catch (error) {
        console.log(error);
    }
}

const subscribeEvent = async (data) => {
    try {
        const response = await api.post('/subscribe', data);
        return response.data;
    }
    catch (error) {
        console.log(error);
        return false;
    }
}

const updateGame = async (eventId, gameId, data) => {
    try {
        const response = await api.put(`/games/${gameId}/event/${eventId}`, data);
        return response.data;
    }
    catch (error) {
        console.log(error);
        return false;
    }
}

const updateMeeting = async (eventId, data) => {
    try {
        const response = await api.put(`/meetings/${eventId}`, data);
        return response.data;
    }
    catch (error) {
        console.log(error);
        return false;
    }
}

const updateEventStatus = async (id) => {
    try {
        const response = await api.put(`/set-status/${id}`);
        return response.data;
    }
    catch (error) {
        console.log(error);
        return false;
    }
}

const unSubscribeEvent = async (data) => {
    try {
        const response = await api.post('/unsubscribe', data);
        return response.data;
    }
    catch (error) {
        console.log(error);
        return false;
    }
}

const applySubscribe = async (data) => {
    try {
        const response = await api.post('/subscribes/waiting', data);
        return response.data;
    }
    catch (error) {
        console.log(error);
        return false;
    }
}

export {
    getEvents,
    getEventsCalendar,
    getEventsBySlug,
    subscribeEvent,
    updateEventStatus,
    applySubscribe,
    unSubscribeEvent,
    updateGame,
    updateMeeting
}