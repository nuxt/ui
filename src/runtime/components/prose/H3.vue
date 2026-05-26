<script lang="ts">
import type { VNode } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/prose/h3'
import type { ComponentConfig } from '../../types/tv'

type ProseH3 = ComponentConfig<typeof theme, AppConfig, 'h3', 'ui.prose'>

export interface ProseH3Props {
  id?: string
  class?: any
  ui?: ProseH3['slots']
}

export interface ProseH3Slots {
  default(props?: {}): VNode[]
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useRuntimeConfig, useAppConfig } from '#imports'
import { useComponentProps } from '../../composables/useComponentProps'
import { tv } from '../../utils/tv'
import UIcon from '../Icon.vue'

const _props = defineProps<ProseH3Props>()

defineSlots<ProseH3Slots>()

const props = useComponentProps('prose.h3', _props)

const appConfig = useAppConfig() as ProseH3['AppConfig']
const { headings } = useRuntimeConfig().public?.mdc || {}

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.prose?.h3 || {}) })())

const generate = computed(() => props.id && typeof headings?.anchorLinks === 'object' && headings.anchorLinks.h3)
</script>

<template>
  <h3 :id="props.id" :class="ui.base({ class: [props.ui?.base, props.class] })">
    <a v-if="props.id && generate" :href="`#${props.id}`" :class="ui.link({ class: props.ui?.link })">
      <span :class="ui.leading({ class: props.ui?.leading })">
        <UIcon :name="appConfig.ui.icons.hash" :class="ui.leadingIcon({ class: props.ui?.leadingIcon })" />
      </span>

      <slot />
    </a>
    <slot v-else />
  </h3>
</template>
