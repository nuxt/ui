<script lang="ts">
import type { VNode } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/sidebar'
import type { UseResizableProps } from '../composables/useResizable'
import type { ButtonProps, DrawerProps, IconProps, ModalProps, SlideoverProps, LinkPropsKeys } from '../types'
import type { ComponentConfig } from '../types/tv'

type Sidebar = ComponentConfig<typeof theme, AppConfig, 'sidebar'>

type SidebarState = 'expanded' | 'collapsed'
type SidebarMode = 'modal' | 'slideover' | 'drawer'
type SidebarMenu<T> = T extends 'modal' ? ModalProps : T extends 'slideover' ? SlideoverProps : T extends 'drawer' ? DrawerProps : never

export interface SidebarProps<T extends SidebarMode = SidebarMode> extends Pick<UseResizableProps, 'id' | 'minSize' | 'maxSize' | 'defaultSize' | 'collapsedSize'> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'aside'
   */
  as?: any
  /**
   * The visual variant of the sidebar.
   * @defaultValue 'sidebar'
   */
  variant?: Sidebar['variants']['variant']
  /**
   * The collapse behavior of the sidebar.
   * - `offcanvas`: The sidebar slides out of view completely.
   * - `icon`: The sidebar shrinks to icon-only width.
   * - `none`: The sidebar is not collapsible.
   * @defaultValue 'offcanvas'
   */
  collapsible?: Sidebar['variants']['collapsible']
  /**
   * The side to render the sidebar on.
   * @defaultValue 'left'
   */
  side?: Sidebar['variants']['side']
  /**
   * The title displayed in the sidebar header.
   */
  title?: string
  /**
   * The description displayed in the sidebar header.
   */
  description?: string
  /**
   * Display a close button to collapse the sidebar.
   * Only renders when `collapsible` is not `none`.
   * `{ size: 'md', color: 'neutral', variant: 'ghost' }`{lang="ts-type"}
   * @defaultValue false
   */
  close?: boolean | Omit<ButtonProps, LinkPropsKeys>
  /**
   * The icon displayed in the close button.
   * @defaultValue appConfig.ui.icons.close
   * @IconifyIcon
   */
  closeIcon?: IconProps['name']
  /**
   * Display a rail on the sidebar edge to toggle collapse.
   * When `resizable` is also enabled, the rail acts as a drag-to-resize handle.
   * @defaultValue false
   */
  rail?: boolean
  /**
   * Whether to allow the user to resize the sidebar by dragging the rail.
   * Requires `rail` to be enabled. Drag to resize between `minSize` and `maxSize`.
   * When `collapsible` is not `none`, dragging below `minSize` snaps to collapsed.
   * Double-click the rail to reset to `defaultSize`.
   * @defaultValue false
   */
  resizable?: boolean
  /**
   * The mode of the sidebar menu on mobile.
   * @defaultValue 'slideover'
   */
  mode?: T
  /**
   * The props for the sidebar menu component on mobile.
   */
  menu?: SidebarMenu<T>
  class?: any
  ui?: Sidebar['slots']
}

export interface SidebarSlots {
  header?(props: { state: SidebarState, open: boolean, close: () => void }): VNode[]
  title?(props: { state: SidebarState }): VNode[]
  description?(props: { state: SidebarState }): VNode[]
  actions?(props: { state: SidebarState }): VNode[]
  close?(props: { ui: Sidebar['ui'], state: SidebarState }): VNode[]
  default?(props: { state: SidebarState, open: boolean, close: () => void }): VNode[]
  footer?(props: { state: SidebarState, open: boolean, close: () => void }): VNode[]
  rail?(props: { ui: Sidebar['ui'], state: SidebarState }): VNode[]
  content?(props: { close: () => void }): VNode[]
}
</script>

<script setup lang="ts" generic="T extends SidebarMode">
import { computed, onMounted, ref, toRef, useId, watch } from 'vue'
import { Primitive } from 'reka-ui'
import { defu } from 'defu'
import { createReusableTemplate, useMediaQuery } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { useComponentUI } from '../composables/useComponentUI'
import { useLocale } from '../composables/useLocale'
import { useResizable } from '../composables/useResizable'
import { tv } from '../utils/tv'
import UButton from './Button.vue'
import USlideover from './Slideover.vue'
import UModal from './Modal.vue'
import UDrawer from './Drawer.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<SidebarProps<T>>(), {
  as: 'aside',
  variant: 'sidebar',
  collapsible: 'offcanvas',
  side: 'left',
  close: false,
  rail: false,
  resizable: false,
  minSize: 12,
  maxSize: 24,
  defaultSize: 16,
  collapsedSize: 0,
  mode: 'slideover' as never
})
const slots = defineSlots<SidebarSlots>()

const [DefineInnerTemplate, ReuseInnerTemplate] = createReusableTemplate()
const [DefineContentTemplate, ReuseContentTemplate] = createReusableTemplate()

const mediaQuery = useMediaQuery('(max-width: 1023px)')
const isMounted = ref(false)
onMounted(() => {
  isMounted.value = true
})
const isMobile = computed(() => isMounted.value && mediaQuery.value)

// Viewport-aware open model: on desktop controls expanded/collapsed, on mobile controls the sheet
const modelOpen = defineModel<boolean>('open', { default: true })
const openMobile = ref(false)

// Saved desktop state so viewport transitions don't lose it
const desktopOpen = ref(modelOpen.value)

const open = computed({
  get: () => isMobile.value ? openMobile.value : modelOpen.value,
  set: (value: boolean) => {
    if (isMobile.value) {
      openMobile.value = value
    } else {
      modelOpen.value = value
    }
  }
})

// Handle viewport transitions and initial mobile state
watch(isMobile, (mobile) => {
  if (mobile) {
    // Save desktop state and align model to mobile (closed)
    desktopOpen.value = modelOpen.value
    modelOpen.value = false
  } else {
    // Restore desktop state
    modelOpen.value = desktopOpen.value
  }
}, { immediate: true })

// Sync model changes into mobile state
watch(modelOpen, (value) => {
  if (isMobile.value) {
    openMobile.value = value
  }
})

// Sync mobile dismissal (overlay click, swipe) back to model so toggle stays in sync
watch(openMobile, (value) => {
  if (isMobile.value) {
    modelOpen.value = value
  }
})

const { t } = useLocale()
const appConfig = useAppConfig() as Sidebar['AppConfig']
const uiProp = useComponentUI('sidebar', props)

// Resizable rail integration
const isResizable = computed(() => props.rail && props.resizable)
const canCollapse = computed(() => isResizable.value && props.collapsible !== 'none')
const sidebarId = `sidebar-${props.id || useId()}`
const desktopCollapsed = ref(!modelOpen.value)

const { el: containerEl, size: sidebarSize, isDragging, isCollapsed, onMouseDown: handleMouseDown, onTouchStart: handleTouchStart, onDoubleClick: handleDoubleClick, collapse } = useResizable(sidebarId, computed(() => ({
  side: props.side,
  minSize: props.minSize,
  maxSize: props.maxSize,
  defaultSize: props.defaultSize,
  resizable: isResizable.value,
  collapsible: canCollapse.value,
  collapsedSize: props.collapsedSize || Math.max(0, props.minSize - 8),
  unit: 'rem' as const,
  persistent: true,
  storage: 'cookie' as const
})), { collapsed: desktopCollapsed })

// Track whether mousedown resulted in a drag (to distinguish click vs drag on the rail)
let didDrag = false

function onRailMouseDown(e: MouseEvent) {
  didDrag = false
  const startX = e.clientX
  const onMove = (ev: MouseEvent) => { if (Math.abs(ev.clientX - startX) > 3) didDrag = true }
  const onUp = () => { document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp) }
  document.addEventListener('mousemove', onMove)
  document.addEventListener('mouseup', onUp)
  handleMouseDown(e)
}

function onRailClick() {
  if (!isResizable.value) return (open.value = !open.value)
  if (!didDrag && canCollapse.value) collapse(!isCollapsed.value)
}

// Dynamic cursor: ew-resize (bidirectional) by default, directional at bounds
const railCursor = computed(() => {
  if (!isResizable.value) return undefined
  if (isCollapsed.value) return props.side === 'left' ? 'e-resize' : 'w-resize'
  if (expandedWidth.value >= props.maxSize) return props.side === 'left' ? 'w-resize' : 'e-resize'
  return 'ew-resize'
})

// Track expanded width for --sidebar-width (so offcanvas slide-out uses the correct value when collapsed)
const expandedWidth = ref(props.defaultSize)
watch(sidebarSize, (v) => {
  if (!isCollapsed.value) expandedWidth.value = v
}, { immediate: true })

// Sync useResizable collapse ↔ open model
watch(isCollapsed, (collapsed) => {
  if (!isMobile.value && canCollapse.value) modelOpen.value = !collapsed
})
watch(modelOpen, (v) => {
  if (!isMobile.value && canCollapse.value && isCollapsed.value === v) collapse(!v)
})

const state = computed<SidebarState>(() => open.value ? 'expanded' : 'collapsed')

// Close button only works when collapsible is not 'none'
const canClose = computed(() => (props.close && props.collapsible !== 'none') || isMobile.value)

function closeSidebar() {
  open.value = false
}

const hasHeader = computed(() => !!slots.header || props.title || !!slots.title || props.description || !!slots.description || !!slots.actions || canClose.value || !!slots.close)

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.sidebar || {}) })({
  side: props.side,
  variant: props.variant,
  collapsible: props.collapsible
}))

const Menu = computed(() => ({
  slideover: USlideover,
  modal: UModal,
  drawer: UDrawer
})[props.mode as SidebarMode])

const menuProps = toRef(() => defu(props.menu, {
  title: props.title,
  description: props.description,
  close: props.close,
  closeIcon: props.closeIcon
}, props.mode === 'modal' ? { } : props.mode === 'slideover' ? { side: props.side, inset: props.variant === 'inset' } : {}) as SidebarMenu<T>)
</script>

<template>
  <DefineContentTemplate>
    <div v-if="hasHeader" data-slot="header" :class="ui.header({ class: uiProp?.header })">
      <slot name="header" :state="state" :open="open" :close="closeSidebar">
        <div v-if="title || !!slots.title || description || !!slots.description" data-slot="wrapper" :class="ui.wrapper({ class: uiProp?.wrapper })">
          <p v-if="title || !!slots.title" data-slot="title" :class="ui.title({ class: uiProp?.title })">
            <slot name="title" :state="state">
              {{ title }}
            </slot>
          </p>

          <p v-if="description || !!slots.description" data-slot="description" :class="ui.description({ class: uiProp?.description })">
            <slot name="description" :state="state">
              {{ description }}
            </slot>
          </p>
        </div>

        <div v-if="!!slots.actions || canClose" data-slot="actions" :class="ui.actions({ class: uiProp?.actions })">
          <slot name="actions" :state="state" />

          <slot name="close" :state="state" :ui="ui">
            <UButton
              v-if="canClose"
              :icon="closeIcon || appConfig.ui.icons.close"
              color="neutral"
              variant="ghost"
              :aria-label="t('sidebar.close')"
              v-bind="(typeof props.close === 'object' ? props.close : {})"
              data-slot="close"
              :class="ui.close({ class: uiProp?.close })"
              @click="closeSidebar"
            />
          </slot>
        </div>
      </slot>
    </div>

    <div data-slot="body" :class="ui.body({ class: uiProp?.body })">
      <slot :state="state" :open="open" :close="closeSidebar" />
    </div>

    <div v-if="!!slots.footer" data-slot="footer" :class="ui.footer({ class: uiProp?.footer })">
      <slot name="footer" :state="state" :open="open" :close="closeSidebar" />
    </div>
  </DefineContentTemplate>

  <DefineInnerTemplate>
    <div data-slot="inner" :class="ui.inner({ class: uiProp?.inner })">
      <ReuseContentTemplate />
    </div>
  </DefineInnerTemplate>

  <!-- Non-collapsible: simple inline sidebar -->
  <Primitive
    v-if="collapsible === 'none'"
    :as="as"
    v-bind="$attrs"
    data-slot="root"
    :data-variant="variant"
    :class="ui.root({ class: [uiProp?.root, props.class] })"
  >
    <ReuseInnerTemplate />
  </Primitive>

  <!-- Collapsible: fixed sidebar with gap spacer + mobile menu -->
  <template v-else>
    <Primitive
      :as="as"
      v-bind="$attrs"
      data-slot="root"
      :data-state="state"
      :data-collapsible="state === 'collapsed' ? collapsible : undefined"
      :data-variant="variant"
      :data-side="side"
      :data-dragging="isDragging || undefined"
      :class="ui.root({ class: [uiProp?.root, props.class] })"
      :style="isResizable ? {
        '--sidebar-width': `${expandedWidth}rem`,
        ...(props.collapsedSize && props.collapsible === 'icon' ? { '--sidebar-width-icon': `${props.collapsedSize}rem` } : {})
      } : undefined"
    >
      <!-- Gap spacer: reserves layout space for the fixed sidebar -->
      <div
        data-slot="gap"
        :data-state="state"
        :class="ui.gap({ class: uiProp?.gap })"
      />

      <!-- Fixed container: the actual visible sidebar -->
      <div
        :ref="isResizable ? (el: any) => { containerEl = el } : undefined"
        data-slot="container"
        :data-state="state"
        :class="ui.container({ class: uiProp?.container })"
      >
        <ReuseInnerTemplate />

        <slot v-if="rail" name="rail" :state="state" :ui="ui">
          <button
            data-slot="rail"
            :data-state="state"
            :aria-label="t('sidebar.toggle')"
            :tabindex="-1"
            :class="ui.rail({ class: uiProp?.rail })"
            :style="railCursor ? { cursor: railCursor } : undefined"
            @mousedown="isResizable ? onRailMouseDown($event) : undefined"
            @touchstart="isResizable && !isCollapsed ? handleTouchStart($event) : undefined"
            @dblclick="isResizable ? handleDoubleClick($event) : undefined"
            @click="onRailClick"
          />
        </slot>
      </div>
    </Primitive>

    <!-- Mobile menu -->
    <Menu
      v-if="isMobile"
      v-model:open="openMobile"
      v-bind="menuProps"
    >
      <template #content="contentData">
        <slot name="content" v-bind="contentData" :close="closeSidebar">
          <ReuseContentTemplate />
        </slot>
      </template>
    </Menu>
  </template>
</template>
