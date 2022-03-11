<template>
  <Modal v-model="isOpen" :appear="appear" class="w-full" @close="onClose">
    <div class="sm:flex sm:items-start">
      <div v-if="icon" :class="iconWrapperClass" class="mx-auto flex-shrink-0 flex items-center justify-center rounded-full sm:mx-0">
        <Icon :name="icon" :class="iconClass" />
      </div>
      <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left space-y-2">
        <DialogTitle v-if="title" as="h3" :class="titleClass">
          {{ title }}
        </DialogTitle>
        <DialogDescription v-if="description" as="p" :class="descriptionClass">
          {{ description }}
        </DialogDescription>
      </div>
    </div>
    <div class="mt-5 space-y-3 sm:space-y-0 sm:mt-4 sm:flex sm:gap-3" :class="{ 'sm:flex-row-reverse': !leadingButtons }">
      <Button variant="primary" :label="confirmLabel" block custom-class="sm:w-auto" @click="onConfirm" />
      <Button variant="secondary" :label="cancelLabel" block custom-class="sm:w-auto" @click="onCancel" />
    </div>
  </Modal>
</template>

<script setup>
import { computed } from 'vue'
import { DialogTitle, DialogDescription } from '@headlessui/vue'
import Modal from '../overlays/Modal'
import Button from '../elements/Button'
import Icon from '../elements/Icon'
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
  icon: {
    type: String,
    default: ''
  },
  iconClass: {
    type: String,
    default: () => $ui.alertDialog.icon.base
  },
  iconWrapperClass: {
    type: String,
    default: () => $ui.alertDialog.icon.wrapper
  },
  title: {
    type: String,
    default: ''
  },
  titleClass: {
    type: String,
    default: () => $ui.alertDialog.icon.title
  },
  description: {
    type: String,
    default: ''
  },
  descriptionClass: {
    type: String,
    default: () => $ui.alertDialog.description
  },
  confirmLabel: {
    type: String,
    default: 'Confirm'
  },
  cancelLabel: {
    type: String,
    default: 'Cancel'
  },
  leadingButtons: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel', 'close'])

const isOpen = computed({
  get () {
    return props.modelValue
  },
  set (value) {
    emit('update:modelValue', value)
  }
})

function onConfirm () {
  emit('confirm')
  isOpen.value = false
}
function onCancel () {
  emit('cancel')
  isOpen.value = false
}
function onClose () {
  emit('close')
}
</script>
