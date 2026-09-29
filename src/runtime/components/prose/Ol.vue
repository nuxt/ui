<script lang="ts">
import type { VNode } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import type { ComponentConfig } from '../../types/tv'
import theme from '../../theme/prose/ol'

type ProseOl = ComponentConfig<typeof theme, AppConfig, 'ol', 'ui.prose'>

export interface ProseOlProps {
  class?: any
  ui?: ProseOl['slots']
}

export interface ProseOlSlots {
  default(props?: {}): VNode[]
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppConfig } from '#imports'
import { useComponentProps, useComponentOverrides } from '../../composables/useComponentProps'
import { tv } from '../../utils/tv'

const _props = defineProps<ProseOlProps>()

defineSlots<ProseOlSlots>()

const props = useComponentProps('prose.ol', _props, theme)

const appConfig = useAppConfig() as ProseOl['AppConfig']
const overrides = useComponentOverrides(() => appConfig.ui?.prose?.ol)

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv(theme, overrides.value)())
</script>

<template>
  <ol :class="ui.base({ class: [props.ui?.base, props.class] })">
    <slot />
  </ol>
</template>
