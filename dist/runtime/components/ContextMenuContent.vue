<script>

</script>

<script setup>
import { computed, toRef } from "vue";
import { ContextMenu } from "reka-ui/namespaced";
import { useForwardPropsEmits } from "reka-ui";
import { reactiveOmit, createReusableTemplate } from "@vueuse/core";
import { useAppConfig } from "#imports";
import { FieldGroupReset } from "../composables/useFieldGroup";
import { useLocale } from "../composables/useLocale";
import { usePortal } from "../composables/usePortal";
import { omit, get, isArrayOfArray } from "../utils";
import { pickLinkProps } from "../utils/link";
import ULinkBase from "./LinkBase.vue";
import ULink from "./Link.vue";
import UAvatar from "./Avatar.vue";
import UIcon from "./Icon.vue";
import UKbd from "./Kbd.vue";
import UContextMenuContent from "./ContextMenuContent.vue";
const props = defineProps({
  items: { type: null, required: false },
  portal: { type: [Boolean, String], required: false, skipCheck: true },
  sub: { type: Boolean, required: false },
  labelKey: { type: null, required: true },
  descriptionKey: { type: null, required: true },
  checkedIcon: { type: null, required: false },
  loadingIcon: { type: null, required: false },
  externalIcon: { type: [Boolean, String], required: false, skipCheck: true },
  class: { type: null, required: false },
  ui: { type: null, required: true },
  uiOverride: { type: null, required: false },
  loop: { type: Boolean, required: false },
  sideFlip: { type: Boolean, required: false },
  alignOffset: { type: Number, required: false },
  alignFlip: { type: Boolean, required: false },
  avoidCollisions: { type: Boolean, required: false },
  collisionBoundary: { type: null, required: false },
  collisionPadding: { type: [Number, Object], required: false },
  hideShiftedArrow: { type: Boolean, required: false },
  sticky: { type: String, required: false },
  hideWhenDetached: { type: Boolean, required: false },
  positionStrategy: { type: String, required: false },
  disableUpdateOnLayoutShift: { type: Boolean, required: false },
  prioritizePosition: { type: Boolean, required: false },
  reference: { type: null, required: false }
});
const emits = defineEmits(["escapeKeyDown", "pointerDownOutside", "focusOutside", "interactOutside", "closeAutoFocus"]);
const slots = defineSlots();
const { dir } = useLocale();
const appConfig = useAppConfig();
const portalProps = usePortal(toRef(() => props.portal));
const contentProps = useForwardPropsEmits(reactiveOmit(props, "sub", "items", "portal", "labelKey", "descriptionKey", "checkedIcon", "loadingIcon", "externalIcon", "class", "ui", "uiOverride"), emits);
const getProxySlots = () => omit(slots, ["default"]);
const [DefineItemTemplate, ReuseItemTemplate] = createReusableTemplate();
const childrenIcon = computed(() => dir.value === "rtl" ? appConfig.ui.icons.chevronLeft : appConfig.ui.icons.chevronRight);
const groups = computed(
  () => props.items?.length ? isArrayOfArray(props.items) ? props.items : [props.items] : []
);
</script>

<template>
  <DefineItemTemplate v-slot="{ item, active, index }">
    <slot :name="item.slot || 'item'" :item="item" :index="index" :ui="ui">
      <slot :name="item.slot ? `${item.slot}-leading` : 'item-leading'" :item="item" :active="active" :index="index" :ui="ui">
        <UIcon v-if="item.loading" :name="loadingIcon || appConfig.ui.icons.loading" data-slot="itemLeadingIcon" :class="ui.itemLeadingIcon({ class: [uiOverride?.itemLeadingIcon, item.ui?.itemLeadingIcon], color: item?.color, loading: true })" />
        <UIcon v-else-if="item.icon" :name="item.icon" data-slot="itemLeadingIcon" :class="ui.itemLeadingIcon({ class: [uiOverride?.itemLeadingIcon, item.ui?.itemLeadingIcon], color: item?.color, active })" />
        <UAvatar v-else-if="item.avatar" :size="item.ui?.itemLeadingAvatarSize || uiOverride?.itemLeadingAvatarSize || ui.itemLeadingAvatarSize()" v-bind="item.avatar" data-slot="itemLeadingAvatar" :class="ui.itemLeadingAvatar({ class: [uiOverride?.itemLeadingAvatar, item.ui?.itemLeadingAvatar], active })" />
      </slot>

      <span v-if="get(item, props.labelKey) || !!slots[item.slot ? `${item.slot}-label` : 'item-label'] || (get(item, props.descriptionKey) || !!slots[item.slot ? `${item.slot}-description` : 'item-description'])" data-slot="itemWrapper" :class="ui.itemWrapper({ class: [uiOverride?.itemWrapper, item.ui?.itemWrapper] })">
        <span data-slot="itemLabel" :class="ui.itemLabel({ class: [uiOverride?.itemLabel, item.ui?.itemLabel], active })">
          <slot :name="item.slot ? `${item.slot}-label` : 'item-label'" :item="item" :active="active" :index="index">
            {{ get(item, props.labelKey) }}
          </slot>

          <UIcon v-if="item.target === '_blank' && externalIcon !== false" :name="typeof externalIcon === 'string' ? externalIcon : appConfig.ui.icons.external" data-slot="itemLabelExternalIcon" :class="ui.itemLabelExternalIcon({ class: [uiOverride?.itemLabelExternalIcon, item.ui?.itemLabelExternalIcon], color: item?.color, active })" />
        </span>

        <span v-if="get(item, props.descriptionKey) || !!slots[item.slot ? `${item.slot}-description` : 'item-description']" data-slot="itemDescription" :class="ui.itemDescription({ class: [uiOverride?.itemDescription, item.ui?.itemDescription] })">
          <slot :name="item.slot ? `${item.slot}-description` : 'item-description'" :item="item" :active="active" :index="index">
            {{ get(item, props.descriptionKey) }}
          </slot>
        </span>
      </span>

      <span data-slot="itemTrailing" :class="ui.itemTrailing({ class: [uiOverride?.itemTrailing, item.ui?.itemTrailing] })">
        <slot :name="item.slot ? `${item.slot}-trailing` : 'item-trailing'" :item="item" :active="active" :index="index" :ui="ui">
          <UIcon v-if="item.children?.length" :name="childrenIcon" data-slot="itemTrailingIcon" :class="ui.itemTrailingIcon({ class: [uiOverride?.itemTrailingIcon, item.ui?.itemTrailingIcon], color: item?.color, active })" />
          <span v-else-if="item.kbds?.length" data-slot="itemTrailingKbds" :class="ui.itemTrailingKbds({ class: [uiOverride?.itemTrailingKbds, item.ui?.itemTrailingKbds] })">
            <UKbd v-for="(kbd, kbdIndex) in item.kbds" :key="kbdIndex" :size="item.ui?.itemTrailingKbdsSize || uiOverride?.itemTrailingKbdsSize || ui.itemTrailingKbdsSize()" v-bind="typeof kbd === 'string' ? { value: kbd } : kbd" />
          </span>
        </slot>

        <ContextMenu.ItemIndicator as-child>
          <UIcon :name="checkedIcon || appConfig.ui.icons.check" data-slot="itemTrailingIcon" :class="ui.itemTrailingIcon({ class: [uiOverride?.itemTrailingIcon, item.ui?.itemTrailingIcon], color: item?.color })" />
        </ContextMenu.ItemIndicator>
      </span>
    </slot>
  </DefineItemTemplate>

  <ContextMenu.Portal v-bind="portalProps">
    <FieldGroupReset>
      <component :is="sub ? ContextMenu.SubContent : ContextMenu.Content" data-slot="content" :class="ui.content({ class: [uiOverride?.content, props.class] })" v-bind="contentProps">
        <slot name="content-top" :sub="sub ?? false" />

        <div role="presentation" data-slot="viewport" :class="ui.viewport({ class: uiOverride?.viewport })">
          <ContextMenu.Group v-for="(group, groupIndex) in groups" :key="`group-${groupIndex}`" data-slot="group" :class="ui.group({ class: uiOverride?.group })">
            <template v-for="(item, index) in group" :key="`group-${groupIndex}-${index}`">
              <ContextMenu.Label v-if="item.type === 'label'" data-slot="label" :class="ui.label({ class: [uiOverride?.label, item.ui?.label, item.class] })">
                <ReuseItemTemplate :item="item" :index="index" />
              </ContextMenu.Label>
              <ContextMenu.Separator v-else-if="item.type === 'separator'" data-slot="separator" :class="ui.separator({ class: [uiOverride?.separator, item.ui?.separator, item.class] })" />
              <ContextMenu.Sub v-else-if="item?.children?.length" :open="item.open" :default-open="item.defaultOpen">
                <ContextMenu.SubTrigger
                  as="button"
                  type="button"
                  :disabled="item.disabled"
                  :text-value="get(item, props.labelKey)"
                  data-slot="item"
                  :class="ui.item({ class: [uiOverride?.item, item.ui?.item, item.class], color: item?.color })"
                >
                  <ReuseItemTemplate :item="item" :index="index" />
                </ContextMenu.SubTrigger>

                <UContextMenuContent
                  sub
                  :class="item.ui?.content"
                  :ui="ui"
                  :ui-override="uiOverride"
                  :portal="portal"
                  :items="item.children"
                  :align-offset="-4"
                  :label-key="labelKey"
                  :description-key="descriptionKey"
                  :checked-icon="checkedIcon"
                  :loading-icon="loadingIcon"
                  :external-icon="externalIcon"
                  v-bind="item.content"
                >
                  <template v-for="(_, name) in getProxySlots()" #[name]="slotData">
                    <slot :name="name" v-bind="slotData" />
                  </template>
                </UContextMenuContent>
              </ContextMenu.Sub>
              <ContextMenu.CheckboxItem
                v-else-if="item.type === 'checkbox'"
                :model-value="item.checked"
                :disabled="item.disabled"
                :text-value="get(item, props.labelKey)"
                data-slot="item"
                :class="ui.item({ class: [uiOverride?.item, item.ui?.item, item.class], color: item?.color })"
                @update:model-value="item.onUpdateChecked"
                @select="item.onSelect"
              >
                <ReuseItemTemplate :item="item" :index="index" />
              </ContextMenu.CheckboxItem>
              <ULink v-else v-slot="{ active, ...slotProps }" v-bind="pickLinkProps(item)" custom>
                <ContextMenu.Item
                  as-child
                  :disabled="item.disabled"
                  :text-value="get(item, props.labelKey)"
                  @select="item.onSelect"
                >
                  <ULinkBase v-bind="slotProps" data-slot="item" :class="ui.item({ class: [uiOverride?.item, item.ui?.item, item.class], active, color: item?.color })">
                    <ReuseItemTemplate :item="item" :active="active" :index="index" />
                  </ULinkBase>
                </ContextMenu.Item>
              </ULink>
            </template>
          </ContextMenu.Group>
        </div>

        <slot />

        <slot name="content-bottom" :sub="sub ?? false" />
      </component>
    </FieldGroupReset>
  </ContextMenu.Portal>
</template>
