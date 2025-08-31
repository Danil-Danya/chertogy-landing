import api from './api.init.js';

const getAllNews = async (page, limit) => {
    try {
        const response = await api.get('/news', {
            params: {
                page: page || 1,
                limit: limit || 10
            }
        })

        return response.data;
    }
    catch (error) {
        console.log(error);
    }
}

const getOneNewsBySlug = async (slug) => {
    try {
        const response = await api.get(`/news/slug/${slug}`);
        return response.data;
    }
    catch (error) {
        console.log(error);
    }
}

export {
    getAllNews,
    getOneNewsBySlug
}