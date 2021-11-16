<template>
  <div
    ref="container"
    v-on-clickaway="onClickaway"
    class="inline whitespace-normal"
    @mouseover="mode === 'hover' ? mouseover() : () => {}"
    @mouseleave="mode === 'hover' ? mouseleave() : () => {}"
  >
    <slot :toggle="toggle" />

    <Portal to="popover">
      <transition
        enter-class="transform scale-95 opacity-0"
        enter-active-class="transition duration-100 ease-out"
        enter-to-class="transform scale-100 opacity-100"
        leave-class="opacity-100"
        leave-active-class="duration-100 ease-in"
        leave-to-class="opacity-0"
      >
        <div
          v-if="show && ready && $scopedSlots.content"
          ref="popover"
          class="z-30 flex bg-white rounded-md shadow ring-1 ring-gray-200 dark:ring-gray-700"
          :class="[
            popoverClass,
            darken ? 'dark:bg-gray-900' : 'dark:bg-gray-800',
            mode === 'click' ? '' : 'invisible lg:visible'
          ]"
          @mouseover="mode === 'hover' ? mouseover() : () => {}"
          @mouseleave="mode === 'hover' ? mouseleave() : () => {}"
        >
          <slot name="content" :toggle="toggle" />
        </div>
      </transition>
    </Portal>
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
    darken: {
      type: Boolean,
      default: false
    },
    popoverClass: {
      type: String,
      default: 'w-auto h-auto'
    },
    mode: {
      type: String,
      default: 'hover',
      validator (value) {
        return ['click', 'hover'].includes(value)
      }
    },
    strategy: {
      type: String,
      default: 'fixed'
    },
    placement: {
      type: String,
      default: 'bottom'
    },
    openDelay: {
      type: Number,
      default: 300
    },
    closeDelay: {
      type: Number,
      default: 100
    },
    ready: {
      type: Boolean,
      default: true
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
      this.$emit('show', value)

      if (!value || !this.ready) {
        // let the 100ms hide animation proceed before destroying the popper instance
        setTimeout(() => {
          // if popover reshow, abort destroy
          if (this.show && this.ready) {
            return
          }
          this.destroyPopper()
        }, 120)
        return
      }

      this.createPopper()
    },
    ready (value) {
      if (!value || !this.show) {
        // let the 100ms hide animation proceed before destroying the popper instance
        setTimeout(() => {
          // if popover reshow, abort destroy
          if (this.show && this.ready) {
            return
          }
          this.destroyPopper()
        }, 120)
        return
      }

      this.createPopper()
    }
  },
  beforeDestroy () {
    this.destroyPopper()
  },
  methods: {
    createPopper () {
      // https://portal-vue.linusb.org/guide/caveats.html#refs
      this.$nextTick().then(
        this.$nextTick().then(() => {
          setTimeout(() => {
            if (this.instance) {
              this.instance.forceUpdate()
              return
            }

            this.instance = createPopper(this.$refs.container, this.$refs.popover, {
              strategy: this.strategy,
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
          }, 1)
        })
      )
    },
    destroyPopper () {
      if (this.instance) {
        this.instance.destroy()
        this.instance = null
      }
    },
    mouseover () {
      clearTimeout(this.closeTimeout)
      this.closeTimeout = null
      if (this.show) {
        return
      }
      this.openTimeout = this.openTimeout || setTimeout(() => {
        this.open()
        this.openTimeout = null
      }, this.openDelay)
    },
    mouseleave () {
      clearTimeout(this.openTimeout)
      this.openTimeout = null
      if (!this.show) {
        return
      }
      this.closeTimeout = this.closeTimeout || setTimeout(() => {
        this.close()
        this.closeTimeout = null
      }, this.closeDelay)
    },
    toggle () {
      this.show = !this.show
    },
    open () {
      this.show = true
    },
    close () {
      this.show = false
    },
    onClickaway () {
      if (this.mode !== 'hover') {
        this.close()
      }
    }
  }
}
</script>
