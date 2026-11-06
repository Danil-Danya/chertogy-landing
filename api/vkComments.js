import api from './api.init.js';

const getMasterVkComments = async (masterId, page, limit) => {
    try {
        const response = await api.get(`/masters/${masterId}/vk-comments`, {
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

const setMasterVkCommentVisibility = async (id, isVisible) => {
    try {
        const response = await api.patch(`/master-vk-comments/${id}/visibility`, { isVisible });
        return response.data;
    }
    catch (error) {
        console.log(error);
        return false;
    }
}

const setMasterVkCommentModeration = async (id, moderated) => {
    try {
        const response = await api.patch(`/master-vk-comments/${id}/moderation`, { moderated });
        return response.data;
    }
    catch (error) {
        console.log(error);
        return false;
    }
}

const deleteMasterVkComment = async (id) => {
    try {
        const response = await api.delete(`/master-vk-comments/${id}`);
        return response.data;
    }
    catch (error) {
        console.log(error);
        return false;
    }
}

export {
    getMasterVkComments,
    setMasterVkCommentVisibility,
    setMasterVkCommentModeration,
    deleteMasterVkComment
}
