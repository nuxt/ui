<template>
  <div
    class="inline-flex items-center"
    :class="wrapperClass"
  >
    <span
      v-if="textLeading"
      :class="textClass"
    >{{ textLeading }}</span>
    <button
      v-if="!short"
      type="button"
      aria-pressed="false"
      :class="value ? 'bg-primary-600' : 'bg-tw-gray-200'"
      class="relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none"
      @click="onClick"
    >
      <span
        aria-hidden="true"
        :class="value ? 'translate-x-5 text-primary-600' : 'translate-x-0 text-tw-gray-400'"
        class="inline-flex items-center justify-center h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
      >
        <Icon v-if="icon" :name="value ? icon : (iconOff ? iconOff : icon)" class="w-3 h-3" />
      </span>
    </button>
    <button
      v-else
      type="button"
      aria-pressed="false"
      class="flex-shrink-0 group relative rounded-full inline-flex items-center justify-center h-5 w-10 cursor-pointer focus:outline-none"
      @click="onClick"
    >
      <span
        aria-hidden="true"
        :class="value ? 'bg-primary-600' : 'bg-tw-gray-200'"
        class="absolute h-4 w-9 mx-auto rounded-full transition-colors ease-in-out duration-200"
      />
      <span
        aria-hidden="true"
        :class="value ? 'translate-x-5 text-primary-600' : 'translate-x-0 text-tw-gray-400'"
        class="absolute left-0 flex items-center justify-center h-5 w-5 border border-tw-gray-200 rounded-full bg-white shadow transform ring-0 transition-transform ease-in-out duration-200"
      >
        <Icon v-if="icon" :name="value ? icon : (iconOff ? iconOff : icon)" class="w-3 h-3" />
      </span>
    </button>
    <span
      v-if="textTrailing"
      :class="textClass"
    >{{ textTrailing }}</span>
  </div>
</template>

<script>
import Icon from '../elements/icon'

export default {
  components: { Icon },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String,
      default: ''
    },
    iconOff: {
      type: String,
      default: ''
    },
    short: {
      type: Boolean,
      default: false
    },
    textLeading: {
      type: String,
      default: ''
    },
    textTrailing: {
      type: String,
      default: ''
    },
    textHighlight: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'md',
      validator (value) {
        return ['xs', 'sm', 'md', 'lg', 'xl'].includes(value)
      }
    }
  },
  computed: {
    wrapperClass () {
      return ({
        xs: 'space-x-2',
        sm: 'space-x-3',
        md: 'space-x-3',
        lg: 'space-x-3',
        xl: 'space-x-3'
      })[this.size]
    },
    textClass () {
      return [
        ({
          xs: 'text-xs',
          sm: 'text-sm',
          md: 'text-sm',
          lg: 'text-base',
          xl: 'text-base'
        })[this.size],
        this.textHighlight && this.value ? 'text-primary-600' : 'text-tw-gray-900',
        'font-medium'
      ].join(' ')
    }
  },
  methods: {
    onClick () {
      this.$emit('input', !this.value)
    }
  }
}
</script>
