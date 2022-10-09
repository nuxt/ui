<template>
  <TransitionRoot :appear="appear" :show="isOpen" as="template">
    <Dialog :class="wrapperClass" @close="close">
      <TransitionChild
        v-if="overlay"
        as="template"
        :appear="appear"
        v-bind="overlayTransition"
      >
        <div class="fixed inset-0 transition-opacity" :class="overlayBackgroundClass" />
      </TransitionChild>

      <div :class="innerClass">
        <div :class="containerClass">
          <TransitionChild
            as="template"
            :appear="appear"
            v-bind="modalTransition"
          >
            <DialogPanel :class="modalClass">
              <Card
                base-class=""
                background-class=""
                shadow-class=""
                ring-class=""
                rounded-class=""
                v-bind="$attrs"
              >
                <template v-if="$slots.header" #header>
                  <slot name="header" />
                </template>
                <slot />
                <template v-if="$slots.footer" #footer>
                  <slot name="footer" />
                </template>
              </Card>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Dialog, DialogPanel, TransitionRoot, TransitionChild } from '@headlessui/vue'
import { classNames } from '../../utils'
import Card from '../layout/Card.vue'
import $ui from '#build/ui'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  appear: {
    type: Boolean,
    default: false
  },
  wrapperClass: {
    type: String,
    default: () => $ui.modal.wrapper
  },
  innerClass: {
    type: String,
    default: () => $ui.modal.inner
  },
  containerClass: {
    type: String,
    default: () => $ui.modal.container
  },
  baseClass: {
    type: String,
    default: () => $ui.modal.base
  },
  backgroundClass: {
    type: String,
    default: () => $ui.modal.background
  },
  overlay: {
    type: Boolean,
    default: true
  },
  overlayBackgroundClass: {
    type: String,
    default: () => $ui.modal.overlay.background
  },
  overlayTransitionClass: {
    type: Object,
    default: () => $ui.modal.overlay.transition
  },
  shadowClass: {
    type: String,
    default: () => $ui.modal.shadow
  },
  ringClass: {
    type: String,
    default: () => $ui.modal.ring
  },
  roundedClass: {
    type: String,
    default: () => $ui.modal.rounded
  },
  widthClass: {
    type: String,
    default: () => $ui.modal.width
  },
  transition: {
    type: Boolean,
    default: true
  },
  transitionClass: {
    type: Object,
    default: () => $ui.modal.transition
  }
})

const emit = defineEmits(['update:modelValue', 'close'])

const isOpen = computed({
  get () {
    return props.modelValue
  },
  set (value) {
    emit('update:modelValue', value)
  }
})

const modalClass = computed(() => {
  return classNames(
    props.baseClass,
    props.widthClass,
    props.backgroundClass,
    props.shadowClass,
    props.ringClass,
    props.roundedClass
  )
})

const overlayTransition = computed(() => {
  if (!props.transition) {
    return {}
  }

  return props.overlayTransitionClass
})

const modalTransition = computed(() => {
  if (!props.transition) {
    return {}
  }

  return props.transitionClass
})

function close (value: boolean) {
  isOpen.value = value
  emit('close')
}
</script>

<script lang="ts">
export default {
  name: 'UModal',
  inheritAttrs: false
}
</script>
