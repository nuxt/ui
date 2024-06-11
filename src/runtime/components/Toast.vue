<script lang="ts">
import { isVNode, type VNode } from 'vue'
import { tv, type VariantProps } from 'tailwind-variants'
import type { ToastRootProps, ToastRootEmits } from 'radix-vue'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/toast'
import type { AvatarProps, ButtonProps, ToasterContext } from '#ui/types'

const appConfig = _appConfig as AppConfig & { ui: { toast: Partial<typeof theme> } }

const toast = tv({ extend: tv(theme), ...(appConfig.ui?.toast || {}) })

type ToastVariants = VariantProps<typeof toast>

export interface ToastProps extends Omit<ToastRootProps, 'asChild' | 'forceMount'> {
  title?: string
  description?: string | VNode | (() => VNode)
  icon?: string
  avatar?: AvatarProps
  color?: ToastVariants['color']
  /**
   * Display a list of actions:
   * - under the title and description if multiline
   * - next to the close button if not multiline
   */
  actions?: ButtonProps[]
  /**
   * Display a close button to dismiss the toast.
   * @defaultValue `true` (`{ size: 'md', color: 'gray', variant: 'link' }`)
   */
  close?: ButtonProps | boolean
  /**
   * The icon displayed in the close button.
   * @defaultValue `appConfig.ui.icons.close`
   */
  closeIcon?: string
  class?: any
  ui?: Partial<typeof toast.slots>
}

export interface ToastEmits extends ToastRootEmits {}

export interface ToastSlots {
  leading(): any
  title(): any
  description(): any
  actions(): any
  close(props: { class: string }): any
}
</script>

<script setup lang="ts">
import { ref, computed, inject, onMounted } from 'vue'
import { ToastRoot, ToastTitle, ToastDescription, ToastAction, ToastClose, useForwardPropsEmits } from 'radix-vue'
import { reactivePick } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { UIcon, UAvatar } from '#components'

const props = withDefaults(defineProps<ToastProps>(), { close: true })
const emits = defineEmits<ToastEmits>()
const slots = defineSlots<ToastSlots>()

const toaster = inject<ToasterContext>('Toaster')

const appConfig = useAppConfig()
const rootProps = useForwardPropsEmits(reactivePick(props, 'as', 'defaultOpen', 'duration', 'open', 'type'), emits)

const multiline = computed(() => !!props.title && !!props.description)
const duration = computed(() => props.duration || toaster?.value.duration)

const ui = computed(() => tv({ extend: toast, slots: props.ui })({ color: props.color }))

const el = ref()
const height = ref(0)

onMounted(() => {
  if (!el.value) {
    return
  }

  setTimeout(() => {
    height.value = el.value.$el.getBoundingClientRect()?.height
  }, 0)
})

defineExpose({
  height
})
</script>

<template>
  <ToastRoot
    ref="el"
    v-slot="{ remaining }"
    v-bind="rootProps"
    :class="ui.root({ class: props.class, multiline })"
    :style="{ '--height': height }"
  >
    <slot name="leading">
      <UAvatar v-if="avatar" size="2xl" v-bind="avatar" :class="ui.avatar()" />
      <UIcon v-else-if="icon" :name="icon" :class="ui.icon()" />
    </slot>

    <div :class="ui.wrapper()">
      <ToastTitle v-if="title || !!slots.title" :class="ui.title()">
        <slot name="title">
          {{ title }}
        </slot>
      </ToastTitle>
      <template v-if="description || !!slots.description">
        <ToastDescription v-if="description && isVNode(description)" :as="description" />
        <ToastDescription v-else :class="ui.description()">
          <slot name="description">
            {{ description }}
          </slot>
        </ToastDescription>
      </template>

      <div v-if="multiline && actions?.length" :class="ui.actions({ multiline: true })">
        <slot name="actions">
          <ToastAction v-for="(action, index) in actions" :key="index" :alt-text="action.label || 'Action'" as-child @click.stop>
            <UButton size="xs" :color="color" v-bind="action" />
          </ToastAction>
        </slot>
      </div>
    </div>

    <div v-if="(!multiline && actions?.length) || close !== null" :class="ui.actions({ multiline: false })">
      <template v-if="!multiline">
        <slot name="actions">
          <ToastAction v-for="(action, index) in actions" :key="index" :alt-text="action.label || 'Action'" as-child @click.stop>
            <UButton size="xs" :color="color" v-bind="action" />
          </ToastAction>
        </slot>
      </template>

      <ToastClose as-child>
        <slot name="close" :class="ui.close()">
          <UButton
            v-if="close"
            :icon="closeIcon || appConfig.ui.icons.close"
            size="md"
            color="gray"
            variant="link"
            aria-label="Close"
            v-bind="typeof close === 'object' ? close : undefined"
            :class="ui.close()"
            @click.stop
          />
        </slot>
      </ToastClose>
    </div>

    <div v-if="remaining > 0 && duration" :class="ui.progress()" :style="{ width: `${remaining / duration * 100}%` }" />
  </ToastRoot>
</template>
