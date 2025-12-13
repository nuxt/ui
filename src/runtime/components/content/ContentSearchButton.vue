<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/content/content-search-button'
import type { ButtonProps, ButtonSlots, IconProps, KbdProps, TooltipProps, LinkPropsKeys } from '../../types'
import type { ComponentConfig } from '../../types/tv'

type ContentSearchButton = ComponentConfig<typeof theme, AppConfig, 'contentSearchButton'>

export interface ContentSearchButtonProps extends Omit<ButtonProps, LinkPropsKeys | 'icon' | 'label' | 'color' | 'variant'> {
  /**
   * The icon displayed in the button.
   * @defaultValue appConfig.ui.icons.search
   * @IconifyIcon
   */
  icon?: IconProps['name']
  /**
   * The label displayed in the button.
   * @defaultValue t('contentSearchButton.label')
   */
  label?: string
  /**
   * The color of the button.
   * @defaultValue 'neutral'
   */
  color?: ButtonProps['color']
  /**
   * The variant of the button.
   * Defaults to 'outline' when not collapsed, 'ghost' when collapsed.
   */
  variant?: ButtonProps['variant']
  /**
   * Whether the button is collapsed.
   * @defaultValue true
   */
  collapsed?: boolean
  /**
   * Display a tooltip on the button when is collapsed with the button label.
   * This has priority over the global `tooltip` prop.
   */
  tooltip?: boolean | TooltipProps
  /**
   * The keyboard keys to display in the button.
   * `{ variant: 'subtle' }`{lang="ts-type"}
   * @defaultValue ['meta', 'k']
   */
  kbds?: KbdProps['value'][] | KbdProps[]
  ui?: ContentSearchButton['slots'] & ButtonProps['ui']
  class?: any
}
</script>

<script setup lang="ts">
import { computed, toRef } from 'vue'
import { useForwardProps } from 'reka-ui'
import { defu } from 'defu'
import { reactiveOmit, createReusableTemplate } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { useContentSearch } from '../../composables/useContentSearch'
import { useLocale } from '../../composables/useLocale'
import { omit, transformUI } from '../../utils'
import { tv } from '../../utils/tv'
import UButton from '../Button.vue'
import UKbd from '../Kbd.vue'
import UTooltip from '../Tooltip.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<ContentSearchButtonProps>(), {
  color: 'neutral',
  collapsed: true,
  tooltip: false,
  kbds: () => ['meta', 'k']
})
const slots = defineSlots<ButtonSlots>()

const [DefineButtonTemplate, ReuseButtonTemplate] = createReusableTemplate()

const getProxySlots = () => omit(slots, ['trailing'])

const buttonProps = useForwardProps(reactiveOmit(props, 'icon', 'label', 'variant', 'collapsed', 'tooltip', 'kbds', 'class', 'ui'))
const tooltipProps = toRef(() => defu(typeof props.tooltip === 'boolean' ? {} : props.tooltip, { delayDuration: 0, content: { side: 'right' } }) as TooltipProps)

const { t } = useLocale()
const { open } = useContentSearch()
const appConfig = useAppConfig() as ContentSearchButton['AppConfig']

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.contentSearchButton || {}) })({
  collapsed: props.collapsed
}))
</script>

<template>
  <DefineButtonTemplate>
    <UButton
      :icon="icon || appConfig.ui.icons.search"
      :label="label || t('contentSearchButton.label')"
      :variant="variant || (collapsed ? 'ghost' : 'outline')"
      v-bind="{
        ...buttonProps,
        ...(collapsed ? {
          'square': true,
          'aria-label': label || t('contentSearchButton.label')
        } : {}),
        ...$attrs
      }"
      :class="ui.base({ class: [props.ui?.base, props.class] })"
      :ui="transformUI(ui, props.ui)"
      @click="open = true"
    >
      <template v-for="(_, name) in getProxySlots()" #[name]="slotData">
        <slot :name="name" v-bind="slotData" />
      </template>

      <template #trailing="{ ui: uiProxy }">
        <div data-slot="trailing" :class="ui.trailing({ class: props.ui?.trailing })">
          <slot name="trailing" :ui="uiProxy">
            <template v-if="kbds?.length">
              <UKbd v-for="(kbd, index) in kbds" :key="index" variant="subtle" v-bind="typeof kbd === 'string' ? { value: kbd } : kbd" />
            </template>
          </slot>
        </div>
      </template>
    </UButton>
  </DefineButtonTemplate>

  <UTooltip v-if="collapsed && tooltip" :text="label || t('contentSearchButton.label')" v-bind="tooltipProps">
    <ReuseButtonTemplate />
  </UTooltip>
  <ReuseButtonTemplate v-else />
</template>
