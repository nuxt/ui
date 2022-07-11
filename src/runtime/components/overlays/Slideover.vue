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
        as="template"
        enter="transition-opacity ease-linear duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="transition-opacity ease-linear duration-300"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 transition-opacity" :class="overlayClass" />
      </TransitionChild>

      <TransitionChild
        as="template"
        enter="transition ease-in-out duration-300 transform"
        :enter-from="side === 'left' ? '-translate-x-full' : 'translate-x-full'"
        enter-to="translate-x-0"
        leave="transition ease-in-out duration-300 transform"
        leave-from="translate-x-0"
        :leave-to="side === 'left' ? '-translate-x-full' : 'translate-x-full'"
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
import { classNames } from '../../utils/'
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
  overlayClass: {
    type: String,
    default: () => $ui.slideover.overlay
  },
  widthClass: {
    type: String,
    default: () => $ui.slideover.width
  },
  headerClass: {
    type: String,
    default: () => $ui.slideover.header
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
