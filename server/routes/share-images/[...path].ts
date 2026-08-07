export default defineEventHandler((event) => {
    const imageBaseUrl = String(process.env.VITE_APP_IMAGE_URL || 'https://test-api.xn----dtbbbhdau6cfpgt1e.xn--p1ai/images').replace(/\/+$/, '');
    const path = getRouterParam(event, 'path');

    if (!path) {
        throw createError({ statusCode: 404, statusMessage: 'Image not found' });
    }

    return sendProxy(event, `${imageBaseUrl}/${encodeURI(path).replace(/^\/+/, '')}`);
});
