import api from './api.init.js';

const getProfile = async () => {
    try {
        const response = await api.get('/profile');
        return response;
    } 
    catch (error) {
        console.log(error);
        return null;
    }
};

const getAllUsers = async (params) => {
    try {
        const response = await api.get('/users', {
            params
        });
        return response.data;
    } 
    catch (error) {
        console.log(error);
    }
};

export {
    getProfile,
    getAllUsers
}