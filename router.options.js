export const routerOptions = {
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
        return savedPosition;
    }

    if (to.hash) {
      const el = document.querySelector(to.hash);

      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
    }
    
    return { left: 0, top: 0 }
  }
}
