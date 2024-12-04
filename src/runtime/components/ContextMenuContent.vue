<script lang="ts">
import { tv } from 'tailwind-variants'
import type { ContextMenuContentProps as RekaContextMenuContentProps, ContextMenuContentEmits as RekaContextMenuContentEmits } from 'reka-ui'
import theme from '#build/ui/context-menu'
import type { KbdProps, AvatarProps, ContextMenuItem, ContextMenuSlots } from '../types'

const _contextMenu = tv(theme)()

interface ContextMenuContentProps<T> extends Omit<RekaContextMenuContentProps, 'as' | 'asChild' | 'forceMount'> {
  items?: T[] | T[][]
  portal?: boolean
  sub?: boolean
  labelKey: string
  checkedIcon?: string
  loadingIcon?: string
  class?: any
  ui: typeof _contextMenu
  uiOverride?: any
}

interface ContextMenuContentEmits extends RekaContextMenuContentEmits {}
</script>

<script setup lang="ts" generic="T extends ContextMenuItem">
import { computed } from 'vue'
import { ContextMenu } from 'reka-ui/namespaced'
import { useForwardPropsEmits } from 'reka-ui'
import { reactiveOmit, createReusableTemplate } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { omit, get } from '../utils'
import { pickLinkProps } from '../utils/link'
import ULinkBase from './LinkBase.vue'
import ULink from './Link.vue'
import UAvatar from './Avatar.vue'
import UIcon from './Icon.vue'
import UKbd from './Kbd.vue'
// eslint-disable-next-line import/no-self-import
import UContextMenuContent from './ContextMenuContent.vue'

const props = defineProps<ContextMenuContentProps<T>>()
const emits = defineEmits<ContextMenuContentEmits>()
const slots = defineSlots<ContextMenuSlots<T>>()

const appConfig = useAppConfig()
const contentProps = useForwardPropsEmits(reactiveOmit(props, 'sub', 'items', 'portal', 'class', 'ui'), emits)
const proxySlots = omit(slots, ['default']) as Record<string, ContextMenuSlots<T>[string]>

const [DefineItemTemplate, ReuseItemTemplate] = createReusableTemplate<{ item: ContextMenuItem, active?: boolean, index: number }>()

const groups = computed(() => props.items?.length ? (Array.isArray(props.items[0]) ? props.items : [props.items]) as T[][] : [])
</script>

<template>
  <DefineItemTemplate v-slot="{ item, active, index }">
    <slot :name="item.slot || 'item'" :item="(item as T)" :index="index">
      <slot :name="item.slot ? `${item.slot}-leading`: 'item-leading'" :item="(item as T)" :active="active" :index="index">
        <UIcon v-if="item.loading" :name="loadingIcon || appConfig.ui.icons.loading" :class="ui.itemLeadingIcon({ class: uiOverride?.itemLeadingIcon, color: item?.color, loading: true })" />
        <UIcon v-else-if="item.icon" :name="item.icon" :class="ui.itemLeadingIcon({ class: uiOverride?.itemLeadingIcon, color: item?.color, active })" />
        <UAvatar v-else-if="item.avatar" :size="((props.uiOverride?.itemLeadingAvatarSize || ui.itemLeadingAvatarSize()) as AvatarProps['size'])" v-bind="item.avatar" :class="ui.itemLeadingAvatar({ class: uiOverride?.itemLeadingAvatar, active })" />
      </slot>

      <span v-if="get(item, props.labelKey as string) || !!slots[item.slot ? `${item.slot}-label`: 'item-label']" :class="ui.itemLabel({ class: uiOverride?.itemLabel, active })">
        <slot :name="item.slot ? `${item.slot}-label`: 'item-label'" :item="(item as T)" :active="active" :index="index">
          {{ get(item, props.labelKey as string) }}
        </slot>

        <UIcon v-if="item.target === '_blank'" :name="appConfig.ui.icons.external" :class="ui.itemLabelExternalIcon({ class: uiOverride?.itemLabelExternalIcon, color: item?.color, active })" />
      </span>

      <span :class="ui.itemTrailing({ class: uiOverride?.itemTrailing })">
        <slot :name="item.slot ? `${item.slot}-trailing`: 'item-trailing'" :item="(item as T)" :active="active" :index="index">
          <UIcon v-if="item.children?.length" :name="appConfig.ui.icons.chevronRight" :class="ui.itemTrailingIcon({ class: uiOverride?.itemTrailingIcon, color: item?.color, active })" />
          <span v-else-if="item.kbds?.length" :class="ui.itemTrailingKbds({ class: uiOverride?.itemTrailingKbds })">
            <UKbd v-for="(kbd, kbdIndex) in item.kbds" :key="kbdIndex" :size="((props.uiOverride?.itemTrailingKbdsSize || ui.itemTrailingKbdsSize()) as KbdProps['size'])" v-bind="typeof kbd === 'string' ? { value: kbd } : kbd" />
          </span>
        </slot>

        <ContextMenu.ItemIndicator as-child>
          <UIcon :name="checkedIcon || appConfig.ui.icons.check" :class="ui.itemTrailingIcon({ class: uiOverride?.itemTrailingIcon, color: item?.color })" />
        </ContextMenu.ItemIndicator>
      </span>
    </slot>
  </DefineItemTemplate>

  <ContextMenu.Portal :disabled="!portal">
    <component :is="sub ? ContextMenu.SubContent : ContextMenu.Content" :class="props.class" v-bind="contentProps">
      <ContextMenu.Group v-for="(group, groupIndex) in groups" :key="`group-${groupIndex}`" :class="ui.group({ class: uiOverride?.group })">
        <template v-for="(item, index) in group" :key="`group-${groupIndex}-${index}`">
          <ContextMenu.Label v-if="item.type === 'label'" :class="ui.label({ class: uiOverride?.label })">
            <ReuseItemTemplate :item="item" :index="index" />
          </ContextMenu.Label>
          <ContextMenu.Separator v-else-if="item.type === 'separator'" :class="ui.separator({ class: uiOverride?.separator })" />
          <ContextMenu.Sub v-else-if="item?.children?.length" :open="item.open" :default-open="item.defaultOpen">
            <ContextMenu.SubTrigger
              as="button"
              type="button"
              :disabled="item.disabled"
              :text-value="get(item, props.labelKey as string)"
              :class="ui.item({ class: uiOverride?.item, color: item?.color })"
            >
              <ReuseItemTemplate :item="item" :index="index" />
            </ContextMenu.SubTrigger>

            <UContextMenuContent
              sub
              :class="props.class"
              :ui="ui"
              :ui-override="uiOverride"
              :portal="portal"
              :items="item.children"
              :align-offset="-4"
              :label-key="labelKey"
              :checked-icon="checkedIcon"
              :loading-icon="loadingIcon"
              v-bind="item.content"
            >
              <template v-for="(_, name) in proxySlots" #[name]="slotData: any">
                <slot :name="name" v-bind="slotData" />
              </template>
            </UContextMenuContent>
          </ContextMenu.Sub>
          <ContextMenu.CheckboxItem
            v-else-if="item.type === 'checkbox'"
            :checked="item.checked"
            :disabled="item.disabled"
            :text-value="get(item, props.labelKey as string)"
            :class="ui.item({ class: [uiOverride?.item, item.class], color: item?.color })"
            @update:checked="item.onUpdateChecked"
            @select="item.onSelect"
          >
            <ReuseItemTemplate :item="item" :index="index" />
          </ContextMenu.CheckboxItem>
          <ContextMenu.Item
            v-else
            as-child
            :disabled="item.disabled"
            :text-value="get(item, props.labelKey as string)"
            @select="item.onSelect"
          >
            <ULink v-slot="{ active, ...slotProps }" v-bind="pickLinkProps(item as Omit<ContextMenuItem, 'type'>)" custom>
              <ULinkBase v-bind="slotProps" :class="ui.item({ class: [uiOverride?.item, item.class], active, color: item?.color })">
                <ReuseItemTemplate :item="item" :active="active" :index="index" />
              </ULinkBase>
            </ULink>
          </ContextMenu.Item>
        </template>
      </ContextMenu.Group>

      <slot />
    </component>
  </ContextMenu.Portal>
</template>
