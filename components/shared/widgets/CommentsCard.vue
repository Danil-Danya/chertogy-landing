<template>
    <div class="comments__card">
        <div class="comments__card-content">
            <div class="comments__card-left">
                <h3 class="comments__card-player">{{ player }}</h3>
                <img :src="avatar" alt="Аватар" class="comments__card-img">
            </div>
            <div class="comments__card-right">
                <div class="comments__info-container">
                    <div class="comments__card-info-el">
                        <p class="comments__card-info-text">{{ date }}</p>
                    </div>
                    <div class="comments__card-info-el" v-if="event">
                        <p class="comments__card-info-text">{{ event }}</p>
                    </div>
                </div>
                <div class="comments__card-text-container">
                    <p class="comments__card-text" v-for="string in text" :key="string">{{ string }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>

    const props = defineProps({
        player: {
            type: String,
            required: true
        },

        avatar: {
            type: String,
            required: true
        },

        date: {
            type: String,
            required: true
        },

        event: {
            type: String,
            default: ''
        },

        text: {
            type: Array,
            required: true
        }
    })

</script>
