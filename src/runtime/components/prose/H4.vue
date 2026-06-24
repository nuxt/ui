<script lang="ts">
import type { VNode } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import type { ComponentConfig } from '../../types/tv'
import theme from '#build/ui/prose/h4'

type ProseH4 = ComponentConfig<typeof theme, AppConfig, 'h4', 'ui.prose'>

export interface ProseH4Props {
  id?: string
  class?: any
  ui?: ProseH4['slots']
}

export interface ProseH4Slots {
  default(props?: {}): VNode[]
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useRuntimeConfig, useAppConfig } from '#imports'
import { useComponentProps } from '../../composables/useComponentProps'
import { tv } from '../../utils/tv'

const _props = defineProps<ProseH4Props>()

defineSlots<ProseH4Slots>()

const props = useComponentProps('prose.h4', _props)

const appConfig = useAppConfig() as ProseH4['AppConfig']
const { headings } = useRuntimeConfig().public?.mdc || {}

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.prose?.h4 || {}) })())

const generate = computed(() => props.id && typeof headings?.anchorLinks === 'object' && headings.anchorLinks.h4)
</script>

<template>
  <h4 :id="props.id" :class="ui.base({ class: [props.ui?.base, props.class] })">
    <a v-if="props.id && generate" :href="`#${props.id}`" :class="ui.link({ class: props.ui?.link })">
      <slot />
    </a>
    <slot v-else />
  </h4>
</template>
