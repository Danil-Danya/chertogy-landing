import axios from 'axios';

import convertKeysToCamelCase from "@/utils/convertKeysToCamelCase.js";
import convertToSnakeCase  from '@/utils/convertToSnakeCase.js';

const DEFAULT_API_BASE_URL = 'https://test-api.xn----dtbbbhdau6cfpgt1e.xn--p1ai/server-api';
const normalizeBaseUrl = (baseUrl) => String(baseUrl || '').replace(/\/+$/, '');

const api = axios.create({
    baseURL: `${normalizeBaseUrl(import.meta.env.VITE_APP_BASE_URL || DEFAULT_API_BASE_URL)}/`,
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

    if (process.client && localStorage.getItem('accessToken')) {
        request.headers = {
            ...request.headers,
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
    }

    return request;
})

export default api;
