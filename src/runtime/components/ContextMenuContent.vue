<script lang="ts">
import type { ContextMenuContentProps as RekaContextMenuContentProps, ContextMenuContentEmits as RekaContextMenuContentEmits } from 'reka-ui'
import type { AppConfig } from '@nuxt/schema'
import type theme from '#build/ui/context-menu'
import type { AvatarProps, ContextMenuItem, ContextMenuSlots, KbdProps } from '../types'
import type { ArrayOrNested, NestedItem, ComponentConfig } from '../types/utils'

type ContextMenu = ComponentConfig<typeof theme, AppConfig, 'contextMenu'>

interface ContextMenuContentProps<T extends ArrayOrNested<ContextMenuItem>> extends Omit<RekaContextMenuContentProps, 'as' | 'asChild' | 'forceMount'> {
  items?: T
  portal?: boolean | string | HTMLElement
  sub?: boolean
  labelKey: keyof NestedItem<T>
  /**
   * @IconifyIcon
   */
  checkedIcon?: string
  /**
   * @IconifyIcon
   */
  loadingIcon?: string
  /**
   * @IconifyIcon
   */
  externalIcon?: boolean | string
  class?: any
  ui: { [K in keyof Required<ContextMenu['slots']>]: (props?: Record<string, any>) => string }
  uiOverride?: ContextMenu['slots']
}

interface ContextMenuContentEmits extends RekaContextMenuContentEmits {}
</script>

<script setup lang="ts" generic="T extends ArrayOrNested<ContextMenuItem>">
import { computed, toRef } from 'vue'
import { ContextMenu } from 'reka-ui/namespaced'
import { useForwardPropsEmits } from 'reka-ui'
import { reactiveOmit, createReusableTemplate } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { useLocale } from '../composables/useLocale'
import { usePortal } from '../composables/usePortal'
import { omit, get, isArrayOfArray } from '../utils'
import { pickLinkProps } from '../utils/link'
import ULinkBase from './LinkBase.vue'
import ULink from './Link.vue'
import UAvatar from './Avatar.vue'
import UIcon from './Icon.vue'
import UKbd from './Kbd.vue'
import UContextMenuContent from './ContextMenuContent.vue'

const props = defineProps<ContextMenuContentProps<T>>()
const emits = defineEmits<ContextMenuContentEmits>()
const slots = defineSlots<ContextMenuSlots<T>>()

const { dir } = useLocale()
const appConfig = useAppConfig()

const portalProps = usePortal(toRef(() => props.portal))
const contentProps = useForwardPropsEmits(reactiveOmit(props, 'sub', 'items', 'portal', 'labelKey', 'checkedIcon', 'loadingIcon', 'externalIcon', 'class', 'ui', 'uiOverride'), emits)
const proxySlots = omit(slots, ['default'])

const [DefineItemTemplate, ReuseItemTemplate] = createReusableTemplate<{ item: ContextMenuItem, active?: boolean, index: number }>()

const childrenIcon = computed(() => dir.value === 'rtl' ? appConfig.ui.icons.chevronLeft : appConfig.ui.icons.chevronRight)
const groups = computed<ContextMenuItem[][]>(() =>
  props.items?.length
    ? isArrayOfArray(props.items)
      ? props.items
      : [props.items]
    : []
)
</script>

<template>
  <DefineItemTemplate v-slot="{ item, active, index }">
    <slot :name="((item.slot || 'item') as keyof ContextMenuSlots<T>)" :item="item" :index="index">
      <slot :name="((item.slot ? `${item.slot}-leading`: 'item-leading') as keyof ContextMenuSlots<T>)" :item="item" :active="active" :index="index">
        <UIcon v-if="item.loading" :name="loadingIcon || appConfig.ui.icons.loading" :class="ui.itemLeadingIcon({ class: [uiOverride?.itemLeadingIcon, item.ui?.itemLeadingIcon], color: item?.color, loading: true })" />
        <UIcon v-else-if="item.icon" :name="item.icon" :class="ui.itemLeadingIcon({ class: [uiOverride?.itemLeadingIcon, item.ui?.itemLeadingIcon], color: item?.color, active })" />
        <UAvatar v-else-if="item.avatar" :size="((item.ui?.itemLeadingAvatarSize || uiOverride?.itemLeadingAvatarSize || ui.itemLeadingAvatarSize()) as AvatarProps['size'])" v-bind="item.avatar" :class="ui.itemLeadingAvatar({ class: [uiOverride?.itemLeadingAvatar, item.ui?.itemLeadingAvatar], active })" />
      </slot>

      <span v-if="get(item, props.labelKey as string) || !!slots[(item.slot ? `${item.slot}-label`: 'item-label') as keyof ContextMenuSlots<T>]" :class="ui.itemLabel({ class: [uiOverride?.itemLabel, item.ui?.itemLabel], active })">
        <slot :name="((item.slot ? `${item.slot}-label`: 'item-label') as keyof ContextMenuSlots<T>)" :item="item" :active="active" :index="index">
          {{ get(item, props.labelKey as string) }}
        </slot>

        <UIcon v-if="item.target === '_blank' && externalIcon !== false" :name="typeof externalIcon === 'string' ? externalIcon : appConfig.ui.icons.external" :class="ui.itemLabelExternalIcon({ class: [uiOverride?.itemLabelExternalIcon, item.ui?.itemLabelExternalIcon], color: item?.color, active })" />
      </span>

      <span :class="ui.itemTrailing({ class: [uiOverride?.itemTrailing, item.ui?.itemTrailing] })">
        <slot :name="((item.slot ? `${item.slot}-trailing`: 'item-trailing') as keyof ContextMenuSlots<T>)" :item="item" :active="active" :index="index">
          <UIcon v-if="item.children?.length" :name="childrenIcon" :class="ui.itemTrailingIcon({ class: [uiOverride?.itemTrailingIcon, item.ui?.itemTrailingIcon], color: item?.color, active })" />
          <span v-else-if="item.kbds?.length" :class="ui.itemTrailingKbds({ class: [uiOverride?.itemTrailingKbds, item.ui?.itemTrailingKbds] })">
            <UKbd v-for="(kbd, kbdIndex) in item.kbds" :key="kbdIndex" :size="((item.ui?.itemTrailingKbdsSize || uiOverride?.itemTrailingKbdsSize || ui.itemTrailingKbdsSize()) as KbdProps['size'])" v-bind="typeof kbd === 'string' ? { value: kbd } : kbd" />
          </span>
        </slot>

        <ContextMenu.ItemIndicator as-child>
          <UIcon :name="checkedIcon || appConfig.ui.icons.check" :class="ui.itemTrailingIcon({ class: [uiOverride?.itemTrailingIcon, item.ui?.itemTrailingIcon], color: item?.color })" />
        </ContextMenu.ItemIndicator>
      </span>
    </slot>
  </DefineItemTemplate>

  <ContextMenu.Portal v-bind="portalProps">
    <component :is="sub ? ContextMenu.SubContent : ContextMenu.Content" :class="props.class" v-bind="contentProps">
      <slot name="content-top" />

      <div role="presentation" :class="ui.viewport({ class: uiOverride?.viewport })">
        <ContextMenu.Group v-for="(group, groupIndex) in groups" :key="`group-${groupIndex}`" :class="ui.group({ class: uiOverride?.group })">
          <template v-for="(item, index) in group" :key="`group-${groupIndex}-${index}`">
            <ContextMenu.Label v-if="item.type === 'label'" :class="ui.label({ class: [uiOverride?.label, item.ui?.label, item.class] })">
              <ReuseItemTemplate :item="item" :index="index" />
            </ContextMenu.Label>
            <ContextMenu.Separator v-else-if="item.type === 'separator'" :class="ui.separator({ class: [uiOverride?.separator, item.ui?.separator, item.class] })" />
            <ContextMenu.Sub v-else-if="item?.children?.length" :open="item.open" :default-open="item.defaultOpen">
              <ContextMenu.SubTrigger
                as="button"
                type="button"
                :disabled="item.disabled"
                :text-value="get(item, props.labelKey as string)"
                :class="ui.item({ class: [uiOverride?.item, item.ui?.item, item.class], color: item?.color })"
              >
                <ReuseItemTemplate :item="item" :index="index" />
              </ContextMenu.SubTrigger>

              <UContextMenuContent
                sub
                :class="props.class"
                :ui="ui"
                :ui-override="uiOverride"
                :portal="portal"
                :items="(item.children as T)"
                :align-offset="-4"
                :label-key="labelKey"
                :checked-icon="checkedIcon"
                :loading-icon="loadingIcon"
                :external-icon="externalIcon"
                v-bind="item.content"
              >
                <template v-for="(_, name) in proxySlots" #[name]="slotData">
                  <slot :name="(name as keyof ContextMenuSlots<T>)" v-bind="slotData" />
                </template>
              </UContextMenuContent>
            </ContextMenu.Sub>
            <ContextMenu.CheckboxItem
              v-else-if="item.type === 'checkbox'"
              :model-value="item.checked"
              :disabled="item.disabled"
              :text-value="get(item, props.labelKey as string)"
              :class="ui.item({ class: [uiOverride?.item, item.ui?.item, item.class], color: item?.color })"
              @update:model-value="item.onUpdateChecked"
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
                <ULinkBase v-bind="slotProps" :class="ui.item({ class: [uiOverride?.item, item.ui?.item, item.class], active, color: item?.color })">
                  <ReuseItemTemplate :item="item" :active="active" :index="index" />
                </ULinkBase>
              </ULink>
            </ContextMenu.Item>
          </template>
        </ContextMenu.Group>
      </div>

      <slot />

      <slot name="content-bottom" />
    </component>
  </ContextMenu.Portal>
</template>
