<template>
    <section class="post">
        <div class="container">
            <div class="post__content">
                <h1 class="title post__title">{{ title }}</h1>
                <NuxtLink to="/news" class="post__button">
                    <BigArrowIcon />
                </NuxtLink>
            </div>
            <div class="post__container">
                <div class="post__container-left">
                    <img v-if="image"
                        class="post__container-img" 
                        :src="image" alt="Картинка" 
                        @click="toggleIsZoomed"  
                        format="webp" 
                    />
                </div>
                <div class="post__container-right">
                    <div class="post__date">
                        <p class="post__container-date">{{ formattedDate }}</p>
                    </div>
                    <div class="post__block">
                        <p class="post__container-text text" v-for="item in text" :key="item" v-html="item" />
                    </div>
                </div>
            </div>
        </div>
        <Transition name="zoom">
            <ZoomImage 
                :image="image" 
                v-if="isZoomed && !isMobile"
                @close="toggleIsZoomed" 
            />
        </Transition>
    </section>
</template>

<script setup>

    import ZoomImage from '@/components/shared/instruments/ZoomImage.vue';

    import { translateDateISOToWords } from '@/utils/dateHelper.js';

    import { useRouter } from 'vue-router';
    import { useIsMobile } from '@/composables/useIsMobile.js';

    const BigArrowIcon = defineAsyncComponent(() => import('@/components/icons/news/BigArrow.vue'));

    const router = useRouter();
    const isMobile = useIsMobile();

    const isZoomed = ref(false);

    const props = defineProps({
        image: {
            type: String,
            required: true,
        },

        title: {
            type: String,
            required: true,
        },

        date: {
            type: String,
            required: true,
        },

        text: {
            type: Array,
            required: true,
        },  
    });
    
    const formattedDate = computed(() => translateDateISOToWords(props.date));

    const goToBack = () => {
        router.back();
    }

    const toggleIsZoomed = () => {
        isZoomed.value = !isZoomed.value;
    }

</script>

<style lang="scss" scoped>
    @import '@/assets/styles/components/post.scss';
</style>
