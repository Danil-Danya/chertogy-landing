import api from './api.init.js';

const getAllMasters = async (page, limit, settings = [], includeHidden = false) => {
    try {
        const response = await api.get(includeHidden ? '/masters/admin' : '/masters', {
            params: {
                page: page || 1,
                limit: limit || 10,
                ordering: 'createdAt',
                orderingType: 'DESC',
                settings: settings.length ? settings : undefined
            }
        })

        return response.data;
    }
    catch (error) {
        console.log(error);
    }
}

const getOneMasterBySlug = async (slug) => {
    try {
        const response = await api.get(`/masters/slug/${slug}`);
        return response.data;
    }
    catch (error) {
        console.log(error);
    }
}

const updateMaster = async (id, data) => {
    try {
        const response = await api.patch(`/masters/${id}`, data);
        return response.data;
    }
    catch (error) {
        console.log(error);
        return false;
    }
}

export {
    getAllMasters,
    getOneMasterBySlug,
    updateMaster
}
