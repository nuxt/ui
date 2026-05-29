<script>
import theme from "#build/ui/carousel";
</script>

<script setup>
import { computed, ref, watch, onMounted, onBeforeUnmount } from "vue";
import useEmblaCarousel from "embla-carousel-vue";
import { Primitive } from "reka-ui";
import { reactivePick } from "@vueuse/core";
import { useAppConfig } from "#imports";
import { useComponentProps } from "../composables/useComponentProps";
import { useForwardProps } from "../composables/useForwardProps";
import { useLocale } from "../composables/useLocale";
import { tv } from "../utils/tv";
import UButton from "./Button.vue";
const _props = defineProps({
  as: { type: null, required: false },
  prev: { type: Object, required: false },
  prevIcon: { type: null, required: false },
  next: { type: Object, required: false },
  nextIcon: { type: null, required: false },
  arrows: { type: Boolean, required: false, default: false },
  dots: { type: Boolean, required: false, default: false },
  orientation: { type: null, required: false, default: "horizontal" },
  items: { type: Array, required: false },
  autoplay: { type: [Boolean, Object], required: false, default: false },
  autoScroll: { type: [Boolean, Object], required: false, default: false },
  autoHeight: { type: [Boolean, Object], required: false, default: false },
  classNames: { type: [Boolean, Object], required: false, default: false },
  fade: { type: [Boolean, Object], required: false, default: false },
  wheelGestures: { type: [Boolean, Object], required: false, default: false },
  class: { type: null, required: false },
  ui: { type: Object, required: false },
  align: { type: [String, Function], required: false, default: "center" },
  containScroll: { type: [Boolean, String], required: false, default: "trimSnaps" },
  slidesToScroll: { type: [String, Number], required: false, default: 1 },
  dragFree: { type: Boolean, required: false, default: false },
  dragThreshold: { type: Number, required: false, default: 10 },
  inViewThreshold: { type: null, required: false, default: 0 },
  loop: { type: Boolean, required: false, default: false },
  skipSnaps: { type: Boolean, required: false, default: false },
  duration: { type: Number, required: false, default: 25 },
  startIndex: { type: Number, required: false, default: 0 },
  watchDrag: { type: [Boolean, Function], required: false, default: true },
  watchResize: { type: [Boolean, Function], required: false, default: true },
  watchSlides: { type: [Boolean, Function], required: false, default: true },
  watchFocus: { type: [Boolean, Function], required: false, default: true },
  active: { type: Boolean, required: false, default: true },
  breakpoints: { type: Object, required: false, default: () => ({}) }
});
defineSlots();
const emits = defineEmits(["select"]);
const props = useComponentProps("carousel", _props);
const { dir, t } = useLocale();
const appConfig = useAppConfig();
const rootProps = useForwardProps(reactivePick(props, "active", "align", "breakpoints", "containScroll", "dragFree", "dragThreshold", "duration", "inViewThreshold", "loop", "skipSnaps", "slidesToScroll", "startIndex", "watchDrag", "watchResize", "watchSlides", "watchFocus"));
const prevIcon = computed(() => props.prevIcon || (dir.value === "rtl" ? appConfig.ui.icons.arrowRight : appConfig.ui.icons.arrowLeft));
const nextIcon = computed(() => props.nextIcon || (dir.value === "rtl" ? appConfig.ui.icons.arrowLeft : appConfig.ui.icons.arrowRight));
const stopAutoplayOnInteraction = computed(() => {
  if (typeof props.autoplay === "boolean") {
    return true;
  }
  return props.autoplay?.stopOnInteraction ?? true;
});
const stopAutoScrollOnInteraction = computed(() => {
  if (typeof props.autoScroll === "boolean") {
    return true;
  }
  return props.autoScroll?.stopOnInteraction ?? true;
});
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.carousel || {} })({
  orientation: props.orientation
}));
const options = computed(() => ({
  ...props.fade ? { align: "center", containScroll: false } : {},
  ...rootProps.value,
  axis: props.orientation === "horizontal" ? "x" : "y",
  direction: dir.value === "rtl" ? "rtl" : "ltr"
}));
const plugins = ref([]);
async function loadPlugins() {
  const emblaPlugins = [];
  if (props.autoplay) {
    const AutoplayPlugin = await import("embla-carousel-autoplay").then((r) => r.default);
    emblaPlugins.push(AutoplayPlugin(typeof props.autoplay === "boolean" ? {} : props.autoplay));
  }
  if (props.autoScroll) {
    const AutoScrollPlugin = await import("embla-carousel-auto-scroll").then((r) => r.default);
    emblaPlugins.push(AutoScrollPlugin(typeof props.autoScroll === "boolean" ? {} : props.autoScroll));
  }
  if (props.autoHeight) {
    const AutoHeightPlugin = await import("embla-carousel-auto-height").then((r) => r.default);
    emblaPlugins.push(AutoHeightPlugin(typeof props.autoHeight === "boolean" ? {} : props.autoHeight));
  }
  if (props.classNames) {
    const ClassNamesPlugin = await import("embla-carousel-class-names").then((r) => r.default);
    emblaPlugins.push(ClassNamesPlugin(typeof props.classNames === "boolean" ? {} : props.classNames));
  }
  if (props.fade) {
    const FadePlugin = await import("embla-carousel-fade").then((r) => r.default);
    emblaPlugins.push(FadePlugin(typeof props.fade === "boolean" ? {} : props.fade));
  }
  if (props.wheelGestures) {
    const { WheelGesturesPlugin } = await import("embla-carousel-wheel-gestures");
    emblaPlugins.push(WheelGesturesPlugin(typeof props.wheelGestures === "boolean" ? {} : props.wheelGestures));
  }
  plugins.value = emblaPlugins;
}
watch(() => [props.autoplay, props.autoScroll, props.autoHeight, props.classNames, props.fade, props.wheelGestures], async () => {
  await loadPlugins();
  emblaApi.value?.reInit(options.value, plugins.value);
}, { immediate: true });
const [emblaRef, emblaApi] = useEmblaCarousel(options, plugins);
watch(options, () => {
  emblaApi.value?.reInit(options.value, plugins.value);
}, { flush: "post" });
function stopOnInteraction() {
  if (stopAutoplayOnInteraction.value) {
    emblaApi.value?.plugins().autoplay?.stop();
  }
  if (stopAutoScrollOnInteraction.value) {
    emblaApi.value?.plugins().autoScroll?.stop();
  }
}
function scrollPrev() {
  emblaApi.value?.scrollPrev();
  stopOnInteraction();
}
function scrollNext() {
  emblaApi.value?.scrollNext();
  stopOnInteraction();
}
function scrollTo(index) {
  emblaApi.value?.scrollTo(index);
}
function onKeyDown(event) {
  let prevKey;
  let nextKey;
  if (props.orientation === "horizontal") {
    prevKey = dir.value === "ltr" ? "ArrowLeft" : "ArrowRight";
    nextKey = dir.value === "ltr" ? "ArrowRight" : "ArrowLeft";
  } else {
    prevKey = "ArrowUp";
    nextKey = "ArrowDown";
  }
  if (event.key === prevKey) {
    event.preventDefault();
    scrollPrev();
    return;
  }
  if (event.key === nextKey) {
    event.preventDefault();
    scrollNext();
  }
}
const canScrollNext = ref(false);
const canScrollPrev = ref(false);
const selectedIndex = ref(0);
const scrollSnaps = ref([]);
function onInit(api) {
  scrollSnaps.value = api?.scrollSnapList() || [];
}
function onSelect(api) {
  canScrollNext.value = api?.canScrollNext() || false;
  canScrollPrev.value = api?.canScrollPrev() || false;
  selectedIndex.value = api?.selectedScrollSnap() || 0;
  emits("select", selectedIndex.value);
}
function isCarouselItem(item) {
  return typeof item === "object" && item !== null;
}
onMounted(() => {
  if (!emblaApi.value) {
    return;
  }
  emblaApi.value.on("init", onInit);
  emblaApi.value.on("init", onSelect);
  emblaApi.value.on("reInit", onInit);
  emblaApi.value.on("reInit", onSelect);
  emblaApi.value.on("select", onSelect);
});
onBeforeUnmount(() => {
  if (!emblaApi.value) {
    return;
  }
  emblaApi.value.off("init", onInit);
  emblaApi.value.off("init", onSelect);
  emblaApi.value.off("reInit", onInit);
  emblaApi.value.off("reInit", onSelect);
  emblaApi.value.off("select", onSelect);
});
defineExpose({
  emblaRef,
  emblaApi
});
</script>

<template>
  <Primitive
    :as="props.as"
    role="region"
    aria-roledescription="carousel"
    :data-orientation="props.orientation"
    tabindex="0"
    data-slot="root"
    :class="ui.root({ class: [props.ui?.root, props.class] })"
    @keydown="onKeyDown"
  >
    <div ref="emblaRef" data-slot="viewport" :class="ui.viewport({ class: props.ui?.viewport })">
      <div data-slot="container" :class="ui.container({ class: props.ui?.container })">
        <div
          v-for="(item, index) in props.items"
          :key="index"
          v-bind="props.dots ? { role: 'tabpanel' } : { 'role': 'group', 'aria-roledescription': 'slide' }"
          data-slot="item"
          :class="ui.item({ class: [props.ui?.item, isCarouselItem(item) && item.ui?.item, isCarouselItem(item) && item.class] })"
        >
          <slot :item="item" :index="index" />
        </div>
      </div>
    </div>

    <div v-if="props.arrows || props.dots" data-slot="controls" :class="ui.controls({ class: props.ui?.controls })">
      <div v-if="props.arrows" data-slot="arrows" :class="ui.arrows({ class: props.ui?.arrows })">
        <UButton
          :disabled="!canScrollPrev"
          :icon="prevIcon"
          color="neutral"
          variant="outline"
          :aria-label="t('carousel.prev')"
          v-bind="typeof props.prev === 'object' ? props.prev : void 0"
          data-slot="prev"
          :class="ui.prev({ class: props.ui?.prev })"
          @click="scrollPrev"
        />
        <UButton
          :disabled="!canScrollNext"
          :icon="nextIcon"
          color="neutral"
          variant="outline"
          :aria-label="t('carousel.next')"
          v-bind="typeof props.next === 'object' ? props.next : void 0"
          data-slot="next"
          :class="ui.next({ class: props.ui?.next })"
          @click="scrollNext"
        />
      </div>

      <div v-if="props.dots" role="tablist" :aria-label="t('carousel.dots')" data-slot="dots" :class="ui.dots({ class: props.ui?.dots })">
        <template v-for="(_, index) in scrollSnaps" :key="index">
          <button
            type="button"
            role="tab"
            :aria-label="t('carousel.goto', { slide: index + 1 })"
            :aria-selected="selectedIndex === index"
            data-slot="dot"
            :class="ui.dot({ class: props.ui?.dot, active: selectedIndex === index })"
            :data-state="selectedIndex === index ? 'active' : void 0"
            @click="scrollTo(index)"
          />
        </template>
      </div>
    </div>
  </Primitive>
</template>
