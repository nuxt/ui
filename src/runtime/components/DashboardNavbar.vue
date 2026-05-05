<script lang="ts">
import type { VNode } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/dashboard-navbar'
import type { DashboardContext } from '../utils/dashboard'
import type { ButtonProps, IconProps, LinkPropsKeys } from '../types'
import type { ComponentConfig } from '../types/tv'

type DashboardNavbar = ComponentConfig<typeof theme, AppConfig, 'dashboardNavbar'>

export interface DashboardNavbarProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  /**
   * The icon displayed next to the title.
   * @IconifyIcon
   */
  icon?: IconProps['name']
  title?: string
  /**
   * Customize the toggle button to open the sidebar.
   * `{ color: 'neutral', variant: 'ghost' }`{lang="ts-type"}
   * @defaultValue true
   */
  toggle?: boolean | Omit<ButtonProps, LinkPropsKeys>
  /**
   * The side to render the toggle button on.
   * @defaultValue 'left'
   */
  toggleSide?: 'left' | 'right'
  class?: any
  ui?: DashboardNavbar['slots']
}

type DashboardNavbarSlotsProps = Omit<DashboardContext, 'storage' | 'storageKey' | 'persistent' | 'unit'>

export interface DashboardNavbarSlots {
  title?(props?: {}): VNode[]
  leading?(props: DashboardNavbarSlotsProps & { ui: DashboardNavbar['ui'] }): VNode[]
  trailing?(props: DashboardNavbarSlotsProps & { ui: DashboardNavbar['ui'] }): VNode[]
  left?(props: DashboardNavbarSlotsProps): VNode[]
  default?(props: DashboardNavbarSlotsProps): VNode[]
  right?(props: DashboardNavbarSlotsProps): VNode[]
  toggle?(props: DashboardNavbarSlotsProps & { ui: DashboardNavbar['ui'] }): VNode[]
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { Primitive } from 'reka-ui'
import { createReusableTemplate } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { useComponentProps } from '../composables/useComponentProps'
import { useDashboard } from '../utils/dashboard'
import { tv } from '../utils/tv'
import UDashboardSidebarToggle from './DashboardSidebarToggle.vue'
import UIcon from './Icon.vue'

defineOptions({ inheritAttrs: false })

const _props = withDefaults(defineProps<DashboardNavbarProps>(), {
  toggle: true,
  toggleSide: 'left'
})
const slots = defineSlots<DashboardNavbarSlots>()

const props = useComponentProps('dashboardNavbar', _props)

const appConfig = useAppConfig() as DashboardNavbar['AppConfig']
const dashboardContext = useDashboard({})

const [DefineToggleTemplate, ReuseToggleTemplate] = createReusableTemplate()

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.dashboardNavbar || {}) })())
</script>

<template>
  <DefineToggleTemplate>
    <slot name="toggle" v-bind="{ ...dashboardContext, ui }">
      <UDashboardSidebarToggle
        v-if="props.toggle"
        v-bind="(typeof props.toggle === 'object' ? props.toggle : {})"
        :side="props.toggleSide"
        data-slot="toggle"
        :class="ui.toggle({ class: props.ui?.toggle, toggleSide: props.toggleSide })"
      />
    </slot>
  </DefineToggleTemplate>

  <Primitive :as="props.as" v-bind="$attrs" data-slot="root" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <div data-slot="left" :class="ui.left({ class: props.ui?.left })">
      <ReuseToggleTemplate v-if="props.toggleSide === 'left'" />

      <slot name="left" v-bind="dashboardContext">
        <slot name="leading" v-bind="{ ...dashboardContext, ui }">
          <UIcon v-if="props.icon" :name="props.icon" data-slot="icon" :class="ui.icon({ class: props.ui?.icon })" />
        </slot>

        <h1 data-slot="title" :class="ui.title({ class: props.ui?.title })">
          <slot name="title">
            {{ props.title }}
          </slot>
        </h1>

        <slot name="trailing" v-bind="{ ...dashboardContext, ui }" />
      </slot>
    </div>

    <div v-if="!!slots.default" data-slot="center" :class="ui.center({ class: props.ui?.center })">
      <slot v-bind="dashboardContext" />
    </div>

    <div data-slot="right" :class="ui.right({ class: props.ui?.right })">
      <slot name="right" v-bind="dashboardContext" />

      <ReuseToggleTemplate v-if="props.toggleSide === 'right'" />
    </div>
  </Primitive>
</template>
