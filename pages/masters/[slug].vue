<template>
    <div class="bg-master">
        <MasterUnavailable :name="master.name" v-if="isMasterUnavailable" />
        <template v-else>
            <Master />
            <MasterSlider />
            <Comments />
        </template>
    </div>
</template>

<script setup>

    import Master from '@/components/pages/masters/slug/Master.vue';
    import MasterSlider from '@/components/pages/masters/slug/MasterSlider.vue';
    import Comments from '@/components/pages/masters/slug/Comments.vue';
    import MasterUnavailable from '@/components/pages/masters/slug/MasterUnavailable.vue';

    import { useMastersStore } from '~/store/useMasters';

    const masterStore = useMastersStore();
    const route = useRoute();

    await masterStore.fetchOneMaster(route.params.slug);

    const master = computed(() => masterStore.oneMaster);
    const isMasterUnavailable = computed(() => {
        return master.value?.id && master.value.isVisible === false;
    });

    definePageMeta({ layout: "site-layout" });
    
</script>

<style lang="scss">
    @import url('@/assets/styles/components/comments.scss');
</style>
