<template>
  <span class="relative inline-flex items-center justify-center overflow-hidden" :class="avatarClass" @click="goto">
    <img v-if="url" :src="url" :alt="alt" :class="roundedClass" />
    <span v-else-if="gradientPlaceholder" class="w-full h-full" v-html="gradientPlaceholder" />
    <span
      v-else-if="placeholder"
      class="font-bold leading-none text-white uppercase"
    >{{ placeholder }}</span>
    <span
      v-else-if="text"
      class="leading-snug"
    >{{ text }}</span>
    <svg
      v-else
      class="w-full h-full text-tw-gray-300"
      :class="roundedClass"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>

    <span
      v-if="status"
      class="absolute top-0 right-0 block rounded-full ring-1 ring-white dark:ring-gray-900"
      :class="statusClass"
    />
  </span>
</template>

<script>
import avatar from 'gradient-avatar'

export default {
  props: {
    src: {
      type: [String, Boolean],
      default: null
    },
    text: {
      type: String,
      default: null
    },
    alt: {
      type: String,
      default: null
    },
    to: {
      type: String,
      default: null
    },
    size: {
      type: String,
      default: 'md',
      validator (value) {
        return ['xxxs', 'xxs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'].includes(value)
      }
    },
    rounded: {
      type: Boolean,
      default: false
    },
    gradient: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      default: null,
      validator (value) {
        return ['online', 'idle', 'invisible', 'donotdisturb', 'focus'].includes(value)
      }
    }
  },
  computed: {
    url () {
      if (typeof this.src === 'boolean') {
        return null
      }
      return this.src
    },
    placeholder () {
      if (!this.alt) {
        return
      }

      return this.alt.split(' ').map(word => word.charAt(0)).join('')
    },
    gradientPlaceholder () {
      if (!this.gradient) {
        return
      }

      return avatar(this.alt || new Date().toString())
    },
    sizeClass () {
      return ({
        xxxs: 'h-4 w-4 text-xs',
        xxs: 'h-5 w-5 text-xs',
        xs: 'h-6 w-6 text-xs',
        sm: 'h-8 w-8 text-sm',
        md: 'h-10 w-10 text-md',
        lg: 'h-12 w-12 text-lg',
        xl: 'h-14 w-14 text-xl',
        '2xl': 'h-16 w-16 text-2xl',
        '3xl': 'h-20 w-20 text-3xl'
      })[this.size]
    },
    roundedClass () {
      return ({
        true: 'rounded-lg',
        false: 'rounded-full'
      })[this.rounded]
    },
    placeholderClass () {
      return ({
        true: 'bg-tw-white',
        false: 'bg-tw-gray-100'
      })[!!this.alt]
    },
    avatarClass () {
      return [
        this.sizeClass,
        this.roundedClass,
        this.placeholderClass,
        this.to ? 'cursor-pointer' : ''
      ].join(' ')
    },
    statusClass () {
      return [
        ({
          online: 'bg-green-400',
          idle: 'bg-yellow-400',
          invisible: 'bg-tw-gray-300',
          donotdisturb: 'bg-red-400',
          focus: 'bg-primary-500'
        })[this.status],
        ({
          xxxs: 'h-1 w-1',
          xxs: 'h-1 w-1',
          xs: 'h-1.5 w-1.5',
          sm: 'h-2 w-2',
          md: 'h-2.5 w-2.5',
          lg: 'h-3 w-3',
          xl: 'h-3.5 w-3.5',
          '2xl': 'h-3.5 w-3.5',
          '3xl': 'h-4 w-4'
        })[this.size],
        ({
          true: 'transform -translate-y-1/2 translate-x-1/2'
        })[this.rounded]
      ].join(' ')
    }
  },
  methods: {
    goto (e) {
      if (!this.to || !this.$router) { return }
      e.preventDefault()
      this.$router.push(this.to)
    }
  }
}
</script>
