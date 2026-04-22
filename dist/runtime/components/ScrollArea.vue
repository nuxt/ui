<script>
import theme from "#build/ui/scroll-area";
</script>

<script setup>
import { computed, onMounted, onUnmounted, toRef, useTemplateRef, watch } from "vue";
import { Primitive } from "reka-ui";
import { defu } from "defu";
import { useVirtualizer } from "@tanstack/vue-virtual";
import { useAppConfig } from "#imports";
import { useComponentUI } from "../composables/useComponentUI";
import { tv } from "../utils/tv";
import { useLocale } from "../composables/useLocale";
const props = defineProps({
  as: { type: null, required: false },
  orientation: { type: null, required: false, default: "vertical" },
  items: { type: Array, required: false },
  virtualize: { type: [Boolean, Object], required: false, default: false },
  class: { type: null, required: false },
  ui: { type: Object, required: false }
});
defineSlots();
const emits = defineEmits(["scroll"]);
const { dir } = useLocale();
const appConfig = useAppConfig();
const uiProp = useComponentUI("scrollArea", props);
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.scrollArea || {} })({
  orientation: props.orientation
}));
const rootRef = useTemplateRef("rootRef");
const isRtl = computed(() => dir.value === "rtl");
const isHorizontal = computed(() => props.orientation === "horizontal");
const isVertical = computed(() => !isHorizontal.value);
const virtualizerProps = toRef(() => {
  const options = typeof props.virtualize === "boolean" ? {} : props.virtualize;
  return defu(options, {
    estimateSize: 100,
    overscan: 12,
    gap: 0,
    paddingStart: 0,
    paddingEnd: 0,
    scrollMargin: 0
  });
});
const lanes = computed(() => {
  const value = virtualizerProps.value.lanes;
  return typeof value === "number" ? value : void 0;
});
const skipMeasurement = computed(() => {
  return typeof props.virtualize === "object" && props.virtualize.skipMeasurement === true;
});
const virtualizer = !!props.virtualize && useVirtualizer({
  ...virtualizerProps.value,
  get overscan() {
    return virtualizerProps.value.overscan;
  },
  get gap() {
    return virtualizerProps.value.gap;
  },
  get paddingStart() {
    return virtualizerProps.value.paddingStart;
  },
  get paddingEnd() {
    return virtualizerProps.value.paddingEnd;
  },
  get scrollMargin() {
    return virtualizerProps.value.scrollMargin;
  },
  get lanes() {
    return lanes.value;
  },
  get isRtl() {
    return isRtl.value;
  },
  get count() {
    return props.items?.length || 0;
  },
  getScrollElement: () => rootRef.value?.$el,
  get horizontal() {
    return isHorizontal.value;
  },
  estimateSize: (index) => {
    const estimate = virtualizerProps.value.estimateSize;
    return typeof estimate === "function" ? estimate(index) : estimate;
  }
});
const virtualItems = computed(() => virtualizer ? virtualizer.value.getVirtualItems() : []);
const totalSize = computed(() => virtualizer ? virtualizer.value.getTotalSize() : 0);
const virtualViewportStyle = computed(() => ({
  position: "relative",
  inlineSize: isHorizontal.value ? `${totalSize.value}px` : "100%",
  blockSize: isVertical.value ? `${totalSize.value}px` : "100%"
}));
function getVirtualItemStyle(virtualItem) {
  const hasLanes = lanes.value !== void 0 && lanes.value > 1;
  const lane = virtualItem.lane;
  const gap = virtualizerProps.value.gap ?? 0;
  const laneSize = hasLanes ? `calc((100% - ${(lanes.value - 1) * gap}px) / ${lanes.value})` : "100%";
  const lanePosition = hasLanes && lane !== void 0 ? `calc(${lane} * ((100% - ${(lanes.value - 1) * gap}px) / ${lanes.value} + ${gap}px))` : 0;
  return {
    position: "absolute",
    insetBlockStart: isHorizontal.value && hasLanes ? lanePosition : 0,
    insetInlineStart: isVertical.value && hasLanes ? lanePosition : 0,
    blockSize: isHorizontal.value ? hasLanes ? laneSize : "100%" : void 0,
    inlineSize: isVertical.value ? hasLanes ? laneSize : "100%" : void 0,
    transform: isHorizontal.value ? `translateX(${isRtl.value ? -virtualItem.start : virtualItem.start}px)` : `translateY(${virtualItem.start}px)`
  };
}
let resizeObserver = null;
let rafId = null;
onMounted(() => {
  if (virtualizer) {
    const el = rootRef.value?.$el;
    if (el) {
      resizeObserver = new ResizeObserver(() => {
        if (rafId !== null) return;
        rafId = requestAnimationFrame(() => {
          rafId = null;
          virtualizer.value.measure();
        });
      });
      resizeObserver.observe(el);
    }
  }
});
onUnmounted(() => {
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
  resizeObserver?.disconnect();
});
function measureElement(el) {
  if (el && virtualizer && !skipMeasurement.value) {
    const element = el instanceof Element ? el : el.$el;
    virtualizer.value.measureElement(element);
  }
}
watch(
  () => virtualizer ? virtualizer.value.isScrolling : false,
  (isScrolling) => emits("scroll", isScrolling)
);
function getItemKey(item, index) {
  if (virtualizerProps.value.getItemKey) {
    return virtualizerProps.value.getItemKey(index);
  }
  if (item && typeof item === "object" && "id" in item) {
    return item.id;
  }
  return index;
}
defineExpose({
  get $el() {
    return rootRef.value?.$el;
  },
  virtualizer: virtualizer || void 0
});
</script>

<template>
  <Primitive
    ref="rootRef"
    :as="as"
    data-slot="root"
    :data-orientation="orientation"
    :class="ui.root({ class: [uiProp?.root, props.class] })"
  >
    <template v-if="virtualizer">
      <div
        data-slot="viewport"
        :class="ui.viewport({ class: uiProp?.viewport })"
        :style="virtualViewportStyle"
      >
        <div
          v-for="virtualItem in virtualItems"
          :key="String(virtualItem.key)"
          :ref="measureElement"
          :data-index="virtualItem.index"
          data-slot="item"
          :class="ui.item({ class: uiProp?.item })"
          :style="getVirtualItemStyle(virtualItem)"
        >
          <slot
            :item="items?.[virtualItem.index]"
            :index="virtualItem.index"
            :virtual-item="virtualItem"
          />
        </div>
      </div>
    </template>

    <template v-else>
      <div data-slot="viewport" :class="ui.viewport({ class: uiProp?.viewport })">
        <template v-if="items">
          <div
            v-for="(item, index) in items"
            :key="getItemKey(item, index)"
            data-slot="item"
            :class="ui.item({ class: uiProp?.item })"
          >
            <slot :item="item" :index="index" />
          </div>
        </template>

        <template v-else>
          <slot :item="{}" :index="0" />
        </template>
      </div>
    </template>
  </Primitive>
</template>
