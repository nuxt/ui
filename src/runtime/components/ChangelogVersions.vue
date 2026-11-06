<!-- eslint-disable vue/block-tag-newline -->
<script lang="ts">
import type { VNode } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import theme from '../theme/changelog-versions'
import type { ChangelogVersionProps, ChangelogVersionSlots } from './ChangelogVersion.vue'
import type { ComponentConfig } from '../types/tv'

type ChangelogVersions = ComponentConfig<typeof theme, AppConfig, 'changelogVersions'>

export interface ChangelogVersionsIndicator {
  /**
   * The scroll container the indicator tracks. Defaults to the page.
   */
  container?: HTMLElement | null
}

export interface ChangelogVersionsProps<T extends ChangelogVersionProps = ChangelogVersionProps> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  versions?: T[]
  /**
   * Display an indicator bar on the left.
   * By default, the indicator tracks the scroll of the page.
   * @defaultValue true
   */
  indicator?: boolean | ChangelogVersionsIndicator
  /**
   * Fill the indicator bar as the page scrolls.
   * @defaultValue true
   */
  indicatorMotion?: boolean
  class?: any
  ui?: ChangelogVersions['slots']
}

type ExtendSlotWithVersion<T extends ChangelogVersionProps, K extends keyof ChangelogVersionSlots>
  = Required<ChangelogVersionSlots>[K] extends (props: infer P) => VNode[]
    ? (props: P & { version: T }) => VNode[]
    : Required<ChangelogVersionSlots>[K]

export type ChangelogVersionsSlots<T extends ChangelogVersionProps = ChangelogVersionProps> = {
  [K in keyof ChangelogVersionSlots]?: ExtendSlotWithVersion<T, K>
} & {
  default?(props?: {}): VNode[]
  indicator?(props?: {}): VNode[]
}

</script>

<script setup lang="ts" generic="T extends ChangelogVersionProps">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { Primitive } from 'reka-ui'
import { defaultWindow, useEventListener, usePreferredReducedMotion } from '@vueuse/core'
import { useComponentProps, useComponentOverrides } from '../composables/useComponentProps'
import { omit } from '../utils'
import { tv } from '../utils/tv'
import UChangelogVersion from './ChangelogVersion.vue'

const _props = withDefaults(defineProps<ChangelogVersionsProps<T>>(), {
  indicator: true,
  indicatorMotion: true
})
const slots = defineSlots<ChangelogVersionsSlots<T>>()

const props = useComponentProps<ChangelogVersionsProps<T>>('changelogVersions', _props, theme)

const getProxySlots = () => omit(slots, ['default', 'indicator'])

const overrides = useComponentOverrides((ui: ChangelogVersions['AppConfig']['ui']) => ui.changelogVersions)

const container = computed(() => (typeof props.indicator === 'object' && props.indicator.container) || undefined)
const reducedMotion = usePreferredReducedMotion()

const progress = ref(0)
let frame: number | undefined
let lastTime: number | undefined

function readProgress() {
  const el = container.value
  const scrolled = el ? el.scrollTop : window.scrollY
  const max = el ? el.scrollHeight - el.clientHeight : document.documentElement.scrollHeight - window.innerHeight
  return max > 0 ? Math.min(Math.max(scrolled / max, 0), 1) : 0
}

// Eases the beam towards the scroll position, so it trails the scroll slightly instead of jumping with each wheel step
function tick(time: number) {
  const target = readProgress()
  const elapsed = lastTime === undefined ? 16 : time - lastTime
  const next = reducedMotion.value === 'reduce' ? target : progress.value + (target - progress.value) * (1 - Math.exp(-elapsed / 100))

  progress.value = Math.abs(target - next) < 0.001 ? target : next

  if (progress.value === target) {
    frame = undefined
    lastTime = undefined
  } else {
    lastTime = time
    frame = requestAnimationFrame(tick)
  }
}

function update() {
  if (!props.indicator || !props.indicatorMotion || frame !== undefined) {
    return
  }

  frame = requestAnimationFrame(tick)
}

useEventListener(() => container.value ?? defaultWindow, 'scroll', update, { passive: true })
useEventListener(defaultWindow, 'resize', update, { passive: true })

onMounted(update)
onBeforeUnmount(() => {
  if (frame !== undefined) {
    cancelAnimationFrame(frame)
  }
})

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv(theme, overrides.value)())
</script>

<template>
  <Primitive :as="props.as" data-slot="changelog-versions" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <div v-if="!!props.indicator || !!slots.indicator" data-slot="changelog-versions-indicator" :class="ui.indicator({ class: props.ui?.indicator })">
      <slot name="indicator">
        <div v-if="!!props.indicatorMotion" data-slot="changelog-versions-beam" :class="ui.beam({ class: props.ui?.beam })" :style="{ transform: `scaleY(${progress})` }" />
      </slot>
    </div>

    <div v-if="props.versions?.length || !!slots.default" data-slot="changelog-versions-container" :class="ui.container({ class: props.ui?.container })">
      <slot>
        <UChangelogVersion
          v-for="(version, index) in props.versions"
          :key="index"
          :indicator="!!props.indicator"
          v-bind="(version as ChangelogVersionProps)"
        >
          <template v-for="(_, name) in getProxySlots()" #[name]="slotData">
            <slot :name="name" v-bind="(slotData as any)" :version="version" />
          </template>
        </UChangelogVersion>
      </slot>
    </div>
  </Primitive>
</template>
