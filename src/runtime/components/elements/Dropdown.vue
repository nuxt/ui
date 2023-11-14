<template>
  <HMenu v-slot="{ open }" as="div" :class="ui.wrapper" v-bind="attrs" @mouseleave="onMouseLeave">
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
        <div>
          <div v-if="popper.arrow" data-popper-arrow :class="['invisible before:visible before:block before:rotate-45 before:z-[-1]', Object.values(ui.arrow)]" />
          <HMenuItems :class="[ui.base, ui.divide, ui.ring, ui.rounded, ui.shadow, ui.background, ui.height]" static>
            <div v-for="(subItems, index) of items" :key="index" :class="ui.padding">
              <NuxtLink v-for="(item, subIndex) of subItems" :key="subIndex" v-slot="{ href, target, rel, navigate, isExternal }" v-bind="omit(item, ['label', 'slot', 'icon', 'iconClass', 'avatar', 'shortcuts', 'disabled', 'click'])" custom>
                <HMenuItem v-slot="{ active, disabled: itemDisabled, close }" :disabled="item.disabled">
                  <component
                    :is="!!href ? 'a' : 'button'"
                    :href="!itemDisabled ? href : undefined"
                    :rel="rel"
                    :target="target"
                    :class="[ui.item.base, ui.item.padding, ui.item.size, ui.item.rounded, active ? ui.item.active : ui.item.inactive, itemDisabled && ui.item.disabled]"
                    @click="(e) => [!!item.click && item.click(), !!href && !isExternal && navigate(e), close()]"
                  >
                    <slot :name="item.slot || 'item'" :item="item">
                      <UIcon v-if="item.icon" :name="item.icon" :class="[ui.item.icon.base, active ? ui.item.icon.active : ui.item.icon.inactive, item.iconClass]" />
                      <UAvatar v-else-if="item.avatar" v-bind="{ size: ui.item.avatar.size, ...item.avatar }" :class="ui.item.avatar.base" />

                      <span class="truncate">{{ item.label }}</span>

                      <span v-if="item.shortcuts?.length" :class="ui.item.shortcuts">
                        <UKbd v-for="shortcut of item.shortcuts" :key="shortcut">{{ shortcut }}</UKbd>
                      </span>
                    </slot>
                  </component>
                </HMenuItem>
              </NuxtLink>
            </div>
          </HMenuItems>
        </div>
      </Transition>
    </div>
  </HMenu>
</template>

<script lang="ts">
import { defineComponent, ref, computed, toRef, onMounted, resolveComponent } from 'vue'
import type { PropType } from 'vue'
import { Menu as HMenu, MenuButton as HMenuButton, MenuItems as HMenuItems, MenuItem as HMenuItem } from '@headlessui/vue'
import { defu } from 'defu'
import UIcon from '../elements/Icon.vue'
import UAvatar from '../elements/Avatar.vue'
import UKbd from '../elements/Kbd.vue'
import { useUI } from '../../composables/useUI'
import { usePopper } from '../../composables/usePopper'
import { mergeConfig, omit } from '../../utils'
import type { DropdownItem, PopperOptions, Strategy } from '../../types'
// @ts-expect-error
import appConfig from '#build/app.config'
import { dropdown } from '#ui/ui.config'

const config = mergeConfig<typeof dropdown>(appConfig.ui.strategy, appConfig.ui.dropdown, dropdown)

export default defineComponent({
  components: {
    HMenu,
    HMenuButton,
    HMenuItems,
    HMenuItem,
    UIcon,
    UAvatar,
    UKbd
  },
  inheritAttrs: false,
  props: {
    items: {
      type: Array as PropType<DropdownItem[][]>,
      default: () => []
    },
    mode: {
      type: String as PropType<'click' | 'hover'>,
      default: 'click',
      validator: (value: string) => ['click', 'hover'].includes(value)
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
      default: 0
    },
    closeDelay: {
      type: Number,
      default: 0
    },
    class: {
      type: [String, Object, Array] as PropType<any>,
      default: undefined
    },
    ui: {
      type: Object as PropType<Partial<typeof config & { strategy?: Strategy }>>,
      default: undefined
    }
  },
  setup (props) {
    const { ui, attrs } = useUI('dropdown', toRef(props, 'ui'), config, toRef(props, 'class'))

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

    const NuxtLink = resolveComponent('NuxtLink')

    return {
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      attrs,
      // eslint-disable-next-line vue/no-dupe-keys
      popper,
      trigger,
      container,
      containerStyle,
      onMouseOver,
      onMouseLeave,
      omit,
      NuxtLink
    }
  }
})
</script>
