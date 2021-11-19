<template>
  <div v-if="showSlideover" ref="container" class="fixed inset-0 z-50 overflow-hidden slideover">
    <div class="absolute inset-0 overflow-hidden">
      <transition
        appear
        enter-class="opacity-0"
        enter-active-class="duration-300 ease-out"
        enter-to-class="opacity-100"
        leave-class="opacity-100"
        leave-active-class="duration-200 ease-in"
        leave-to-class="opacity-0"
        @before-leave="backdropLeaving = true"
        @after-leave="backdropLeaving = false"
      >
        <div v-if="showBackdrop" class="fixed inset-0 transition-opacity bg-gray-800 sm:bg-opacity-75" @click="open = false" />
      </transition>

      <section class="absolute inset-y-0 right-0 flex max-w-full sm:pl-16">
        <transition
          appear
          v-bind="transitionProps"
          @before-leave="contentLeaving = true"
          @after-leave="contentLeaving = false"
        >
          <Card
            v-if="showContent"
            v-bind="$attrs"
            role="dialog"
            aria-modal="true"
            class="z-50 flex flex-col w-screen h-screen transition transform shadow-xl sm:max-w-md "
            body-class="flex-1 overflow-y-auto"
            ring-class="sm:ring-1 ring-transparent dark:ring-gray-700"
            variant="white"
            :rounded="false"
          >
            <template v-if="$slots.header" #header>
              <slot name="header" />
            </template>
            <template v-else-if="title" #header>
              <div class="flex items-center justify-between">
                <h2 class="font-medium sm:leading-6 sm:text-lg text-tw-gray-900">
                  {{ title }}
                </h2>
                <div class="flex items-center">
                  <button
                    type="button"
                    aria-label="Close panel"
                    class="rounded-md text-tw-gray-400 hover:text-tw-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    @click="open = false"
                  >
                    <Icon name="outline/x" class="w-6 h-6" />
                  </button>
                </div>
              </div>
            </template>
            <slot />
            <template v-if="$slots.footer" #footer>
              <slot name="footer" />
            </template>
          </Card>
        </transition>
      </section>
    </div>
  </div>
</template>

<script>
// import focusLock from 'dom-focus-lock'

import Icon from '../elements/Icon'
import Card from '../layout/Card'

export default {
  components: {
    Icon,
    Card
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      showSlideover: false,
      showBackdrop: false,
      showContent: false,
      backdropLeaving: false,
      contentLeaving: false,
      lock: false
    }
  },
  head () {
    if (this.open) {
      return {
        bodyAttrs: {
          class: ['overflow-hidden']
        },
        htmlAttrs: {
          style: ['touch-action: none;']
        }
      }
    }

    return undefined
  },
  computed: {
    transitionProps () {
      // Same transition than Modal but only on mobile
      if (this.$mq === 'xs') {
        return {
          enterClass: 'translate-y-4 opacity-0 sm:translate-y-0 sm:scale-95',
          enterActiveClass: 'duration-300 ease-out',
          enterToClass: 'translate-y-0 opacity-100 sm:scale-100',
          leaveClass: 'translate-y-0 opacity-100 sm:scale-100',
          leaveActiveClass: 'duration-200 ease-in',
          leaveToClass: 'translate-y-4 opacity-0 sm:translate-y-0 sm:scale-95'
        }
      } else {
        return {
          enterClass: 'translate-x-full',
          enterActiveClass: 'transition duration-500 ease-in-out transform sm:duration-700',
          enterToClass: 'translate-x-0',
          leaveClass: 'translate-x-0',
          leaveActiveClass: 'transition duration-500 ease-in-out transform sm:duration-700',
          leaveToClass: 'translate-x-full'
        }
      }
    },
    leaving () {
      return this.backdropLeaving || this.contentLeaving
    },
    open: {
      get () {
        return this.value
      },
      set (open) {
        this.$emit('input', open)
      }
    }
  },
  watch: {
    open: {
      handler (newValue) {
        if (newValue) {
          this.show()
        } else {
          this.close()
        }
      },
      immediate: true
    },
    leaving (newValue) {
      if (newValue === false) {
        this.showSlideover = false
        this.open = false
      }
    }
  },
  beforeDestroy () {
    if (this.lock) {
      // focusLock.off(this.$refs.container)
      this.lock = false
    }
  },
  shortcuts: {
    disabled () {
      return !this.open
    },
    esc: 'esc'
  },
  methods: {
    show () {
      this.showSlideover = true
      this.showBackdrop = true
      this.showContent = true
      // Remove current focus if any, avoiding the close button to autofocus and break opening animation.
      document.activeElement?.blur()
      this.$nextTick(() => {
        if (this.$refs.container && !this.lock) {
          // focusLock.on(this.$refs.container)
          this.lock = true
        }
      })
    },
    close () {
      this.showBackdrop = false
      this.showContent = false
      if (this.lock) {
        // focusLock.off(this.$refs.container)
        this.lock = false
      }
    },
    esc () {
      this.$listeners.close ? this.$listeners.close() : this.close()
    }
  }
}
</script>

<style scoped>
.slideover {
  margin: env(safe-area-inset-top) 0 0 env(safe-area-inset-left);
}
</style>
