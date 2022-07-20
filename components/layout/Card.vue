<template>
  <component
    :is="$attrs.onSubmit ? 'form': 'div'"
    :class="cardClass"
    v-bind="$attrs"
  >
    <div
      v-if="$slots.header"
      :class="[headerClass, headerBackgroundClass, borderColorClass, !!$slots.default && 'border-b']"
    >
      <slot name="header" />
    </div>
    <div :class="[bodyClass, bodyBackgroundClass]">
      <slot />
    </div>
    <div
      v-if="$slots.footer"
      :class="[footerClass, footerBackgroundClass, borderColorClass, (!!$slots.default || (!$slots.default && !!$slots.header)) && 'border-t']"
    >
      <slot name="footer" />
    </div>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { classNames } from '../../utils'
import { $theme } from '#theme'

const props = defineProps({
  padded: {
    type: Boolean,
    default: false
  },
  rounded: {
    type: Boolean,
    default: true
  },
  baseClass: {
    type: String,
    default () { return $theme('ui.card.base').value }
  },
  backgroundClass: {
    type: String,
    default () { return $theme('ui.card.background').value }
  },
  borderColorClass: {
    type: String,
    default () { return $theme('ui.card.border').value }
  },
  shadowClass: {
    type: String,
    default () { return $theme('ui.card.shadow').value }
  },
  ringClass: {
    type: String,
    default () { return $theme('ui.card.ring').value }
  },
  roundedClass: {
    type: String,
    default () { return $theme('ui.card.rounded').value },
    validator (value: string) {
      return !value || ['sm', 'md', 'lg', 'xl', '2xl', '3xl'].map(size => `rounded-${size}`).includes(value)
    }
  },
  bodyClass: {
    type: String,
    default () { return $theme('ui.card.body').value }
  },
  bodyBackgroundClass: {
    type: String,
    default: null
  },
  headerClass: {
    type: String,
    default () { return $theme('ui.card.header').value }
  },
  headerBackgroundClass: {
    type: String,
    default: null
  },
  footerClass: {
    type: String,
    default () { return $theme('ui.card.footer').value }
  },
  footerBackgroundClass: {
    type: String,
    default: null
  },
  customClass: {
    type: String,
    default: null
  }
})

const cardClass = computed(() => {
  return classNames(
    props.baseClass,
    props.padded && props.rounded && props.roundedClass,
    !props.padded && props.rounded && props.roundedClass && `sm:${props.roundedClass}`,
    props.ringClass,
    props.shadowClass,
    props.backgroundClass,
    props.customClass
  )
})
</script>

<script lang="ts">
export default {
  name: 'UCard',
  inheritAttrs: false
}
</script>
