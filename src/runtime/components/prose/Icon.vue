<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/prose/icon'
import type { ComponentConfig } from '../../types/tv'

type ProseIcon = ComponentConfig<typeof theme, AppConfig, 'icon', 'ui.prose'>

export interface ProseIconProps {
  name: string
  class?: any
  ui?: { base?: any }
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppConfig } from '#imports'
import { useComponentProps } from '../../composables/useComponentProps'
import { tv } from '../../utils/tv'
import UIcon from '../Icon.vue'

const _props = defineProps<ProseIconProps>()

const props = useComponentProps('prose.icon', _props)

const appConfig = useAppConfig() as ProseIcon['AppConfig']

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.prose?.icon || {}) }))
</script>

<template>
  <UIcon :name="props.name" :class="ui({ class: [props.ui?.base, props.class] })" />
</template>
