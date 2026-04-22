<script>
import theme from "#build/ui/content/content-toc";
</script>

<script setup>
import { computed, onUnmounted } from "vue";
import { CollapsibleRoot, CollapsibleTrigger, CollapsibleContent, useForwardPropsEmits } from "reka-ui";
import { reactivePick, createReusableTemplate } from "@vueuse/core";
import { useRouter, useAppConfig, useNuxtApp } from "#imports";
import { useComponentUI } from "../../composables/useComponentUI";
import { useResolvedVariants } from "../../composables/useResolvedVariants";
import { useScrollspy } from "../../composables/useScrollspy";
import { useLocale } from "../../composables/useLocale";
import { tv } from "../../utils/tv";
import UIcon from "../Icon.vue";
defineOptions({ inheritAttrs: false });
const props = defineProps({
  as: { type: null, required: false, default: "nav" },
  trailingIcon: { type: null, required: false },
  title: { type: String, required: false },
  color: { type: null, required: false },
  highlight: { type: Boolean, required: false },
  highlightColor: { type: null, required: false },
  highlightVariant: { type: null, required: false },
  links: { type: Array, required: false },
  class: { type: null, required: false },
  ui: { type: Object, required: false },
  defaultOpen: { type: Boolean, required: false },
  open: { type: Boolean, required: false }
});
const emits = defineEmits(["update:open", "move"]);
const slots = defineSlots();
const rootProps = useForwardPropsEmits(reactivePick(props, "as", "open", "defaultOpen"), emits);
const { t } = useLocale();
const router = useRouter();
const appConfig = useAppConfig();
const uiProp = useComponentUI("contentToc", props);
const { highlightVariant } = useResolvedVariants("contentToc", props, theme, ["highlightVariant"]);
const { activeHeadings, updateHeadings } = useScrollspy();
const [DefineListTemplate, ReuseListTemplate] = createReusableTemplate({
  props: {
    links: Array,
    level: Number
  }
});
const [DefineTriggerTemplate, ReuseTriggerTemplate] = createReusableTemplate();
const [DefineContentTemplate, ReuseContentTemplate] = createReusableTemplate();
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.contentToc || {} })({
  color: props.color,
  highlight: props.highlight,
  highlightVariant: highlightVariant.value,
  highlightColor: props.highlightColor || props.color
}));
function scrollToHeading(id) {
  const encodedId = encodeURIComponent(id);
  router.push(`#${encodedId}`);
  emits("move", id);
}
function flattenLinks(links) {
  return links.flatMap((link) => [link, ...link.children ? flattenLinks(link.children) : []]);
}
function flattenLinksWithLevel(links, level = 0) {
  return links.flatMap((link) => [
    { link, level },
    ...link.children ? flattenLinksWithLevel(link.children, level + 1) : []
  ]);
}
const linkHeight = 1.75;
const indicatorStyle = computed(() => {
  if (!activeHeadings.value?.length) {
    return;
  }
  const flatLinks = flattenLinks(props.links || []);
  const activeIndex = flatLinks.findIndex((link) => activeHeadings.value.includes(link.id));
  return {
    "--indicator-size": `${linkHeight * activeHeadings.value.length}rem`,
    "--indicator-position": activeIndex >= 0 ? `${activeIndex * linkHeight}rem` : "0rem"
  };
});
const circuitMaskStyle = computed(() => {
  if (!props.highlight || highlightVariant.value !== "circuit" || !props.links?.length) {
    return;
  }
  const flatLinks = flattenLinksWithLevel(props.links);
  const svgUnit = 16;
  const svgLinkHeight = linkHeight * svgUnit;
  const svgHeight = flatLinks.length * svgLinkHeight;
  const x0 = 0.5;
  const x1 = 10.5;
  let path = "";
  let currentX = x0;
  let y = 0;
  flatLinks.forEach((item, index) => {
    const targetX = item.level > 0 ? x1 : x0;
    const nextY = y + svgLinkHeight;
    if (index === 0) {
      path += `M${targetX} ${y}`;
      currentX = targetX;
    }
    if (targetX !== currentX) {
      path += ` L${targetX} ${y + 6}`;
      currentX = targetX;
    }
    path += ` L${currentX} ${nextY - (index < flatLinks.length - 1 && flatLinks[index + 1]?.level !== item.level ? 6 : 0)}`;
    y = nextY;
  });
  const svgPath = encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 ${svgHeight}'><path d='${path}' stroke='black' stroke-width='1' fill='none'/></svg>`);
  return {
    width: "0.75rem",
    height: `${flatLinks.length * linkHeight}rem`,
    maskImage: `url("data:image/svg+xml,${svgPath}")`
  };
});
const nuxtApp = useNuxtApp();
function refreshHeadings() {
  const flatLinks = flattenLinks(props.links || []);
  if (!flatLinks.length) {
    updateHeadings([]);
    return;
  }
  const selector = flatLinks.map((l) => `#${CSS.escape(l.id)}`).join(", ");
  const headings = Array.from(document.querySelectorAll(selector));
  updateHeadings(headings);
}
const offLoadingEnd = nuxtApp.hooks.hook("page:loading:end", refreshHeadings);
const offTransitionFinish = nuxtApp.hooks.hook("page:transition:finish", refreshHeadings);
onUnmounted(() => {
  offLoadingEnd();
  offTransitionFinish();
});
</script>

<template>
  <!-- eslint-disable-next-line vue/no-template-shadow -->
  <DefineListTemplate v-slot="{ links, level }">
    <ul :class="level > 0 ? ui.listWithChildren({ class: uiProp?.listWithChildren }) : ui.list({ class: uiProp?.list })">
      <li v-for="(link, index) in links" :key="index" :class="link.children && link.children.length > 0 ? ui.itemWithChildren({ class: [uiProp?.itemWithChildren, link.ui?.itemWithChildren] }) : ui.item({ class: [uiProp?.item, link.ui?.item] })">
        <a :href="`#${link.id}`" data-slot="link" :class="ui.link({ class: [uiProp?.link, link.ui?.link, link.class], active: activeHeadings.includes(link.id) })" @click.prevent="scrollToHeading(link.id)">
          <slot name="link" :link="link">
            <span data-slot="linkText" :class="ui.linkText({ class: [uiProp?.linkText, link.ui?.linkText] })">
              {{ link.text }}
            </span>
          </slot>
        </a>

        <ReuseListTemplate v-if="link.children?.length" :links="link.children" :level="level + 1" />
      </li>
    </ul>
  </DefineListTemplate>

  <DefineTriggerTemplate v-slot="{ open }">
    <slot name="leading" :open="open" :ui="ui" />

    <span data-slot="title" :class="ui.title({ class: uiProp?.title })">
      <slot :open="open">{{ title || t("contentToc.title") }}</slot>
    </span>

    <span data-slot="trailing" :class="ui.trailing({ class: uiProp?.trailing })">
      <slot name="trailing" :open="open" :ui="ui">
        <UIcon :name="trailingIcon || appConfig.ui.icons.chevronDown" data-slot="trailingIcon" :class="ui.trailingIcon({ class: uiProp?.trailingIcon })" />
      </slot>
    </span>
  </DefineTriggerTemplate>

  <DefineContentTemplate>
    <div v-if="highlight" data-slot="indicator" :class="ui.indicator({ class: uiProp?.indicator })" :style="{ ...indicatorStyle, ...circuitMaskStyle || {} }">
      <div data-slot="indicatorLine" :class="ui.indicatorLine({ class: uiProp?.indicatorLine })" />
      <div v-if="indicatorStyle" data-slot="indicatorActive" :class="ui.indicatorActive({ class: uiProp?.indicatorActive })" />
    </div>

    <slot name="content" :links="links">
      <ReuseListTemplate :links="links" :level="0" />
    </slot>
  </DefineContentTemplate>

  <CollapsibleRoot v-slot="{ open }" v-bind="{ ...rootProps, ...$attrs }" :default-open="defaultOpen" data-slot="root" :class="ui.root({ class: [uiProp?.root, props.class] })">
    <div data-slot="container" :class="ui.container({ class: uiProp?.container })">
      <div v-if="!!slots.top" data-slot="top" :class="ui.top({ class: uiProp?.top })">
        <slot name="top" :links="links" />
      </div>

      <template v-if="links?.length">
        <CollapsibleTrigger data-slot="trigger" :class="ui.trigger({ class: 'lg:hidden' })">
          <ReuseTriggerTemplate :open="open" />
        </CollapsibleTrigger>

        <CollapsibleContent data-slot="content" :class="ui.content({ class: [uiProp?.content, 'lg:hidden'] })">
          <ReuseContentTemplate />
        </CollapsibleContent>

        <p data-slot="trigger" :class="ui.trigger({ class: 'hidden lg:flex' })">
          <ReuseTriggerTemplate :open="open" />
        </p>

        <div data-slot="content" :class="ui.content({ class: [uiProp?.content, 'hidden lg:flex'] })">
          <ReuseContentTemplate />
        </div>
      </template>

      <div v-if="!!slots.bottom" data-slot="bottom" :class="ui.bottom({ class: uiProp?.bottom, body: !!slots.top || !!links?.length })">
        <slot name="bottom" :links="links" />
      </div>
    </div>
  </CollapsibleRoot>
</template>
