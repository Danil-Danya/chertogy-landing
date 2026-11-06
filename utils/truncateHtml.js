const voidTags = new Set([
    'area',
    'base',
    'br',
    'col',
    'embed',
    'hr',
    'img',
    'input',
    'link',
    'meta',
    'param',
    'source',
    'track',
    'wbr'
]);

const truncateHtml = (html, maxLength) => {
    if (!html) {
        return '';
    }

    const parts = String(html).split(/(<[^>]+>)/g).filter(Boolean);
    const openedTags = [];
    let result = '';
    let textLength = 0;
    let isTruncated = false;

    for (const part of parts) {
        if (part.startsWith('<')) {
            result += part;

            const tag = part.match(/^<\/?\s*([a-z0-9-]+)/i)?.[1]?.toLowerCase();

            if (!tag) {
                continue;
            }

            if (/^<\//.test(part)) {
                const tagIndex = openedTags.lastIndexOf(tag);

                if (tagIndex !== -1) {
                    openedTags.splice(tagIndex, 1);
                }
            }
            else if (!voidTags.has(tag) && !/\/\s*>$/.test(part)) {
                openedTags.push(tag);
            }

            continue;
        }

        const availableLength = maxLength - textLength;

        if (part.length <= availableLength) {
            result += part;
            textLength += part.length;
            continue;
        }

        result += `${part.slice(0, Math.max(availableLength, 0)).trimEnd()}...`;
        isTruncated = true;
        break;
    }

    if (!isTruncated) {
        return result;
    }

    return result + openedTags.reverse().map(tag => `</${tag}>`).join('');
};

export default truncateHtml;
