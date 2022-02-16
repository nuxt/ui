<template>
  <Menu v-slot="{ open }" as="div" :class="wrapperClass">
    <MenuButton ref="trigger" as="div" class="inline-flex">
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
        <MenuItems :class="baseClass" static>
          <div v-for="(subItems, index) of items" :key="index" class="py-1">
            <MenuItem v-for="(item, subIndex) of subItems" :key="subIndex" v-slot="{ active, disabled }">
              <Component v-bind="item" :is="(item.to && 'Link') || 'button'" :class="resolveItemClass({ active, disabled })" @click="onItemClick(item)">
                <slot :name="item.slot" :item="item">
                  <Icon v-if="item.icon" :name="item.icon" :class="itemIconClass" />
                  <Avatar v-if="item.avatar" :src="item.avatar" :alt="item.label" :class="itemAvatarClass" size="xs" />

                  <span class="truncate">{{ item.label }}</span>
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
import Avatar from '../elements/Avatar'
import Link from '../elements/Link'
import { classNames, usePopper } from '../../utils'
import $ui from '#build/ui'

export default {
  components: {
    Menu,
    MenuButton,
    MenuItems,
    MenuItem,
    Icon,
    Avatar,
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
      default: () => $ui.dropdown.wrapper
    },
    containerClass: {
      type: String,
      default: () => $ui.dropdown.container
    },
    baseClass: {
      type: String,
      default: () => $ui.dropdown.base
    },
    itemBaseClass: {
      type: String,
      default: () => $ui.dropdown.item.base
    },
    itemActiveClass: {
      type: String,
      default: () => $ui.dropdown.item.active
    },
    itemInactiveClass: {
      type: String,
      default: () => $ui.dropdown.item.inactive
    },
    itemDisabledClass: {
      type: String,
      default: () => $ui.dropdown.item.disabled
    },
    itemIconClass: {
      type: String,
      default: () => $ui.dropdown.item.icon
    },
    itemAvatarClass: {
      type: String,
      default: () => $ui.dropdown.item.avatar
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
        props.itemBaseClass,
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
