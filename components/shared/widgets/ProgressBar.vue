<template>
    <div class="progress-bar" ref="progressBar" :class="{ 'active': isVisible }" :style="{ '--progress-delay': `${delay}ms` }">
        <h3 class="progress-bar__title">{{ title }}</h3>
        <div
            class="progress-bar__line"
            role="meter"
            :aria-label="title"
            aria-valuemin="1"
            aria-valuemax="10"
            :aria-valuenow="progressValue"
            :aria-valuetext="`${progressValue} из 10`"
        >
            <div class="progress-bar__dots" aria-hidden="true">
                <span class="progress-bar__dot" v-for="point in 10" :key="point" :style="{ '--point-delay': `${point * 30}ms` }"></span>
            </div>
            <div class="progress-bar__fill" :style="{ width: isVisible ? `${progressValue * 10}%` : '0%' }" aria-hidden="true"></div>
        </div>
    </div>
</template>

<script setup>

    import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

    const props = defineProps({
        title: {
            type: String,
            required: true
        },

        value: {
            type: Number,
            required: true
        },

        delay: {
            type: Number,
            default: 0
        }
    });

    const progressBar = ref(null);
    const isVisible = ref(false);
    const progressValue = computed(() => Math.min(10, Math.max(1, Math.round(props.value) || 1)));

    let observer;

    onMounted(() => {
        if (!('IntersectionObserver' in window)) {
            isVisible.value = true;
            return;
        }

        observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                isVisible.value = true;
                observer.disconnect();
            }
        }, { threshold: 0.5 });

        observer.observe(progressBar.value);
    });

    onBeforeUnmount(() => {
        observer?.disconnect();
    });

</script>

<style lang="scss">
    @import '@/assets/styles/components/progress-bar.scss';
</style>
