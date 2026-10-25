<template>
    <div class="bg-master">
        <Master />
        <MasterSlider />
        <Comments />
    </div>
</template>

<script setup>

    import Master from '@/components/pages/masters/slug/Master.vue';
    import MasterSlider from '@/components/pages/masters/slug/MasterSlider.vue';
    import Comments from '@/components/pages/masters/slug/Comments.vue';

    import { useMastersStore } from '~/store/useMasters';

    const masterStore = useMastersStore();
    const route = useRoute();

    await masterStore.fetchOneMaster(route.params.slug);

    definePageMeta({ layout: "site-layout" });
    
</script>

<style lang="scss">
    @import url('@/assets/styles/components/comments.scss');
</style>
