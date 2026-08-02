import convertKeysToCamelCase from '~/utils/convertKeysToCamelCase.js';

const API_BASE_URL = 'https://api.xn----dtbbbhdau6cfpgt1e.xn--p1ai/server-api';
const PUBLIC_EVENTS_LIMIT = 100;
const PUBLIC_EVENTS_MAX_PAGES = 10;
const LIST_REQUEST_TIMEOUT_MS = 6000;
const EVENT_REQUEST_TIMEOUT_MS = 8000;
const CACHE_TTL_MS = 1000 * 60 * 30;

const getCacheKey = (slug) => `public-event:${slug}`;

const findEventBySlug = (payload, slug) => {
    const rows = Array.isArray(payload?.rows) ? payload.rows : [];

    return rows.find((event) => event?.slug === slug) ?? null;
};

const fetchEventListPage = async (page) => {
    return $fetch(`${API_BASE_URL}/events`, {
        method: 'POST',
        body: {
            orderingType: 'DESC',
            ordering: 'start_time',
            page,
            limit: PUBLIC_EVENTS_LIMIT,
            lasted: false,
            show_meetings: true
        },
        timeout: LIST_REQUEST_TIMEOUT_MS
    });
};

const fetchEventFromList = async (slug) => {
    const firstPage = await fetchEventListPage(1);
    const firstMatch = findEventBySlug(firstPage, slug);

    if (firstMatch) {
        return firstMatch;
    }

    const totalPagesRaw = Number(firstPage?.total_pages ?? 1);
    const totalPages = Math.min(
        Number.isFinite(totalPagesRaw) && totalPagesRaw > 0 ? totalPagesRaw : 1,
        PUBLIC_EVENTS_MAX_PAGES
    );

    for (let page = 2; page <= totalPages; page += 1) {
        const nextPage = await fetchEventListPage(page);
        const nextMatch = findEventBySlug(nextPage, slug);

        if (nextMatch) {
            return nextMatch;
        }
    }

    return null;
};

const fetchEventBySlug = async (slug) => {
    return $fetch(`${API_BASE_URL}/events/${encodeURIComponent(slug)}`, {
        timeout: EVENT_REQUEST_TIMEOUT_MS
    });
};

const readCachedEvent = async (slug) => {
    const storage = useStorage('cache');
    const cached = await storage.getItem(getCacheKey(slug));

    if (!cached?.event || !cached?.cachedAt) {
        return null;
    }

    return cached;
};

const writeCachedEvent = async (slug, event) => {
    const storage = useStorage('cache');

    await storage.setItem(getCacheKey(slug), {
        cachedAt: Date.now(),
        event
    });
};

const isFreshCache = (cached) => {
    return Date.now() - cached.cachedAt < CACHE_TTL_MS;
};

const normalizeEvent = (event, { stale = false } = {}) => {
    const normalized = convertKeysToCamelCase(event);

    return {
        ...normalized,
        _stale: stale
    };
};

const getStatusCode = (error) => {
    return Number(
        error?.statusCode ??
        error?.response?.status ??
        error?.status ??
        error?.data?.statusCode ??
        0
    );
};

export default defineEventHandler(async (event) => {
    const slug = getRouterParam(event, 'slug');

    if (!slug) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Event slug is required'
        });
    }

    const cached = await readCachedEvent(slug);

    if (cached && isFreshCache(cached)) {
        return normalizeEvent(cached.event, { stale: false });
    }

    try {
        const listEvent = await fetchEventFromList(slug);

        if (listEvent) {
            await writeCachedEvent(slug, listEvent);
            return normalizeEvent(listEvent, { stale: false });
        }
    }
    catch (error) {
        console.error(`Failed to fetch event list for slug "${slug}"`, error);
    }

    try {
        const directEvent = await fetchEventBySlug(slug);

        if (directEvent) {
            await writeCachedEvent(slug, directEvent);
            return normalizeEvent(directEvent, { stale: false });
        }
    }
    catch (error) {
        const statusCode = getStatusCode(error);

        if (statusCode === 404) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Event not found'
            });
        }

        if (cached?.event) {
            return normalizeEvent(cached.event, { stale: true });
        }

        throw createError({
            statusCode: 503,
            statusMessage: 'Event data is temporarily unavailable'
        });
    }

    if (cached?.event) {
        return normalizeEvent(cached.event, { stale: true });
    }

    throw createError({
        statusCode: 404,
        statusMessage: 'Event not found'
    });
});
