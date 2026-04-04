const SUBSCRIPTION_CAPTCHA_STORAGE_KEY = 'subscription-captcha-attempts';
const SUBSCRIPTION_CAPTCHA_THRESHOLD = 3;

export const useSubscriptionCaptcha = () => {
    const canUseStorage = () => process.client && typeof window !== 'undefined';

    const readState = () => {
        if (!canUseStorage()) {
            return {};
        }

        try {
            const rawState = window.localStorage.getItem(SUBSCRIPTION_CAPTCHA_STORAGE_KEY);

            if (!rawState) {
                return {};
            }

            const parsedState = JSON.parse(rawState);

            return parsedState && typeof parsedState === 'object' ? parsedState : {};
        }
        catch {
            return {};
        }
    };

    const writeState = (nextState) => {
        if (!canUseStorage()) {
            return;
        }

        window.localStorage.setItem(
            SUBSCRIPTION_CAPTCHA_STORAGE_KEY,
            JSON.stringify(nextState)
        );
    };

    const buildAttemptKey = ({ eventId, userId }) => {
        if (!eventId || !userId) {
            return null;
        }

        return `${userId}:${eventId}`;
    };

    const getUnsubscribeAttempts = ({ eventId, userId }) => {
        const attemptKey = buildAttemptKey({ eventId, userId });

        if (!attemptKey) {
            return 0;
        }

        const state = readState();
        const attempts = Number(state[attemptKey]) || 0;

        return attempts;
    };

    const incrementUnsubscribeAttempts = ({ eventId, userId }) => {
        const attemptKey = buildAttemptKey({ eventId, userId });

        if (!attemptKey) {
            return 0;
        }

        const state = readState();
        const nextAttempts = (Number(state[attemptKey]) || 0) + 1;

        state[attemptKey] = nextAttempts;
        writeState(state);

        return nextAttempts;
    };

    const clearUnsubscribeAttempts = ({ eventId, userId }) => {
        const attemptKey = buildAttemptKey({ eventId, userId });

        if (!attemptKey) {
            return;
        }

        const state = readState();

        delete state[attemptKey];
        writeState(state);
    };

    const shouldRequireCaptcha = ({ eventId, userId }) => {
        return getUnsubscribeAttempts({ eventId, userId }) >= SUBSCRIPTION_CAPTCHA_THRESHOLD;
    };

    return {
        getUnsubscribeAttempts,
        incrementUnsubscribeAttempts,
        clearUnsubscribeAttempts,
        shouldRequireCaptcha,
        threshold: SUBSCRIPTION_CAPTCHA_THRESHOLD
    };
};
