<template>
  <div v-if="showModal" class="fixed inset-0 z-50 overflow-hidden modal">
    <div class="flex items-start justify-center min-h-screen">
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

      <transition
        appear
        enter-class="translate-y-4 opacity-0 sm:translate-y-0 sm:scale-95"
        enter-active-class="duration-300 ease-out"
        enter-to-class="translate-y-0 opacity-100 sm:scale-100"
        leave-class="translate-y-0 opacity-100 sm:scale-100"
        leave-active-class="duration-200 ease-in"
        leave-to-class="translate-y-4 opacity-0 sm:translate-y-0 sm:scale-95"
        @before-leave="contentLeaving = true"
        @after-leave="contentLeaving = false"
      >
        <Card
          v-if="showContent"
          v-bind="$attrs"
          class="z-50 flex flex-col flex-1 w-screen h-screen mx-auto overflow-hidden shadow-xl"
          :class="modalClass"
          variant="white"
          ring-class="sm:ring-1 ring-transparent dark:ring-gray-700"
          aria-modal="true"
        >
          <template v-if="$slots.header" #header>
            <slot name="header" />
          </template>
          <template v-else-if="title" #header>
            <div class="flex items-center justify-between">
              <h2 class="font-medium sm:text-lg sm:leading-6 text-tw-gray-900">
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
    </div>
  </div>
</template>

<script>
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
    },
    fullscreen: {
      type: Boolean,
      default: false
    },
    baseClass: {
      type: String,
      default: 'sm:my-20 sm:max-w-xl sm:h-auto'
    }
  },
  data () {
    return {
      showModal: false,
      showBackdrop: false,
      showContent: false,
      backdropLeaving: false,
      contentLeaving: false
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
    modalClass () {
      return this.fullscreen ? 'sm:m-10 sm:h-[calc(100vh-5rem)]' : this.baseClass
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
        this.showModal = false
        this.open = false
      }
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
      this.showModal = true
      this.showBackdrop = true
      this.showContent = true
    },
    close () {
      this.showBackdrop = false
      this.showContent = false
    },
    esc () {
      this.$listeners.close ? this.$listeners.close() : this.close()
    }
  }
}
</script>

<style scoped>
.modal {
  padding: env(safe-area-inset-top) 0 0 env(safe-area-inset-left);
}
</style>
