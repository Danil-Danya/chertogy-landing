import axios from 'axios';

import convertKeysToCamelCase from "@/utils/convertKeysToCamelCase.js";
import convertToSnakeCase  from '@/utils/convertToSnakeCase.js';

const api = axios.create({
    baseURL: 'https://api.чертоги-героев.рф/server-api/',
    timeout: 5000
});

api.interceptors.response.use((response) => {
    if (response.data) {
        response.data = convertKeysToCamelCase(response.data);
    }
    
    return response;
});

api.interceptors.request.use((request) => {
    if (request.data) {
        request.data = convertToSnakeCase(request.data);
    }

    if (localStorage.getItem('accessToken')) {
        request.headers = {
            ...request.headers,
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
    }

    return request;
})

export default api;