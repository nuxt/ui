<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/prose/icon'
import type { ComponentConfig } from '../../types/tv'

type ProseIcon = ComponentConfig<typeof theme, AppConfig, 'icon', 'ui.prose'>

export interface ProseIconProps {
  name: string
  class?: any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppConfig } from '#imports'
import { tv } from '../../utils/tv'
import UIcon from '../Icon.vue'

const props = defineProps<ProseIconProps>()

const appConfig = useAppConfig() as ProseIcon['AppConfig']

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.prose?.icon || {}) }))
</script>

<template>
  <UIcon :name="name" :class="ui({ class: props.class })" />
</template>
