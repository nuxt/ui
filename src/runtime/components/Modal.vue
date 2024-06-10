<script lang="ts">
import { tv } from 'tailwind-variants'
import type { DialogRootProps, DialogRootEmits, DialogContentProps } from 'radix-vue'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/modal'
import type { ButtonProps } from '#ui/types'

const appConfig = _appConfig as AppConfig & { ui: { modal: Partial<typeof theme> } }

const modal = tv({ extend: tv(theme), ...(appConfig.ui?.modal || {}) })

export interface ModalProps extends DialogRootProps {
  title?: string
  description?: string
  content?: Omit<DialogContentProps, 'asChild' | 'forceMount'>
  overlay?: boolean
  transition?: boolean
  fullscreen?: boolean
  preventClose?: boolean
  portal?: boolean
  close?: ButtonProps | null
  class?: any
  ui?: Partial<typeof modal.slots>
}

export interface ModalEmits extends DialogRootEmits {}

export interface ModalSlots {
  default(props: { open: boolean }): any
  content(): any
  header(): any
  title(): any
  description(): any
  close(props: { class: string }): any
  body(): any
  footer(): any
}
</script>

<script setup lang="ts">
import { computed, toRef } from 'vue'
import { DialogRoot, DialogTrigger, DialogPortal, DialogOverlay, DialogContent, DialogTitle, DialogDescription, DialogClose, useForwardPropsEmits } from 'radix-vue'
import { reactivePick } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { UButton } from '#components'

const props = withDefaults(defineProps<ModalProps>(), {
  portal: true,
  overlay: true,
  transition: true
})
const emits = defineEmits<ModalEmits>()
const slots = defineSlots<ModalSlots>()

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

const ui = computed(() => tv({ extend: modal, slots: props.ui })({
  transition: props.transition,
  fullscreen: props.fullscreen
}))
</script>

<template>
  <DialogRoot v-slot="{ open }" v-bind="rootProps">
    <DialogTrigger v-if="!!slots.default" as-child>
      <slot :open="open" />
    </DialogTrigger>

    <DialogPortal :disabled="!portal">
      <DialogOverlay v-if="overlay" :class="ui.overlay()" />

      <DialogContent :class="ui.content({ class: props.class })" v-bind="contentProps" v-on="contentEvents">
        <slot name="content">
          <div v-if="!!slots.header || (title || !!slots.title) || (description || !!slots.description) || (close !== null || !!slots.close)" :class="ui.header()">
            <slot name="header">
              <DialogTitle v-if="title || !!slots.title" :class="ui.title()">
                <slot name="title">
                  {{ title }}
                </slot>
              </DialogTitle>

              <DialogDescription v-if="description || !!slots.description" :class="ui.description()">
                <slot name="description">
                  {{ description }}
                </slot>
              </DialogDescription>

              <DialogClose as-child>
                <slot name="close" :class="ui.close()">
                  <UButton
                    v-if="close !== null"
                    :icon="appConfig.ui.icons.close"
                    size="md"
                    color="gray"
                    variant="ghost"
                    aria-label="Close"
                    v-bind="close"
                    :class="ui.close()"
                  />
                </slot>
              </DialogClose>
            </slot>
          </div>

          <div v-if="!!slots.body" :class="ui.body()">
            <slot name="body" />
          </div>

          <div v-if="!!slots.footer" :class="ui.footer()">
            <slot name="footer" />
          </div>
        </slot>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
