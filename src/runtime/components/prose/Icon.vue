<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import theme from '../../theme/prose/icon'
import type { ComponentConfig } from '../../types/tv'

type ProseIcon = ComponentConfig<typeof theme, AppConfig, 'icon', 'ui.prose'>

export interface ProseIconProps {
  name: string
  class?: any
  ui?: ProseIcon['slots']
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppConfig } from '#imports'
import { useComponentProps, useComponentOverrides } from '../../composables/useComponentProps'
import { tv } from '../../utils/tv'
import UIcon from '../Icon.vue'

const _props = defineProps<ProseIconProps>()

const props = useComponentProps('prose.icon', _props, theme)

const appConfig = useAppConfig() as ProseIcon['AppConfig']
const overrides = useComponentOverrides(() => appConfig.ui?.prose?.icon)

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv(theme, overrides.value)())
</script>

<template>
  <UIcon :name="props.name" :class="ui.base({ class: [props.ui?.base, props.class] })" />
</template>
