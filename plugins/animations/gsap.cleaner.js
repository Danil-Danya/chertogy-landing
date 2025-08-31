import { defineNuxtPlugin } from '#app'
import gsap from './gsap.js'

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.hook('page:finish', () => {
        gsap.killTweensOf('*');

        const ScrollTrigger = gsap.core.globals().ScrollTrigger;

        if (ScrollTrigger) {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
            ScrollTrigger.refresh();
        }
    })
})
