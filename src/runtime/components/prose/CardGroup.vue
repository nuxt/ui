<script lang="ts">
import type { VNode } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import type { ComponentConfig } from '../../types/tv'
import theme from '../../theme/prose/card-group'

type ProseCardGroup = ComponentConfig<typeof theme, AppConfig, 'cardGroup', 'ui.prose'>

export interface ProseCardGroupProps {
  class?: any
  ui?: ProseCardGroup['slots']
}

export interface ProseCardGroupSlots {
  default(props?: {}): VNode[]
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useComponentProps, useComponentOverrides, useThemeConfig } from '../../composables/useComponentProps'
import { tv } from '../../utils/tv'

const _props = defineProps<ProseCardGroupProps>()

defineSlots<ProseCardGroupSlots>()

const props = useComponentProps('prose.cardGroup', _props, theme)

const appConfig = useThemeConfig() as ProseCardGroup['AppConfig']
const overrides = useComponentOverrides(() => appConfig.ui?.prose?.cardGroup)

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv(theme, overrides.value)())
</script>

<template>
  <div :class="ui.base({ class: [props.ui?.base, props.class] })">
    <slot />
  </div>
</template>
