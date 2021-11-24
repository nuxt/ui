<template>
  <transition
    appear
    enter-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
    enter-active-class="transition duration-300 ease-out transform"
    enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
    leave-class="opacity-100"
    leave-active-class="transition duration-100 ease-in"
    leave-to-class="opacity-0"
  >
    <div
      class="z-50 w-full bg-white rounded-lg shadow-lg pointer-events-auto dark:bg-gray-800"
      @mouseover="onMouseover"
      @mouseout="onMouseout"
    >
      <div class="relative overflow-hidden rounded-lg ring-1 u-ring-gray-200">
        <div class="p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <Icon :name="iconName" class="w-6 h-6" :class="iconClass" />
            </div>
            <div class="ml-3 w-0 flex-1 pt-0.5">
              <p class="text-sm font-medium leading-5 u-text-gray-900">
                {{ title }}
              </p>
              <p v-if="description" class="mt-1 text-sm leading-5 u-text-gray-500">
                {{ description }}
              </p>
              <Button
                v-if="undo"
                variant="white"
                size="xs"
                class="mt-2"
                @click.native.stop="cancel"
              >
                Undo
                <div class="inline-flex items-center rounded u-bg-gray-200 ml-1.5">
                  <span class="w-full px-1 text-center u-text-gray-600 text-xxs">
                    Z
                  </span>
                </div>
              </Button>
            </div>
            <div class="flex-shrink-0 ml-4">
              <button
                class="transition duration-150 ease-in-out u-text-gray-400 focus:outline-none hover:u-text-gray-500 focus:u-text-gray-500"
                @click.stop="close"
              >
                <span class="sr-only">Close</span>
                <Icon name="outline/x" class="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        <div v-if="timeout" class="absolute bottom-0 left-0 right-0 h-1">
          <div class="h-1 bg-primary-500" :style="progressBarStyle" />
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import Icon from '../elements/Icon'
import Button from '../elements/Button'

export default {
  components: {
    Icon,
    Button
  },
  props: {
    id: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true,
      default: 'info',
      validator (value) {
        return ['info', 'success', 'error', 'warning'].includes(value)
      }
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: null
    },
    icon: {
      type: String,
      default: null
    },
    timeout: {
      type: Number,
      default: 5000
    },
    undo: {
      type: Function,
      default: null
    },
    callback: {
      type: Function,
      default: null
    }
  },
  data () {
    return {
      timer: null,
      ticker: null,
      remainingTime: this.timeout
    }
  },
  computed: {
    iconName () {
      return this.icon || ({
        warning: 'solid/exclamation-circle',
        info: 'solid/information-circle',
        success: 'solid/check-circle',
        error: 'solid/x-circle'
      })[this.type]
    },
    iconClass () {
      return ({
        warning: 'text-orange-400',
        info: 'text-blue-400',
        success: 'text-green-400',
        error: 'text-red-400'
      })[this.type] || 'u-text-gray-400'
    },
    progressBarStyle () {
      const remainingPercent = this.remainingTime / this.timeout * 100
      return { width: `${remainingPercent}%` }
    }
  },
  mounted () {
    if (!this.$timer) {
      return
    }

    if (this.timeout) {
      this.timer = new this.$timer(() => {
        this.close()
        this.ticker?.stop()
      }, this.timeout)
      this.ticker = new this.$ticker(() => {
        this.remainingTime -= 10
      }, 10)
    }
  },
  beforeDestroy () {
    if (this.timer) {
      this.timer.stop()
      this.ticker.stop()
    }
  },
  methods: {
    onMouseover () {
      if (this.timer) {
        this.timer.pause()
        this.ticker.stop()
      }
    },
    onMouseout () {
      if (this.timer) {
        this.timer.resume()
        this.ticker.start()
      }
    },
    cancel () {
      if (this.timer) {
        this.timer.stop()
        this.ticker.stop()
      }
      if (this.undo) {
        this.undo()
      }
      this.$emit('close')
    },
    close () {
      if (this.callback) {
        this.callback()
      }
      this.$emit('close')
    }
  }
}
</script>
