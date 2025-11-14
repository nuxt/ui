<script lang="ts">
import type { DrawerRootProps, DrawerRootEmits } from 'vaul-vue'
import type { DialogContentProps, DialogContentEmits } from 'reka-ui'
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/drawer'
import type { EmitsToProps } from '../types/utils'
import type { ComponentConfig } from '../types/tv'

type Drawer = ComponentConfig<typeof theme, AppConfig, 'drawer'>

export interface DrawerProps extends Pick<DrawerRootProps, 'activeSnapPoint' | 'closeThreshold' | 'shouldScaleBackground' | 'setBackgroundColorOnScale' | 'scrollLockTimeout' | 'fixed' | 'dismissible' | 'modal' | 'open' | 'defaultOpen' | 'nested' | 'direction' | 'noBodyStyles' | 'handleOnly' | 'preventScrollRestoration' | 'snapPoints'> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  title?: string
  description?: string
  /**
   * Whether to inset the drawer from the edges.
   * @defaultValue false
   */
  inset?: boolean
  /** The content of the drawer. */
  content?: Omit<DialogContentProps, 'as' | 'asChild' | 'forceMount'> & Partial<EmitsToProps<DialogContentEmits>>
  /**
   * Render an overlay behind the drawer.
   * @defaultValue true
   */
  overlay?: boolean
  /**
   * Render a handle on the drawer.
   * @defaultValue true
   */
  handle?: boolean
  /**
   * Render the drawer in a portal.
   * @defaultValue true
   */
  portal?: boolean | string | HTMLElement
  /**
   * Whether the drawer is nested in another drawer.
   * @defaultValue false
   */
  nested?: boolean
  class?: any
  ui?: Drawer['slots']
}

export interface DrawerEmits extends DrawerRootEmits {
  (e: 'close:prevent'): void
}

export interface DrawerSlots {
  default(props?: {}): any
  content(props?: {}): any
  header(props?: {}): any
  title(props?: {}): any
  description(props?: {}): any
  body(props?: {}): any
  footer(props?: {}): any
}
</script>

<script setup lang="ts">
import { computed, toRef } from 'vue'
import { VisuallyHidden, useForwardPropsEmits } from 'reka-ui'
import { DrawerRoot, DrawerRootNested, DrawerTrigger, DrawerPortal, DrawerOverlay, DrawerContent, DrawerTitle, DrawerDescription, DrawerHandle } from 'vaul-vue'
import { reactivePick } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { usePortal } from '../composables/usePortal'
import { tv } from '../utils/tv'

const props = withDefaults(defineProps<DrawerProps>(), {
  direction: 'bottom',
  portal: true,
  overlay: true,
  handle: true,
  modal: true,
  dismissible: true
})
const emits = defineEmits<DrawerEmits>()
const slots = defineSlots<DrawerSlots>()

const appConfig = useAppConfig() as Drawer['AppConfig']

const rootProps = useForwardPropsEmits(reactivePick(props, 'activeSnapPoint', 'closeThreshold', 'shouldScaleBackground', 'setBackgroundColorOnScale', 'scrollLockTimeout', 'fixed', 'dismissible', 'modal', 'open', 'defaultOpen', 'nested', 'direction', 'noBodyStyles', 'handleOnly', 'preventScrollRestoration', 'snapPoints'), emits)
const portalProps = usePortal(toRef(() => props.portal))
const contentProps = toRef(() => props.content)
const contentEvents = computed(() => {
  if (!props.dismissible) {
    const events = ['pointerDownOutside', 'interactOutside', 'escapeKeyDown']

    return events.reduce((acc, curr) => {
      acc[curr] = (e: Event) => {
        e.preventDefault()
        emits('close:prevent')
      }
      return acc
    }, {} as Record<typeof events[number], (e: Event) => void>)
  }

  return {}
})

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.drawer || {}) })({
  direction: props.direction,
  inset: props.inset,
  snapPoints: props.snapPoints && props.snapPoints.length > 0
}))
</script>

<template>
  <component :is="nested ? DrawerRootNested : DrawerRoot" v-bind="rootProps">
    <DrawerTrigger v-if="!!slots.default" as-child :class="props.class">
      <slot />
    </DrawerTrigger>

    <DrawerPortal v-bind="portalProps">
      <DrawerOverlay v-if="overlay" data-slot="overlay" :class="ui.overlay({ class: props.ui?.overlay })" />

      <DrawerContent data-slot="content" :class="ui.content({ class: [!slots.default && props.class, props.ui?.content] })" v-bind="contentProps" v-on="contentEvents">
        <DrawerHandle v-if="handle" data-slot="handle" :class="ui.handle({ class: props.ui?.handle })" />

        <VisuallyHidden v-if="!!slots.content && ((title || !!slots.title) || (description || !!slots.description))">
          <DrawerTitle v-if="title || !!slots.title">
            <slot name="title">
              {{ title }}
            </slot>
          </DrawerTitle>

          <DrawerDescription v-if="description || !!slots.description">
            <slot name="description">
              {{ description }}
            </slot>
          </DrawerDescription>
        </VisuallyHidden>

        <slot name="content">
          <div data-slot="container" :class="ui.container({ class: props.ui?.container })">
            <div v-if="!!slots.header || (title || !!slots.title) || (description || !!slots.description)" data-slot="header" :class="ui.header({ class: props.ui?.header })">
              <slot name="header">
                <DrawerTitle v-if="title || !!slots.title" data-slot="title" :class="ui.title({ class: props.ui?.title })">
                  <slot name="title">
                    {{ title }}
                  </slot>
                </DrawerTitle>

                <DrawerDescription v-if="description || !!slots.description" data-slot="description" :class="ui.description({ class: props.ui?.description })">
                  <slot name="description">
                    {{ description }}
                  </slot>
                </DrawerDescription>
              </slot>
            </div>

            <div v-if="!!slots.body" data-slot="body" :class="ui.body({ class: props.ui?.body })">
              <slot name="body" />
            </div>

            <div v-if="!!slots.footer" data-slot="footer" :class="ui.footer({ class: props.ui?.footer })">
              <slot name="footer" />
            </div>
          </div>
        </slot>
      </DrawerContent>
    </DrawerPortal>
  </component>
</template>
