import { useAnimate } from 'motion-v'
import { useElementVisibility, useEventListener, useRafFn } from '@vueuse/core'

/**
 * Nuxi, the Nuxt mascot, as the Ask AI glyph. Ported from nuxt.com: the face
 * lives in a mask over the Nuxt mark, so the eyes and mouth are holes that
 * blink, look around and follow the pointer, and the body rides a keyframe
 * per mood.
 */
export type NuxiMood = 'idle' | 'happy' | 'excited' | 'thinking' | 'sleeping' | 'surprised'

type LookDir = 'center' | 'left' | 'right' | 'up'

type MouthShape = 'default' | 'O'

interface MoodVisual {
  showSmile: boolean
  mouthShape: MouthShape
  eyeLeftScaleY: number
  eyeLeftScaleX: number
  eyeRightScaleY: number
  eyeRightScaleX: number
  eyeTranslateY: number
  mouthScale: number
  mouthTY: number
  mouthOpacity: number
  blinkEnabled: boolean
}

const BASE_Y = -6
const PROXIMITY_RADIUS = 400
const LERP_FACTOR = 0.10
// under a hundredth of a pixel the face has arrived, so the loop can stop
const LERP_EPSILON = 0.01

const LOOK_OFFSETS: Record<LookDir, { x: number, y: number }> = {
  center: { x: 0, y: 0 },
  left: { x: -8, y: 2 },
  right: { x: 8, y: 2 },
  up: { x: 0, y: -6 }
}

const EYE_LEFT_PATH = 'M76.425 109.429C87.5373 92.1556 113.182 93.389 122.585 111.649C131.988 129.91 118.098 151.501 97.5822 150.515C77.0667 149.528 65.3128 126.703 76.425 109.429Z'
const EYE_RIGHT_PATH = 'M204.632 156.542C185.601 155.627 174.698 134.454 185.006 118.43C195.314 102.407 219.102 103.551 227.825 120.49C236.547 137.429 223.662 157.458 204.632 156.542Z'

// The `^_^` smile: stroked arcs layered over the eyes, faded in per mood.
// Single quadratic curves with round caps, so the ends stay smooth.
const SMILE_LEFT_PATH = 'M77 125 Q 99 109 121 125'
const SMILE_RIGHT_PATH = 'M184 133 Q 206 117 228 133'

const MOUTH_PATHS: Record<MouthShape, string> = {
  default: 'M129.032 174.492C137.341 190.478 160.159 191.682 170.105 176.66L172.148 173.574C173.856 170.994 172.113 167.535 169.023 167.372L131.086 165.369C127.996 165.206 125.899 168.463 127.326 171.209L129.032 174.492Z',
  O: 'M132 178 a 17 13 0 1 0 34 0 a 17 13 0 1 0 -34 0 Z'
}

/* eslint-disable @stylistic/key-spacing, @stylistic/no-multi-spaces -- table layout for legibility */
const MOOD_VISUALS: Record<NuxiMood, MoodVisual> = {
  idle:      { showSmile: false, eyeLeftScaleY: 1,    eyeLeftScaleX: 1,    eyeRightScaleY: 1,    eyeRightScaleX: 1,    eyeTranslateY: 0,  mouthShape: 'default', mouthScale: 1,    mouthTY: 0, mouthOpacity: 1, blinkEnabled: true  },
  happy:     { showSmile: true,  eyeLeftScaleY: 0.02, eyeLeftScaleX: 0.5,  eyeRightScaleY: 0.02, eyeRightScaleX: 0.5,  eyeTranslateY: -5, mouthShape: 'default', mouthScale: 1.25, mouthTY: 3, mouthOpacity: 1, blinkEnabled: false },
  excited:   { showSmile: false, eyeLeftScaleY: 1.05, eyeLeftScaleX: 1.02, eyeRightScaleY: 1.05, eyeRightScaleX: 1.02, eyeTranslateY: 0,  mouthShape: 'default', mouthScale: 1.55, mouthTY: 6, mouthOpacity: 1, blinkEnabled: false },
  thinking:  { showSmile: false, eyeLeftScaleY: 0.55, eyeLeftScaleX: 0.9,  eyeRightScaleY: 0.55, eyeRightScaleX: 0.9,  eyeTranslateY: 0,  mouthShape: 'default', mouthScale: 0.7,  mouthTY: 6, mouthOpacity: 1, blinkEnabled: false },
  sleeping:  { showSmile: false, eyeLeftScaleY: 0.15, eyeLeftScaleX: 1,    eyeRightScaleY: 0.15, eyeRightScaleX: 1,    eyeTranslateY: 0,  mouthShape: 'default', mouthScale: 0,    mouthTY: 0, mouthOpacity: 1, blinkEnabled: false },
  surprised: { showSmile: false, eyeLeftScaleY: 1.08, eyeLeftScaleX: 1.03, eyeRightScaleY: 1.08, eyeRightScaleX: 1.03, eyeTranslateY: 0,  mouthShape: 'O',       mouthScale: 1,    mouthTY: 0, mouthOpacity: 1, blinkEnabled: false }
}
/* eslint-enable @stylistic/key-spacing, @stylistic/no-multi-spaces */

interface NuxiIconProps {
  mood?: NuxiMood
  interactive?: boolean
}

type EmitFn = (event: 'moodChange', mood: NuxiMood) => void

export function useNuxiIcon(props: NuxiIconProps, emit?: EmitFn) {
  const maskId = useId()
  const [svgEl, animate] = useAnimate()

  // Below `lg` the button is only CSS-hidden, so the icon stays mounted with a
  // zeroed rect. Nothing animates, listens or schedules while it is out of view.
  const isElementVisible = useElementVisibility(() => svgEl.value as unknown as SVGSVGElement | undefined)
  const isPageVisible = ref(true)
  const isAwake = computed(() => isElementVisible.value && isPageVisible.value)

  let mounted = true

  // Every timeout goes through `later` so unmounting clears the nested ones too.
  const timers = new Set<ReturnType<typeof setTimeout>>()

  function later(fn: () => void, delay: number) {
    const timer = setTimeout(() => {
      timers.delete(timer)
      if (!mounted) return
      fn()
    }, delay)
    timers.add(timer)
    return timer
  }

  function clearLater(timer: ReturnType<typeof setTimeout> | undefined) {
    if (timer === undefined) return
    clearTimeout(timer)
    timers.delete(timer)
  }

  const internalMood = ref<NuxiMood>('idle')
  const isHovered = ref(false)
  const isInProximity = ref(false)
  const lookDir = ref<LookDir>('center')
  const isBlinking = ref(false)
  const isWinking = ref(false)
  const isEasterEggPlaying = ref(false)

  const effectiveMood = computed<NuxiMood>(() => {
    if (isHovered.value) return 'excited'
    if (props.mood) return props.mood
    return internalMood.value
  })

  function setInternalMood(mood: NuxiMood, duration?: number) {
    internalMood.value = mood
    emit?.('moodChange', mood)
    if (duration) {
      later(() => {
        if (internalMood.value === mood) {
          internalMood.value = 'idle'
          emit?.('moodChange', 'idle')
        }
      }, duration)
    }
  }

  const rawOffset = reactive({ x: 0, y: 0 })
  const lerpedOffset = reactive({ x: 0, y: 0 })

  const targetOffset = computed(() => {
    const mood = effectiveMood.value
    if (mood === 'sleeping') return { x: 0, y: 2 }
    if (mood === 'thinking') return { x: -6, y: -4 }
    if (mood === 'surprised') return { x: 0, y: -8 }
    if (mood === 'excited') return { x: 0, y: -11 }
    const baseY = mood === 'happy' ? -4 : 0
    if (isInProximity.value) return { x: rawOffset.x, y: baseY + rawOffset.y }
    const look = LOOK_OFFSETS[lookDir.value]
    return { x: look.x, y: baseY + look.y }
  })

  const { pause: pauseLerp, resume: resumeLerp } = useRafFn(() => {
    const t = targetOffset.value
    const dx = t.x - lerpedOffset.x
    const dy = t.y - lerpedOffset.y

    // once the face has caught up, snap and stop: a resting icon costs no frames
    if (Math.abs(dx) < LERP_EPSILON && Math.abs(dy) < LERP_EPSILON) {
      lerpedOffset.x = t.x
      lerpedOffset.y = t.y
      pauseLerp()
      return
    }

    lerpedOffset.x += dx * LERP_FACTOR
    lerpedOffset.y += dy * LERP_FACTOR
  }, { immediate: false })

  // a new target (pointer proximity, look around, mood, attention nudge) is the
  // only thing that has to restart the loop
  watch(targetOffset, () => {
    if (isAwake.value) resumeLerp()
  })

  const faceTransform = computed(() =>
    `translate(${lerpedOffset.x}px, ${BASE_Y + lerpedOffset.y}px)`
  )

  const visual = computed(() => MOOD_VISUALS[effectiveMood.value])

  const smileOpacity = computed(() => visual.value.showSmile ? 1 : 0)

  const mouthD = computed(() => MOUTH_PATHS[visual.value.mouthShape])
  const mouthOpacity = computed(() => visual.value.mouthOpacity)

  const eyeLeftScaleY = computed(() => isBlinking.value ? 0.05 : visual.value.eyeLeftScaleY)
  const eyeRightScaleY = computed(() => isBlinking.value ? 0.05 : visual.value.eyeRightScaleY)

  const eyeLeftTransform = computed(() =>
    isWinking.value
      ? `translateY(${visual.value.eyeTranslateY}px) scale(${visual.value.eyeLeftScaleX}, 0.05)`
      : `translateY(${visual.value.eyeTranslateY}px) scale(${visual.value.eyeLeftScaleX}, ${eyeLeftScaleY.value})`
  )

  const eyeRightTransform = computed(() =>
    `translateY(${visual.value.eyeTranslateY}px) scale(${visual.value.eyeRightScaleX}, ${eyeRightScaleY.value})`
  )

  const eyeLeftTransition = computed(() =>
    (isBlinking.value || isWinking.value)
      ? 'transform 0.06s ease'
      : 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
  )

  const eyeRightTransition = computed(() =>
    isBlinking.value
      ? 'transform 0.06s ease 0.04s'
      : 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.04s'
  )

  const mouthTransform = computed(() => {
    const v = visual.value
    let scale = v.mouthScale
    let ty = v.mouthTY
    let rotate = 0

    if (isInProximity.value && effectiveMood.value !== 'sleeping' && effectiveMood.value !== 'thinking') {
      const proximity = Math.sqrt(lerpedOffset.x ** 2 + lerpedOffset.y ** 2) / 9
      scale += proximity * 0.1
      ty += proximity * 1.2
      rotate = lerpedOffset.x * 0.6
    }

    return `scale(${scale}) translateY(${ty}px) rotate(${rotate}deg)`
  })

  const bodyClass = computed(() =>
    isEasterEggPlaying.value ? '' : `nuxi-body--${effectiveMood.value}`
  )

  let lookTimer: ReturnType<typeof setTimeout> | undefined
  let blinkTimer: ReturnType<typeof setTimeout> | undefined
  let sleepTimer: ReturnType<typeof setTimeout> | undefined
  let attentionTimer: ReturnType<typeof setTimeout> | undefined
  let winkTimer: ReturnType<typeof setTimeout> | undefined

  function scheduleLook() {
    if (!mounted) return
    lookTimer = later(() => {
      if ((effectiveMood.value === 'idle' || effectiveMood.value === 'happy') && !isInProximity.value) {
        const dirs: LookDir[] = ['center', 'center', 'left', 'right', 'up']
        lookDir.value = dirs[Math.floor(Math.random() * dirs.length)] as LookDir
        later(() => {
          if (effectiveMood.value === 'idle' || effectiveMood.value === 'happy') lookDir.value = 'center'
        }, 600 + Math.random() * 500)
      }
      scheduleLook()
    }, 2000 + Math.random() * 3000)
  }

  function scheduleBlink() {
    if (!mounted) return
    blinkTimer = later(() => {
      if (visual.value.blinkEnabled && !isWinking.value) {
        isBlinking.value = true
        later(() => (isBlinking.value = false), 110)
        if (Math.random() < 0.1) {
          later(() => {
            isBlinking.value = true
            later(() => (isBlinking.value = false), 80)
          }, 200)
        }
      }
      scheduleBlink()
    }, 2200 + Math.random() * 3800)
  }

  function scheduleWink() {
    if (!mounted) return
    winkTimer = later(() => {
      if (effectiveMood.value === 'idle' || effectiveMood.value === 'happy') {
        isWinking.value = true
        later(() => (isWinking.value = false), 250)
      }
      scheduleWink()
    }, 15000 + Math.random() * 10000)
  }

  function scheduleAttention() {
    if (!mounted) return
    clearLater(attentionTimer)
    attentionTimer = later(async () => {
      if (effectiveMood.value === 'idle' && !isEasterEggPlaying.value && !props.mood) {
        await doNudge()
      }
      // the nudge takes half a second, and `stopIdleTimers` may have run in
      // the meantime: re-arming here would put the timer back
      if (isAwake.value) scheduleAttention()
    }, 12000 + Math.random() * 8000)
  }

  function resetSleepTimer() {
    clearLater(sleepTimer)
    if (isInProximity.value && !isHovered.value && internalMood.value === 'idle' && !props.mood) {
      sleepTimer = later(() => setInternalMood('sleeping'), 8000)
    }
  }

  function startIdleTimers() {
    stopIdleTimers()
    scheduleLook()
    scheduleBlink()
    scheduleWink()
    scheduleAttention()
  }

  function stopIdleTimers() {
    clearLater(lookTimer)
    clearLater(blinkTimer)
    clearLater(winkTimer)
    clearLater(attentionTimer)
    clearLater(sleepTimer)
  }

  let lastMouseX = 0
  let lastMouseY = 0
  let mouseSpeed = 0

  function handleMouseMove(e: MouseEvent) {
    const mdx = e.clientX - lastMouseX
    const mdy = e.clientY - lastMouseY
    // tracked while asleep too, or the first move after waking reads as a jolt
    // and the stale speed sets off the dizzy spell on the way out
    lastMouseX = e.clientX
    lastMouseY = e.clientY
    mouseSpeed = Math.sqrt(mdx * mdx + mdy * mdy)
    if (!isAwake.value) return

    if (!svgEl.value || isHovered.value) return
    const rect = (svgEl.value as unknown as Element).getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = e.clientX - cx
    const dy = e.clientY - cy
    const dist = Math.sqrt(dx * dx + dy * dy)

    if (dist < PROXIMITY_RADIUS && dist > 1) {
      const strength = ((PROXIMITY_RADIUS - dist) / PROXIMITY_RADIUS) * 9
      rawOffset.x = (dx / dist) * strength
      rawOffset.y = (dy / dist) * strength
      isInProximity.value = true

      if (internalMood.value === 'sleeping' && !props.mood) {
        setInternalMood('surprised', 1200)
      }

      resetSleepTimer()
      scheduleAttention()
    } else if (isInProximity.value) {
      resetProximity()
    }
  }

  function resetProximity() {
    isInProximity.value = false
    rawOffset.x = 0
    rawOffset.y = 0
    clearLater(sleepTimer)
  }

  async function doFlip() {
    if (isEasterEggPlaying.value) return
    isEasterEggPlaying.value = true

    await animate('.nuxi-body', { scaleX: 1.12, scaleY: 0.82, y: 6 }, { duration: 0.12, ease: [0.4, 0, 1, 1] })
    await animate('.nuxi-body', { scaleX: 0.88, scaleY: 1.18, y: -35 }, { duration: 0.14, ease: [0, 0, 0.2, 1] })
    await animate('.nuxi-body', {
      rotate: 360,
      y: [null, -48, -50, -48, -30],
      scaleX: [null, 0.94, 1.04, 0.94, 0.97],
      scaleY: [null, 1.06, 0.96, 1.06, 1.03]
    }, { duration: 0.6, ease: [0.15, 0.6, 0.4, 1] })
    await animate('.nuxi-body', { scaleX: 1.15, scaleY: 0.78, y: 4 }, { duration: 0.08, ease: [0.4, 0, 1, 1] })
    await animate('.nuxi-body', { scaleX: 0.96, scaleY: 1.05, y: -5 }, { duration: 0.1, ease: [0, 0, 0.2, 1] })
    await animate('.nuxi-body', { scaleX: 1, scaleY: 1, y: 0, rotate: 360 }, { duration: 0.14, ease: [0.34, 1.56, 0.64, 1] })
    await animate('.nuxi-body', { rotate: 0 }, { duration: 0 })

    isEasterEggPlaying.value = false
  }

  async function doSpin() {
    if (isEasterEggPlaying.value) return
    isEasterEggPlaying.value = true

    await animate('.nuxi-body', { rotate: 360, scale: [1, 1.12, 1.06, 1] }, { duration: 0.5, ease: [0.15, 0.6, 0.4, 1] })
    await animate('.nuxi-body', { rotate: 0 }, { duration: 0 })

    isEasterEggPlaying.value = false
  }

  async function doDance() {
    if (isEasterEggPlaying.value) return
    isEasterEggPlaying.value = true

    for (let i = 0; i < 2; i++) {
      await animate('.nuxi-body', { scaleX: 1.06, scaleY: 0.88, y: 4 }, { duration: 0.08, ease: 'easeIn' })
      await animate('.nuxi-body', { scaleX: 0.9, scaleY: 1.14, y: -18, rotate: i === 0 ? 8 : -8 }, { duration: 0.15, ease: [0, 0, 0.2, 1] })
      await animate('.nuxi-body', { scaleX: 1.08, scaleY: 0.9, y: 3, rotate: 0 }, { duration: 0.1, ease: [0.4, 0, 1, 1] })
    }
    await animate('.nuxi-body', { scaleX: 1, scaleY: 1, y: 0, rotate: 0 }, { duration: 0.15, ease: [0.34, 1.56, 0.64, 1] })

    isEasterEggPlaying.value = false
  }

  async function doNudge() {
    if (isEasterEggPlaying.value) return
    isEasterEggPlaying.value = true

    await animate('.nuxi-body', { scaleX: 1.04, scaleY: 0.94, y: 2 }, { duration: 0.1, ease: 'easeIn' })
    await animate('.nuxi-body', { scaleX: 0.96, scaleY: 1.06, y: -8, rotate: 3 }, { duration: 0.15, ease: [0, 0, 0.2, 1] })
    await animate('.nuxi-body', { scaleX: 1.02, scaleY: 0.98, y: 1, rotate: -2 }, { duration: 0.12, ease: [0.4, 0, 1, 1] })
    await animate('.nuxi-body', { scaleX: 1, scaleY: 1, y: 0, rotate: 0 }, { duration: 0.2, ease: [0.34, 1.56, 0.64, 1] })

    isEasterEggPlaying.value = false
  }

  async function doWobble() {
    if (isEasterEggPlaying.value) return
    isEasterEggPlaying.value = true

    for (let i = 0; i < 3; i++) {
      const angle = (3 - i) * 6
      await animate('.nuxi-body', { rotate: angle, y: -2 }, { duration: 0.06, ease: 'easeIn' })
      await animate('.nuxi-body', { rotate: -angle, y: -2 }, { duration: 0.06, ease: 'easeIn' })
    }
    await animate('.nuxi-body', { rotate: 0, y: 0 }, { duration: 0.15, ease: [0.34, 1.56, 0.64, 1] })

    isEasterEggPlaying.value = false
  }

  async function doDizzy() {
    if (isEasterEggPlaying.value) return
    isEasterEggPlaying.value = true

    await animate('.nuxi-body', {
      rotate: [0, -8, 12, -6, 8, -3, 0],
      y: [0, -3, -5, -2, -4, -1, 0],
      scaleX: [1, 1.04, 0.97, 1.03, 0.98, 1.01, 1],
      scaleY: [1, 0.97, 1.03, 0.98, 1.02, 0.99, 1]
    }, { duration: 0.8, ease: [0.22, 1, 0.36, 1] })

    isEasterEggPlaying.value = false
  }

  const keyBuffer: string[] = []
  let clickCount = 0
  let clickResetTimer: ReturnType<typeof setTimeout> | undefined
  let hoverCount = 0
  let hoverResetTimer: ReturnType<typeof setTimeout> | undefined

  function handleKeyDown(e: KeyboardEvent) {
    const target = e.target as HTMLElement
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return
    keyBuffer.push(e.key.toLowerCase())
    if (keyBuffer.length > 5) keyBuffer.shift()
    const buf = keyBuffer.join('')
    function trigger(fn: () => void) {
      fn()
      keyBuffer.length = 0
    }
    if (buf.endsWith('flip')) trigger(doFlip)
    else if (buf.endsWith('nuxi')) trigger(doDance)
    else if (buf.endsWith('spin')) trigger(doSpin)
    else if (buf.endsWith('hi')) {
      setInternalMood('happy', 2000)
      trigger(doNudge)
    }
  }

  function handleSvgClick() {
    clickCount++
    clearLater(clickResetTimer)
    clickResetTimer = later(() => {
      clickCount = 0
    }, 500)
    if (clickCount === 2) {
      isWinking.value = true
      later(() => (isWinking.value = false), 300)
    } else if (clickCount >= 4) {
      // the svg sits inside the Ask AI button, so the click keeps bubbling
      doWobble()
      clickCount = 0
    }
  }

  function handleMouseEnter() {
    isHovered.value = true
    hoverCount++
    clearLater(hoverResetTimer)
    hoverResetTimer = later(() => {
      hoverCount = 0
    }, 2000)
    if (hoverCount >= 4) {
      doSpin()
      hoverCount = 0
    }
    scheduleAttention()
  }

  function handleMouseLeave() {
    isHovered.value = false
    if (mouseSpeed > 60 && Math.random() < 0.4) doDizzy()
  }

  watch(isAwake, (awake) => {
    if (awake) {
      startIdleTimers()
      resumeLerp()
      return
    }

    stopIdleTimers()
    pauseLerp()
    resetProximity()
  })

  onMounted(() => {
    if (props.interactive !== false) {
      useEventListener(window, 'mousemove', handleMouseMove, { passive: true })
      useEventListener(window, 'keydown', handleKeyDown)
    }

    isPageVisible.value = !document.hidden
    useEventListener(document, 'visibilitychange', () => {
      isPageVisible.value = !document.hidden
    })
  })

  onUnmounted(() => {
    mounted = false
    for (const timer of timers) clearTimeout(timer)
    timers.clear()
  })

  return {
    maskId,
    svgEl,
    effectiveMood,
    faceTransform,
    eyeLeftPath: EYE_LEFT_PATH,
    eyeRightPath: EYE_RIGHT_PATH,
    smileLeftPath: SMILE_LEFT_PATH,
    smileRightPath: SMILE_RIGHT_PATH,
    smileOpacity,
    mouthD,
    mouthOpacity,
    eyeLeftTransform,
    eyeRightTransform,
    eyeLeftTransition,
    eyeRightTransition,
    mouthTransform,
    bodyClass,
    handleMouseEnter,
    handleMouseLeave,
    handleSvgClick
  }
}
