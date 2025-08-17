/* eslint-disable */
import { gsap } from 'gsap'
import { Flip } from 'gsap/Flip'
import { ScrollSmoother } from 'gsap/ScrollSmoother'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Initialize plugins
gsap.registerPlugin(ScrollTrigger, ScrollSmoother, Flip)

ScrollSmoother.create({
  smooth: 1,
  effects: true,
})

// Animation variables
let activeSlideIndex = 0
let previousProgress = 0
let isAnimatingSlide = false
let triggerDestroyed = false

// Marquee animation
const initMarquee = (marqueeInner) => {
  if (marqueeInner.dataset.animated) return
  marqueeInner.dataset.animated = 'true'
  gsap.to(marqueeInner, {
    xPercent: -33.33,
    ease: 'none',
    duration: 15,
    repeat: -1,
  })
}

window.alert('dwsfw')
// Debugged progress bars function
const updateProgressBars = (progress) => {
  const bars = document.querySelectorAll('.progress-bar')
  if (!bars.length) {
    console.warn('Progress bars not found')
    return
  }

  bars.forEach((bar, index) => {
    const fill = bar.querySelector('.progress-fill')
    if (!fill) {
      console.warn('Progress fill not found in bar', bar)
      return
    }

    const barProgress = Math.min(Math.max(progress * bars.length - index, 0), 1)

    // Use GSAP for smooth animation
    gsap.to(fill, {
      scaleX: barProgress,
      duration: 0.3,
      transformOrigin: 'left center',
      ease: 'power1.out',
      overwrite: 'auto',
    })
  })
}

// Slide transitions
const setupCarousel = () => {
  const slides = gsap.utils.toArray('.carousel-item')
  if (!slides.length) {
    console.warn('No carousel items found')
    return
  }

  // Initialize first slide
  const firstSlide = slides[0]
  gsap.set(firstSlide, {
    clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
  })
  gsap.set(firstSlide.querySelector('.slide-img img'), { y: '0%' })
  initMarquee(firstSlide.querySelector('.marquee-inner'))

  // Hide other slides initially
  slides.slice(1).forEach((slide) => {
    gsap.set(slide, {
      clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)',
      opacity: 0,
    })
  })

  // Create scroll trigger
  ScrollTrigger.create({
    trigger: '.carousel-section',
    start: 'top top',
    end: () => `+=${window.innerHeight * (slides.length + 2)}`,
    pin: true,
    scrub: 1,
    onUpdate: (self) => {
      if (triggerDestroyed) return

      const progress = self.progress
      updateProgressBars(progress)

      if (isAnimatingSlide) {
        previousProgress = progress
        return
      }

      const isScrollingForward = progress > previousProgress
      const targetIndex = Math.min(
        Math.floor(progress * slides.length),
        slides.length - 1
      )

      if (targetIndex !== activeSlideIndex) {
        isAnimatingSlide = true
        animateSlideTransition(
          activeSlideIndex,
          targetIndex,
          isScrollingForward
        )
        activeSlideIndex = targetIndex
      }

      previousProgress = progress
    },
    onKill: () => {
      triggerDestroyed = true
    },
  })
}

// Direction-aware slide animation
const animateSlideTransition = (oldIndex, newIndex, isForward) => {
  const slides = gsap.utils.toArray('.carousel-item')
  const currentSlide = slides[oldIndex]
  const nextSlide = slides[newIndex]

  // Initialize new slide position based on direction
  if (isForward) {
    gsap.set(nextSlide, {
      clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
      opacity: 1,
    })
    gsap.set(nextSlide.querySelector('.slide-img img'), { y: '25%' })
    gsap.set(nextSlide.querySelector('.slide-copy'), { y: '100%' })
  } else {
    gsap.set(nextSlide, {
      clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
      opacity: 1,
    })
    gsap.set(nextSlide.querySelector('.slide-img img'), { y: '-25%' })
    gsap.set(nextSlide.querySelector('.slide-copy'), { y: '-100%' })
  }

  // Animate both slides
  const tl = gsap.timeline({
    onComplete: () => {
      isAnimatingSlide = false
    },
    onInterrupt: () => {
      isAnimatingSlide = false
    },
  })

  if (isForward) {
    // Forward animation
    tl.to(
      nextSlide,
      {
        clipPath: 'polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)',
        duration: 1,
        ease: 'power4.inOut',
      },
      0
    )
      .to(
        [
          nextSlide.querySelector('.slide-copy'),
          nextSlide.querySelector('.slide-img img'),
        ],
        {
          y: '0%',
          duration: 1,
          ease: 'power4.inOut',
        },
        0
      )
      .to(
        currentSlide,
        {
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
          duration: 1,
          ease: 'power4.inOut',
        },
        0
      )
      .to(
        currentSlide.querySelector('.slide-img img'),
        {
          y: '-25%',
          duration: 1,
          ease: 'power4.inOut',
        },
        0
      )
      .to(
        currentSlide.querySelector('.slide-copy'),
        {
          y: '-100%',
          duration: 1,
          ease: 'power4.inOut',
        },
        0
      )
  } else {
    // Backward animation
    tl.to(
      nextSlide,
      {
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
        duration: 1,
        ease: 'power4.inOut',
      },
      0
    )
      .to(
        [
          nextSlide.querySelector('.slide-img img'),
          nextSlide.querySelector('.slide-copy'),
        ],
        {
          y: '0%',
          duration: 1,
          ease: 'power4.inOut',
        },
        0
      )
      .to(
        currentSlide,
        {
          clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
          duration: 1,
          ease: 'power4.inOut',
        },
        0
      )
      .to(
        currentSlide.querySelector('.slide-img img'),
        {
          y: '25%',
          duration: 1,
          ease: 'power4.inOut',
        },
        0
      )
      .to(
        currentSlide.querySelector('.slide-copy'),
        {
          y: '100%',
          duration: 1,
          ease: 'power4.inOut',
        },
        0
      )
  }
}

//PROPS section
const horizontalSection = document.querySelector('.section_props')
const wrapper = horizontalSection.querySelector('.cards_wrapper')
const items = wrapper.querySelectorAll('.props_card')

//horizontal scrolling effect
let wrapperTween = gsap.to(wrapper, {
  x: () => (wrapper.offsetWidth - window.innerWidth) * -1,
  ease: 'none',
  scrollTrigger: {
    // markers: true,
    trigger: horizontalSection,
    pin: true,
    start: 'top top',
    end: () => `+=${items[0].offsetWidth * items.length}`,
    scrub: 1,
    invalidateOnRefresh: true, //recalculate the start and end points when window resize
  },
})

//PROPS section ENDS

/////////
//FLIP MENU
gsap.registerPlugin(Flip)
let filpContainer = document.querySelector('.blob_wrap')
let flipItemEl = document.querySelector('.blob')
let menuBaseEl = document.querySelector('.nav_menu-base')
let filpDestination = document.querySelector('.props_card')

let flipDuration = 0.3

function flip(forwards) {
  let state = Flip.getState(flipItemEl)
  if (forwards) {
    filpDestination.appendChild(flipItemEl)
  } else {
    filpContainer.appendChild(flipItemEl)
  }
  Flip.from(state, { duration: flipDuration })
}

let tl = gsap.timeline({ paused: true })

//from is used because we want to move the base first
tl.from(menuBaseEl, {
  opacity: 0,
  duration: flipDuration,
  ease: 'none',
  //conditional...only runs when the timeline starts
  onStart: function () {
    flip(true)
  },
})

const menuLinks = gsap.utils.toArray('.nav_menu-link')
tl.from(menuLinks, {
  opacity: 0,
  yPercent: 50,
  duration: 0.2,
  //stagger: { amount: 0.2 },
  //conditional...only runs when the tween finishes the reverse to the start point
  //here moving the base after the links disappear completely
  onReverseComplete: function () {
    flip(false)
  },
})

function openMenu(open) {
  //check if the animation is playing to stop intteruption
  if (!tl.isActive()) {
    if (open) {
      tl.play()
      filpContainer.classList.add('nav-open')
    } else {
      //play close animation because because open menu was set to false
      tl.reverse()
      filpContainer.classList.remove('nav-open')
    }
  }
}

//callback to perform menu open or close
filpContainer.addEventListener('mouseenter', function () {
  openMenu(true)
  //checking if the menu is open or closed
  // if (filpContainer.classList.contains('nav-open')) {
  //   //then set openmenu to false
  //   openMenu(false)
  // } else {
  //   openMenu(true)
  // }
})

filpContainer.addEventListener('mouseleave', function () {
  openMenu(false)
})

menuBaseEl.addEventListener('mouseenter', function () {
  openMenu(false)
})
menuBaseEl.addEventListener('click', function () {
  openMenu(false)
})
/////////

// Initialize everything
const init = () => {
  document.querySelectorAll('.marquee-inner').forEach(initMarquee)
  setupCarousel()
}

// Start initialization after slight delay
setTimeout(init, 500)
