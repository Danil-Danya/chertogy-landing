<template>
    <section class="captcha" v-if="captchaTarget">
        <div class="captcha__head">
            <button
                type="button"
                class="captcha__refresh"
                @click="generateCaptchaEntities"
            >
                Обновить
            </button>
        </div>

        <div class="captcha__question">
            <p class="captcha__question-text">
                Найдите на мозаике "{{ captchaTarget.name }}"
            </p>
            <p class="captcha__question-note">
                Внутри только {{ captchaTypeLabel }}
            </p>
        </div>

        <p
            class="captcha__message"
            :class="{ 'is-error': captchaError }"
        >
            {{ captchaError || 'Выберите правильную картинку, чтобы записаться на событие' }}
        </p>

        <div class="captcha__mosaic">
            <button
                v-for="entity in captchaEntities"
                :key="`${entity.key}-${entity.randomIndex}`"
                type="button"
                class="captcha__mosaic-item"
                :class="{
                    'is-selected': selectedCaptchaKey === entity.key,
                    'is-error': captchaError && selectedCaptchaKey === entity.key
                }"
                :disabled="isCaptchaSubmitting"
                @click="handleCaptchaSelect(entity)"
            >
                <img
                    :src="entity.img"
                    :alt="entity.name"
                    class="captcha__mosaic-image"
                >
            </button>
        </div>
    </section>
</template>

<script setup>

    const emit = defineEmits(['success']);

    const allEntities = ref({
        builds: [
            { img: '/images/captcha/buildings/castle.png', name: 'замок', key: 'castle' },
            { img: '/images/captcha/buildings/colesium.png', name: 'колизей', key: 'colesium' },
            { img: '/images/captcha/buildings/elfian_village.png', name: 'эльфийская деревня', key: 'elfian_village' },
            { img: '/images/captcha/buildings/magic_academy.png', name: 'магическая академия', key: 'magic_academy' },
            { img: '/images/captcha/buildings/military_base.png', name: 'военный лагерь', key: 'military_base' },
            { img: '/images/captcha/buildings/steeler_guild.png', name: 'гильдия воров', key: 'steeler_guild' }
        ],

        weapons: [
            { img: '/images/captcha/weapons/bow.png', name: 'лук', key: 'bow' },
            { img: '/images/captcha/weapons/daggers.png', name: 'кинжалы', key: 'daggers' },
            { img: '/images/captcha/weapons/sekira.png', name: 'секира', key: 'sekira' },
            { img: '/images/captcha/weapons/spear.png', name: 'копьё', key: 'spear' },
            { img: '/images/captcha/weapons/staff.png', name: 'посох', key: 'staff' },
            { img: '/images/captcha/weapons/sword.png', name: 'меч', key: 'sword' }
        ],

        classes: [
            { img: '/images/captcha/classes/archer.png', name: 'лучник', key: 'archer' },
            { img: '/images/captcha/classes/assasin.png', name: 'ассасин', key: 'assasin' },
            { img: '/images/captcha/classes/berserk.png', name: 'берсерк', key: 'berserk' },
            { img: '/images/captcha/classes/centurion.png', name: 'центурион', key: 'centurion' },
            { img: '/images/captcha/classes/knight.png', name: 'рыцарь', key: 'knight' },
            { img: '/images/captcha/classes/magician.png', name: 'маг', key: 'magician' }
        ]
    });

    const captchaType = ref(null);
    const captchaEntities = ref([]);
    const captchaTarget = ref(null);
    const selectedCaptchaKey = ref(null);
    const captchaError = ref('');
    const isCaptchaSubmitting = ref(false);

    const captchaTypeLabel = computed(() => {
        if (captchaType.value === 'builds') {
            return 'строения';
        }

        if (captchaType.value === 'weapons') {
            return 'оружие';
        }

        if (captchaType.value === 'classes') {
            return 'классы';
        }

        return 'элементы';
    });

    const shuffleArray = (items = []) => {
        const clonedItems = [...items];

        for (let index = clonedItems.length - 1; index > 0; index -= 1) {
            const randomIndex = Math.floor(Math.random() * (index + 1));

            [clonedItems[index], clonedItems[randomIndex]] = [clonedItems[randomIndex], clonedItems[index]];
        }

        return clonedItems;
    };

    const attachRandomIndexes = (items = []) => {
        const randomIndexes = shuffleArray(
            Array.from({ length: items.length }, (_, index) => index)
        );

        return items.map((item, index) => {
            return {
                ...item,
                randomIndex: randomIndexes[index]
            };
        });
    };

    const getRandomItem = (items = []) => {
        if (!items.length) {
            return null;
        }

        const randomIndex = Math.floor(Math.random() * items.length);

        return items[randomIndex];
    };

    const generateCaptchaEntities = () => {
        const entityTypes = Object.keys(allEntities.value);
        const randomType = entityTypes[Math.floor(Math.random() * entityTypes.length)];
        const selectedEntities = allEntities.value[randomType] ?? [];
        const preparedEntities = attachRandomIndexes(selectedEntities);

        captchaType.value = randomType;
        captchaTarget.value = getRandomItem(preparedEntities);
        captchaEntities.value = shuffleArray(preparedEntities);
        selectedCaptchaKey.value = null;
        captchaError.value = '';
        isCaptchaSubmitting.value = false;
    };

    const handleCaptchaSelect = (entity) => {
        if (!entity || isCaptchaSubmitting.value) {
            return;
        }

        selectedCaptchaKey.value = entity.key;

        if (entity.key !== captchaTarget.value?.key) {
            captchaError.value = 'Неверная картинка. Попробуйте ещё раз.';
            return;
        }

        captchaError.value = '';
        isCaptchaSubmitting.value = true;

        setTimeout(() => {
            emit('success');
        }, 150);
    };

    onMounted(() => {
        generateCaptchaEntities();
    });

</script>

<style lang="scss">
    @import '@/assets/styles/components/captcha.scss';
</style>
