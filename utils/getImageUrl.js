const DEFAULT_IMAGE_BASE_URL = 'https://test-api.xn----dtbbbhdau6cfpgt1e.xn--p1ai/images';
const ABSOLUTE_URL_RE = /^(?:[a-z]+:)?\/\//i;

const normalizeBaseUrl = (baseUrl) => {
    return String(baseUrl || '').replace(/\/+$/, '');
};

const getImageUrl = (path) => {
    if (typeof path !== 'string') {
        return null;
    }

    const normalizedPath = path.trim();

    if (!normalizedPath) {
        return null;
    }

    if (ABSOLUTE_URL_RE.test(normalizedPath) || normalizedPath.startsWith('data:')) {
        return normalizedPath;
    }

    const imageBaseUrl = normalizeBaseUrl(import.meta.env.VITE_APP_IMAGE_URL || DEFAULT_IMAGE_BASE_URL);

    return `${imageBaseUrl}/${normalizedPath.replace(/^\/+/, '')}`;
};

export default getImageUrl;
