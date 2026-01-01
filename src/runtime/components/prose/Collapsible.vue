<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/prose/collapsible'
import type { IconProps, CollapsibleProps } from '../../types'
import type { ComponentConfig } from '../../types/tv'

type ProseCollapsible = ComponentConfig<typeof theme, AppConfig, 'collapsible', 'ui.prose'>

export interface ProseCollapsibleProps {
  /**
   * The icon displayed to toggle the collapsible.
   * @defaultValue appConfig.ui.icons.chevronDown
   */
  icon?: IconProps['name']
  /**
   * The name displayed in the trigger label.
   * @defaultValue t('prose.collapsible.name')
   */
  name?: string
  /**
   * The text displayed when the collapsible is open.
   * @defaultValue t('prose.collapsible.openText')
   */
  openText?: string
  /**
   * The text displayed when the collapsible is closed.
   * @defaultValue t('prose.collapsible.closeText')
   */
  closeText?: string
  class?: any
  ui?: ProseCollapsible['slots'] & CollapsibleProps['ui']
}

export interface ProseCollapsibleSlots {
  default(props?: {}): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppConfig } from '#imports'
import { useLocale } from '../../composables/useLocale'
import { transformUI } from '../../utils'
import { tv } from '../../utils/tv'
import UCollapsible from '../Collapsible.vue'
import UIcon from '../Icon.vue'

const props = defineProps<ProseCollapsibleProps>()
defineSlots<ProseCollapsibleSlots>()

const { t } = useLocale()
const appConfig = useAppConfig() as ProseCollapsible['AppConfig']

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.prose?.collapsible || {}) })())
</script>

<template>
  <UCollapsible :unmount-on-hide="false" :class="props.class" :ui="transformUI(ui, props.ui)">
    <template #default="{ open }">
      <button :class="ui.trigger({ class: props.ui?.trigger })">
        <UIcon :name="icon || appConfig.ui.icons.chevronDown" :class="ui.triggerIcon({ class: props.ui?.triggerIcon })" />

        <span :class="ui.triggerLabel({ class: props.ui?.triggerLabel })">
          {{ open ? (props.closeText || t('prose.collapsible.closeText')) : (props.openText || t('prose.collapsible.openText')) }} {{ props.name || t('prose.collapsible.name') }}
        </span>
      </button>
    </template>

    <template #content>
      <slot />
    </template>
  </UCollapsible>
</template>
