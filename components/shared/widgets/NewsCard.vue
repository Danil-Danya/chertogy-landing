<template>
    <div class="news__card">
        <div class="news__card-top">
            <NuxtLink :to="`/news/${slug}`">
                <NuxtImg loading="lazy" class="news__card-img" :src="image" :alt="`Картинка новости ${title}`" format="webp" />
            </NuxtLink>
        </div>
        <div class="news__card-center">
            <div class="news__card-heading">
                <h3 class="news__card-title">{{ title }}</h3>
                <p class="news__card-date">{{ formattedDate }}</p>
            </div>
            <div class="news__card-content">
                <p class="news__card-text text">{{ text }}</p>
            </div>
        </div>
        <div class="news__card-bottom" v-if="!isSlider">
            <NuxtLink :to="`/news/${slug}`" class="news__card-link">Подробнее</NuxtLink>
        </div>
    </div>
</template>

<script setup>

    import translateDateISOToWords from '@/utils/dateHelper.js';

    const props = defineProps({
        image: {
            type: String,
            required: true,
            default: '/images/news/news.png'
        },

        title: {
            type: String,
            required: true,
            default: 'Новость номер один'
        },

        date: {
            type: String,
            required: true,
            default: '28 октября 2024 г'
        },

        text: {
            type: String,
            required: true,
            default: 'В королевстве, охваченном тьмой, группа смелых искателей приключений отправляется в опасное путешествие, чтобы спасти мир от забытого зла. Их путь лежит через мрачные леса и заброшенные руины, где каждый шаг может стать последним…'
        },  

        slug: {
            type: String,
            required: true,
            default: 'novost-nomer-odin'
        },

        isSlider: {
            type: Boolean,
            required: true,
            default: false
        }
    });

    const formattedDate = computed(() => translateDateISOToWords(props.date));

</script>
