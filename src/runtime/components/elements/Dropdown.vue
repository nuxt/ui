<template>
  <HMenu v-slot="{ open }" as="div" :class="ui.wrapper" @mouseleave="onMouseLeave">
    <HMenuButton
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
    </HMenuButton>

    <div v-if="open && items.length" ref="container" :class="[ui.container, ui.width]" :style="containerStyle" @mouseover="onMouseOver">
      <Transition appear v-bind="ui.transition">
        <HMenuItems :class="[ui.base, ui.divide, ui.ring, ui.rounded, ui.shadow, ui.background, ui.height]" static>
          <div v-for="(subItems, index) of items" :key="index" :class="ui.padding">
            <HMenuItem v-for="(item, subIndex) of subItems" :key="subIndex" v-slot="{ active, disabled: itemDisabled }" :disabled="item.disabled">
              <ULink
                v-bind="omit(item, ['label', 'slot', 'icon', 'iconClass', 'avatar', 'shortcuts', 'disabled', 'click'])"
                :class="[ui.item.base, ui.item.padding, ui.item.size, ui.item.rounded, active ? ui.item.active : ui.item.inactive, itemDisabled && ui.item.disabled]"
                @click="item.click"
              >
                <slot :name="item.slot || 'item'" :item="item">
                  <UIcon v-if="item.icon" :name="item.icon" :class="[ui.item.icon.base, active ? ui.item.icon.active : ui.item.icon.inactive, item.iconClass]" />
                  <UAvatar v-else-if="item.avatar" v-bind="{ size: ui.item.avatar.size, ...item.avatar }" :class="ui.item.avatar.base" />

                  <span class="truncate">{{ item.label }}</span>

                  <span v-if="item.shortcuts?.length" :class="ui.item.shortcuts">
                    <UKbd v-for="shortcut of item.shortcuts" :key="shortcut">{{ shortcut }}</UKbd>
                  </span>
                </slot>
              </ULink>
            </HMenuItem>
          </div>
        </HMenuItems>
      </Transition>
    </div>
  </HMenu>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue'
import type { PropType } from 'vue'
import { Menu as HMenu, MenuButton as HMenuButton, MenuItems as HMenuItems, MenuItem as HMenuItem } from '@headlessui/vue'
import { defu } from 'defu'
import { omit } from 'lodash-es'
import UIcon from '../elements/Icon.vue'
import UAvatar from '../elements/Avatar.vue'
import UKbd from '../elements/Kbd.vue'
import ULink from '../elements/Link.vue'
import { usePopper } from '../../composables/usePopper'
import type { DropdownItem } from '../../types/dropdown'
import type { PopperOptions } from '../../types'
import { useAppConfig } from '#imports'
// TODO: Remove
// @ts-expect-error
import appConfig from '#build/app.config'

// const appConfig = useAppConfig()

export default defineComponent({
  components: {
    HMenu,
    HMenuButton,
    HMenuItems,
    HMenuItem,
    UIcon,
    UAvatar,
    UKbd,
    ULink
  },
  props: {
    items: {
      type: Array as PropType<DropdownItem[][]>,
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

    const popper = computed<PopperOptions>(() => defu(props.mode === 'hover' ? { offsetDistance: 0 } : {}, props.popper, ui.value.popper as PopperOptions))

    const [trigger, container] = usePopper(popper.value)

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

    const containerStyle = computed(() => {
      const offsetDistance = (props.popper as PopperOptions)?.offsetDistance || (ui.value.popper as PopperOptions)?.offsetDistance || 8

      return props.mode === 'hover' ? { paddingTop: `${offsetDistance}px`, paddingBottom: `${offsetDistance}px` } : {}
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
      containerStyle,
      onMouseOver,
      onMouseLeave,
      omit
    }
  }
})
</script>
