<template>
  <span class="inline-flex items-center font-medium" :class="badgeClass">
    <slot>{{ label }}</slot>
  </span>
</template>

<script>
export default {
  props: {
    size: {
      type: String,
      default: 'md',
      validator (value) {
        return ['sm', 'md', 'lg'].includes(value)
      }
    },
    variant: {
      type: String,
      default: 'primary',
      validator (value) {
        return ['primary', 'gray', 'red', 'orange', 'yellow', 'green', 'teal', 'blue', 'indigo', 'purple', 'pink', 'gradient'].includes(value)
      }
    },
    pill: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: null
    }
  },
  computed: {
    sizeClass () {
      return ({
        sm: 'text-xs px-2 py-0.5',
        md: 'text-sm px-2.5 py-0.5 leading-4',
        lg: 'text-sm px-3 py-0.5 leading-5'
      })[this.size]
    },
    variantClass () {
      return ({
        primary: 'bg-primary-100 dark:bg-primary-700 text-primary-800 dark:text-primary-100',
        gray: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100',
        red: 'bg-red-100 dark:bg-red-700 text-red-800 dark:text-red-100',
        orange: 'bg-orange-100 dark:bg-orange-700 text-orange-800 dark:text-orange-100',
        yellow: 'bg-yellow-100 dark:bg-yellow-700 text-yellow-800 dark:text-yellow-100',
        green: 'bg-green-100 dark:bg-green-700 text-green-800 dark:text-green-100',
        teal: 'bg-teal-100 dark:bg-teal-700 text-teal-800 dark:text-teal-100',
        blue: 'bg-blue-100 dark:bg-blue-700 text-blue-800 dark:text-blue-100',
        indigo: 'bg-indigo-100 dark:bg-indigo-700 text-indigo-800 dark:text-indigo-100',
        purple: 'bg-purple-100 dark:bg-purple-700 text-purple-800 dark:text-purple-100',
        pink: 'bg-pink-100 dark:bg-pink-700 text-pink-800 dark:text-pink-100',
        gradient: 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white'
      })[this.variant]
    },
    roundedClass () {
      return ({
        false: 'rounded',
        true: 'rounded-full'
      })[this.pill]
    },
    badgeClass () {
      return [
        this.sizeClass,
        this.variantClass,
        this.roundedClass
      ].join(' ')
    }
  }
}
</script>
