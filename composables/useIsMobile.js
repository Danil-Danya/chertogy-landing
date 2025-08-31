export const useIsMobile = () => {
    const isMobile = ref(false);

    const checkInMobile = () => {
        isMobile.value = window.innerWidth < 992;
    }

    onMounted(() => {
        checkInMobile();
        window.addEventListener('resize', () => checkInMobile());
    })

    // onBeforeUnmount(() => {
    //     window.removeEventListener('resize', () => checkIsMobile());
    // })

    return isMobile;
}