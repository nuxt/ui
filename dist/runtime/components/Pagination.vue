<script>
import theme from "#build/ui/pagination";
</script>

<script setup>
import { computed } from "vue";
import { PaginationRoot, PaginationList, PaginationListItem, PaginationFirst, PaginationPrev, PaginationEllipsis, PaginationNext, PaginationLast } from "reka-ui";
import { useForwardProps } from "../composables/useForwardProps";
import { reactivePick } from "@vueuse/core";
import { useAppConfig } from "#imports";
import { useComponentProps } from "../composables/useComponentProps";
import { useLocale } from "../composables/useLocale";
import { tv } from "../utils/tv";
import UButton from "./Button.vue";
const _props = defineProps({
  as: { type: null, required: false },
  firstIcon: { type: null, required: false },
  prevIcon: { type: null, required: false },
  nextIcon: { type: null, required: false },
  lastIcon: { type: null, required: false },
  ellipsisIcon: { type: null, required: false },
  color: { type: null, required: false, default: "neutral" },
  variant: { type: null, required: false, default: "outline" },
  activeColor: { type: null, required: false, default: "primary" },
  activeVariant: { type: null, required: false, default: "solid" },
  showControls: { type: Boolean, required: false, default: true },
  size: { type: null, required: false },
  to: { type: Function, required: false },
  class: { type: null, required: false },
  ui: { type: Object, required: false },
  defaultPage: { type: Number, required: false },
  disabled: { type: Boolean, required: false },
  itemsPerPage: { type: Number, required: false, default: 10 },
  page: { type: Number, required: false },
  showEdges: { type: Boolean, required: false, default: false },
  siblingCount: { type: Number, required: false, default: 2 },
  total: { type: Number, required: false, default: 0 }
});
const emits = defineEmits(["update:page"]);
const slots = defineSlots();
const props = useComponentProps("pagination", _props);
const { dir } = useLocale();
const appConfig = useAppConfig();
const rootProps = useForwardProps(reactivePick(props, "as", "defaultPage", "disabled", "itemsPerPage", "page", "showEdges", "siblingCount", "total"), emits);
const firstIcon = computed(() => props.firstIcon || (dir.value === "rtl" ? appConfig.ui.icons.chevronDoubleRight : appConfig.ui.icons.chevronDoubleLeft));
const prevIcon = computed(() => props.prevIcon || (dir.value === "rtl" ? appConfig.ui.icons.chevronRight : appConfig.ui.icons.chevronLeft));
const nextIcon = computed(() => props.nextIcon || (dir.value === "rtl" ? appConfig.ui.icons.chevronLeft : appConfig.ui.icons.chevronRight));
const lastIcon = computed(() => props.lastIcon || (dir.value === "rtl" ? appConfig.ui.icons.chevronDoubleLeft : appConfig.ui.icons.chevronDoubleRight));
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.pagination || {} })());
</script>

<template>
  <PaginationRoot v-slot="{ page, pageCount }" v-bind="rootProps" data-slot="root" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <PaginationList v-slot="{ items }" data-slot="list" :class="ui.list({ class: props.ui?.list })">
      <PaginationFirst v-if="props.showControls || !!slots.first" as-child data-slot="first" :class="ui.first({ class: props.ui?.first })">
        <slot name="first">
          <UButton :color="props.color" :variant="props.variant" :size="props.size" :icon="firstIcon" :to="props.to?.(1)" />
        </slot>
      </PaginationFirst>
      <PaginationPrev v-if="props.showControls || !!slots.prev" as-child data-slot="prev" :class="ui.prev({ class: props.ui?.prev })">
        <slot name="prev">
          <UButton :color="props.color" :variant="props.variant" :size="props.size" :icon="prevIcon" :to="page > 1 ? props.to?.(page - 1) : void 0" />
        </slot>
      </PaginationPrev>

      <template v-for="(item, index) in items" :key="index">
        <PaginationListItem v-if="item.type === 'page'" as-child :value="item.value" data-slot="item" :class="ui.item({ class: props.ui?.item })">
          <slot name="item" v-bind="{ item, index, page, pageCount }">
            <UButton
              :color="page === item.value ? props.activeColor : props.color"
              :variant="page === item.value ? props.activeVariant : props.variant"
              :size="props.size"
              :label="String(item.value)"
              :ui="{ label: ui.label() }"
              :to="props.to?.(item.value)"
              square
            />
          </slot>
        </PaginationListItem>

        <PaginationEllipsis v-else as-child data-slot="ellipsis" :class="ui.ellipsis({ class: props.ui?.ellipsis })">
          <slot name="ellipsis" :ui="ui">
            <UButton as="div" :color="props.color" :variant="props.variant" :size="props.size" :icon="props.ellipsisIcon || appConfig.ui.icons.ellipsis" />
          </slot>
        </PaginationEllipsis>
      </template>

      <PaginationNext v-if="props.showControls || !!slots.next" as-child data-slot="next" :class="ui.next({ class: props.ui?.next })">
        <slot name="next">
          <UButton :color="props.color" :variant="props.variant" :size="props.size" :icon="nextIcon" :to="page < pageCount ? props.to?.(page + 1) : void 0" />
        </slot>
      </PaginationNext>
      <PaginationLast v-if="props.showControls || !!slots.last" as-child data-slot="last" :class="ui.last({ class: props.ui?.last })">
        <slot name="last">
          <UButton :color="props.color" :variant="props.variant" :size="props.size" :icon="lastIcon" :to="props.to?.(pageCount)" />
        </slot>
      </PaginationLast>
    </PaginationList>
  </PaginationRoot>
</template>
