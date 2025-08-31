import { ref, computed } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import ValidationMessages from '@/utils/validationMessages';

export function useValidation(schema) {
    const form = {};
    const rules = {};

    for (const key in schema) {
        form[key] = ref(schema[key].value || '');
        rules[key] = schema[key].rules;я
    }

    const v$ = useVuelidate(rules, form);

    const getMessage = (field, rule, params = {}) => {
        const fieldMessages = ValidationMessages[field] || {};
        const defaultMessages = ValidationMessages._default || {};

        const message = fieldMessages[rule] || defaultMessages[rule];

        switch (typeof message) {
            case 'function':
                return message(params);
            case 'string':
                return message;
            default:
                return 'Ошибка валидации';
        }

        return 'Ошибка валидации';
    };

    const errors = computed(() => {
        const result = {};

        for (const key in v$.value) {
            const field = v$.value[key];

            if (field?.$errors?.length) {
                result[key] = field.$errors.map((e) => {
                    return getMessage(key, e.$validator, e.$params);
                });
            }
        }

        return result;
    });

    return {
        form,
        v$,
        errors,
    };
}
