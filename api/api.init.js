import axios from 'axios';
import convertKeysToCamelCase from "@/utils/convertKeysToCamelCase.js";

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

export default api;