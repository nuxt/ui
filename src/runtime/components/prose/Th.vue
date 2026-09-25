<script lang="ts">
import type { VNode } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import type { ComponentConfig } from '../../types/tv'
import theme from '#build/ui/prose/th'

type ProseTh = ComponentConfig<typeof theme, AppConfig, 'th', 'ui.prose'>

export interface ProseThProps {
  align?: 'left' | 'center' | 'right'
  class?: any
  ui?: ProseTh['slots']
}

export interface ProseThSlots {
  default(props?: {}): VNode[]
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppConfig } from '#imports'
import { useComponentProps } from '../../composables/useComponentProps'
import { tv } from '../../utils/tv'

const _props = defineProps<ProseThProps>()

defineSlots<ProseThSlots>()

const props = useComponentProps('prose.th', _props, theme)

const appConfig = useAppConfig() as ProseTh['AppConfig']

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv(theme, appConfig.ui?.prose?.th)({ align: props.align }))
</script>

<template>
  <th :class="ui.base({ class: [props.ui?.base, props.class] })">
    <slot />
  </th>
</template>
