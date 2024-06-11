<script lang="ts">
import { tv } from 'tailwind-variants'
import type { DrawerRootProps, DrawerRootEmits } from 'vaul-vue'
import type { DialogContentProps } from 'radix-vue'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/drawer'

const appConfig = _appConfig as AppConfig & { ui: { drawer: Partial<typeof theme> } }

const drawer = tv({ extend: tv(theme), ...(appConfig.ui?.drawer || {}) })

export interface DrawerProps extends Omit<DrawerRootProps, 'asChild'> {
  title?: string
  description?: string
  /** The content of the drawer. */
  content?: Omit<DialogContentProps, 'asChild' | 'forceMount'>
  overlay?: boolean
  /**
   * Render the drawer in a portal.
   * @defaultValue `true`
   */
  portal?: boolean
  class?: any
  ui?: Partial<typeof drawer.slots>
}

export interface DrawerEmits extends DrawerRootEmits {}

export interface DrawerSlots {
  default(): any
  handle(): any
  content(): any
  header(): any
  title(): any
  description(): any
  body(): any
  footer(): any
}
</script>

<script setup lang="ts">
import { computed, toRef } from 'vue'
import { useForwardPropsEmits } from 'radix-vue'
import { DrawerRoot, DrawerTrigger, DrawerPortal, DrawerOverlay, DrawerContent, DrawerTitle, DrawerDescription } from 'vaul-vue'
import { reactivePick } from '@vueuse/core'

const props = withDefaults(defineProps<DrawerProps>(), {
  portal: true,
  overlay: true
})
const emits = defineEmits<DrawerEmits>()
const slots = defineSlots<DrawerSlots>()

const rootProps = useForwardPropsEmits(reactivePick(props, 'activeSnapPoint', 'closeThreshold', 'defaultOpen', 'dismissible', 'fadeFromIndex', 'fixed', 'modal', 'nested', 'open', 'scrollLockTimeout', 'shouldScaleBackground', 'snapPoints'), emits)
const contentProps = toRef(() => props.content)

const ui = computed(() => tv({ extend: drawer, slots: props.ui })())
</script>

<template>
  <DrawerRoot v-bind="rootProps">
    <DrawerTrigger v-if="!!slots.default" as-child>
      <slot />
    </DrawerTrigger>

    <DrawerPortal :disabled="!portal">
      <DrawerOverlay v-if="overlay" :class="ui.overlay()" />

      <DrawerContent :class="ui.content({ class: props.class })" v-bind="contentProps">
        <slot name="handle">
          <div :class="ui.handle()" />
        </slot>

        <slot name="content">
          <div :class="ui.container()">
            <div v-if="!!slots.header || (title || !!slots.title) || (description || !!slots.description)" :class="ui.header()">
              <slot name="header">
                <DrawerTitle v-if="title || !!slots.title" :class="ui.title()">
                  <slot name="title">
                    {{ title }}
                  </slot>
                </DrawerTitle>

                <DrawerDescription v-if="description || !!slots.description" :class="ui.description()">
                  <slot name="description">
                    {{ description }}
                  </slot>
                </DrawerDescription>
              </slot>
            </div>

            <div v-if="!!slots.body" :class="ui.body()">
              <slot name="body" />
            </div>

            <div v-if="!!slots.footer" :class="ui.footer()">
              <slot name="footer" />
            </div>
          </div>
        </slot>
      </DrawerContent>
    </DrawerPortal>
  </DrawerRoot>
</template>
