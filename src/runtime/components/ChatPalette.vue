<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/chat-palette'
import type { ComponentConfig } from '../types/tv'

type ChatPalette = ComponentConfig<typeof theme, AppConfig, 'chatPalette'>

export interface ChatPaletteProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  class?: any
  ui?: ChatPalette['slots']
}

export interface ChatPaletteSlots {
  default(props?: {}): any
  prompt(props?: {}): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { Primitive, Slot } from 'reka-ui'
import { useAppConfig, useComponentUiTheme } from '#imports'
import { tv } from '../utils/tv'

const props = defineProps<ChatPaletteProps>()
const slots = defineSlots<ChatPaletteSlots>()

const appConfig = useAppConfig() as ChatPalette['AppConfig']
const uiTheme = useComponentUiTheme('chatPalette', () => ({ slots: props.ui }))

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.chatPalette || {}) })())
</script>

<template>
  <Primitive :as="as" :class="ui.root({ class: [uiTheme?.slots?.root, props.class] })">
    <div :class="ui.content({ class: uiTheme?.slots?.content })">
      <Slot compact>
        <slot />
      </Slot>
    </div>

    <Slot v-if="!!slots.prompt" :class="ui.prompt({ class: uiTheme?.slots?.prompt })">
      <slot name="prompt" />
    </Slot>
  </Primitive>
</template>
