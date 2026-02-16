<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import type { ComponentConfig } from '../../types/tv'
import theme from '#build/ui/prose/th'

type ProseTh = ComponentConfig<typeof theme, AppConfig, 'th', 'ui.prose'>

export interface ProseThProps {
  align?: 'left' | 'center' | 'right'
  class?: any
  ui?: { base?: any }
}

export interface ProseThSlots {
  default(props?: {}): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppConfig } from '#imports'
import { useComponentUI } from '../../composables/useComponentUI'
import { tv } from '../../utils/tv'

const props = defineProps<ProseThProps>()
defineSlots<ProseThSlots>()

const appConfig = useAppConfig() as ProseTh['AppConfig']
const uiProp = useComponentUI('prose.th', props)

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.prose?.th || {}) }))
</script>

<template>
  <th :class="ui({ align: props.align, class: [uiProp?.base, props.class] })">
    <slot />
  </th>
</template>
