<script lang="ts">
import type { DialogRootProps, DialogRootEmits, DialogContentProps, DialogContentEmits } from 'reka-ui'
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/modal'
import type { ButtonProps } from '../types'
import type { EmitsToProps, ComponentConfig } from '../types/utils'

type Modal = ComponentConfig<typeof theme, AppConfig, 'modal'>

export interface ModalProps extends DialogRootProps {
  title?: string
  description?: string
  /** The content of the modal. */
  content?: Omit<DialogContentProps, 'as' | 'asChild' | 'forceMount'> & Partial<EmitsToProps<DialogContentEmits>>
  /**
   * Render an overlay behind the modal.
   * @defaultValue true
   */
  overlay?: boolean
  /**
   * Animate the modal when opening or closing.
   * @defaultValue true
   */
  transition?: boolean
  /**
   * When `true`, the modal will take up the full screen.
   * @defaultValue false
   */
  fullscreen?: boolean
  /**
   * Render the modal in a portal.
   * @defaultValue true
   */
  portal?: boolean | string | HTMLElement
  /**
   * Display a close button to dismiss the modal.
   * `{ size: 'md', color: 'neutral', variant: 'ghost' }`{lang="ts-type"}
   * @defaultValue true
   */
  close?: boolean | Partial<ButtonProps>
  /**
   * The icon displayed in the close button.
   * @defaultValue appConfig.ui.icons.close
   * @IconifyIcon
   */
  closeIcon?: string
  /**
   * When `false`, the modal will not close when clicking outside or pressing escape.
   * @defaultValue true
   */
  dismissible?: boolean
  class?: any
  ui?: Modal['slots']
}

export interface ModalEmits extends DialogRootEmits {
  'after:leave': []
  'after:enter': []
  'close:prevent': []
}

export interface ModalSlots {
  default(props: { open: boolean, animating: boolean }): any
  content(props: { close: () => void, animating: boolean }): any
  header(props: { close: () => void, animating: boolean }): any
  title(props: { animating: boolean }): any
  description(props: { animating: boolean }): any
  actions(props: { animating: boolean }): any
  close(props: { close: () => void, ui: { [K in keyof Required<Modal['slots']>]: (props?: Record<string, any>) => string }, animating: boolean }): any
  body(props: { close: () => void, animating: boolean }): any
  footer(props: { close: () => void, animating: boolean }): any
}
</script>

<script setup lang="ts">
import { computed, toRef, ref, watch } from 'vue'
import { DialogRoot, DialogTrigger, DialogPortal, DialogOverlay, DialogContent, DialogTitle, DialogDescription, DialogClose, VisuallyHidden, useForwardPropsEmits } from 'reka-ui'
import { reactivePick } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { useLocale } from '../composables/useLocale'
import { usePortal } from '../composables/usePortal'
import { tv } from '../utils/tv'
import UButton from './Button.vue'

const props = withDefaults(defineProps<ModalProps>(), {
  close: true,
  portal: true,
  overlay: true,
  transition: true,
  modal: true,
  dismissible: true
})
const emits = defineEmits<ModalEmits>()
const slots = defineSlots<ModalSlots>()

const { t } = useLocale()
const appConfig = useAppConfig() as Modal['AppConfig']

const animating = ref(false)

const rootProps = useForwardPropsEmits(reactivePick(props, 'open', 'defaultOpen', 'modal'), emits)
const portalProps = usePortal(toRef(() => props.portal))
const contentProps = toRef(() => props.content)
const contentEvents = computed(() => {
  const defaultEvents = {
    closeAutoFocus: (e: Event) => e.preventDefault()
  }

  if (!props.dismissible) {
    const events = ['pointerDownOutside', 'interactOutside', 'escapeKeyDown']

    return events.reduce((acc, curr) => {
      acc[curr] = (e: Event) => {
        e.preventDefault()
        emits('close:prevent')
      }
      return acc
    }, defaultEvents as Record<typeof events[number] | keyof typeof defaultEvents, (e: Event) => void>)
  }

  return defaultEvents
})

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.modal || {}) })({
  transition: props.transition,
  fullscreen: props.fullscreen
}))

watch(() => props.open, () => {
  if (props.transition) {
    animating.value = true
  }
})

function handleAfterEnter() {
  animating.value = false
  emits('after:enter')
}

function handleAfterLeave() {
  animating.value = false
  emits('after:leave')
}
</script>

<!-- eslint-disable vue/no-template-shadow -->
<template>
  <DialogRoot v-slot="{ open, close }" v-bind="rootProps">
    <DialogTrigger v-if="!!slots.default" as-child :class="props.class">
      <slot :open="open" :animating="animating" />
    </DialogTrigger>

    <DialogPortal v-bind="portalProps">
      <DialogOverlay v-if="overlay" :class="ui.overlay({ class: props.ui?.overlay })" />

      <DialogContent :class="ui.content({ class: [!slots.default && props.class, props.ui?.content] })" v-bind="contentProps" @after-enter="handleAfterEnter" @after-leave="handleAfterLeave" v-on="contentEvents">
        <VisuallyHidden v-if="!!slots.content && ((title || !!slots.title) || (description || !!slots.description))">
          <DialogTitle v-if="title || !!slots.title">
            <slot name="title" :animating="animating">
              {{ title }}
            </slot>
          </DialogTitle>

          <DialogDescription v-if="description || !!slots.description">
            <slot name="description" :animating="animating">
              {{ description }}
            </slot>
          </DialogDescription>
        </VisuallyHidden>

        <slot name="content" :close="close" :animating="animating">
          <div v-if="!!slots.header || (title || !!slots.title) || (description || !!slots.description) || (props.close || !!slots.close)" :class="ui.header({ class: props.ui?.header })">
            <slot name="header" :close="close" :animating="animating">
              <div :class="ui.wrapper({ class: props.ui?.wrapper })">
                <DialogTitle v-if="title || !!slots.title" :class="ui.title({ class: props.ui?.title })">
                  <slot name="title" :animating="animating">
                    {{ title }}
                  </slot>
                </DialogTitle>

                <DialogDescription v-if="description || !!slots.description" :class="ui.description({ class: props.ui?.description })">
                  <slot name="description" :animating="animating">
                    {{ description }}
                  </slot>
                </DialogDescription>
              </div>

              <slot name="actions" :animating="animating" />

              <DialogClose v-if="props.close || !!slots.close" as-child>
                <slot name="close" :close="close" :ui="ui" :animating="animating">
                  <UButton
                    v-if="props.close"
                    :icon="closeIcon || appConfig.ui.icons.close"
                    color="neutral"
                    variant="ghost"
                    :aria-label="t('modal.close')"
                    v-bind="(typeof props.close === 'object' ? props.close as Partial<ButtonProps> : {})"
                    :class="ui.close({ class: props.ui?.close })"
                  />
                </slot>
              </DialogClose>
            </slot>
          </div>

          <div v-if="!!slots.body" :class="ui.body({ class: props.ui?.body })">
            <slot name="body" :close="close" :animating="animating" />
          </div>

          <div v-if="!!slots.footer" :class="ui.footer({ class: props.ui?.footer })">
            <slot name="footer" :close="close" :animating="animating" />
          </div>
        </slot>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
