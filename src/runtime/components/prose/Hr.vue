<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import type { ComponentConfig } from '../../types/tv'
import theme from '#build/ui/prose/hr'

type ProseHr = ComponentConfig<typeof theme, AppConfig, 'hr', 'ui.prose'>

export interface ProseHrProps {
  class?: any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppConfig } from '#imports'
import { tv } from '../../utils/tv'

const props = defineProps<ProseHrProps>()

const appConfig = useAppConfig() as ProseHr['AppConfig']

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.prose?.hr || {}) }))
</script>

<template>
  <hr :class="ui({ class: props.class })">
</template>
