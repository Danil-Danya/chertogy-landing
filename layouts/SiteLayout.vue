<template>
    <header class="header">
        <Navbar v-if="!isMobile"/>
        <MobileNavbar v-else/>
    </header>
    <main class="main">
        <RouterView />
    </main>
    <footer class="footer">
        <Footer v-if="!isMobile" />
        <MobileFooter v-else />
    </footer>
</template>

<script setup>

    import Navbar from '@/components/layouts/Navbar.vue';
    import Footer from '@/components/layouts/Footer.vue';

    import MobileNavbar from '@/components/layouts/mobile/MobileNavbar.vue';
    import MobileFooter from '@/components/layouts/mobile/MobileFooter.vue';

    const isMobile = ref(false);

    const checkInMobile = () => {
        isMobile.value = window.innerWidth < 992;
    }

    onMounted(() => {
        checkInMobile();
        window.addEventListener('resize', () => checkInMobile())
    })

    onBeforeUnmount(() => {
        window.removeEventListener('resize', () => checkIsMobile());
    })
    
</script>