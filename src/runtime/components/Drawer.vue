<script lang="ts">
import type { DrawerRootProps, DrawerRootEmits } from 'vaul-vue'
import type { DialogContentProps } from 'reka-ui'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/drawer'
import { tv } from '../utils/tv'

const appConfigDrawer = _appConfig as AppConfig & { ui: { drawer: Partial<typeof theme> } }

const drawer = tv({ extend: tv(theme), ...(appConfigDrawer.ui?.drawer || {}) })

export interface DrawerProps extends Pick<DrawerRootProps, 'activeSnapPoint' | 'closeThreshold' | 'defaultOpen' | 'direction' | 'fadeFromIndex' | 'fixed' | 'modal' | 'nested' | 'direction' | 'open' | 'scrollLockTimeout' | 'shouldScaleBackground' | 'snapPoints'> {
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
  content?: Omit<DialogContentProps, 'as' | 'asChild' | 'forceMount'>
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
  portal?: boolean
  /**
   * When `false`, the drawer will not close when clicking outside or pressing escape.
   * @defaultValue true
   */
  dismissible?: boolean
  class?: any
  ui?: Partial<typeof drawer.slots>
}

export interface DrawerEmits extends DrawerRootEmits {}

export interface DrawerSlots {
  default(props?: {}): any
  handle(props?: {}): any
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
import { useForwardPropsEmits } from 'reka-ui'
import { DrawerRoot, DrawerTrigger, DrawerPortal, DrawerOverlay, DrawerContent, DrawerTitle, DrawerDescription } from 'vaul-vue'
import { reactivePick } from '@vueuse/core'

const props = withDefaults(defineProps<DrawerProps>(), {
  direction: 'bottom',
  portal: true,
  overlay: true,
  handle: true
})
const emits = defineEmits<DrawerEmits>()
const slots = defineSlots<DrawerSlots>()

const rootProps = useForwardPropsEmits(reactivePick(props, 'activeSnapPoint', 'closeThreshold', 'defaultOpen', 'dismissible', 'fadeFromIndex', 'fixed', 'modal', 'nested', 'direction', 'open', 'scrollLockTimeout', 'shouldScaleBackground', 'snapPoints'), emits)
const contentProps = toRef(() => props.content)
const contentEvents = {
  closeAutoFocus: (e: Event) => e.preventDefault()
}

const ui = computed(() => drawer({
  direction: props.direction,
  inset: props.inset
}))
</script>

<template>
  <DrawerRoot v-bind="rootProps">
    <DrawerTrigger v-if="!!slots.default" as-child :class="props.class">
      <slot />
    </DrawerTrigger>

    <DrawerPortal :disabled="!portal">
      <DrawerOverlay v-if="overlay" :class="ui.overlay({ class: props.ui?.overlay })" />

      <DrawerContent :class="ui.content({ class: [!slots.default && props.class, props.ui?.content] })" v-bind="contentProps" v-on="contentEvents">
        <slot name="handle">
          <div v-if="handle" :class="ui.handle({ class: props.ui?.handle })" />
        </slot>

        <slot name="content">
          <div :class="ui.container({ class: props.ui?.container })">
            <div v-if="!!slots.header || (title || !!slots.title) || (description || !!slots.description)" :class="ui.header({ class: props.ui?.header })">
              <slot name="header">
                <DrawerTitle v-if="title || !!slots.title" :class="ui.title({ class: props.ui?.title })">
                  <slot name="title">
                    {{ title }}
                  </slot>
                </DrawerTitle>

                <DrawerDescription v-if="description || !!slots.description" :class="ui.description({ class: props.ui?.description })">
                  <slot name="description">
                    {{ description }}
                  </slot>
                </DrawerDescription>
              </slot>
            </div>

            <div v-if="!!slots.body" :class="ui.body({ class: props.ui?.body })">
              <slot name="body" />
            </div>

            <div v-if="!!slots.footer" :class="ui.footer({ class: props.ui?.footer })">
              <slot name="footer" />
            </div>
          </div>
        </slot>
      </DrawerContent>
    </DrawerPortal>
  </DrawerRoot>
</template>
