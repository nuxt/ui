<script lang="ts">
import type { DropdownMenuContentProps as RadixDropdownMenuContentProps, DropdownMenuContentEmits as RadixDropdownMenuContentEmits } from 'radix-vue'
import type { DropdownMenuItem } from '#ui/components/DropdownMenu.vue'

export interface DropdownMenuContentProps<T> extends Omit<RadixDropdownMenuContentProps, 'as' | 'asChild' | 'forceMount'> {
  items?: T[] | T[][]
  portal?: boolean
  sub?: boolean
  class?: any
  ui: any
}

export interface DropdownMenuContentEmits extends RadixDropdownMenuContentEmits {}

type SlotProps<T> = (props: { item: T, active?: boolean }) => any

export interface DropdownMenuContentSlots<T> {
  default(): any
  leading: SlotProps<T>
  label: SlotProps<T>
  trailing: SlotProps<T>
}
</script>

<script setup lang="ts" generic="T extends DropdownMenuItem">
import { computed } from 'vue'
import { DropdownMenu } from 'radix-vue/namespaced'
import { useForwardPropsEmits } from 'radix-vue'
import { reactiveOmit, createReusableTemplate } from '@vueuse/core'
import { ULink } from '#components'
import { omit } from '#ui/utils'
import { useAppConfig } from '#imports'

const props = defineProps<DropdownMenuContentProps<T>>()
const emits = defineEmits<DropdownMenuContentEmits>()
const slots = defineSlots<DropdownMenuContentSlots<T>>()

const appConfig = useAppConfig()
const contentProps = useForwardPropsEmits(reactiveOmit(props, 'sub', 'items', 'portal', 'class', 'ui'), emits)
const proxySlots = omit(slots, ['default'])

const [DefineItemTemplate, ReuseItemTemplate] = createReusableTemplate()

const groups = computed(() => props.items?.length ? (Array.isArray(props.items[0]) ? props.items : [props.items]) as T[][] : [])
</script>

<template>
  <DefineItemTemplate v-slot="{ item, active }">
    <slot name="leading" :item="item" :active="active">
      <UAvatar v-if="item.avatar" size="2xs" v-bind="item.avatar" :class="ui.itemLeadingAvatar({ active })" />
      <UIcon v-else-if="item.icon" :name="item.icon" :class="ui.itemLeadingIcon({ active })" />
    </slot>

    <span v-if="item.label || $slots.default" :class="ui.itemLabel()">
      <slot name="label" :item="item" :active="active">
        {{ item.label }}
      </slot>
    </span>

    <span v-if="$slots.trailing || item.children?.length || item.shortcuts?.length" :class="ui.itemTrailing()">
      <slot name="trailing" :item="item" :active="active">
        <UIcon v-if="item.children?.length" :name="appConfig.ui.icons.chevronRight" :class="ui.itemTrailingIcon()" />
        <span v-else-if="item.shortcuts?.length" :class="ui.itemTrailingShortcuts()">
          <UKbd v-for="(shortcut, shortcutIndex) in item.shortcuts" :key="shortcutIndex" size="sm" v-bind="typeof shortcut === 'string' ? { value: shortcut } : shortcut" />
        </span>
      </slot>
    </span>
  </DefineItemTemplate>

  <DropdownMenu.Portal :disabled="!portal">
    <component :is="sub ? DropdownMenu.SubContent : DropdownMenu.Content" :class="props.class" v-bind="contentProps">
      <DropdownMenu.Group v-for="(group, index) in groups" :key="`group-${index}`" :class="ui.group()">
        <template v-for="(item, itemIndex) in group" :key="`group-${index}-${itemIndex}`">
          <DropdownMenu.Label v-if="item.type === 'label'" :class="ui.label()">
            <ReuseItemTemplate :item="item" />
          </DropdownMenu.Label>
          <DropdownMenu.Sub v-else-if="item?.children?.length">
            <DropdownMenu.SubTrigger
              as="button"
              type="button"
              :disabled="item.disabled"
              :open="item.open"
              :default-open="item.defaultOpen"
              :text-value="item.label"
              :class="ui.item()"
            >
              <ReuseItemTemplate :item="item" />
            </DropdownMenu.SubTrigger>

            <UDropdownMenuContent
              sub
              :class="props.class"
              :ui="ui"
              :portal="portal"
              :items="item.children"
              side="right"
              align="start"
              :align-offset="-4"
              :side-offset="3"
              v-bind="item.content"
            >
              <template v-for="(_, name) in proxySlots" #[name]="slotData: any">
                <slot :name="name" v-bind="slotData" />
              </template>
            </UDropdownMenuContent>
          </DropdownMenu.Sub>
          <DropdownMenu.Item v-else as-child :disabled="item.disabled" :text-value="item.label" @select="item.select">
            <ULink v-slot="{ active, ...slotProps }" v-bind="omit((item as DropdownMenuItem), ['label', 'icon', 'avatar', 'shortcuts', 'slot', 'open', 'defaultOpen', 'select', 'children', 'type'])" custom>
              <ULinkBase v-bind="slotProps" :class="ui.item({ active })">
                <ReuseItemTemplate :item="item" :active="active" />
              </ULinkBase>
            </ULink>
          </DropdownMenu.Item>
        </template>
      </DropdownMenu.Group>

      <slot />
    </component>
  </DropdownMenu.Portal>
</template>
