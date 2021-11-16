
<template>
  <div ref="container" v-on-clickaway="close" @mouseover="mouseover" @mouseleave="mouseleave">
    <slot />

    <transition
      enter-class="transform scale-95 opacity-0"
      enter-active-class="transition duration-100 ease-out"
      enter-to-class="transform scale-100 opacity-100"
      leave-class="opacity-100"
      leave-active-class="duration-100 ease-in"
      leave-to-class="opacity-0"
    >
      <div
        v-show="show && (text || shortcuts.length || $slots.text)"
        ref="tooltip"
        class="fixed z-30 flex items-center justify-center invisible w-auto h-6 max-w-xs px-2 space-x-1 truncate rounded shadow lg:visible"
        :class="{
          'bg-gray-800': !darken,
          'bg-gray-900': darken
        }"
      >
        <span v-if="text || $slots.text" class="truncate text-gray-50 text-xxs">
          <slot name="text">{{ text }}</slot>
        </span>
        <div v-if="shortcuts && shortcuts.length">
          <div class="flex items-center flex-shrink-0 h-6 space-x-1">
            <span v-if="text" class="mb-2 text-center text-gray-500">.</span>
            <div
              v-for="(shortcut, index) of shortcuts"
              :key="index"
              class="flex items-center px-1 bg-gray-600 rounded"
            >
              <span
                class="font-light text-center text-gray-200 text-xxs"
              >{{ shortcut }}</span>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { createPopper } from '@popperjs/core'
import { directive as onClickaway } from 'vue-clickaway'

export default {
  directives: {
    onClickaway
  },
  props: {
    text: {
      type: String,
      default: null
    },
    shortcuts: {
      type: Array,
      default: () => []
    },
    darken: {
      type: Boolean,
      default: false
    },
    openDelay: {
      type: Number,
      default: 0
    },
    closeDelay: {
      type: Number,
      default: 100
    },
    placement: {
      type: String,
      default: 'bottom'
    }
  },
  data () {
    return {
      show: false,
      instance: null,
      openTimeout: null,
      closeTimeout: null
    }
  },
  watch: {
    show (value) {
      if (!value) {
        return
      }

      if (this.instance) {
        this.instance.destroy()
        this.instance = null
      }

      this.instance = createPopper(this.$refs.container, this.$refs.tooltip, {
        strategy: 'fixed',
        placement: this.placement,
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [0, 8]
            }
          },
          {
            name: 'computeStyles',
            options: {
              gpuAcceleration: false,
              adaptive: false
            }
          },
          {
            name: 'preventOverflow',
            options: {
              padding: 8
            }
          }
        ]
      })
    }
  },
  beforeDestroy () {
    if (this.instance) {
      this.instance.destroy()
      this.instance = null
    }
  },
  methods: {
    mouseover () {
      clearTimeout(this.closeTimeout)
      this.closeTimeout = null
      this.openTimeout = this.openTimeout || setTimeout(() => {
        this.open()
        this.openTimeout = null
      }, this.openDelay)
    },
    mouseleave () {
      clearTimeout(this.openTimeout)
      this.openTimeout = null
      this.closeTimeout = this.closeTimeout || setTimeout(() => {
        this.close()
        this.closeTimeout = null
      }, this.closeDelay)
    },
    open () {
      this.show = true
    },
    close () {
      this.show = false
    }
  }
}
</script>
