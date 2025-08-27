<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/prose/code-collapse'
import type { IconProps } from '../../types'
import type { ComponentConfig } from '../../types/tv'

type ProseCodeCollapse = ComponentConfig<typeof theme, AppConfig, 'codeCollapse', 'ui.prose'>

export interface ProseCodeCollapseProps {
  /**
   * The icon displayed to toggle the code.
   * @defaultValue appConfig.ui.icons.chevronDown
   */
  icon?: IconProps['name']
  /**
   * The name displayed in the trigger label.
   * @defaultValue t('prose.codeCollapse.name')
   */
  name?: string
  /**
   * The text displayed when the code is collapsed.
   * @defaultValue t('prose.codeCollapse.openText')
   */
  openText?: string
  /**
   * The text displayed when the code is expanded.
   * @defaultValue t('prose.codeCollapse.closeText')
   */
  closeText?: string
  class?: any
  ui?: ProseCodeCollapse['slots']
}

export interface ProseCodeCollapseSlots {
  default(props?: {}): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppConfig } from '#imports'
import { useLocale } from '../../composables/useLocale'
import { tv } from '../../utils/tv'
import UButton from '../Button.vue'

const props = defineProps<ProseCodeCollapseProps>()
defineSlots<ProseCodeCollapseSlots>()

const open = defineModel<boolean>('open', { default: false })

const { t } = useLocale()
const appConfig = useAppConfig() as ProseCodeCollapse['AppConfig']

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.prose?.codeCollapse || {}) })({
  open: open.value
}))
</script>

<template>
  <div :class="ui.root({ class: [props.ui?.root, props.class] })">
    <slot />

    <div :class="ui.footer({ class: props.ui?.footer })">
      <UButton
        :icon="icon || appConfig.ui.icons.chevronDown"
        color="neutral"
        variant="outline"
        :data-state="open ? 'open' : 'closed'"
        :label="`${open ? (props.closeText || t('prose.codeCollapse.closeText')) : (props.openText || t('prose.codeCollapse.openText'))} ${props.name || t('prose.codeCollapse.name')}`"
        :class="ui.trigger({ class: props.ui?.trigger })"
        :ui="{ leadingIcon: ui.triggerIcon({ class: props.ui?.triggerIcon }) }"
        @click="open = !open"
      />
    </div>
  </div>
</template>
