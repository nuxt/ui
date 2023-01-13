<template>
  <TransitionRoot as="template" :appear="appear" :show="isOpen">
    <Dialog :class="[wrapperClass, { 'justify-end': side === 'right' }]" @close="close">
      <TransitionChild
        v-if="overlay"
        as="template"
        :appear="appear"
        v-bind="overlayTransition"
      >
        <div class="fixed inset-0 transition-opacity" :class="overlayBackgroundClass" />
      </TransitionChild>

      <TransitionChild
        as="template"
        :appear="appear"
        v-bind="slideoverTransition"
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
  appear: {
    type: Boolean,
    default: false
  },
  side: {
    type: String,
    default: 'left',
    validator: (value: string) => ['left', 'right'].includes(value)
  },
  wrapperClass: {
    type: String,
    default: () => $ui.slideover.wrapper
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
  transition: {
    type: Boolean,
    default: true
  },
  transitionClass: {
    type: Object,
    default: () => $ui.slideover.transition
  }
})

const emit = defineEmits(['update:modelValue', 'close'])

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

const overlayTransition = computed(() => {
  if (!props.transition) {
    return {}
  }

  return props.overlayTransitionClass
})

const slideoverTransition = computed(() => {
  if (!props.transition) {
    return {}
  }

  return {
    enterFrom: props.side === 'left' ? '-translate-x-full' : 'translate-x-full',
    enterTo: 'translate-x-0',
    leaveFrom: 'translate-x-0',
    leaveTo: props.side === 'left' ? '-translate-x-full' : 'translate-x-full',
    ...props.transitionClass
  }
})

function close (value: boolean) {
  isOpen.value = value
  emit('close')
}
</script>

<script lang="ts">
export default { name: 'USlideover' }
</script>
