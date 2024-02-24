<template>
  <!-- eslint-disable-next-line vue/no-template-shadow -->
  <HMenu v-slot="{ open }" as="div" :class="_ui.wrapper" v-bind="attrs" @mouseleave="onMouseLeave">
    <HMenuButton
      ref="trigger"
      as="div"
      :disabled="disabled"
      :class="_ui.trigger"
      role="button"
      @mouseover="onMouseOver"
    >
      <slot :open="open" :disabled="disabled">
        <button :disabled="disabled">
          Open
        </button>
      </slot>
    </HMenuButton>

    <div v-if="open && items.length" ref="container" :class="[_ui.container, _ui.width]" :style="containerStyle" @mouseover="onMouseOver">
      <Transition appear v-bind="_ui.transition">
        <div>
          <div v-if="_popper.arrow" data-popper-arrow :class="Object.values(_ui.arrow)" />

          <HMenuItems :class="[_ui.base, _ui.divide, _ui.ring, _ui.rounded, _ui.shadow, _ui.background, _ui.height]" static>
            <div v-for="(subItems, index) of items" :key="index" :class="_ui.padding">
              <NuxtLink v-for="(item, subIndex) of subItems" :key="subIndex" v-slot="{ href, target, rel, navigate, isExternal }" v-bind="getNuxtLinkProps(item)" custom>
                <HMenuItem v-slot="{ active, disabled: itemDisabled, close }" :disabled="item.disabled">
                  <component
                    :is="!!href ? 'a' : 'button'"
                    :href="!itemDisabled ? href : undefined"
                    :rel="rel"
                    :target="target"
                    :class="twMerge(twJoin(_ui.item.base, _ui.item.padding, _ui.item.size, _ui.item.rounded, active ? _ui.item.active : _ui.item.inactive, itemDisabled && _ui.item.disabled), item.class)"
                    @click="onClick($event, item, { href, navigate, close, isExternal })"
                  >
                    <slot :name="item.slot || 'item'" :item="item">
                      <UIcon v-if="item.icon" :name="item.icon" :class="twMerge(twJoin(_ui.item.icon.base, active ? _ui.item.icon.active : _ui.item.icon.inactive), item.iconClass)" />
                      <UAvatar v-else-if="item.avatar" v-bind="{ size: _ui.item.avatar.size, ...item.avatar }" :class="_ui.item.avatar.base" />

                      <span :class="twMerge(_ui.item.label, item.labelClass)">{{ item.label }}</span>

                      <span v-if="item.shortcuts?.length" :class="_ui.item.shortcuts">
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
import { defineComponent, ref, computed, watch, toRef, onMounted, resolveComponent } from 'vue'
import type { PropType } from 'vue'
import { Menu as HMenu, MenuButton as HMenuButton, MenuItems as HMenuItems, MenuItem as HMenuItem, provideUseId } from '@headlessui/vue'
import { defu } from 'defu'
import { twMerge, twJoin } from 'tailwind-merge'
import UIcon from '../elements/Icon.vue'
import UAvatar from '../elements/Avatar.vue'
import UKbd from '../elements/Kbd.vue'
import { useUI } from '../../composables/useUI'
import { usePopper } from '../../composables/usePopper'
import { mergeConfig, getNuxtLinkProps } from '../../utils'
import type { DropdownItem, PopperOptions, Strategy } from '../../types'
// @ts-expect-error
import appConfig from '#build/app.config'
import { dropdown } from '#ui/ui.config'
import { useId } from '#imports'

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
    open: {
      type: Boolean,
      default: undefined
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
      default: () => config.default.openDelay
    },
    closeDelay: {
      type: Number,
      default: () => config.default.closeDelay
    },
    class: {
      type: [String, Object, Array] as PropType<any>,
      default: () => ''
    },
    ui: {
      type: Object as PropType<Partial<typeof config> & { strategy?: Strategy }>,
      default: () => ({})
    }
  },
  emits: ['update:open'],
  setup (props, { emit }) {
    const { ui, attrs } = useUI('dropdown', toRef(props, 'ui'), config, toRef(props, 'class'))

    const popper = computed<PopperOptions>(() => defu(props.mode === 'hover' ? { offsetDistance: 0 } : {}, props.popper, ui.value.popper as PopperOptions))

    const [trigger, container] = usePopper(popper.value)

    // https://github.com/tailwindlabs/headlessui/blob/f66f4926c489fc15289d528294c23a3dc2aee7b1/packages/%40headlessui-vue/src/components/menu/menu.ts#L131
    const menuApi = ref<any>(null)

    let openTimeout: NodeJS.Timeout | null = null
    let closeTimeout: NodeJS.Timeout | null = null

    onMounted(() => {
      // @ts-expect-error internals
      const menuProvides = trigger.value?.$.provides
      if (!menuProvides) {
        return
      }
      const menuProvidesSymbols = Object.getOwnPropertySymbols(menuProvides)
      menuApi.value = menuProvidesSymbols.length && menuProvides[menuProvidesSymbols[0]]

      if (props.open) {
        menuApi.value?.openMenu()
      }
    })

    const containerStyle = computed(() => {
      if (props.mode !== 'hover') {
        return {}
      }

      const offsetDistance = (props.popper as PopperOptions)?.offsetDistance || (ui.value.popper as PopperOptions)?.offsetDistance || 8
      const placement = popper.value.placement?.split('-')[0]
      const padding = `${offsetDistance}px`

      if (placement === 'top' || placement === 'bottom') {
        return {
          paddingTop: padding,
          paddingBottom: padding
        }
      } else if (placement === 'left' || placement === 'right') {
        return {
          paddingLeft: padding,
          paddingRight: padding
        }
      } else {
        return {
          paddingTop: padding,
          paddingBottom: padding,
          paddingLeft: padding,
          paddingRight: padding
        }
      }
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

    function onClick (e, item, { href, navigate, close, isExternal }) {
      if (item.click) {
        item.click(e)
      }

      if (href && !isExternal) {
        navigate(e)

        close()
      }
    }

    watch(() => props.open, (newValue: boolean, oldValue: boolean) => {
      if (!menuApi.value) return
      if (oldValue === undefined || newValue === oldValue) return

      if (newValue) {
        menuApi.value.openMenu()
      } else {
        menuApi.value.closeMenu()
      }
    })

    watch(() => menuApi.value?.menuState, (newValue: number, oldValue: number) => {
      if (oldValue === undefined || newValue === oldValue) return

      emit('update:open', newValue === 0)
    })

    const NuxtLink = resolveComponent('NuxtLink')

    provideUseId(() => useId())

    return {
      _ui: ui,
      attrs,
      _popper: popper,
      trigger,
      container,
      containerStyle,
      onMouseOver,
      onMouseLeave,
      onClick,
      getNuxtLinkProps,
      twMerge,
      twJoin,
      NuxtLink
    }
  }
})
</script>
