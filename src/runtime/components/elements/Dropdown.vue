<template>
  <Menu v-slot="{ open }" as="div" :class="wrapperClass" @mouseleave="onMouseLeave">
    <MenuButton ref="trigger" as="div" class="inline-flex" @mouseover="onMouseOver">
      <slot :open="open">
        <button>Open</button>
      </slot>
    </MenuButton>

    <div v-if="open" ref="container" :class="containerClass" @mouseover="onMouseOver">
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
            <MenuItem v-for="(item, subIndex) of subItems" :key="subIndex" v-slot="{ active, disabled }" :disabled="item.disabled" as="div">
              <Component v-bind="item" :is="(item.to && NuxtLink) || (item.click && 'button') || 'div'" :class="resolveItemClass({ active, disabled })" @click="onItemClick(item)" @mouseover="$emit('hover', item)">
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

<script setup lang="ts">
import {
  Menu,
  MenuButton,
  MenuItems,
  MenuItem
} from '@headlessui/vue'

import type { Ref } from 'vue'
import { ref, onMounted } from 'vue'
import Icon from '../elements/Icon'
import Avatar from '../elements/Avatar'
import { classNames, usePopper } from '../../utils'
import $ui from '#build/ui'
import NuxtLink from '#app/components/nuxt-link'

const props = defineProps({
  items: {
    type: Array,
    default: () => []
  },
  placement: {
    type: String,
    default: 'bottom-end',
    validator: (value: string) => {
      return ['auto', 'auto-start', 'auto-end', 'top', 'top-start', 'top-end', 'bottom', 'bottom-start', 'bottom-end', 'right', 'right-start', 'right-end', 'left', 'left-start', 'left-end'].includes(value)
    }
  },
  strategy: {
    type: String,
    default: 'fixed',
    validator: (value: string) => {
      return ['absolute', 'fixed'].includes(value)
    }
  },
  mode: {
    type: String,
    default: 'click',
    validator: (value: string) => {
      return ['click', 'hover'].includes(value)
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
})

defineEmits(['hover'])

const [trigger, container] = usePopper({
  placement: props.placement,
  strategy: props.strategy,
  modifiers: [{
    name: 'offset',
    options: {
      offset: 0
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

function resolveItemClass ({ active, disabled }: { active: boolean, disabled: boolean }) {
  return classNames(
    props.itemBaseClass,
    active ? props.itemActiveClass : props.itemInactiveClass,
    disabled && props.itemDisabledClass
  )
}

function onItemClick (item: any) {
  if (item.disabled) {
    return
  }

  if (item.click) {
    item.click()
  }
}

const menuApi: Ref<any> = ref(null)
let openTimeout: NodeJS.Timeout | null = null
let closeTimeout: NodeJS.Timeout | null = null
onMounted(() => {
  setTimeout(() => {
    const menuProvides = trigger.value?.$.provides
    const menuProvidesSymbols = Object.getOwnPropertySymbols(menuProvides)
    menuApi.value = menuProvidesSymbols.length && menuProvides[menuProvidesSymbols[0]]
    // stop trigger click propagation on hover
    menuApi.value?.buttonRef.addEventListener('click', (e: Event) => {
      if (props.mode === 'hover') {
        e.stopPropagation()
      }
    }, true)
  }, 0)
})

function onMouseOver () {
  if (props.mode !== 'hover' || !menuApi.value) {
    return
  }

  // cancel programmed closing
  if (closeTimeout) {
    clearTimeout(closeTimeout)
    closeTimeout = null
  }
  // dropdown already open
  if (menuApi.value.menuState === 0) {
    return
  }
  openTimeout = openTimeout || setTimeout(() => {
    menuApi.value.openMenu && menuApi.value.openMenu()
    openTimeout = null
  }, 50)
}

function onMouseLeave () {
  if (props.mode !== 'hover' || !menuApi.value) {
    return
  }

  // cancel programmed opening
  if (openTimeout) {
    clearTimeout(openTimeout)
    openTimeout = null
  }
  // dropdown already closed
  if (menuApi.value.menuState === 1) {
    return
  }
  closeTimeout = closeTimeout || setTimeout(() => {
    menuApi.value.closeMenu && menuApi.value.closeMenu()
    closeTimeout = null
  }, 0)
}
</script>

<script lang="ts">
export default { name: 'UDropdown' }
</script>
