<script lang="ts">
import type { VNode } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import type { ComponentConfig } from '../../types/tv'
import theme from '../../theme/prose/code'

type ProseCode = ComponentConfig<typeof theme, AppConfig, 'code', 'ui.prose'>

export interface ProseCodeProps {
  lang?: string
  /**
   * @defaultValue 'neutral'
   */
  color?: ProseCode['variants']['color']
  class?: any
  ui?: ProseCode['slots']
}

export interface ProseCodeSlots {
  default(props?: {}): VNode[]
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useComponentProps, useComponentOverrides, useThemeConfig } from '../../composables/useComponentProps'
import { tv } from '../../utils/tv'

const _props = defineProps<ProseCodeProps>()

defineSlots<ProseCodeSlots>()

const props = useComponentProps('prose.code', _props, theme)

const appConfig = useThemeConfig() as ProseCode['AppConfig']
const overrides = useComponentOverrides(() => appConfig.ui?.prose?.code)

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv(theme, overrides.value)({ color: props.color }))
</script>

<template>
  <code :class="ui.base({ class: [props.ui?.base, (props.class || '').split(',').join(' ')] })">
    <slot />
  </code>
</template>
