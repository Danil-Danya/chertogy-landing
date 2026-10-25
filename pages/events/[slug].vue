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
    const IMAGE_EXTENSION_RE = /\.(png|webp|gif|jpe?g)(?=($|[?#]))/i;

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

        return value.trim();
    };

    const encodePathPreservingSlashes = (value) => {
        return String(value)
            .split('/')
            .filter(Boolean)
            .map((segment) => encodeURIComponent(segment))
            .join('/');
    };

    const seoRequest = process.server
        ? await useFetch(
            () => `/api/event-seo/${encodeURIComponent(slug.value)}`,
            {
                key: () => `event-seo-${slug.value}`,
                server: true,
                default: () => null
            }
        )
        : useFetch(
            () => `/api/event-seo/${encodeURIComponent(slug.value)}`,
            {
                key: () => `event-seo-${slug.value}`,
                server: true,
                default: () => null
            }
        );

    const { data: seoData } = seoRequest;

    const hasResolvedSeoTitle = typeof seoData.value?.title === 'string'
        && seoData.value.title.trim().length > 0;

    const resolvedTitle = typeof seoData.value?.title === 'string'
        ? seoData.value.title.trim() || DEFAULT_TITLE
        : DEFAULT_TITLE;
    const resolvedDescription = normalizeDescription(seoData.value?.shortDescription) || DEFAULT_DESCRIPTION;
    const resolvedSiteUrl = siteUrl.value;
    const resolvedDefaultImage = `${resolvedSiteUrl}/images/og/logo-og.jpg`;
    const resolvedCanonicalUrl = slug.value
        ? `${resolvedSiteUrl}/events/${encodeURIComponent(slug.value)}`
        : `${resolvedSiteUrl}/events`;

    const resolvedPreviewPath = normalizePreviewPath(seoData.value?.previewPath);
    const resolvedOgImage = resolvedPreviewPath
        ? `${resolvedSiteUrl}/share-images/${encodePathPreservingSlashes(resolvedPreviewPath.replace(/^\/+/, ''))}`
        : resolvedDefaultImage;

    const resolvedOgImageType = (() => {
        const imageExtension = resolvedOgImage.match(IMAGE_EXTENSION_RE)?.[1]?.toLowerCase();

        if (imageExtension === 'png') {
            return 'image/png';
        }

        if (imageExtension === 'gif') {
            return 'image/gif';
        }

        if (imageExtension === 'webp') {
            return 'image/webp';
        }

        return 'image/jpeg';
    })();

    useServerSeoMeta({
        title: resolvedTitle,
        description: resolvedDescription,
        keywords: 'Чертоги Героев, события, мероприятия, D&D Москва, настольные ролевые игры',
        ogLocale: 'ru_RU',
        ogSiteName: 'Чертоги Героев',
        ogType: 'website',
        ogUrl: resolvedCanonicalUrl,
        ogTitle: resolvedTitle,
        ogDescription: resolvedDescription,
        ogImage: resolvedOgImage,
        ogImageSecureUrl: resolvedOgImage,
        ogImageType: resolvedOgImageType,
        ogImageAlt: resolvedTitle,
        twitterCard: 'summary_large_image',
        twitterTitle: resolvedTitle,
        twitterDescription: resolvedDescription,
        twitterImage: resolvedOgImage
    });

    useHead({
        link: [
            {
                key: 'canonical',
                rel: 'canonical',
                href: resolvedCanonicalUrl,
            }
        ]
    }, {
        tagPriority: 'critical'
    });
</script>
