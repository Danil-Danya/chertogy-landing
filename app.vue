<template>
    <div>
        <PageLoader />;
        <Preloader v-show="loading" />;
        <NuxtLayout>
            <NuxtPage />;
        </NuxtLayout>;
    </div>;
</template>

<script setup>

    import Preloader from '@/components/shared/instruments/Preloader.vue';
    import PageLoader from '@/components/shared/instruments/PageLoader.vue';

    const EVENTS_WEEK_SCROLL_STATE_KEY = 'events-week-scroll-state';

    let animateAllSite;
    if (process.client) {
        animateAllSite = (await import('@/utils/animations')).default
    }

    const loading = ref(true);
    const router = useRouter();
    const { public: { yandexMetrikaId } } = useRuntimeConfig();
    let removeAfterEachHook = null;
    let animationRestartTimeout = null;

    const handlePopState = () => {
        loading.value = true;

        setTimeout(() => {
            loading.value = false;
        }, 300)
    };

    const consumeEventsWeekScrollState = (to, from) => {
        if (!process.client) {
            return null;
        }

        const rawState = window.sessionStorage.getItem(EVENTS_WEEK_SCROLL_STATE_KEY);

        if (!rawState) {
            return null;
        }

        window.sessionStorage.removeItem(EVENTS_WEEK_SCROLL_STATE_KEY);

        try {
            const scrollState = JSON.parse(rawState);

            if (scrollState?.source !== 'events-week-navigation') {
                return null;
            }

            if (to.path !== '/events' || from.path !== '/events') {
                return null;
            }

            return {
                left: Number(scrollState.x) || 0,
                top: Number(scrollState.y) || 0
            };
        }
        catch {
            return null;
        }
    };

    const restartSiteAnimations = (delay = 0) => {
        if (!process.client || !animateAllSite) {
            return;
        }

        if (animationRestartTimeout) {
            window.clearTimeout(animationRestartTimeout);
        }

        animationRestartTimeout = window.setTimeout(async () => {
            loading.value = false;

            await nextTick();

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    animateAllSite();
                });
            });
        }, delay);
    };

    const trackMetrikaPage = (path, referer = null) => {
        if (!process.client || !yandexMetrikaId || typeof window.ym !== 'function') {
            return;
        }

        if (referer) {
            window.ym(yandexMetrikaId, 'hit', path, { referer });
            return;
        }

        window.ym(yandexMetrikaId, 'hit', path);
    };

    onMounted(() => {
        window.addEventListener('popstate', handlePopState);

        restartSiteAnimations(500);

        removeAfterEachHook = router.afterEach((to, from) => {
            if (to.fullPath !== from.fullPath) {
                trackMetrikaPage(to.fullPath, from.fullPath);
            }

            const preservedScroll = consumeEventsWeekScrollState(to, from);

            requestAnimationFrame(() => {
                if (preservedScroll) {
                    window.scrollTo({
                        top: preservedScroll.top,
                        left: preservedScroll.left,
                        behavior: 'auto'
                    });
                    return;
                }

                if (!to.hash) {
                    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
                }
            });

            loading.value = true;

            restartSiteAnimations(300);
        });
    })

    onBeforeUnmount(() => {
        window.removeEventListener('popstate', handlePopState);
        removeAfterEachHook?.();

        if (animationRestartTimeout) {
            window.clearTimeout(animationRestartTimeout);
        }
    })

</script>


