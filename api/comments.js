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
        return {
            error: true,
            message: error.response?.data?.message || 'Не удалось отправить отзыв'
        };
    }
}

const setMasterCommentVisibility = async (id, isVisible) => {
    try {
        const response = await api.patch(`/master-comments/${id}/visibility`, { isVisible });
        return response.data;
    }
    catch (error) {
        console.log(error);
        return false;
    }
}

const setMasterCommentModeration = async (id, moderated) => {
    try {
        const response = await api.patch(`/master-comments/${id}/moderation`, { moderated });
        return response.data;
    }
    catch (error) {
        console.log(error);
        return false;
    }
}

const deleteMasterComment = async (id) => {
    try {
        const response = await api.delete(`/master-comments/${id}`);
        return response.data;
    }
    catch (error) {
        console.log(error);
        return false;
    }
}

export {
    getMasterComments,
    createMasterComment,
    setMasterCommentVisibility,
    setMasterCommentModeration,
    deleteMasterComment
}
