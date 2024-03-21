<script lang="ts">
import { tv } from 'tailwind-variants'
import type { NavigationMenuRootProps, NavigationMenuRootEmits } from 'radix-vue'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/navigationMenu'
import { getNuxtLinkProps, type LinkProps } from '#ui/components/Link.vue'
import type { AvatarProps } from '#ui/components/Avatar.vue'
import type { BadgeProps } from '#ui/components/Badge.vue'

const appConfig = _appConfig as AppConfig & { ui: { navigationMenu: Partial<typeof theme> } }

const navigationMenu = tv({ extend: tv(theme), ...(appConfig.ui?.navigationMenu || {}) })

export interface NavigationMenuLink extends LinkProps {
  label: string | number
  icon?: string
  avatar?: AvatarProps
  click?: Function
  class?: any
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
import { NuxtLink, UIcon, UAvatar, UBadge } from '#components'

const props = withDefaults(defineProps<NavigationMenuProps<T>>(), { orientation: 'horizontal' })
const emits = defineEmits<NavigationMenuEmits>()
defineSlots<NavigationMenuSlots<T>>()

const rootProps = useForwardPropsEmits(reactivePick(props, 'as', 'modelValue', 'defaultValue', 'delayDuration', 'skipDelayDuration', 'orientation'), emits)

const ui = computed(() => tv({ extend: navigationMenu, slots: props.ui })({
  orientation: props.orientation
}))

const lists = computed(() => props.links?.length ? (Array.isArray(props.links[0]) ? props.links : [props.links]) as T[][] : [])

function onClick (e: MouseEvent, link: NavigationMenuLink, { href, navigate, isExternal }: { href: string; navigate: Function; isExternal: boolean }) {
  if (link.click) {
    link.click(e)
  }

  if (href && !isExternal) {
    navigate(e)
  }
}
</script>

<template>
  <NavigationMenuRoot v-bind="rootProps" :class="ui.root({ class: props.class })">
    <NavigationMenuList v-for="(list, index) in lists" :key="`list-${index}`" :class="ui.list()">
      <NavigationMenuItem v-for="(link, subIndex) in list" :key="`list-${index}-${subIndex}`" :class="ui.item()">
        <NuxtLink v-slot="{ href, target, rel, navigate, isExternal, isActive }" v-bind="getNuxtLinkProps(link)" custom>
          <NavigationMenuLink as-child :active="isActive">
            <component
              :is="href ? 'a' : 'button'"
              :href="href"
              :rel="rel"
              :target="target"
              :class="ui.base({ active: isActive, class: link.class })"
              @click="onClick($event, link, { href, navigate, isExternal })"
            >
              <slot name="leading" :link="link" :active="isActive">
                <UAvatar v-if="link.avatar" size="2xs" v-bind="link.avatar" :class="ui.avatar({ active: isActive })" />
                <UIcon v-else-if="link.icon" :name="link.icon" :class="ui.icon({ active: isActive })" />
              </slot>

              <span v-if="link.label || $slots.default" :class="ui.label()">
                <slot :link="link" :active="isActive">
                  {{ link.label }}
                </slot>
              </span>

              <slot name="trailing" :link="link" :active="isActive">
                <UBadge
                  v-if="link.badge"
                  color="gray"
                  variant="solid"
                  size="xs"
                  v-bind="(typeof link.badge === 'string' || typeof link.badge === 'number') ? { label: link.badge } : link.badge"
                  :class="ui.badge()"
                />
              </slot>
            </component>
          </NavigationMenuLink>
        </NuxtLink>
      </NavigationMenuItem>
    </NavigationMenuList>
  </NavigationMenuRoot>
</template>
