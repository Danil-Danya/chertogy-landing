import axios from 'axios';

import convertKeysToCamelCase from "@/utils/convertKeysToCamelCase.js";
import convertToSnakeCase  from '@/utils/convertToSnakeCase.js';

const DEFAULT_API_BASE_URL = 'https://api.xn----dtbbbhdau6cfpgt1e.xn--p1ai/server-api';
const normalizeBaseUrl = (baseUrl) => String(baseUrl || '').replace(/\/+$/, '');

const api = axios.create({
    baseURL: `${normalizeBaseUrl(import.meta.env.VITE_APP_BASE_URL || DEFAULT_API_BASE_URL)}/`,
    timeout: 5000
});

const isBinaryData = (data) => {
    const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;
    const isBlob = typeof Blob !== 'undefined' && data instanceof Blob;
    const isArrayBuffer = typeof ArrayBuffer !== 'undefined'
        && (data instanceof ArrayBuffer || ArrayBuffer.isView(data));

    return isFormData || isBlob || isArrayBuffer;
};

api.interceptors.response.use((response) => {
    if (response.data) {
        response.data = convertKeysToCamelCase(response.data);
    }
    
    return response;
});

api.interceptors.request.use((request) => {
    if (request.data && !isBinaryData(request.data)) {
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
