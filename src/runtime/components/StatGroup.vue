<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/stat-group'
import type { ComponentConfig } from '../types/tv'

type StatGroup = ComponentConfig<typeof theme, AppConfig, 'statGroup'>

export interface StatGroupProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'section'
   */
  as?: any
  /**
   * Number of columns in the grid layout.
   * @defaultValue 4
   */
  cols?: 1 | 2 | 3 | 4
  /**
   * Gap between grid items.
   * @defaultValue 'md'
   */
  gap?: StatGroup['variants']['gap']
  /**
   * Optional title for the group.
   */
  title?: string
  class?: any
  ui?: StatGroup['slots']
}

export interface StatGroupSlots {
  header(props: { ui: StatGroup['ui'] }): any
  title(props: { title?: string, ui: StatGroup['ui'] }): any
  actions(props: { ui: StatGroup['ui'] }): any
  default(props: { ui: StatGroup['ui'] }): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { Primitive } from 'reka-ui'
import { useAppConfig } from '#imports'
import { tv } from '../utils/tv'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<StatGroupProps>(), {
  as: 'section',
  cols: 4,
  gap: 'md'
})

const slots = defineSlots<StatGroupSlots>()

const appConfig = useAppConfig() as StatGroup['AppConfig']

const ui = computed(() => {
  const extendedTheme = appConfig.ui?.statGroup
  const themeConfig = extendedTheme
    ? {
        ...extendedTheme,
        defaultVariants: extendedTheme.defaultVariants
          ? {
              ...extendedTheme.defaultVariants,
              cols: typeof extendedTheme.defaultVariants.cols === 'number'
                ? (String(extendedTheme.defaultVariants.cols) as '1' | '2' | '3' | '4')
                : extendedTheme.defaultVariants.cols
            }
          : undefined
      }
    : undefined

  return tv({ extend: tv(theme as any), ...themeConfig })({
    cols: String(props.cols) as '1' | '2' | '3' | '4',
    gap: props.gap
  }) as StatGroup['ui']
})
</script>

<template>
  <Primitive
    :as="as"
    data-slot="root"
    :class="ui.root({ class: [props.ui?.root, props.class] })"
    v-bind="$attrs"
  >
    <div v-if="title || !!slots.title || !!slots.header || !!slots.actions" data-slot="header" :class="ui.header({ class: props.ui?.header })">
      <slot name="header" :ui="ui">
        <div v-if="title || !!slots.title" data-slot="title" :class="ui.title({ class: props.ui?.title })">
          <slot name="title" :title="title" :ui="ui">
            {{ title }}
          </slot>
        </div>
        <div v-if="!!slots.actions" data-slot="actions" :class="ui.actions({ class: props.ui?.actions })">
          <slot name="actions" :ui="ui" />
        </div>
      </slot>
    </div>

    <div data-slot="grid" :class="ui.grid({ class: props.ui?.grid })">
      <slot :ui="ui" />
    </div>
  </Primitive>
</template>
