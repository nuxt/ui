<script lang="ts">
import { tv, type VariantProps } from 'tailwind-variants'
import type { DialogRootProps, DialogRootEmits, DialogContentProps } from 'radix-vue'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/slideover'
import type { ButtonProps } from '../types'

const appConfig = _appConfig as AppConfig & { ui: { slideover: Partial<typeof theme> } }

const slideover = tv({ extend: tv(theme), ...(appConfig.ui?.slideover || {}) })

type SlideoverVariants = VariantProps<typeof slideover>

export interface SlideoverProps extends DialogRootProps {
  title?: string
  description?: string
  /** The content of the slideover. */
  content?: Omit<DialogContentProps, 'as' | 'asChild' | 'forceMount'>
  /**
   * Display an overlay behind the slideover.
   * @defaultValue true
   */
  overlay?: boolean
  /**
   * Open & close the slideover with a transition.
   * @defaultValue true
   */
  transition?: boolean
  side?: SlideoverVariants['side']
  /**
   * Render the slideover in a portal.
   * @defaultValue true
   */
  portal?: boolean
  /**
   * Display a close button to dismiss the slideover.
   * `{ size: 'md', color: 'gray', variant: 'ghost' }`{lang="ts-type"}
   * @defaultValue true
   */
  close?: ButtonProps | boolean
  /**
   * The icon displayed in the close button.
   * @defaultValue appConfig.ui.icons.close
   */
  closeIcon?: string
  /** When `true`, the slideover will not close when clicking outside. */
  preventClose?: boolean
  class?: any
  ui?: Partial<typeof slideover.slots>
}

export interface SlideoverEmits extends DialogRootEmits {}

export interface SlideoverSlots {
  default(props: { open: boolean }): any
  content(props?: {}): any
  header(props?: {}): any
  title(props?: {}): any
  description(props?: {}): any
  close(props: { ui: any }): any
  body(props?: {}): any
  footer(props?: {}): any
}
</script>

<script setup lang="ts">
import { computed, toRef } from 'vue'
import { DialogRoot, DialogTrigger, DialogPortal, DialogOverlay, DialogContent, DialogTitle, DialogDescription, DialogClose, useForwardPropsEmits } from 'radix-vue'
import { reactivePick } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { UButton } from '#components'

const props = withDefaults(defineProps<SlideoverProps>(), {
  close: true,
  portal: true,
  overlay: true,
  transition: true,
  side: 'right'
})
const emits = defineEmits<SlideoverEmits>()
const slots = defineSlots<SlideoverSlots>()

const rootProps = useForwardPropsEmits(reactivePick(props, 'open', 'defaultOpen', 'modal'), emits)
const contentProps = toRef(() => props.content)
const contentEvents = computed(() => {
  if (props.preventClose) {
    return {
      pointerDownOutside: (e: Event) => e.preventDefault(),
      interactOutside: (e: Event) => e.preventDefault()
    }
  }

  return {}
})

const appConfig = useAppConfig()

const ui = computed(() => slideover({
  transition: props.transition,
  side: props.side
}))
</script>

<template>
  <DialogRoot v-slot="{ open }" v-bind="rootProps">
    <DialogTrigger v-if="!!slots.default" as-child>
      <slot :open="open" />
    </DialogTrigger>

    <DialogPortal :disabled="!portal">
      <DialogOverlay v-if="overlay" :class="ui.overlay({ class: props.ui?.overlay })" />

      <DialogContent :data-side="side" :class="ui.content({ class: props.class })" v-bind="contentProps" v-on="contentEvents">
        <slot name="content">
          <div v-if="!!slots.header || (title || !!slots.title) || (description || !!slots.description) || (close || !!slots.close)" :class="ui.header({ class: props.ui?.header })">
            <slot name="header">
              <DialogTitle v-if="title || !!slots.title" :class="ui.title({ class: props.ui?.title })">
                <slot name="title">
                  {{ title }}
                </slot>
              </DialogTitle>

              <DialogDescription v-if="description || !!slots.description" :class="ui.description({ class: props.ui?.description })">
                <slot name="description">
                  {{ description }}
                </slot>
              </DialogDescription>

              <DialogClose as-child>
                <slot name="close" :ui="ui">
                  <UButton
                    v-if="close"
                    :icon="closeIcon || appConfig.ui.icons.close"
                    size="md"
                    color="gray"
                    variant="ghost"
                    aria-label="Close"
                    v-bind="typeof close === 'object' ? close : undefined"
                    :class="ui.close({ class: props.ui?.close })"
                  />
                </slot>
              </DialogClose>
            </slot>
          </div>

          <div :class="ui.body({ class: props.ui?.body })">
            <slot name="body" />
          </div>

          <div v-if="!!slots.footer" :class="ui.footer({ class: props.ui?.footer })">
            <slot name="footer" />
          </div>
        </slot>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
