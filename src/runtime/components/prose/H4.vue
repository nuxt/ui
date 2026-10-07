<script lang="ts">
import type { VNode } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import type { ComponentConfig } from '../../types/tv'
import theme from '#build/ui/prose/h4'

type ProseH4 = ComponentConfig<typeof theme, AppConfig, 'h4', 'ui.prose'>

export interface ProseH4Props {
  id?: string
  /**
   * Wrap the heading in an anchor link when an `id` is present.
   * `@nuxt/content` and `@nuxtjs/mdc` enable this for H2–H4 by default.
   * @defaultValue false
   */
  anchor?: boolean
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
// NOTE: the `mdc.headings.anchorLinks` fallback is deprecated, remove in v5 in favor of the `anchor` prop.
const { headings } = useRuntimeConfig().public?.mdc || {}

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: theme, ...(appConfig.ui?.prose?.h4 || {}) })())

const generate = computed(() => props.id && (props.anchor ?? (typeof headings?.anchorLinks === 'boolean' ? headings.anchorLinks : headings?.anchorLinks?.h4) ?? false))
</script>

<template>
  <h4 :id="props.id" :class="ui.base({ class: [props.ui?.base, props.class] })">
    <a v-if="props.id && generate" :href="`#${props.id}`" :class="ui.link({ class: props.ui?.link })">
      <slot />
    </a>
    <slot v-else />
  </h4>
</template>
