<script lang="ts">
import { tv } from 'tailwind-variants'
import type { AspectRatioProps as AspectRatioRootProps } from 'radix-vue'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/aspect-ratio'

const appConfig = _appConfig as AppConfig & { ui: { aspectRatio: Partial<typeof theme> } }

const aspectRatio = tv({ extend: tv(theme), ...(appConfig.ui?.aspectRatio || {}) })

export interface AspectRatioProps extends AspectRatioRootProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'span'
   */
  as?: any
  class?: any
  ui?: Partial<typeof aspectRatio.slots>
}

export interface AspectRatioSlots {
  default(props?: {}): any
}
</script>

<script setup lang="ts">
import { AspectRatio, useForwardProps } from 'radix-vue'
import { reactivePick } from '@vueuse/core'

const props = defineProps<AspectRatioProps>()
defineSlots<AspectRatioSlots>()

const rootProps = useForwardProps(reactivePick(props, 'as', 'asChild', 'ratio'))

// eslint-disable-next-line vue/no-dupe-keys
const ui = aspectRatio()
</script>

<template>
  <AspectRatio v-bind="rootProps" :class="ui.root({ class: [props.class, props.ui?.root] })">
    <slot />
  </AspectRatio>
</template>
