import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const animateAllSite = () => {
    gsap.from(".head__title", {
        x: -50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.5
    })

    gsap.from(".head__title-mini", {
        y: 30,
        opacity: 0,
        duration: 1,
        delay: 1,
        ease: "power3.out"
    })

    gsap.from(".head__text", {
        opacity: 0,
        duration: 1,
        delay: 1.5
    })

    gsap.from(".about__title", {
        scrollTrigger: {
            trigger: ".about__title",
            once: true,
            start: "top 80%",
            toggleActions: "play none none reverse"
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.5
    })

    gsap.utils.toArray(".about__container-item").forEach((el) => {
        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                once: true,
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            y: 40,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out"
        })
    })

    gsap.from(".slogan__title", {
        scrollTrigger: {
            trigger: ".slogan__title",
            once: true,
            start: "top 80%",
            toggleActions: "play none none reverse"
        },
        y: -50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.5
    })

    gsap.utils.toArray(".slogan__item").forEach((el) => {
        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                start: "top 85%",
                once: true,
                toggleActions: "play none none reverse"
            },
            y: 40,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out"
        })
    })

    // gsap.from(".slogan__block-item", {
    //     scrollTrigger: {
    //         trigger: ".slogan__block-item",
    //         start: "top 85%",
    //         toggleActions: "play none none reverse"
    //     },
    //     y: 40,
    //     opacity: 0,
    //     duration: 1,
    //     ease: "power2.out"
    // })

    gsap.from(".mission__title", {
        scrollTrigger: {
            trigger: ".mission__title",
            once: true,
            start: "top 80%",
            toggleActions: "play none none reverse"
        },
        y: -50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.5
    })

    gsap.from(".mission__block", {
        scrollTrigger: {
            trigger: ".mission__block",
            once: true,
            start: "top 85%",
            toggleActions: "play none none reverse"
        },
        x: -50,
        opacity: 0,
        duration: 1,
        ease: "power2.out"
    })

    gsap.utils.toArray(".mission__item").forEach((el) => {
        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                start: "top 85%",
                once: true,
                toggleActions: "play none none reverse"
            },
            y: 40,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out"
        })
    })

    gsap.from(".coast__item-title", {
        scrollTrigger: {
            trigger: ".coast__item-title",
            start: "top 85%",
            once: true,
            toggleActions: "play none none reverse"
        },
        y: -40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.5
    })

    gsap.utils.toArray(".coast__item").forEach((el, i) => {
        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                start: "top 85%",
                once: true,
                toggleActions: "play none none reverse"
            },
            y: 60,
            scale: 0.9,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out",
            delay: i * 0.15
        })
    })

    gsap.from(".conditions__title", {
        scrollTrigger: {
            trigger: ".conditions__title",
            once: true,
            start: "top 85%",
            toggleActions: "play none none reverse"
        },
        y: -40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.5
    })

    gsap.utils.toArray(".conditions__item").forEach((el, i) => {
        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                start: "top 85%",
                once: true,
                toggleActions: "play none none reverse"
            },
            y: 60,
            opacity: 0,
            scale: 0.9,
            duration: 0.8,
            ease: "power2.out",
            delay: i * 0.15
        })
    })

    gsap.from(".conditions__banner-block", {
        scrollTrigger: {
            trigger: ".conditions__banner",
            once: true,
            start: "top 90%",
            toggleActions: "play none none reverse"
        },
        y: 80,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.3
    })
}

export default animateAllSite;