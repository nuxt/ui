<script lang="ts">
import type { VNode } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import theme from '../../theme/prose/code-collapse'
import type { IconProps } from '../Icon.vue'
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
  default(props?: {}): VNode[]
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppConfig } from '#imports'
import { useComponentProps, useComponentOverrides } from '../../composables/useComponentProps'
import { useLocale } from '../../composables/useLocale'
import { tv } from '../../utils/tv'
import UButton from '../Button.vue'

const _props = defineProps<ProseCodeCollapseProps>()

defineSlots<ProseCodeCollapseSlots>()

const props = useComponentProps('prose.codeCollapse', _props, theme)

const open = defineModel<boolean>('open', { default: false })

const { t } = useLocale()
const appConfig = useAppConfig() as ProseCodeCollapse['AppConfig']
const overrides = useComponentOverrides(() => appConfig.ui?.prose?.codeCollapse)

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv(theme, overrides.value)({
  open: open.value
}))
</script>

<template>
  <div :class="ui.root({ class: [props.ui?.root, props.class] })">
    <slot />

    <div :class="ui.footer({ class: props.ui?.footer })">
      <UButton
        :icon="props.icon || appConfig.ui.icons.chevronDown"
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
