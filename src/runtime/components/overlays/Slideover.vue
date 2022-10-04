<template>
  <TransitionRoot as="template" :show="isOpen">
    <Dialog
      class="fixed inset-0 flex z-40"
      :class="{
        'justify-end': side === 'right'
      }"
      @close="isOpen = false"
    >
      <TransitionChild
        v-if="overlay"
        as="template"
        v-bind="overlayTransitionClass"
      >
        <div class="fixed inset-0 transition-opacity" :class="overlayBackgroundClass" />
      </TransitionChild>

      <TransitionChild
        as="template"
        :enter-from="side === 'left' ? '-translate-x-full' : 'translate-x-full'"
        enter-to="translate-x-0"
        leave-from="translate-x-0"
        :leave-to="side === 'left' ? '-translate-x-full' : 'translate-x-full'"
        v-bind="transitionClass"
      >
        <DialogPanel :class="slideoverClass">
          <div v-if="$slots.header" :class="headerClass">
            <slot name="header" />
          </div>
          <slot />
        </DialogPanel>
      </TransitionChild>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { WritableComputedRef, PropType } from 'vue'
import { Dialog, DialogPanel, TransitionRoot, TransitionChild } from '@headlessui/vue'
import { classNames } from '../../utils'
import $ui from '#build/ui'

const props = defineProps({
  modelValue: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  side: {
    type: String,
    default: 'left',
    validator: (value: string) => ['left', 'right'].includes(value)
  },
  baseClass: {
    type: String,
    default: () => $ui.slideover.base
  },
  backgroundClass: {
    type: String,
    default: () => $ui.slideover.background
  },
  overlay: {
    type: Boolean,
    default: true
  },
  overlayBackgroundClass: {
    type: String,
    default: () => $ui.slideover.overlay.background
  },
  overlayTransitionClass: {
    type: Object,
    default: () => $ui.slideover.overlay.transition
  },
  widthClass: {
    type: String,
    default: () => $ui.slideover.width
  },
  headerClass: {
    type: String,
    default: () => $ui.slideover.header
  },
  transitionClass: {
    type: Object,
    default: () => $ui.slideover.transition
  }
})

const emit = defineEmits(['update:modelValue'])

const isOpen: WritableComputedRef<boolean> = computed({
  get () {
    return props.modelValue
  },
  set (value) {
    emit('update:modelValue', value)
  }
})

const slideoverClass = computed(() => {
  return classNames(
    props.baseClass,
    props.widthClass,
    props.backgroundClass
  )
})
</script>

<script lang="ts">
export default { name: 'USlideover' }
</script>
