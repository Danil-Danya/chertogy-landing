const months = {
    0: { nom: 'январь', gen: 'января' },
    1: { nom: 'февраль', gen: 'февраля' },
    2: { nom: 'март', gen: 'марта' },
    3: { nom: 'апрель', gen: 'апреля' },
    4: { nom: 'май', gen: 'мая' },
    5: { nom: 'июнь', gen: 'июня' },
    6: { nom: 'июль', gen: 'июля' },
    7: { nom: 'август', gen: 'августа' },
    8: { nom: 'сентябрь', gen: 'сентября' },
    9: { nom: 'октябрь', gen: 'октября' },
    10: { nom: 'ноябрь', gen: 'ноября' },
    11: { nom: 'декабрь', gen: 'декабря' }
};

const translateDateISOToWords = (isoString, useGenitive = true) => {
    const date = new Date(isoString);
    
    if (isNaN(date)) {
        return 'Некорректная дата';
    }

    const day = date.getDate();
    const month = months[date.getMonth()][useGenitive ? 'gen' : 'nom'];
    const year = date.getFullYear();

    return useGenitive ? `${day} ${month} ${year} г.` : `${day} ${month} ${year}`;
};

const translateDateISOToWordsNoYear = (isoString, useGenitive = true) => {
    const date = new Date(isoString);

    if (isNaN(date)) {
        return 'Некорректная дата';
    }

    const day = date.getDate();
    const month = months[date.getMonth()][useGenitive ? 'gen' : 'nom'];

    if (useGenitive) {
        return `${day} ${month}`;
    }
    else {
        return `${day} ${month}`;
    }
};


export {
    translateDateISOToWords,
    translateDateISOToWordsNoYear
};
