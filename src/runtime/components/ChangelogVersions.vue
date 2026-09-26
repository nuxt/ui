<!-- eslint-disable vue/block-tag-newline -->
<script lang="ts">
import type { VNode } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import type { SpringOptions, UseScrollOptions } from 'motion-v'
import theme from '../theme/changelog-versions'
import type { ChangelogVersionProps, ChangelogVersionSlots } from './ChangelogVersion.vue'
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
   * By default, the indicator will track the scroll of the page. (https://motion.dev/docs/vue-use-scroll#page-scroll)
   * @defaultValue true
   * @see https://motion.dev/docs/vue-use-scroll#api
   */
  indicator?: boolean | UseScrollOptions
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
import { computed } from 'vue'
import { Primitive } from 'reka-ui'
import { Motion, useScroll, useSpring, useTransform } from 'motion-v'
import { defu } from 'defu'
import { useComponentProps, useComponentOverrides, useThemeConfig } from '../composables/useComponentProps'
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

const appConfig = useThemeConfig() as ChangelogVersions['AppConfig']
const overrides = useComponentOverrides(() => appConfig.ui?.changelogVersions)

const springOptions = computed(() => defu(typeof props.indicatorMotion === 'object' ? props.indicatorMotion : {}, { damping: 30, restDelta: 0.001 }))
const scrollOptions = computed(() => typeof props.indicator === 'object' ? props.indicator : {})

const { scrollYProgress } = useScroll(scrollOptions.value)
const y = useSpring(scrollYProgress, springOptions)
const height = useTransform(() => `${Number(y.get()) * 100}%`)

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv(theme, overrides.value)())
</script>

<template>
  <Primitive :as="props.as" data-slot="changelog-versions" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <div v-if="!!props.indicator || !!slots.indicator" data-slot="changelog-versions-indicator" :class="ui.indicator({ class: props.ui?.indicator })">
      <slot name="indicator">
        <Motion v-if="!!props.indicatorMotion" data-slot="changelog-versions-beam" :class="ui.beam({ class: props.ui?.beam })" :style="{ height }" />
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
