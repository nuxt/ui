<script lang="ts">
import { tv } from 'tailwind-variants'
import type { PrimitiveProps } from 'radix-vue'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/breadcrumb'
import type { AvatarProps, IconProps, LinkProps } from '#ui/types'

const appConfig = _appConfig as AppConfig & { ui: { breadcrumb: Partial<typeof theme> } }

const breadcrumb = tv({ extend: tv(theme), ...(appConfig.ui?.breadcrumb || {}) })

export interface BreadcrumbItem extends LinkProps {
  label?: string
  icon?: IconProps['name']
  avatar?: AvatarProps
  slot?: string
}

export interface BreadcrumbProps<T> extends Omit<PrimitiveProps, 'asChild'> {
  items?: T[]
  separatorIcon?: IconProps['name']
  class?: any
  ui?: Partial<typeof breadcrumb.slots>
}

type SlotProps<T> = (props: { item: T, index: number, active?: boolean }) => any

export interface BreadcrumbSlots<T> {
  leading: SlotProps<T>
  label: SlotProps<T>
  trailing: SlotProps<T>
  item: SlotProps<T>
  [key: string]: SlotProps<T>
  separator(): any
}
</script>

<script setup lang="ts" generic="T extends BreadcrumbItem">
import { computed } from 'vue'
import { Primitive } from 'radix-vue'
import { useAppConfig } from '#imports'
import { ULink, UIcon, UAvatar } from '#components'
import { omit } from '#ui/utils'

const props = defineProps<BreadcrumbProps<T>>()
defineSlots<BreadcrumbSlots<T>>()

const appConfig = useAppConfig()

const ui = computed(() => tv({ extend: breadcrumb, slots: props.ui })())
</script>

<template>
  <Primitive :as="as" aria-label="breadcrumb" :class="ui.root({ class: props.class })">
    <ol :class="ui.list()">
      <template v-for="(item, index) in items" :key="index">
        <li :class="ui.item()">
          <slot :name="item.slot || 'item'" :item="item" :index="index">
            <ULink as="span" v-bind="omit(item, ['label', 'icon', 'avatar'])" :aria-current="index === items!.length - 1 ? 'page' : undefined" :class="ui.link({ active: index === items!.length - 1, disabled: !!item.disabled, to: !!item.to })" raw>
              <slot name="leading" :item="item" :active="index === items!.length - 1" :index="index">
                <UAvatar v-if="item.avatar" size="2xs" v-bind="item.avatar" :class="ui.linkLeadingAvatar({ active: index === items!.length - 1 })" />
                <UIcon v-else-if="item.icon" :name="item.icon" :class="ui.linkLeadingIcon({ active: index === items!.length - 1 })" />
              </slot>

              <span v-if="item.label || $slots.label" :class="ui.linkLabel()">
                <slot name="label" :item="item" :active="index === items!.length - 1" :index="index">
                  {{ item.label }}
                </slot>
              </span>

              <slot name="trailing" :item="item" :active="index === items!.length - 1" :index="index" />
            </ULink>
          </slot>
        </li>

        <li v-if="index < items!.length - 1" role="presentation" :class="ui.separator()">
          <slot name="separator">
            <UIcon :name="separatorIcon || appConfig.ui.icons.chevronRight" :class="ui.separatorIcon()" />
          </slot>
        </li>
      </template>
    </ol>
  </Primitive>
</template>
