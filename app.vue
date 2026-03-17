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

    let animateAllSite;
    if (process.client) {
        animateAllSite = (await import('@/utils/animations')).default
    }

    const loading = ref(true);
    const router = useRouter();

    onMounted(() => {
        setTimeout(() => {
            loading.value = false;
        }, 500)

        router.afterEach(() => {
            window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
        })

        const handlePopState = () => {
            loading.value = true;

            setTimeout(() => {
                loading.value = false;
            }, 300)
        }

        window.addEventListener('popstate', handlePopState);

        animateAllSite()

        router.afterEach(() => {
            loading.value = true;

            setTimeout(() => {
                loading.value = false;
                animateAllSite();
            }, 300)
        })

        onBeforeUnmount(() => {
            window.removeEventListener('popstate', handlePopState);
        })
    })

</script>



