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
        <div class="fixed inset-0 bg-gray-500/75 dark:bg-gray-600/75 transition-opacity" />
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
        <DialogPanel class="relative flex-1 flex flex-col w-full u-bg-white focus:outline-none" :class="panelClass">
          <div v-if="$slots.header" class="border-b u-border-gray-200">
            <div
              :class="{ 'flex-row-reverse justify-between': side === 'left' }"
              class="flex items-center px-4 sm:px-6 h-16 gap-3"
            >
              <Button
                icon="heroicons-outline:x"
                variant="transparent"
                @click="isOpen = false"
              />
              <slot name="header" />
            </div>
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
import Button from '../elements/Button'

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
  panelClass: {
    type: String,
    default: 'max-w-md'
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
</script>

<script lang="ts">
export default { name: 'USlideover' }
</script>
