<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import type { SpringOptions } from 'motion-v'
import theme from '#build/ui/changelog-versions'
import type { ChangelogVersionProps } from '../types'
import type { ComponentConfig } from '../types/tv'
import type { SlotsReturn } from '../types/utils'

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

export interface ChangelogVersionsSlots<T extends ChangelogVersionProps = ChangelogVersionProps> {
  default?(props?: {}): SlotsReturn
  indicator?(props?: {}): SlotsReturn
  header?(props: { version: T }): SlotsReturn
  badge?(props: { version: T }): SlotsReturn
  date?(props: { version: T }): SlotsReturn
  title?(props: { version: T }): SlotsReturn
  description?(props: { version: T }): SlotsReturn
  image?(props: { version: T }): SlotsReturn
  body?(props: { version: T }): SlotsReturn
  footer?(props: { version: T }): SlotsReturn
  authors?(props: { version: T }): SlotsReturn
  actions?(props: { version: T }): SlotsReturn
  indicator?(props: { version: T }): SlotsReturn
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
  <Primitive :as="as" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <div v-if="!!props.indicator || !!slots.indicator" :class="ui.indicator({ class: props.ui?.indicator })">
      <slot name="indicator">
        <Motion v-if="!!props.indicatorMotion" :class="ui.beam({ class: props.ui?.beam })" :style="{ height }" />
      </slot>
    </div>

    <div v-if="versions?.length || !!slots.default" :class="ui.container({ class: props.ui?.container })">
      <slot>
        <UChangelogVersion
          v-for="(version, index) in versions"
          :key="index"
          :indicator="!!props.indicator"
          v-bind="(version as ChangelogVersionProps)"
        >
          <template v-for="(_, name) in getProxySlots()" #[name]>
            <slot :name="name" v-bind="{ version }" />
          </template>
        </UChangelogVersion>
      </slot>
    </div>
  </Primitive>
</template>
