import api from "./api.init";

const getTagsWithCategories = async (page, limit) => {
    try {
        const response = await api.get('/tags-categories', {
            params: {
                page,
                limit,
                include: true
            }
        });
        return response.data;
    }
    catch (error) {
        console.log(error);
    }
}

const getOneTagById = async (id) => {
    try {
        const response = await api.get(`/tags/${id}`);
        return response.data;
    }
    catch (error) {
        console.log(error);
    }
}

export {
    getTagsWithCategories,
    getOneTagById
}