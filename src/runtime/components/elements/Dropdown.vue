<template>
  <Menu v-slot="{ open }" as="div" :class="wrapperClass">
    <MenuButton ref="trigger" as="div">
      <slot :open="open">
        <button>Open</button>
      </slot>
    </MenuButton>

    <div v-if="open" ref="container" :class="containerClass">
      <transition
        appear
        enter-active-class="transition duration-100 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-75 ease-out"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
        <MenuItems :class="itemsClass" static>
          <div v-for="(subItems, index) of items" :key="index" class="py-1">
            <MenuItem v-for="(item, subIndex) of subItems" :key="subIndex" v-slot="{ active, disabled }">
              <Component v-bind="item" :is="(item.to && 'Link') || 'button'" :class="resolveItemClass({ active, disabled })" @click="onItemClick(item)">
                <slot :name="item.slot" :item="item">
                  <Icon v-if="item.icon" :name="item.icon" :class="itemIconClass" />

                  {{ item.label }}
                </slot>
              </Component>
            </MenuItem>
          </div>
        </MenuItems>
      </transition>
    </div>
  </Menu>
</template>

<script>
import {
  Menu,
  MenuButton,
  MenuItems,
  MenuItem
} from '@headlessui/vue'

import Icon from '../elements/Icon'
import Link from '../elements/Link'
import { classNames, usePopper } from '../../utils'

export default {
  components: {
    Menu,
    MenuButton,
    MenuItems,
    MenuItem,
    Icon,
    Link
  },
  props: {
    items: {
      type: Array,
      default: () => []
    },
    placement: {
      type: String,
      default: 'bottom-end',
      validator: (value) => {
        return ['auto', 'auto-start', 'auto-end', 'top', 'top-start', 'top-end', 'bottom', 'bottom-start', 'bottom-end', 'right', 'right-start', 'right-end', 'left', 'left-start', 'left-end'].includes(value)
      }
    },
    strategy: {
      type: String,
      default: 'fixed',
      validator: (value) => {
        return ['absolute', 'fixed'].includes(value)
      }
    },
    wrapperClass: {
      type: String,
      default: 'relative inline-block text-left'
    },
    containerClass: {
      type: String,
      default: 'w-48 z-20'
    },
    itemsClass: {
      type: String,
      default: 'u-bg-white divide-y u-divide-gray-100 rounded-md ring-1 ring-black ring-opacity-5'
    },
    itemClass: {
      type: String,
      default: 'group flex items-center px-4 py-2 text-sm w-full'
    },
    itemActiveClass: {
      type: String,
      default: 'u-bg-gray-100 u-text-gray-900'
    },
    itemInactiveClass: {
      type: String,
      default: 'u-text-gray-700'
    },
    itemDisabledClass: {
      type: String,
      default: 'cursor-not-allowed opacity-50'
    },
    itemIconClass: {
      type: String,
      default: 'mr-3 h-5 w-5 u-text-gray-400 group-hover:u-text-gray-500'
    }
  },
  setup (props) {
    const [trigger, container] = usePopper({
      placement: props.placement,
      strategy: props.strategy,
      modifiers: [{
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
      }]
    })

    function resolveItemClass ({ active, disabled }) {
      return classNames(
        props.itemClass,
        active ? props.itemActiveClass : props.itemInactiveClass,
        disabled && props.itemDisabledClass
      )
    }

    function onItemClick (item) {
      if (item.disabled) {
        return
      }

      if (item.click) {
        item.click()
      }
    }

    return {
      trigger,
      container,
      onItemClick,
      resolveItemClass
    }
  }
}
</script>
