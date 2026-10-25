<template>
    <section class="gallery">
        <div class="container">
            <div class="gallery__content">
                <h1 class="title gallery__title">Галерея</h1>
                <div class="gallery__list">
                    <div
                        class="gallery__item"
                        v-for="image in images"
                        :key="image"
                    >
                        <img
                            :src="image"
                            alt="Фотография Чертогов Героев"
                            class="gallery__img"
                        >
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>

    const images = ref([
        '/images/gallery/Rectangle 4306.png',
        '/images/gallery/Rectangle 4307.png',
        '/images/gallery/Rectangle 4308.png',
        '/images/gallery/Rectangle 4309.png',
        '/images/gallery/Rectangle 4311.png',
        '/images/gallery/Rectangle 4312.png',
        '/images/gallery/Rectangle 4310.png',
    ]);

</script>

<style lang="scss">
    @import '@/assets/styles/components/gallery.scss';
</style>
