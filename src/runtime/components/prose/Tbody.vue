<script lang="ts">
import type { VNode } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import type { ComponentConfig } from '../../types/tv'
import theme from '#build/ui/prose/tbody'

type ProseTbody = ComponentConfig<typeof theme, AppConfig, 'tbody', 'ui.prose'>

export interface ProseTbodyProps {
  class?: any
  ui?: { base?: any }
}

export interface ProseTbodySlots {
  default(props?: {}): VNode[]
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppConfig } from '#imports'
import { useComponentProps } from '../../composables/useComponentProps'
import { tv } from '../../utils/tv'

const _props = defineProps<ProseTbodyProps>()

defineSlots<ProseTbodySlots>()

const props = useComponentProps('prose.tbody', _props)

const appConfig = useAppConfig() as ProseTbody['AppConfig']

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.prose?.tbody || {}) }))
</script>

<template>
  <tbody :class="ui({ class: [props.ui?.base, props.class] })">
    <slot />
  </tbody>
</template>
