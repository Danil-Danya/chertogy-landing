const SUBSCRIPTION_SUCCESS_MODAL_STORAGE_KEY = 'subscription-success-modal-display-count';
const SUBSCRIPTION_SUCCESS_MODAL_MAX_SHOWS = 3;

const normalizeDisplayCount = (value) => {
    const parsedValue = Number.parseInt(value, 10);

    if (!Number.isFinite(parsedValue) || parsedValue < 0) {
        return 0;
    }

    return parsedValue;
};

export const useSubscriptionSuccessModal = () => {
    const isSubscriptionSuccessModalOpen = ref(false);

    const getDisplayCount = () => {
        if (!import.meta.client) {
            return 0;
        }

        try {
            return normalizeDisplayCount(localStorage.getItem(SUBSCRIPTION_SUCCESS_MODAL_STORAGE_KEY));
        }
        catch {
            return 0;
        }
    };

    const setDisplayCount = (count) => {
        if (!import.meta.client) {
            return;
        }

        try {
            localStorage.setItem(SUBSCRIPTION_SUCCESS_MODAL_STORAGE_KEY, String(count));
        }
        catch {
            // Ignore storage write failures and keep the UI usable.
        }
    };

    const openSubscriptionSuccessModal = () => {
        if (!import.meta.client) {
            return false;
        }

        const displayCount = getDisplayCount();

        if (displayCount >= SUBSCRIPTION_SUCCESS_MODAL_MAX_SHOWS) {
            return false;
        }

        setDisplayCount(displayCount + 1);
        isSubscriptionSuccessModalOpen.value = true;

        return true;
    };

    const closeSubscriptionSuccessModal = () => {
        isSubscriptionSuccessModalOpen.value = false;
    };

    return {
        isSubscriptionSuccessModalOpen,
        openSubscriptionSuccessModal,
        closeSubscriptionSuccessModal,
    };
};
