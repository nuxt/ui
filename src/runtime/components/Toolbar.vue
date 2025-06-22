<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/toolbar'
import type { ComponentConfig } from '../types/utils'

type Toolbar = ComponentConfig<typeof theme, AppConfig, 'toolbar'>

export interface ToolbarProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  /**
   * @defaultValue 'outline'
   */
  title?: string
  variant?: Toolbar['variants']['variant']
  class?: any
  ui?: Toolbar['slots']
}
export interface ToolbarSlots {
  default(props?: {}): any
  title(props?: {}): any
  left(props?: {}): any
  right(props?: {}): any
  center(props?: {}): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { Primitive } from 'reka-ui'
import { useAppConfig } from '#imports'
import { tv } from '../utils/tv'

const props = defineProps<ToolbarProps>()
const slots = defineSlots<ToolbarSlots>()

const appConfig = useAppConfig() as Toolbar['AppConfig']

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.toolbar || {}) })({
  variant: props.variant
}))
</script>

<template>
  <Primitive :as="as" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <slot>
      <div :class="ui.left({ class: [props.ui?.left] })">
        <slot name="left">
          <div v-if="title || !!slots.title" :class="ui.title({ class: props.ui?.title })">
            <slot name="title">
              {{ title }}
            </slot>
          </div>
        </slot>
      </div>

      <div :class="ui.center({ class: [props.ui?.center] })">
        <slot name="center" />
      </div>

      <div :class="ui.right({ class: [props.ui?.right] })">
        <slot name="right" />
      </div>
    </slot>
  </Primitive>
</template>
