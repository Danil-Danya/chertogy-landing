<template>
    <div class="navbar__dropdown">
        <div class="container">
            <div class="navbar__dropdown-content">
                <ul class="navbar__dropdown-list">
                    <li class="navbar__dropdown-li" v-for="link in navLinks" :key="link">
                        <NuxtLink :to="link.path" class="navbar__dropdown-link" @click="emit('closeDropdown')">{{ link.text }}</NuxtLink>
                    </li>
                </ul>
                <div class="navbar__dropdown-bottom">
                    <div class="navbar__dropdown-help">
                        <a href="https://t.me/ChertogiGeroev" class="navbar__dropdown-help-link">
                            <p class="navbar__dropdown-help-text">Помогите мне</p>
                            <span class="navbar__dropdown-help-icon">
                                <HelpIcon />
                            </span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>

    import HelpIcon from '@/components/icons/navbar/Help.vue';

    const emit = defineEmits(['closeDropdown']);

    const navLinks = ref([
        { text: 'О клубе', path: '/' },
        { text: 'Тарифы', path: '/tariffs' },
        { text: 'К приключениям', path: '/technical-work' },
        { text: 'Новости', path: '/news' },
        { text: 'Контакты', path: '/contacts' },
    ])

</script>
