<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import type { ComponentConfig } from '../../types/tv'
import theme from '#build/ui/prose/h1'

type ProseH1 = ComponentConfig<typeof theme, AppConfig, 'h1', 'ui.prose'>

export interface ProseH1Props {
  id?: string
  class?: any
  ui?: ProseH1['slots']
}

export interface ProseH1Slots {
  default(props?: {}): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppConfig, useRuntimeConfig } from '#imports'
import { tv } from '../../utils/tv'

const props = defineProps<ProseH1Props>()
defineSlots<ProseH1Slots>()

const appConfig = useAppConfig() as ProseH1['AppConfig']
const { headings } = useRuntimeConfig().public?.mdc || {}

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.prose?.h1 || {}) })())

const generate = computed(() => props.id && typeof headings?.anchorLinks === 'object' && headings.anchorLinks.h1)
</script>

<template>
  <h1 :id="id" :class="ui.base({ class: props.class })">
    <a v-if="id && generate" :href="`#${id}`" :class="ui.link({ class: props.ui?.link })">
      <slot />
    </a>
    <slot v-else />
  </h1>
</template>
