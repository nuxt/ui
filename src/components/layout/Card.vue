<template>
  <component
    :is="$attrs.onSubmit ? 'form': 'div'"
    :class="[padded && rounded && 'rounded-md', !padded && rounded && 'sm:rounded-md', wrapperClass, ringClass, shadowClass, backgroundClass]"
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

<script>
export default {
  props: {
    padded: {
      type: Boolean,
      default: false
    },
    rounded: {
      type: Boolean,
      default: true
    },
    wrapperClass: {
      type: String,
      default: 'overflow-hidden'
    },
    backgroundClass: {
      type: String,
      default: 'u-bg-white'
    },
    shadowClass: {
      type: String,
      default: ''
    },
    ringClass: {
      type: String,
      default: 'ring-1 u-ring-gray-200'
    },
    bodyClass: {
      type: String,
      default: 'px-4 py-5 sm:p-6'
    },
    bodyBackgroundClass: {
      type: String,
      default: null
    },
    headerClass: {
      type: String,
      default: 'px-4 py-5 sm:px-6'
    },
    headerBackgroundClass: {
      type: String,
      default: null
    },
    footerClass: {
      type: String,
      default: 'px-4 py-4 sm:px-6'
    },
    footerBackgroundClass: {
      type: String,
      default: null
    },
    borderColorClass: {
      type: String,
      default: 'u-border-gray-200'
    }
  }
}
</script>
