import convertKeysToCamelCase from '~/utils/convertKeysToCamelCase.js';

const API_BASE_URL = 'https://api.xn----dtbbbhdau6cfpgt1e.xn--p1ai/server-api';
const PUBLIC_EVENTS_LIMIT = 100;
const PUBLIC_EVENTS_MAX_PAGES = 10;
const LIST_REQUEST_TIMEOUT_MS = 4000;
const EVENT_REQUEST_TIMEOUT_MS = 2500;

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

    if (totalPages <= 1) {
        return null;
    }

    const pages = Array.from({ length: totalPages - 1 }, (_, index) => index + 2);
    const responses = await Promise.all(pages.map((page) => fetchEventListPage(page)));

    for (const response of responses) {
        const nextMatch = findEventBySlug(response, slug);

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

const normalizeSeoEvent = (event) => {
    const normalized = convertKeysToCamelCase(event);

    return {
        title: normalized?.title ?? null,
        shortDescription: normalized?.shortDescription ?? null,
        previewPath: normalized?.previewPath ?? null
    };
};

const writeCachedEvent = async (slug, event) => {
    const storage = useStorage('cache');

    await storage.setItem(getCacheKey(slug), {
        cachedAt: Date.now(),
        event
    });
};

export default defineEventHandler(async (event) => {
    const slug = getRouterParam(event, 'slug');

    if (!slug) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Event slug is required'
        });
    }

    const storage = useStorage('cache');
    const cached = await storage.getItem(getCacheKey(slug));

    if (cached?.event) {
        return normalizeSeoEvent(cached.event);
    }

    try {
        const listEvent = await fetchEventFromList(slug);

        if (listEvent) {
            await writeCachedEvent(slug, listEvent);
            return normalizeSeoEvent(listEvent);
        }
    }
    catch (error) {
        console.error(`Failed to fetch SEO list data for slug "${slug}"`, error);
    }

    try {
        const directEvent = await fetchEventBySlug(slug);

        if (directEvent) {
            await writeCachedEvent(slug, directEvent);
            return normalizeSeoEvent(directEvent);
        }
    }
    catch (error) {
        throw createError({
            statusCode: 503,
            statusMessage: 'Event SEO data is temporarily unavailable'
        });
    }

    throw createError({
        statusCode: 404,
        statusMessage: 'Event not found'
    });
});