<template>
  <component
    :is="is"
    :class="buttonClass"
    :aria-label="ariaLabel"
    v-bind="props"
  >
    <Icon v-if="isLeading" :name="iconName" :class="leadingIconClass" aria-hidden="true" />
    <slot><span :class="truncate ? 'text-left break-all line-clamp-1' : ''">{{ label }}</span></slot>
    <Icon v-if="isTrailing" :name="iconName" :class="trailingIconClass" aria-hidden="true" />
  </component>
</template>

<script>
import Icon from './icon'

export default {
  components: {
    Icon
  },
  props: {
    type: {
      type: String,
      default: 'button'
    },
    block: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: null
    },
    loading: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'md',
      validator (value) {
        return ['', 'xxs', 'xs', 'sm', 'md', 'lg', 'xl'].includes(value)
      }
    },
    variant: {
      type: String,
      default: 'primary',
      validator (value) {
        return ['primary', 'secondary', 'danger', 'white', 'gray', 'gray-hover', 'white-hover', 'black', 'black-hover', 'transparent', 'link', 'gradient', 'custom'].includes(value)
      }
    },
    icon: {
      type: String,
      default: null
    },
    loadingIcon: {
      type: String,
      default: null
    },
    trailing: {
      type: Boolean,
      default: false
    },
    leading: {
      type: Boolean,
      default: false
    },
    href: {
      type: String,
      default: null
    },
    to: {
      type: [String, Object],
      default: null
    },
    target: {
      type: String,
      default: null
    },
    ariaLabel: {
      type: String,
      default: null
    },
    rounded: {
      type: Boolean,
      default: false
    },
    iconClass: {
      type: String,
      default: ''
    },
    baseClass: {
      type: String,
      default: 'font-medium focus:outline-none disabled:cursor-not-allowed disabled:opacity-75'
    },
    customClass: {
      type: String,
      default: null
    },
    square: {
      type: Boolean,
      default: false
    },
    truncate: {
      type: Boolean,
      default: false
    },
    noFocusBorder: {
      type: Boolean,
      default: false
    },
    noPadding: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    is () {
      if (this.href) {
        return 'a'
      } else if (this.to) {
        return 'NuxtLink'
      }

      return 'button'
    },
    props () {
      switch (this.is) {
        case 'a':
          return {
            href: this.href,
            target: this.target
          }
        case 'NuxtLink': {
          return {
            to: this.to
          }
        }
        default: {
          return {
            disabled: this.disabled || this.loading,
            type: this.type
          }
        }
      }
    },
    isLeading () {
      return (this.leading && this.icon) || (this.icon && !this.trailing) || (this.loading && !this.trailing)
    },
    isTrailing () {
      return (this.trailing && this.icon) || (this.loading && this.trailing)
    },
    sizeClass () {
      return ({
        xxs: 'text-xs',
        xs: 'text-xs',
        sm: 'text-sm leading-4',
        md: 'text-sm',
        lg: 'text-base',
        xl: 'text-base'
      })[this.size]
    },
    paddingClass () {
      if (this.noPadding) {
        return ''
      }

      const isSquare = this.square || (!this.$slots.default && !this.label)

      return ({
        true: {
          xxs: 'px-2 py-1',
          xs: 'px-2.5 py-1.5',
          sm: 'px-3 py-2',
          md: 'px-4 py-2',
          lg: 'px-4 py-2',
          xl: 'px-6 py-3'
        },
        false: {
          xxs: 'p-1',
          xs: 'p-1.5',
          sm: 'p-2',
          md: 'p-2',
          lg: 'p-2',
          xl: 'p-3'
        }
      })[!isSquare][this.size]
    },
    variantClass () {
      return ({
        primary: 'shadow-sm border border-transparent text-white bg-primary-600 hover:bg-primary-700 disabled:bg-primary-600',
        secondary: 'border border-transparent text-primary-700 bg-primary-100 hover:bg-primary-200 disabled:bg-primary-100',
        danger: 'shadow-sm border border-transparent text-white bg-red-500 dark:bg-red-600 hover:bg-red-600 dark:hover:bg-red-500 disabled:bg-red-500 dark:disabled:bg-red-600',
        white: 'shadow-sm border border-tw-gray-300 text-tw-gray-700 bg-tw-white hover:bg-tw-gray-50 disabled:bg-tw-white',
        'white-hover': 'border border-transparent text-tw-gray-500 hover:text-tw-gray-700 focus:text-tw-gray-700 bg-transparent hover:bg-gray-100 focus:bg-gray-100 dark:hover:bg-gray-900 dark:focus:bg-gray-900 disabled:text-tw-gray-500',
        gray: 'shadow-sm border border-tw-gray-300 text-tw-gray-500 hover:text-tw-gray-700 focus:text-tw-gray-700 bg-gray-50 dark:bg-gray-800 disabled:text-tw-gray-500',
        'gray-hover': 'border border-transparent text-tw-gray-500 hover:text-tw-gray-700 focus:text-tw-gray-700 bg-transparent hover:bg-gray-100 focus:bg-gray-100 dark:hover:bg-gray-800 dark:focus:bg-gray-800 disabled:text-tw-gray-500',
        black: 'border border-transparent text-tw-white bg-tw-gray-800 hover:bg-tw-gray-900 focus:bg-tw-gray-900',
        'black-hover': 'border border-transparent text-tw-gray-500 hover:text-tw-gray-900 focus:text-tw-gray-700 bg-transparent hover:bg-white dark:hover:bg-black focus:bg-white dark:focus:bg-black',
        transparent: 'border border-transparent text-tw-gray-500 hover:text-tw-gray-700 focus:text-tw-gray-700 disabled:hover:text-tw-gray-500',
        link: 'border border-transparent text-primary-500 hover:text-primary-700 focus:text-primary-700',
        gradient: 'shadow-sm text-white border border-transparent bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700',
        custom: ''
      })[this.variant]
    },
    variantFocusBorderClass () {
      if (this.noFocusBorder) {
        return ''
      }

      return ({
        primary: 'focus:ring-2 focus:ring-primary-200',
        secondary: 'focus:ring-2 focus:ring-primary-500',
        white: 'focus:ring-1 focus:ring-primary-500 focus:border-primary-500 dark:focus:border-primary-500',
        'white-hover': '',
        gray: 'focus:ring-1 focus:ring-primary-500 focus:border-primary-500 dark:focus:border-primary-500',
        'gray-hover': '',
        link: '',
        transparent: '',
        custom: ''
      })[this.variant]
    },
    blockClass () {
      return ({
        true: 'w-full flex justify-center items-center',
        false: 'inline-flex items-center'
      })[this.block]
    },
    roundedClass () {
      return ({
        true: 'rounded-full',
        false: 'rounded-md'
      })[this.rounded]
    },
    iconName () {
      if (this.loading) {
        return this.loadingIcon || 'custom/loading'
      }

      return this.icon
    },
    loadingIconClass () {
      return [
        ({
          true: 'animate-spin'
        })[this.loading]
      ]
    },
    leadingIconClass () {
      return [
        this.iconClass,
        'flex-shrink-0',
        ...this.loadingIconClass,
        ({
          xxs: 'h-3.5 w-3.5',
          xs: 'h-4 w-4',
          sm: 'h-4 w-4',
          md: 'h-5 w-5',
          lg: 'h-5 w-5',
          xl: 'h-5 w-5'
        })[this.size || 'sm'],
        ({
          true: {
            xxs: '-ml-0.5 mr-1',
            xs: '-ml-0.5 mr-1.5',
            sm: '-ml-0.5 mr-2',
            md: '-ml-1 mr-2',
            lg: '-ml-1 mr-3',
            xl: '-ml-1 mr-3'
          },
          false: {}
        })[!!this.$slots.default || !!(this.label?.length)][this.size]
      ].join(' ')
    },
    trailingIconClass () {
      return [
        this.iconClass,
        'flex-shrink-0',
        ...this.loadingIconClass,
        ({
          xxs: 'h-3.5 w-3.5',
          xs: 'h-4 w-4',
          sm: 'h-4 w-4',
          md: 'h-5 w-5',
          lg: 'h-5 w-5',
          xl: 'h-5 w-5'
        })[this.size || 'sm'],
        ({
          true: {
            xxs: 'ml-1 -mr-0.5',
            xs: 'ml-1.5 -mr-0.5',
            sm: 'ml-2 -mr-0.5',
            md: 'ml-2 -mr-1',
            lg: 'ml-3 -mr-1',
            xl: 'ml-3 -mr-1'
          },
          false: {}
        })[!!this.$slots.default || !!(this.label?.length)][this.size]
      ].join(' ')
    },
    buttonClass () {
      return [
        this.baseClass,
        this.roundedClass,
        this.sizeClass,
        this.paddingClass,
        this.variantClass,
        this.variantFocusBorderClass,
        this.blockClass,
        this.customClass
      ].filter(Boolean).join(' ')
    }
  }
}
</script>
