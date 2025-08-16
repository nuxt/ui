<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/dashboard-navbar'
import type { DashboardContext } from '../utils/dashboard'
import type { ButtonProps, IconProps } from '../types'
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
  toggle?: boolean | Partial<ButtonProps>
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
  title(props?: {}): any
  leading(props: DashboardNavbarSlotsProps): any
  trailing(props: DashboardNavbarSlotsProps): any
  left(props: DashboardNavbarSlotsProps): any
  default(props: DashboardNavbarSlotsProps): any
  right(props: DashboardNavbarSlotsProps): any
  toggle(props: DashboardNavbarSlotsProps): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { Primitive } from 'reka-ui'
import { createReusableTemplate } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { useDashboard } from '../utils/dashboard'
import { tv } from '../utils/tv'
import UDashboardSidebarToggle from './DashboardSidebarToggle.vue'
import UIcon from './Icon.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<DashboardNavbarProps>(), {
  toggle: true,
  toggleSide: 'left'
})
const slots = defineSlots<DashboardNavbarSlots>()

const appConfig = useAppConfig() as DashboardNavbar['AppConfig']
const dashboardContext = useDashboard({})

const [DefineToggleTemplate, ReuseToggleTemplate] = createReusableTemplate()

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.dashboardNavbar || {}) })())
</script>

<template>
  <DefineToggleTemplate>
    <slot name="toggle" v-bind="dashboardContext">
      <UDashboardSidebarToggle
        v-if="toggle"
        v-bind="(typeof toggle === 'object' ? toggle as Partial<ButtonProps> : {})"
        :side="toggleSide"
        :class="ui.toggle({ class: props.ui?.toggle, toggleSide })"
      />
    </slot>
  </DefineToggleTemplate>

  <Primitive :as="as" v-bind="$attrs" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <div :class="ui.left({ class: props.ui?.left })">
      <ReuseToggleTemplate v-if="toggleSide === 'left'" />

      <slot name="left" v-bind="dashboardContext">
        <slot name="leading" v-bind="dashboardContext">
          <UIcon v-if="icon" :name="icon" :class="ui.icon({ class: props.ui?.icon })" />
        </slot>

        <h1 :class="ui.title({ class: props.ui?.title })">
          <slot name="title">
            {{ title }}
          </slot>
        </h1>

        <slot name="trailing" v-bind="dashboardContext" />
      </slot>
    </div>

    <div v-if="!!slots.default" :class="ui.center({ class: props.ui?.center })">
      <slot v-bind="dashboardContext" />
    </div>

    <div :class="ui.right({ class: props.ui?.right })">
      <slot name="right" v-bind="dashboardContext" />

      <ReuseToggleTemplate v-if="toggleSide === 'right'" />
    </div>
  </Primitive>
</template>
