<template>
  <TransitionRoot :appear="appear" :show="isOpen" as="template">
    <Dialog class="relative z-50" @close="close">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <TransitionChild
          as="template"
          :appear="appear"
          enter="ease-out duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in duration-200"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 transition-opacity" :class="overlayClass" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-end sm:items-center justify-center p-4 text-center">
            <TransitionChild
              as="template"
              :appear="appear"
              enter="ease-out duration-300"
              enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enter-to="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leave-from="opacity-100 translate-y-0 sm:scale-100"
              leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
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
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Dialog, DialogPanel, TransitionRoot, TransitionChild } from '@headlessui/vue'
import { classNames } from '../../utils/'
import Card from '../layout/Card.vue'
import { $theme } from '#theme'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  appear: {
    type: Boolean,
    default: false
  },
  baseClass: {
    type: String,
    default () { return $theme('ui.modal.base') }
  },
  backgroundClass: {
    type: String,
    default () { return $theme('ui.modal.background') }
  },
  overlayClass: {
    type: String,
    default () { return $theme('ui.modal.overlay') }
  },
  shadowClass: {
    type: String,
    default () { return $theme('ui.modal.shadow') }
  },
  ringClass: {
    type: String,
    default () { return $theme('ui.modal.ring') }
  },
  roundedClass: {
    type: String,
    default () { return $theme('ui.modal.rounded') }
  },
  widthClass: {
    type: String,
    default () { return $theme('ui.modal.width') }
  }
})

const emit = defineEmits(['update:modelValue', 'close'])

const isOpen = computed({
  get () {
    return props.modelValue || false
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
