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
    let removeAfterEachHook = null;

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

    onMounted(() => {
        setTimeout(() => {
            loading.value = false;
        }, 500)

        window.addEventListener('popstate', handlePopState);

        animateAllSite()

        removeAfterEachHook = router.afterEach((to, from) => {
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

            setTimeout(() => {
                loading.value = false;
                animateAllSite();
            }, 300)
        });
    })

    onBeforeUnmount(() => {
        window.removeEventListener('popstate', handlePopState);
        removeAfterEachHook?.();
    })

</script>



