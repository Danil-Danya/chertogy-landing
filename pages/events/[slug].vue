<template>
    <ClientOnly>
        <Event />
    </ClientOnly>
</template>

<script setup>
    import Event from "~/components/pages/events/Event.vue";

    definePageMeta({ layout: "site-layout" });

    const DEFAULT_TITLE = 'Чертоги Героев';
    const DEFAULT_DESCRIPTION = 'Чертоги Героев — аутентичный клуб настольных ролевых игр.';
    const SEO_IMAGE_BASE_URL = 'https://test-api.xn----dtbbbhdau6cfpgt1e.xn--p1ai/images';
    const FILE_EXTENSION_RE = /\.[a-z0-9]+(?=($|[?#]))/i;

    const route = useRoute();
    const requestUrl = useRequestURL();
    const runtimeConfig = useRuntimeConfig();

    const normalizePathSegment = (value) => {
        if (typeof value !== 'string') {
            return '';
        }

        const normalizedValue = value.trim();

        if (!normalizedValue) {
            return '';
        }

        try {
            return decodeURIComponent(normalizedValue);
        }
        catch {
            return normalizedValue;
        }
    };

    const slug = computed(() => {
        const routeSlug = Array.isArray(route.params.slug)
            ? route.params.slug[0]
            : route.params.slug;

        const normalizedRouteSlug = normalizePathSegment(routeSlug);

        if (normalizedRouteSlug) {
            return normalizedRouteSlug;
        }

        const pathParts = String(route.path || '')
            .split('/')
            .filter(Boolean);

        return normalizePathSegment(pathParts[pathParts.length - 1]);
    });

    const siteUrl = computed(() => {
        const configuredSiteUrl = typeof runtimeConfig.public.siteBaseURL === 'string'
            ? runtimeConfig.public.siteBaseURL.trim()
            : '';
        const requestSiteUrl = requestUrl?.host
            ? `${requestUrl.protocol}//${requestUrl.host}`
            : '';

        return String(configuredSiteUrl || requestSiteUrl).replace(/\/+$/, '');
    });

    const normalizeDescription = (value) => {
        if (typeof value !== 'string') {
            return '';
        }

        return value.replace(/\s+/g, ' ').trim();
    };

    const normalizePreviewPath = (value) => {
        if (typeof value !== 'string') {
            return '';
        }

        return value.trim().replace(FILE_EXTENSION_RE, '');
    };

    const { data: seoData } = await useFetch(
        () => `/api/event-seo/${encodeURIComponent(slug.value)}`,
        {
            key: () => `event-seo-${slug.value}`,
            server: true,
            default: () => null
        }
    );

    const title = computed(() => {
        const seoTitle = typeof seoData.value?.title === 'string'
            ? seoData.value.title.trim()
            : '';

        return seoTitle || DEFAULT_TITLE;
    });

    const description = computed(() => {
        const seoDescription = normalizeDescription(seoData.value?.shortDescription);

        return seoDescription || DEFAULT_DESCRIPTION;
    });

    const defaultImage = computed(() => {
        return `${siteUrl.value}/images/og/logo-og.jpg`;
    });

    const canonicalUrl = computed(() => {
        if (!slug.value) {
            return `${siteUrl.value}/events`;
        }

        return `${siteUrl.value}/events/${encodeURIComponent(slug.value)}`;
    });

    const ogImage = computed(() => {
        const previewPath = normalizePreviewPath(seoData.value?.previewPath);

        if (!previewPath) {
            return defaultImage.value;
        }

        return `${SEO_IMAGE_BASE_URL}/${encodeURIComponent(previewPath.replace(/^\/+/, ''))}.jpg`;
    });

    const ogImageType = computed(() => {
        if (/\.png(?=($|[?#]))/i.test(ogImage.value)) {
            return 'image/png';
        }

        return 'image/jpeg';
    });

    useHead(() => ({
        title: title.value,
        meta: [
            {
                name: 'description',
                content: description.value
            },
            {
                name: 'keywords',
                content: 'Чертоги Героев, события, мероприятия, D&D Москва, настольные ролевые игры'
            },
            {
                property: 'og:type',
                content: 'website'
            },
            {
                property: 'og:url',
                content: canonicalUrl.value
            },
            {
                property: 'og:title',
                content: title.value
            },
            {
                property: 'og:image',
                content: ogImage.value
            },
            {
                property: 'og:description',
                content: description.value
            },
        ],
        link: [
            {
                rel: 'canonical',
                href: canonicalUrl.value,
            }
        ]
    }), {
        tagPriority: 'critical'
    });
</script>
