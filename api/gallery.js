import api from './api.init.js';

const getGalleryImages = async () => {
    try {
        const response = await api.get('/gallery', {
            params: {
                page: 1,
                limit: 100,
                ordering: 'weight',
                orderingType: 'ASC'
            }
        });

        return response.data;
    }
    catch (error) {
        console.log(error);
    }
}

const createGalleryImage = async (image, crop, weight) => {
    try {
        const formData = new FormData();

        formData.append('image', image);
        formData.append('crop_x', crop.x);
        formData.append('crop_y', crop.y);
        formData.append('center_width', crop.size);
        formData.append('center_height', crop.size);
        formData.append('weight', weight);

        const response = await api.post('/gallery', formData, {
            timeout: 30000
        });

        return response.data;
    }
    catch (error) {
        console.log(error);
        return false;
    }
}

const updateGalleryImage = async (id, crop, weight, image = null) => {
    try {
        const formData = new FormData();

        formData.append('crop_x', crop.x);
        formData.append('crop_y', crop.y);
        formData.append('center_width', crop.size);
        formData.append('center_height', crop.size);
        formData.append('weight', weight);

        if (image) {
            formData.append('image', image);
        }

        const response = await api.patch(`/gallery/${id}/crop`, formData, {
            timeout: 30000
        });

        return response.data;
    }
    catch (error) {
        console.log(error);
        return false;
    }
}

const deleteGalleryImage = async (id) => {
    try {
        const response = await api.delete(`/gallery/${id}`);
        return response.data;
    }
    catch (error) {
        console.log(error);
        return false;
    }
}

const swapGalleryImageWeight = async (firstId, secondId) => {
    try {
        const response = await api.patch('/gallery/swap-weight', {
            firstId,
            secondId
        });

        return response.data;
    }
    catch (error) {
        console.log(error);
        return false;
    }
}

export {
    getGalleryImages,
    createGalleryImage,
    updateGalleryImage,
    deleteGalleryImage,
    swapGalleryImageWeight
}
