import api from './api.init.js';

const getMasterComments = async (masterId, page, limit) => {
    try {
        const response = await api.get(`/masters/${masterId}/comments`, {
            params: {
                page: page || 1,
                limit: limit || 10
            }
        });

        return response.data;
    }
    catch (error) {
        console.log(error);
    }
}

const createMasterComment = async (masterId, data) => {
    try {
        const response = await api.post(`/masters/${masterId}/comments`, data);
        return response.data;
    }
    catch (error) {
        console.log(error);
        return false;
    }
}

export {
    getMasterComments,
    createMasterComment
}
