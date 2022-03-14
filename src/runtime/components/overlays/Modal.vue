<template>
  <TransitionRoot :appear="appear" :show="isOpen" as="template">
    <Dialog @close="close">
      <div class="fixed z-20 inset-0 overflow-y-auto">
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
            <DialogOverlay class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </TransitionChild>

          <!-- This element is to trick the browser into centering the modal contents. -->
          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

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
            <Card
              :base-class="baseClass"
              :background-class="backgroundClass"
              :shadow-class="shadowClass"
              :ring-class="ringClass"
              :rounded-class="roundedClass"
              :class="modalClass"
              padded
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
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script>
import { computed } from 'vue'
import { Dialog, DialogOverlay, TransitionRoot, TransitionChild } from '@headlessui/vue'
import { classNames } from '../../utils/'
import Card from '../layout/Card'
import $ui from '#build/ui'

export default {
  components: {
    Dialog,
    DialogOverlay,
    TransitionRoot,
    TransitionChild,
    Card
  },
  inheritAttrs: false,
  props: {
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
      default: () => $ui.modal.base
    },
    backgroundClass: {
      type: String,
      default: () => $ui.modal.background
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
      default: () => $ui.modal.width,
      validator (value) {
        return ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl'].map(width => `max-w-${width}`).includes(value)
      }
    }
  },
  emits: ['update:modelValue', 'close'],
  setup (props, { emit }) {
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
        `sm:${props.widthClass}`
      )
    })

    return {
      isOpen,
      modalClass,
      close (value) {
        isOpen.value = value
        emit('close')
      }
    }
  }
}
</script>
