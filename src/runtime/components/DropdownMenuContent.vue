<script lang="ts">
import { tv } from 'tailwind-variants'
import type { DropdownMenuContentProps as RadixDropdownMenuContentProps, DropdownMenuContentEmits as RadixDropdownMenuContentEmits } from 'radix-vue'
import theme from '#build/ui/dropdown-menu'
import type { DropdownMenuItem, DropdownMenuSlots } from '#ui/types'

const dropdownMenu = tv(theme)()

interface DropdownMenuContentProps<T> extends Omit<RadixDropdownMenuContentProps, 'asChild' | 'forceMount'> {
  items?: T[] | T[][]
  portal?: boolean
  sub?: boolean
  class?: any
  ui: typeof dropdownMenu
}

interface DropdownMenuContentEmits extends RadixDropdownMenuContentEmits {}

type DropdownMenuContentSlots<T extends { slot?: string }> = Omit<DropdownMenuSlots<T>, 'default'> & {
  default(): any
}
</script>

<script setup lang="ts" generic="T extends DropdownMenuItem">
import { computed } from 'vue'
import { DropdownMenu } from 'radix-vue/namespaced'
import { useForwardPropsEmits } from 'radix-vue'
import { reactiveOmit, createReusableTemplate } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { ULink } from '#components'
import { omit } from '#ui/utils'
import { pickLinkProps } from '#ui/utils/link'

const props = defineProps<DropdownMenuContentProps<T>>()
const emits = defineEmits<DropdownMenuContentEmits>()
const slots = defineSlots<DropdownMenuContentSlots<T>>()

const appConfig = useAppConfig()
const contentProps = useForwardPropsEmits(reactiveOmit(props, 'sub', 'items', 'portal', 'class', 'ui'), emits)
const proxySlots = omit(slots, ['default']) as Record<string, DropdownMenuContentSlots<T>[string]>

const [DefineItemTemplate, ReuseItemTemplate] = createReusableTemplate<{ item: DropdownMenuItem, active?: boolean, index: number }>()

const groups = computed(() => props.items?.length ? (Array.isArray(props.items[0]) ? props.items : [props.items]) as T[][] : [])
</script>

<template>
  <DefineItemTemplate v-slot="{ item, active, index }">
    <slot :name="item.slot || 'item'" :item="(item as T)" :index="index">
      <slot :name="item.slot ? `${item.slot}-leading`: 'item-leading'" :item="(item as T)" :active="active" :index="index">
        <UAvatar v-if="item.avatar" size="2xs" v-bind="item.avatar" :class="ui.itemLeadingAvatar({ active })" />
        <UIcon v-else-if="item.icon" :name="item.icon" :class="ui.itemLeadingIcon({ active })" />
      </slot>

      <span v-if="item.label || !!slots[item.slot ? `${item.slot}-label`: 'item-label']" :class="ui.itemLabel({ active })">
        <slot :name="item.slot ? `${item.slot}-label`: 'item-label'" :item="(item as T)" :active="active" :index="index">
          {{ item.label }}
        </slot>

        <UIcon v-if="item.target === '_blank'" :name="appConfig.ui.icons.external" :class="ui.itemLabelExternalIcon({ active })" />
      </span>

      <span v-if="item.children?.length || item.kbds?.length || !!slots[item.slot ? `${item.slot}-trailing`: 'item-trailing']" :class="ui.itemTrailing()">
        <slot :name="item.slot ? `${item.slot}-trailing`: 'item-trailing'" :item="(item as T)" :active="active" :index="index">
          <UIcon v-if="item.children?.length" :name="appConfig.ui.icons.chevronRight" :class="ui.itemTrailingIcon({ active })" />
          <span v-else-if="item.kbds?.length" :class="ui.itemTrailingKbds()">
            <UKbd v-for="(kbd, kbdIndex) in item.kbds" :key="kbdIndex" size="md" v-bind="typeof kbd === 'string' ? { value: kbd } : kbd" />
          </span>
        </slot>
      </span>
    </slot>
  </DefineItemTemplate>

  <DropdownMenu.Portal :disabled="!portal">
    <component :is="sub ? DropdownMenu.SubContent : DropdownMenu.Content" :class="props.class" v-bind="contentProps">
      <DropdownMenu.Group v-for="(group, groupIndex) in groups" :key="`group-${groupIndex}`" :class="ui.group()">
        <template v-for="(item, index) in group" :key="`group-${groupIndex}-${index}`">
          <DropdownMenu.Label v-if="item.type === 'label'" :class="ui.label()">
            <ReuseItemTemplate :item="item" :index="index" />
          </DropdownMenu.Label>
          <DropdownMenu.Separator v-else-if="item.type === 'separator'" :class="ui.separator()" />
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
              <ReuseItemTemplate :item="item" :index="index" />
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
            <ULink v-slot="{ active, ...slotProps }" v-bind="pickLinkProps(item as Omit<DropdownMenuItem, 'type'>)" custom>
              <ULinkBase v-bind="slotProps" :class="ui.item({ active })">
                <ReuseItemTemplate :item="item" :active="active" :index="index" />
              </ULinkBase>
            </ULink>
          </DropdownMenu.Item>
        </template>
      </DropdownMenu.Group>

      <slot />
    </component>
  </DropdownMenu.Portal>
</template>
