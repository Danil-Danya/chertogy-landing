<template>
    <ClientOnly>
        <Event />
    </ClientOnly>
</template>

<script setup>
    import Event from '~/components/pages/events/Event.vue';

    definePageMeta({ layout: 'site-layout' });
</script>