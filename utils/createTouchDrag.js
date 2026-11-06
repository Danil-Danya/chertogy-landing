const createTouchDrag = ({
    selector,
    getItemId,
    canStart,
    onStart,
    onOver,
    onDrop,
    onCancel,
    threshold = 8,
    scrollZone = 90,
    maxScrollSpeed = 18
}) => {
    let pointerId = null;
    let pointerTarget = null;
    let sourceItem = null;
    let sourceId = null;
    let targetId = null;
    let startX = 0;
    let startY = 0;
    let pointerX = 0;
    let pointerY = 0;
    let isActive = false;
    let scrollFrame = null;

    const stopAutoScroll = () => {
        if (scrollFrame !== null) {
            window.cancelAnimationFrame(scrollFrame);
            scrollFrame = null;
        }
    };

    const reset = () => {
        stopAutoScroll();

        if (pointerTarget?.hasPointerCapture?.(pointerId)) {
            pointerTarget.releasePointerCapture(pointerId);
        }

        pointerId = null;
        pointerTarget = null;
        sourceItem = null;
        sourceId = null;
        targetId = null;
        isActive = false;
    };

    const updateTarget = () => {
        const target = document.elementFromPoint(pointerX, pointerY)?.closest(selector);
        const nextTargetId = target?.dataset.sortId || null;

        targetId = nextTargetId && nextTargetId !== sourceId
            ? nextTargetId
            : null;

        onOver(targetId);
    };

    const autoScroll = () => {
        if (!isActive) {
            scrollFrame = null;
            return;
        }

        const viewportHeight = window.innerHeight;
        let scrollOffset = 0;

        if (pointerY < scrollZone) {
            scrollOffset = -Math.ceil((scrollZone - pointerY) / scrollZone * maxScrollSpeed);
        }
        else if (viewportHeight - pointerY < scrollZone) {
            scrollOffset = Math.ceil((scrollZone - (viewportHeight - pointerY)) / scrollZone * maxScrollSpeed);
        }

        if (scrollOffset) {
            window.scrollBy(0, scrollOffset);
            updateTarget();
        }

        scrollFrame = window.requestAnimationFrame(autoScroll);
    };

    const start = (event, item) => {
        if (event.pointerType !== 'touch' || pointerId !== null || !canStart(item)) {
            return;
        }

        pointerId = event.pointerId;
        pointerTarget = event.currentTarget;
        sourceItem = item;
        sourceId = getItemId(item);
        startX = event.clientX;
        startY = event.clientY;
        pointerX = event.clientX;
        pointerY = event.clientY;
        pointerTarget.setPointerCapture?.(pointerId);
    };

    const move = (event) => {
        if (event.pointerId !== pointerId) {
            return;
        }

        pointerX = event.clientX;
        pointerY = event.clientY;

        if (!isActive) {
            const distance = Math.hypot(pointerX - startX, pointerY - startY);

            if (distance < threshold) {
                return;
            }

            isActive = true;
            onStart(sourceItem);
            scrollFrame = window.requestAnimationFrame(autoScroll);
        }

        event.preventDefault();
        updateTarget();
    };

    const end = (event) => {
        if (event.pointerId !== pointerId) {
            return;
        }

        const wasActive = isActive;
        const droppedTargetId = targetId;

        if (wasActive) {
            event.preventDefault();
        }

        reset();

        if (wasActive && droppedTargetId) {
            onDrop(droppedTargetId);
        }
        else if (wasActive) {
            onCancel();
        }
    };

    const cancel = () => {
        const wasActive = isActive;

        reset();

        if (wasActive) {
            onCancel();
        }
    };

    return {
        start,
        move,
        end,
        cancel
    };
};

export default createTouchDrag;
