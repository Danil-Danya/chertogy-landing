<template>
    <div class="modal" @click.self="onClose">
        <div class="modal__content light-border">
            <div class="modal__head">
                <button type="button" class="modal__close" @click="onClose" aria-label="Close modal">
                    <CloseIcon />
                </button>
            </div>
            <h2 class="modal__title title">
                Где вам удобнее связаться?
            </h2>

            <div class="modal__data">
                <div class="modal__item" v-for="item in socialLinks" :key="item">
                    <a :href="item.link" class="modal__link" target="_blank" rel="noopener noreferrer">
                        <span class="modal__social-icon">
                            <Component :is="item.icon" />
                        </span>
                        <p class="text">{{ item.text }}</p>
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>

    const CloseIcon = defineAsyncComponent(() => import('@/components/icons/development/Close.vue'));
    const TGIcon = defineAsyncComponent(() => import('@/components/icons/development/Telegram.vue'));
    const VKIcon = defineAsyncComponent(() => import('@/components/icons/development/VK.vue'));

    const socialLinks = ref([
        {
            icon: TGIcon,
            text: '@ChertogiGeroev',
            link: 'https://t.me/ChertogiGeroev'
        },
        {
            icon: VKIcon,
            text: '@chertogi.club',
            link: 'https://vk.com/chertogi.club'
        }
    ])

    const emit = defineEmits([
        'close',
    ]);

    const onClose = () => {
        emit('close');
    };

</script>
