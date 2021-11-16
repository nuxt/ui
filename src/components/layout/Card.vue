<template>
  <component
    :is="$listeners && $listeners.submit ? 'form': 'div'"
    :class="[padded && rounded && 'rounded-md', !padded && rounded && 'sm:rounded-md', wrapperClass, ringClass, backgroundClass]"
    @submit.prevent="$listeners && $listeners.submit ? $listeners.submit() : null"
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
    wrapperClass: {
      type: String,
      default: 'overflow-hidden'
    },
    ringClass: {
      type: String,
      default: 'ring-1 ring-gray-200 dark:ring-gray-700'
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
      default: 'border-gray-200 dark:border-gray-700'
    },
    rounded: {
      type: Boolean,
      default: true
    },
    variant: {
      type: String,
      default: 'gray',
      validator (value) {
        return ['gray', 'white', 'black'].includes(value)
      }
    }
  },
  computed: {
    backgroundClass () {
      return ({
        white: 'bg-white dark:bg-gray-800',
        gray: 'bg-tw-gray-50',
        black: 'bg-white dark:bg-black'
      })[this.variant]
    }
  }
}
</script>
