<!-- eslint-disable vue/block-tag-newline -->
<script lang="ts">
import type { DropdownMenuContentProps as RekaDropdownMenuContentProps, DropdownMenuContentEmits as RekaDropdownMenuContentEmits } from 'reka-ui'
import type { AppConfig } from '@nuxt/schema'
import type theme from '#build/ui/dropdown-menu'
import type { KbdProps, AvatarProps, DropdownMenuItem, DropdownMenuSlots } from '../types'
import type { ArrayOrNested, NestedItem, ComponentConfig } from '../types/utils'

type DropdownMenu = ComponentConfig<typeof theme, AppConfig, 'dropdownMenu'>

interface DropdownMenuContentProps<T extends ArrayOrNested<DropdownMenuItem>> extends Omit<RekaDropdownMenuContentProps, 'as' | 'asChild' | 'forceMount'> {
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
  ui: { [K in keyof Required<DropdownMenu['slots']>]: (props?: Record<string, any>) => string }
  uiOverride?: DropdownMenu['slots']
}

interface DropdownMenuContentEmits extends RekaDropdownMenuContentEmits {}

type DropdownMenuContentSlots<T extends ArrayOrNested<DropdownMenuItem>> = Omit<DropdownMenuSlots<T>, 'default'> & {
  default(props?: {}): any
}

</script>

<script setup lang="ts" generic="T extends ArrayOrNested<DropdownMenuItem>">
import { computed, toRef } from 'vue'
import { DropdownMenu } from 'reka-ui/namespaced'
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
// eslint-disable-next-line import/no-self-import
import UDropdownMenuContent from './DropdownMenuContent.vue'

const props = defineProps<DropdownMenuContentProps<T>>()
const emits = defineEmits<DropdownMenuContentEmits>()
const slots = defineSlots<DropdownMenuContentSlots<T>>()

const { dir } = useLocale()
const appConfig = useAppConfig()

const portalProps = usePortal(toRef(() => props.portal))
const contentProps = useForwardPropsEmits(reactiveOmit(props, 'sub', 'items', 'portal', 'labelKey', 'checkedIcon', 'loadingIcon', 'externalIcon', 'class', 'ui', 'uiOverride'), emits)
const proxySlots = omit(slots, ['default'])

const [DefineItemTemplate, ReuseItemTemplate] = createReusableTemplate<{ item: DropdownMenuItem, active?: boolean, index: number }>()

const childrenIcon = computed(() => dir.value === 'rtl' ? appConfig.ui.icons.chevronLeft : appConfig.ui.icons.chevronRight)
const groups = computed<DropdownMenuItem[][]>(() =>
  props.items?.length
    ? isArrayOfArray(props.items)
      ? props.items
      : [props.items]
    : []
)
</script>

<template>
  <DefineItemTemplate v-slot="{ item, active, index }">
    <slot :name="((item.slot || 'item') as keyof DropdownMenuContentSlots<T>)" :item="(item as Extract<NestedItem<T>, { slot: string; }>)" :index="index">
      <slot :name="((item.slot ? `${item.slot}-leading`: 'item-leading') as keyof DropdownMenuContentSlots<T>)" :item="(item as Extract<NestedItem<T>, { slot: string; }>)" :active="active" :index="index">
        <UIcon v-if="item.loading" :name="loadingIcon || appConfig.ui.icons.loading" :class="ui.itemLeadingIcon({ class: [uiOverride?.itemLeadingIcon, item.ui?.itemLeadingIcon], color: item?.color, loading: true })" />
        <UIcon v-else-if="item.icon" :name="item.icon" :class="ui.itemLeadingIcon({ class: [uiOverride?.itemLeadingIcon, item.ui?.itemLeadingIcon], color: item?.color, active })" />
        <UAvatar v-else-if="item.avatar" :size="((item.ui?.itemLeadingAvatarSize || props.uiOverride?.itemLeadingAvatarSize || ui.itemLeadingAvatarSize()) as AvatarProps['size'])" v-bind="item.avatar" :class="ui.itemLeadingAvatar({ class: [uiOverride?.itemLeadingAvatar, item.ui?.itemLeadingAvatar], active })" />
      </slot>

      <span v-if="get(item, props.labelKey as string) || !!slots[(item.slot ? `${item.slot}-label`: 'item-label') as keyof DropdownMenuContentSlots<T>]" :class="ui.itemLabel({ class: [uiOverride?.itemLabel, item.ui?.itemLabel], active })">
        <slot :name="((item.slot ? `${item.slot}-label`: 'item-label') as keyof DropdownMenuContentSlots<T>)" :item="(item as Extract<NestedItem<T>, { slot: string; }>)" :active="active" :index="index">
          {{ get(item, props.labelKey as string) }}
        </slot>

        <UIcon v-if="item.target === '_blank' && externalIcon !== false" :name="typeof externalIcon === 'string' ? externalIcon : appConfig.ui.icons.external" :class="ui.itemLabelExternalIcon({ class: [uiOverride?.itemLabelExternalIcon, item.ui?.itemLabelExternalIcon], color: item?.color, active })" />
      </span>

      <span :class="ui.itemTrailing({ class: [uiOverride?.itemTrailing, item.ui?.itemTrailing] })">
        <slot :name="((item.slot ? `${item.slot}-trailing`: 'item-trailing') as keyof DropdownMenuContentSlots<T>)" :item="(item as Extract<NestedItem<T>, { slot: string; }>)" :active="active" :index="index">
          <UIcon v-if="item.children?.length" :name="childrenIcon" :class="ui.itemTrailingIcon({ class: [uiOverride?.itemTrailingIcon, item.ui?.itemTrailingIcon], color: item?.color, active })" />
          <span v-else-if="item.kbds?.length" :class="ui.itemTrailingKbds({ class: [uiOverride?.itemTrailingKbds, item.ui?.itemTrailingKbds] })">
            <UKbd v-for="(kbd, kbdIndex) in item.kbds" :key="kbdIndex" :size="((item.ui?.itemTrailingKbdsSize || props.uiOverride?.itemTrailingKbdsSize || ui.itemTrailingKbdsSize()) as KbdProps['size'])" v-bind="typeof kbd === 'string' ? { value: kbd } : kbd" />
          </span>
        </slot>

        <DropdownMenu.ItemIndicator as-child>
          <UIcon :name="checkedIcon || appConfig.ui.icons.check" :class="ui.itemTrailingIcon({ class: [uiOverride?.itemTrailingIcon, item.ui?.itemTrailingIcon], color: item?.color })" />
        </DropdownMenu.ItemIndicator>
      </span>
    </slot>
  </DefineItemTemplate>

  <DropdownMenu.Portal v-bind="portalProps">
    <component :is="sub ? DropdownMenu.SubContent : DropdownMenu.Content" :class="props.class" v-bind="contentProps">
      <slot name="content-top" />

      <div role="presentation" :class="ui.viewport({ class: props.ui?.viewport })">
        <DropdownMenu.Group v-for="(group, groupIndex) in groups" :key="`group-${groupIndex}`" :class="ui.group({ class: uiOverride?.group })">
          <template v-for="(item, index) in group" :key="`group-${groupIndex}-${index}`">
            <DropdownMenu.Label v-if="item.type === 'label'" :class="ui.label({ class: [uiOverride?.label, item.ui?.label, item.class] })">
              <ReuseItemTemplate :item="item" :index="index" />
            </DropdownMenu.Label>
            <DropdownMenu.Separator v-else-if="item.type === 'separator'" :class="ui.separator({ class: [uiOverride?.separator, item.ui?.separator, item.class] })" />
            <DropdownMenu.Sub v-else-if="item?.children?.length" :open="item.open" :default-open="item.defaultOpen">
              <DropdownMenu.SubTrigger
                as="button"
                type="button"
                :disabled="item.disabled"
                :text-value="get(item, props.labelKey as string)"
                :class="ui.item({ class: [uiOverride?.item, item.ui?.item, item.class], color: item?.color })"
              >
                <ReuseItemTemplate :item="item" :index="index" />
              </DropdownMenu.SubTrigger>

              <UDropdownMenuContent
                sub
                :class="props.class"
                :ui="ui"
                :ui-override="uiOverride"
                :portal="portal"
                :items="(item.children as T)"
                align="start"
                :align-offset="-4"
                :side-offset="3"
                :label-key="labelKey"
                :checked-icon="checkedIcon"
                :loading-icon="loadingIcon"
                :external-icon="externalIcon"
                v-bind="item.content"
              >
                <template v-for="(_, name) in proxySlots" #[name]="slotData">
                  <slot :name="(name as keyof DropdownMenuContentSlots<T>)" v-bind="slotData" />
                </template>
              </UDropdownMenuContent>
            </DropdownMenu.Sub>
            <DropdownMenu.CheckboxItem
              v-else-if="item.type === 'checkbox'"
              :model-value="item.checked"
              :disabled="item.disabled"
              :text-value="get(item, props.labelKey as string)"
              :class="ui.item({ class: [uiOverride?.item, item.ui?.item, item.class], color: item?.color })"
              @update:model-value="item.onUpdateChecked"
              @select="item.onSelect"
            >
              <ReuseItemTemplate :item="item" :index="index" />
            </DropdownMenu.CheckboxItem>
            <DropdownMenu.Item
              v-else
              as-child
              :disabled="item.disabled"
              :text-value="get(item, props.labelKey as string)"
              @select="item.onSelect"
            >
              <ULink v-slot="{ active, ...slotProps }" v-bind="pickLinkProps(item as Omit<DropdownMenuItem, 'type'>)" custom>
                <ULinkBase v-bind="slotProps" :class="ui.item({ class: [uiOverride?.item, item.ui?.item, item.class], color: item?.color, active })">
                  <ReuseItemTemplate :item="item" :active="active" :index="index" />
                </ULinkBase>
              </ULink>
            </DropdownMenu.Item>
          </template>
        </DropdownMenu.Group>
      </div>

      <slot />

      <slot name="content-bottom" />
    </component>
  </DropdownMenu.Portal>
</template>
