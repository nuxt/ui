<template>
  <div
    ref="container"
    v-on-clickaway="close"
    :class="typeof wrapperClass === 'string' ? wrapperClass : 'relative inline-block text-left'"
    @keydown.escape="open = false"
    @mouseover="mode === 'hover' ? mouseover() : () => {}"
    @mouseleave="mode === 'hover' ? mouseleave() : () => {}"
  >
    <div class="flex items-center">
      <slot name="trigger" :toggle="toggle" :open="open">
        <TwButton
          :variant="variant"
          :size="size"
          :label="label"
          :icon="icon"
          :rounded="rounded"
          :square="square"
          :loading="loading"
          :disabled="disabled"
          :custom-class="customClass"
          :icon-class="iconClass"
          trailing
          @click.native="toggle"
        >
          <slot />
        </TwButton>
      </slot>
    </div>

    <transition
      appear
      enter-class="transform scale-95 opacity-0"
      enter-active-class="transition duration-100 ease-out"
      enter-to-class="transform scale-100 opacity-100"
      leave-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div
        v-show="open && (links.length || $slots.header || $scopedSlots.header)"
        ref="tooltip"
        :class="[
          dropdownClass,
          mode === 'hover' && 'pt-2'
        ]"
        class="z-30 rounded-md shadow-lg"
      >
        <div
          class="overflow-y-auto bg-white divide-y divide-gray-100 rounded-md ring-1 ring-gray-200 dark:ring-gray-700 dark:divide-gray-700"
          :class="[
            dropdownMenuClass,
            darken ? 'dark:bg-gray-900' : 'dark:bg-gray-800'
          ]"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
        >
          <slot name="header" />
          <div v-if="links.length" class="divide-y divide-gray-100 dark:divide-gray-700">
            <div v-for="(items, index) of links" :key="index" class="py-1">
              <div
                v-for="(link, i) of items"
                :key="i"
                role="menuitem"
                @click="!link.disabled ? click(link) : (() => {})()"
              >
                <component
                  :is="(link.to && 'NuxtLink') || (link.href && 'a') || 'div'"
                  :to="link.to"
                  :href="link.href"
                  :target="link.target"
                  :class="[
                    link.click || (link.to || link.href) ? 'cursor-pointer hover:text-tw-gray-900 focus:text-tw-gray-900 hover:bg-tw-gray-100 focus:bg-tw-gray-100' : '',
                    link.active ? 'bg-tw-gray-100' : '',
                    !link.disabled ? 'text-tw-gray-600' : 'text-tw-gray-400 cursor-not-allowed',
                    size === 'md' ? 'px-4 py-2' : 'px-3 py-1.5',
                    customLinkClass,
                    link.customClass
                  ]"
                  class="flex items-center justify-between space-x-3 text-sm group focus:outline-none"
                >
                  <slot name="link" :link="link">
                    <div class="flex items-center flex-1 truncate" :class="{ 'flex-row-reverse justify-between': link.reverse, 'gap-3': size === 'md', 'gap-2': size !== 'md' }">
                      <Icon
                        v-if="link.icon"
                        :name="link.icon"
                        :class="[
                          !link.disabled ? 'group-hover:text-tw-gray-500 group-focus:text-tw-gray-500' : '',
                          size === 'md' ? 'h-5 w-5' : 'h-4 w-4',
                          link.customIconClass
                        ]"
                        class="flex-shrink-0 text-tw-gray-400"
                      />
                      <TwAvatar
                        v-if="link.avatar"
                        :src="link.avatar"
                        :alt="link.label"
                        :gradient="link.gradient"
                        size="xxs"
                      />
                      <span class="truncate">{{ link.label }}</span>
                    </div>

                    <div
                      v-if="link.shortcuts && link.shortcuts.length && $mq !== 'xs'"
                      class="flex items-center flex-shrink-0 ml-1 space-x-1 text-xs font-bold text-tw-gray-400"
                    >
                      <div v-for="(shortcut, j) of link.shortcuts" :key="j">
                        <span>
                          {{ shortcut }}
                        </span>
                      </div>
                    </div>

                    <span
                      v-if="link.unread"
                      class="flex-shrink-0 block w-2 h-2 p-1 mr-1 rounded-full opacity-75 bg-primary-600 dark:bg-white animate-pulse"
                    />
                  </slot>

                  <slot v-if="link.slot" :name="link.slot" />
                </component>
              </div>
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
import Icon from '../elements/icon'

export default {
  components: { Icon },
  directives: {
    onClickaway
  },
  props: {
    label: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: 'solid/chevron-down'
    },
    links: {
      type: Array,
      default: () => []
    },
    variant: {
      type: String,
      default: 'white'
    },
    size: {
      type: String,
      default: 'md',
      validator (value) {
        return ['', 'xxs', 'xs', 'sm', 'md', 'lg', 'xl'].includes(value)
      }
    },
    mode: {
      type: String,
      default: 'click',
      validator (value) {
        return ['click', 'hover'].includes(value)
      }
    },
    placement: {
      type: String,
      default: 'bottom-end'
    },
    strategy: {
      type: String,
      default: 'absolute'
    },
    wrapperClass: {
      type: String,
      default: null
    },
    iconClass: {
      type: String,
      default: null
    },
    customClass: {
      type: String,
      default: null
    },
    customLinkClass: {
      type: String,
      default: null
    },
    rounded: {
      type: Boolean,
      default: false
    },
    square: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    darken: {
      type: Boolean,
      default: false
    },
    dropdownClass: {
      type: String,
      default: 'w-48'
    },
    dropdownMenuClass: {
      type: String,
      default: 'max-h-56'
    },
    openDelay: {
      type: Number,
      default: 100
    },
    closeDelay: {
      type: Number,
      default: 0
    },
    preventOverflow: {
      type: Number,
      default: 8
    }
  },
  data () {
    return {
      open: false,
      instance: null,
      openTimeout: null,
      closeTimeout: null
    }
  },
  watch: {
    disabled (value) {
      if (value && open) { this.close() }
    },
    open (value) {
      if (!value) {
        return
      }

      if (this.instance) {
        this.instance.destroy()
        this.instance = null
      }

      this.instance = createPopper(this.$refs.container, this.$refs.tooltip, {
        strategy: this.strategy,
        placement: this.placement,
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: this.mode === 'click' ? [0, 8] : 0
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
              padding: this.preventOverflow
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
    click (link) {
      if (link.click) {
        link.click()
      }
      if (link.click || link.to) {
        this.toggle()
      }
    },
    mouseover () {
      clearTimeout(this.closeTimeout)
      this.closeTimeout = null
      this.openTimeout = this.openTimeout || setTimeout(() => {
        this.open = true
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
    toggle () {
      this.open = !this.open
    },
    close () {
      this.open = false
    }
  }
}
</script>
