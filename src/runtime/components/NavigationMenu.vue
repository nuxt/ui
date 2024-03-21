<script lang="ts">
import { tv } from 'tailwind-variants'
import type { NavigationMenuRootProps, NavigationMenuRootEmits } from 'radix-vue'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/navigationMenu'
import type { LinkProps } from '#ui/components/Link.vue'
import type { AvatarProps } from '#ui/components/Avatar.vue'
import type { BadgeProps } from '#ui/components/Badge.vue'

const appConfig = _appConfig as AppConfig & { ui: { navigationMenu: Partial<typeof theme> } }

const navigationMenu = tv({ extend: tv(theme), ...(appConfig.ui?.navigationMenu || {}) })

export interface NavigationMenuLink extends LinkProps {
  label: string | number
  icon?: string
  avatar?: AvatarProps
  badge?: string | number | BadgeProps
}

export interface NavigationMenuProps<T extends NavigationMenuLink> extends Omit<NavigationMenuRootProps, 'asChild' | 'dir'> {
  links: T[][] | T[]
  class?: any
  ui?: Partial<typeof navigationMenu.slots>
}

export interface NavigationMenuEmits extends NavigationMenuRootEmits {}

type SlotProps<T> = (props: { link: T, active: boolean }) => any

export interface NavigationMenuSlots<T extends NavigationMenuLink> {
  leading: SlotProps<T>
  default: SlotProps<T>
  trailing: SlotProps<T>
}
</script>

<script setup lang="ts" generic="T extends NavigationMenuLink">
import { computed } from 'vue'
import { NavigationMenuRoot, NavigationMenuList, NavigationMenuItem, NavigationMenuLink, useForwardPropsEmits } from 'radix-vue'
import { reactivePick } from '@vueuse/core'
import { UIcon, UAvatar, UBadge, ULink, ULinkBase } from '#components'
import { omit } from '#ui/utils'

const props = withDefaults(defineProps<NavigationMenuProps<T>>(), { orientation: 'horizontal' })
const emits = defineEmits<NavigationMenuEmits>()
defineSlots<NavigationMenuSlots<T>>()

const rootProps = useForwardPropsEmits(reactivePick(props, 'as', 'modelValue', 'defaultValue', 'delayDuration', 'skipDelayDuration', 'orientation'), emits)

const ui = computed(() => tv({ extend: navigationMenu, slots: props.ui })({ orientation: props.orientation }))

const lists = computed(() => props.links?.length ? (Array.isArray(props.links[0]) ? props.links : [props.links]) as T[][] : [])
</script>

<template>
  <NavigationMenuRoot v-bind="rootProps" :class="ui.root({ class: props.class })">
    <NavigationMenuList v-for="(list, index) in lists" :key="`list-${index}`" :class="ui.list()">
      <NavigationMenuItem v-for="(link, subIndex) in list" :key="`list-${index}-${subIndex}`" :class="ui.item()">
        <ULink v-slot="{ active, ...slotProps }" v-bind="omit(link, ['label', 'icon', 'avatar', 'badge'])" custom>
          <NavigationMenuLink as-child :active="active">
            <ULinkBase v-bind="slotProps" :class="ui.base({ active })">
              <slot name="leading" :link="link" :active="active">
                <UAvatar v-if="link.avatar" size="2xs" v-bind="link.avatar" :class="ui.avatar({ active })" />
                <UIcon v-else-if="link.icon" :name="link.icon" :class="ui.icon({ active })" />
              </slot>

              <span v-if="link.label || $slots.default" :class="ui.label()">
                <slot :link="link" :active="active">
                  {{ link.label }}
                </slot>
              </span>

              <slot name="trailing" :link="link" :active="active">
                <UBadge
                  v-if="link.badge"
                  color="gray"
                  variant="solid"
                  size="xs"
                  v-bind="(typeof link.badge === 'string' || typeof link.badge === 'number') ? { label: link.badge } : link.badge"
                  :class="ui.badge()"
                />
              </slot>
            </ULinkBase>
          </NavigationMenuLink>
        </ULink>
      </NavigationMenuItem>
    </NavigationMenuList>
  </NavigationMenuRoot>
</template>
