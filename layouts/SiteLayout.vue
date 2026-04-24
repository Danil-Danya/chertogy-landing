<template>
    <header class="header">
        <Navbar v-if="!isMobile"/>
        <MobileNavbar v-else/>
    </header>
    <main class="main">
        <RouterView />
        <Transition name="scroll-top">
            <button
                v-if="isMobile && isScrollTopButtonVisible"
                type="button"
                class="site-layout__scroll-top"
                aria-label="Прокрутить наверх"
                @click="scrollTop"
            >
                <span class="site-layout__scroll-top-icon">
                    <TopArrowIcon width="24px" height="24px" />
                </span>
            </button>
        </Transition>
    </main>
    <footer class="footer">
        <Footer v-if="!isMobile" />
        <MobileFooter v-else />
    </footer>
</template>

<script setup>

    import { useRoute } from 'vue-router';

    import Navbar from '@/components/layouts/Navbar.vue';
    import Footer from '@/components/layouts/Footer.vue';

    import MobileNavbar from '@/components/layouts/mobile/MobileNavbar.vue';
    import MobileFooter from '@/components/layouts/mobile/MobileFooter.vue';

    const TopArrowIcon = defineAsyncComponent(() => import('@/components/icons/navigator/Arrow.vue'));

    const route = useRoute();
    const isMobile = ref(false);
    const isScrollTopButtonVisible = ref(false);

    const checkInMobile = () => {
        isMobile.value = window.innerWidth < 992;
    }

    const updateScrollTopButtonVisibility = () => {
        if (!isMobile.value) {
            isScrollTopButtonVisible.value = false;
            return;
        }

        isScrollTopButtonVisible.value = window.scrollY >= window.innerHeight;
    };

    const handleResize = () => {
        checkInMobile();
        updateScrollTopButtonVisibility();
    };

    const handleScroll = () => {
        updateScrollTopButtonVisibility();
    };

    const scrollTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    watch(() => route.fullPath, async () => {
        await nextTick();
        requestAnimationFrame(() => {
            updateScrollTopButtonVisibility();
        });
    });

    onMounted(() => {
        handleResize();

        window.addEventListener('resize', handleResize);
        window.addEventListener('scroll', handleScroll, { passive: true });
    });

    onBeforeUnmount(() => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', handleScroll);
    });
    
</script>

<style lang="scss" scoped>
    .site-layout {
        &__scroll-top {
            position: fixed;
            right: 10%;
            bottom: 10%;
            width: 50px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 0;
            border-radius: 10px;
            background: #18171E;
            color: #FFFFFF;
            cursor: pointer;
            transition: background 300ms ease, opacity 300ms ease, transform 300ms ease;
            z-index: 1000;

            &:hover {
                background: #3D3A4B;
            }
        }

        &__scroll-top-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            transform: rotate(-90deg);
        }
    }

    .scroll-top-enter-active,
    .scroll-top-leave-active {
        transition: opacity 300ms ease, transform 300ms ease;
    }

    .scroll-top-enter-from,
    .scroll-top-leave-to {
        opacity: 0;
        transform: translateY(16px);
    }
</style>
