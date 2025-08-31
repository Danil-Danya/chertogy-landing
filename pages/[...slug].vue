<template>
    <div class="bg-general">
        <NotFound />
    </div>
</template>

<script setup>
    
    import NotFound from '@/components/pages/404/NotFound.vue';

    definePageMeta({ layout: 'site-layout' });

    useHead({
        title: 'Страница не найдена',
    });
</script>