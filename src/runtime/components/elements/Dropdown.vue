<template>
  <Menu v-slot="{ open }" as="div" :class="wrapperClass" @mouseleave="onMouseLeave">
    <MenuButton
      ref="trigger"
      as="div"
      :disabled="disabled"
      class="inline-flex w-full"
      role="button"
      @mouseover="onMouseOver"
    >
      <slot :open="open">
        <button :disabled="disabled">
          Open
        </button>
      </slot>
    </MenuButton>

    <div v-if="open && items.length" ref="container" :class="[containerClass, widthClass]" @mouseover="onMouseOver">
      <transition appear v-bind="transitionClass">
        <MenuItems :class="baseClass" static>
          <div v-for="(subItems, index) of items" :key="index" :class="groupClass">
            <MenuItem v-for="(item, subIndex) of subItems" :key="subIndex" v-slot="{ active, disabled: itemDisabled }" :disabled="item.disabled">
              <Component
                v-bind="omit(item, ['click'])"
                :is="(item.to && NuxtLink) || (item.click && 'button') || 'div'"
                :class="resolveItemClass({ active, disabled: itemDisabled })"
                @click="item.click"
              >
                <slot :name="item.slot" :item="item">
                  <IconCSS v-if="item.icon" :name="item.icon" :class="[itemIconClass, item.iconClass]" />
                  <Avatar v-if="item.avatar" v-bind="{ size: 'xxs', ...item.avatar }" :class="itemAvatarClass" />

                  <span class="truncate">{{ item.label }}</span>

                  <span v-if="item.shortcuts?.length" :class="itemShortcutsClass">
                    <kbd v-for="shortcut of item.shortcuts" :key="shortcut" class="font-sans">{{ shortcut }}</kbd>
                  </span>
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
import type { PropType } from 'vue'
import type { RouteLocationNormalized } from 'vue-router'
import { ref, computed, onMounted } from 'vue'
import { defu } from 'defu'
import NuxtLink from '#app/components/nuxt-link'
import Avatar from '../elements/Avatar.vue'
import { classNames, omit } from '../../utils'
import { usePopper } from '../../composables/usePopper'
import type { Avatar as AvatarType } from '../../types/avatar'
import type { PopperOptions } from '../../types'
import $ui from '#build/ui'

const props = defineProps({
  items: {
    type: Array as PropType<{
      to?: RouteLocationNormalized
      exact?: boolean
      label: string
      disabled?: boolean
      slot?: string
      icon?: string
      iconClass?: string
      avatar?: Partial<AvatarType>
      click?: Function
      shortcuts?: string[]
    }[][]>,
    default: () => []
  },
  mode: {
    type: String,
    default: 'click',
    validator: (value: string) => {
      return ['click', 'hover'].includes(value)
    }
  },
  disabled: {
    type: Boolean,
    default: false
  },
  wrapperClass: {
    type: String,
    default: () => $ui.dropdown.wrapper
  },
  containerClass: {
    type: String,
    default: () => $ui.dropdown.container
  },
  widthClass: {
    type: String,
    default: () => $ui.dropdown.width
  },
  baseClass: {
    type: String,
    default: () => $ui.dropdown.base
  },
  transitionClass: {
    type: Object,
    default: () => $ui.dropdown.transition
  },
  groupClass: {
    type: String,
    default: () => $ui.dropdown.group
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
  },
  itemShortcutsClass: {
    type: String,
    default: () => $ui.dropdown.item.shortcuts
  },
  popperOptions: {
    type: Object as PropType<PopperOptions>,
    default: () => ({})
  },
  openDelay: {
    type: Number,
    default: 50
  },
  closeDelay: {
    type: Number,
    default: 0
  }
})

const popperOptions = computed<PopperOptions>(() => defu({}, props.popperOptions, $ui.dropdown.popperOptions))

const [trigger, container] = usePopper(popperOptions.value)

function resolveItemClass ({ active, disabled }: { active: boolean, disabled: boolean }) {
  return classNames(
    props.itemBaseClass,
    active ? props.itemActiveClass : props.itemInactiveClass,
    disabled && props.itemDisabledClass
  )
}

// https://github.com/tailwindlabs/headlessui/blob/f66f4926c489fc15289d528294c23a3dc2aee7b1/packages/%40headlessui-vue/src/components/menu/menu.ts#L131
const menuApi = ref<any>(null)

let openTimeout: NodeJS.Timeout | null = null
let closeTimeout: NodeJS.Timeout | null = null

onMounted(() => {
  setTimeout(() => {
    // @ts-expect-error internals
    const menuProvides = trigger.value?.$.provides
    if (!menuProvides) {
      return
    }
    const menuProvidesSymbols = Object.getOwnPropertySymbols(menuProvides)
    menuApi.value = menuProvidesSymbols.length && menuProvides[menuProvidesSymbols[0]]
  }, 200)
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
  }, props.openDelay)
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
  }, props.closeDelay)
}
</script>

<script lang="ts">
export default { name: 'UDropdown' }
</script>
