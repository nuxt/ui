<template>
  <div v-if="isOpen" ref="container" :class="[containerClass, widthClass]">
    <transition appear v-bind="transitionClass">
      <div :class="baseClass">
        <slot />
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { computed, toRef } from 'vue'
import { defu } from 'defu'
import { usePopper } from '../../composables/usePopper'
import type { PopperOptions } from '../../types'
import $ui from '#build/ui'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  virtualElement: {
    type: Object,
    required: true
  },
  wrapperClass: {
    type: String,
    default: () => $ui.contextMenu.wrapper
  },
  containerClass: {
    type: String,
    default: () => $ui.contextMenu.container
  },
  widthClass: {
    type: String,
    default: () => $ui.contextMenu.width
  },
  baseClass: {
    type: String,
    default: () => $ui.contextMenu.base
  },
  transitionClass: {
    type: Object,
    default: () => $ui.contextMenu.transition
  },
  popperOptions: {
    type: Object as PropType<PopperOptions>,
    default: () => {}
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

const virtualElement = toRef(props, 'virtualElement')

const popperOptions = computed<PopperOptions>(() => defu({}, props.popperOptions, $ui.contextMenu.popperOptions))

const [, container] = usePopper(popperOptions.value, virtualElement)
</script>

<script lang="ts">
export default { name: 'UContextMenu' }
</script>
