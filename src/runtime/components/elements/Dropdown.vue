<template>
  <Menu v-slot="{ open }" as="div" :class="ui.wrapper" @mouseleave="onMouseLeave">
    <MenuButton
      ref="trigger"
      as="div"
      :disabled="disabled"
      class="inline-flex w-full"
      role="button"
      @mouseover="onMouseOver"
    >
      <slot :open="open" :disabled="disabled">
        <button :disabled="disabled">
          Open
        </button>
      </slot>
    </MenuButton>

    <div v-if="open && items.length" ref="container" :class="[ui.container, ui.width]" @mouseover="onMouseOver">
      <transition appear v-bind="ui.transition">
        <MenuItems :class="[ui.base, ui.divide, ui.ring, ui.rounded, ui.shadow, ui.background]" static>
          <div v-for="(subItems, index) of items" :key="index" :class="ui.spacing">
            <MenuItem v-for="(item, subIndex) of subItems" :key="subIndex" v-slot="{ active, disabled: itemDisabled }" :disabled="item.disabled">
              <Component
                v-bind="omit(item, ['click'])"
                :is="(item.to && NuxtLink) || (item.click && 'button') || 'div'"
                :class="resolveItemClass({ active, disabled: itemDisabled })"
                @click="item.click"
              >
                <slot :name="item.slot || 'item'" :item="item">
                  <Icon v-if="item.icon" :name="item.icon" :class="[ui.item.icon.base, active ? ui.item.icon.active : ui.item.icon.inactive, item.iconClass]" />
                  <Avatar v-else-if="item.avatar" v-bind="{ size: ui.item.avatar.size, ...item.avatar }" :class="ui.item.avatar.base" />

                  <span class="truncate">{{ item.label }}</span>

                  <span v-if="item.shortcuts?.length" :class="ui.item.shortcuts">
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

<script lang="ts">
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import type { PropType } from 'vue'
import type { RouteLocationNormalized } from 'vue-router'
import { defineComponent, ref, computed, onMounted } from 'vue'
import { defu } from 'defu'
import Icon from '../elements/Icon.vue'
import Avatar from '../elements/Avatar.vue'
import { classNames, omit } from '../../utils'
import { usePopper } from '../../composables/usePopper'
import type { Avatar as AvatarType } from '../../types/avatar'
import type { PopperOptions } from '../../types'
import { NuxtLink } from '#components'
import { useAppConfig } from '#imports'
// TODO: Remove
// @ts-expect-error
import appConfig from '#build/app.config'

// const appConfig = useAppConfig()

export default defineComponent({
  components: {
    // eslint-disable-next-line vue/no-reserved-component-names
    Menu,
    MenuButton,
    MenuItems,
    MenuItem,
    Icon,
    Avatar
  },
  props: {
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
    popper: {
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
    },
    ui: {
      type: Object as PropType<Partial<typeof appConfig.ui.dropdown>>,
      default: () => appConfig.ui.dropdown
    }
  },
  setup (props) {
    // TODO: Remove
    const appConfig = useAppConfig()

    const ui = computed<Partial<typeof appConfig.ui.dropdown>>(() => defu({}, props.ui, appConfig.ui.dropdown))

    const popper = computed<PopperOptions>(() => defu({}, props.popper, ui.value.popper as PopperOptions))

    const [trigger, container] = usePopper(popper.value)

    function resolveItemClass ({ active, disabled }: { active: boolean, disabled: boolean }) {
      return classNames(
        ui.value.item.base,
        active ? ui.value.item.active : ui.value.item.inactive,
        disabled && ui.value.item.disabled
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

    return {
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      trigger,
      container,
      resolveItemClass,
      onMouseOver,
      onMouseLeave,
      omit,
      NuxtLink
    }
  }
})
</script>
