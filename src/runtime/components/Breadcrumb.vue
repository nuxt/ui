<script lang="ts">
import { tv } from 'tailwind-variants'
import type { PrimitiveProps } from 'radix-vue'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/breadcrumb'
import type { AvatarProps, IconProps, LinkProps } from '#ui/types'

const appConfig = _appConfig as AppConfig & { ui: { breadcrumb: Partial<typeof theme> } }

const breadcrumb = tv({ extend: tv(theme), ...(appConfig.ui?.breadcrumb || {}) })

export interface BreadcrumbLink extends LinkProps {
  label: string
  icon?: IconProps['name']
  avatar?: AvatarProps
}

export interface BreadcrumbProps<T> extends Omit<PrimitiveProps, 'asChild'> {
  links?: T[]
  separatorIcon?: IconProps['name']
  class?: any
  ui?: Partial<typeof breadcrumb.slots>
}

type SlotProps<T> = (props: { link: T, active: boolean, index: number }) => any

export interface BreadcrumbSlots<T> {
  leading: SlotProps<T>
  default: SlotProps<T>
  trailing: SlotProps<T>
  separator(): any
}
</script>

<script setup lang="ts" generic="T extends BreadcrumbLink">
import { computed } from 'vue'
import { Primitive } from 'radix-vue'
import { useAppConfig } from '#imports'
import { omit } from '#ui/utils'

const props = defineProps<BreadcrumbProps<T>>()
defineSlots<BreadcrumbSlots<T>>()

const appConfig = useAppConfig()

const ui = computed(() => tv({ extend: breadcrumb, slots: props.ui })())
</script>

<template>
  <Primitive :as="as" aria-label="breadcrumb" :class="ui.root({ class: props.class })">
    <ol :class="ui.list()">
      <template v-for="(link, index) in links" :key="index">
        <li :class="ui.item()">
          <ULink as="span" v-bind="omit(link, ['label', 'icon', 'avatar'])" :aria-current="index === links!.length - 1 ? 'page' : undefined" :class="ui.link({ active: index === links!.length - 1, disabled: link.disabled })" raw>
            <slot name="leading" :link="link" :active="index === links!.length - 1" :index="index">
              <UAvatar v-if="link.avatar" size="2xs" v-bind="link.avatar" :class="ui.linkLeadingAvatar({ active: index === links!.length - 1 })" />
              <UIcon v-else-if="link.icon" :name="link.icon" :class="ui.linkLeadingIcon({ active: index === links!.length - 1 })" />
            </slot>

            <span v-if="link.label || $slots.default" :class="ui.linkLabel()">
              <slot :link="link" :active="index === links!.length - 1" :index="index">
                {{ link.label }}
              </slot>
            </span>

            <slot name="trailing" :link="link" :active="index === links!.length - 1" :index="index" />
          </ULink>
        </li>

        <li v-if="index < links!.length - 1" role="presentation" :class="ui.separator()">
          <slot name="separator">
            <UIcon :name="separatorIcon || appConfig.ui.icons.chevronRight" :class="ui.separatorIcon()" />
          </slot>
        </li>
      </template>
    </ol>
  </Primitive>
</template>
