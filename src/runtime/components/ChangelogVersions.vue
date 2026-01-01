<!-- eslint-disable vue/block-tag-newline -->
<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import type { SpringOptions } from 'motion-v'
import theme from '#build/ui/changelog-versions'
import type { ChangelogVersionProps, ChangelogVersionSlots } from '../types'
import type { ComponentConfig } from '../types/tv'

type ChangelogVersions = ComponentConfig<typeof theme, AppConfig, 'changelogVersions'>

export interface ChangelogVersionsProps<T extends ChangelogVersionProps = ChangelogVersionProps> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  versions?: T[]
  /**
   * Display an indicator bar on the left.
   * @defaultValue true
   */
  indicator?: boolean
  /**
   * Enable scrolling motion effect on the indicator bar.
   * `{ damping: 30, restDelta: 0.001 }`{lang="ts-type"}
   * @defaultValue true
   * @see https://motion.dev/docs/vue-transitions#spring
   */
  indicatorMotion?: boolean | SpringOptions
  class?: any
  ui?: ChangelogVersions['slots']
}

type ExtendSlotWithVersion<T extends ChangelogVersionProps, K extends keyof ChangelogVersionSlots>
  = ChangelogVersionSlots[K] extends (props: infer P) => any
    ? (props: P & { version: T }) => any
    : ChangelogVersionSlots[K]

export type ChangelogVersionsSlots<T extends ChangelogVersionProps = ChangelogVersionProps> = {
  [K in keyof ChangelogVersionSlots]: ExtendSlotWithVersion<T, K>
} & {
  default(props?: {}): any
  indicator(props?: {}): any
}

</script>

<script setup lang="ts" generic="T extends ChangelogVersionProps">
import { computed } from 'vue'
import { Primitive } from 'reka-ui'
import { Motion, useScroll, useSpring, useTransform } from 'motion-v'
import { defu } from 'defu'
import { useAppConfig } from '#imports'
import { omit } from '../utils'
import { tv } from '../utils/tv'
import UChangelogVersion from './ChangelogVersion.vue'

const props = withDefaults(defineProps<ChangelogVersionsProps<T>>(), {
  indicator: true,
  indicatorMotion: true
})
const slots = defineSlots<ChangelogVersionsSlots<T>>()

const getProxySlots = () => omit(slots, ['default', 'indicator'])

const appConfig = useAppConfig() as ChangelogVersions['AppConfig']

const springOptions = computed(() => defu(typeof props.indicatorMotion === 'object' ? props.indicatorMotion : {}, { damping: 30, restDelta: 0.001 }))

const { scrollYProgress } = useScroll()
const y = useSpring(scrollYProgress, springOptions)
const height = useTransform(() => `${y.get() * 100}%`)

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.changelogVersions || {}) })())
</script>

<template>
  <Primitive :as="as" data-slot="root" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <div v-if="!!props.indicator || !!slots.indicator" data-slot="indicator" :class="ui.indicator({ class: props.ui?.indicator })">
      <slot name="indicator">
        <Motion v-if="!!props.indicatorMotion" data-slot="beam" :class="ui.beam({ class: props.ui?.beam })" :style="{ height }" />
      </slot>
    </div>

    <div v-if="versions?.length || !!slots.default" data-slot="container" :class="ui.container({ class: props.ui?.container })">
      <slot>
        <UChangelogVersion
          v-for="(version, index) in versions"
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
