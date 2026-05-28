export const getEventWord = (count) => {
    const absCount = Math.abs(count);
    const lastDigit = absCount % 10;
    const lastTwoDigits = absCount % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
        return 'событий';
    }

    if (lastDigit === 1) {
        return 'событие';
    }

    if (lastDigit >= 2 && lastDigit <= 4) {
        return 'события';
    }

    return 'событий';
};