export default defineEventHandler((event) => {
    const imageBaseUrl = String(process.env.VITE_APP_IMAGE_URL || 'https://api.чертоги-героев.рф/images').replace(/\/+$/, '');
    const path = getRouterParam(event, 'path');

    if (!path) {
        throw createError({ statusCode: 404, statusMessage: 'Image not found' });
    }

    return sendProxy(event, `${imageBaseUrl}/${encodeURI(path).replace(/^\/+/, '')}`);
});
