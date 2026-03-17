<template>
    <div v-show="loading" class="page-loader">
        <div class="page-loader-bar" :style="{ width: progress + '%' }"></div>
    </div>
</template>

<script setup>

    import { useRouter } from 'vue-router'

    const router = useRouter();

    const loading = ref(false);
    const progress = ref(0);

    let interval = null;

    const startLoading = () => {
        loading.value = true;
        progress.value = 0;

        clearInterval(interval);

        interval = setInterval(() => {
            if (progress.value < 90) {
                progress.value += Math.random() * 5;
            }
        }, 100)
    }

    const finishLoading = () => {
        clearInterval(interval);
            progress.value = 100;

            setTimeout(() => {
                loading.value = false;
                progress.value = 0;
        }, 500)
    }

    router.beforeEach((to, from, next) => {
        startLoading();
        next();
    })

    router.afterEach(() => {
        finishLoading();
    })

</script>

<style scoped>
    .page-loader {
        position: fixed;
        top: 0;
        left: 0;
        height: 2px;
        width: 100%;
        z-index: 999999;
        background: transparent;
    }

    .page-loader-bar {
        height: 100%;
        background: #8b00ff;
        width: 0%;
        transition: width 0.2s ease;
    }
</style>
