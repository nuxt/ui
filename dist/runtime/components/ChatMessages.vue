<script>
import theme from "#build/ui/chat-messages";
</script>

<script setup>
import { ref, computed, watch, nextTick, toRef, onMounted } from "vue";
import { Presence } from "reka-ui";
import { defu } from "defu";
import { useElementBounding, useEventListener, useMutationObserver, watchThrottled } from "@vueuse/core";
import { useAppConfig } from "#imports";
import { useComponentProps } from "../composables/useComponentProps";
import { omit } from "../utils";
import { tv } from "../utils/tv";
import UChatMessage from "./ChatMessage.vue";
import UButton from "./Button.vue";
const _props = defineProps({
  messages: { type: null, required: false },
  status: { type: String, required: false },
  shouldAutoScroll: { type: Boolean, required: false, default: false },
  shouldScrollToBottom: { type: Boolean, required: false, default: true },
  autoScroll: { type: [Boolean, Object], required: false, default: true },
  autoScrollIcon: { type: null, required: false },
  user: { type: Object, required: false },
  assistant: { type: Object, required: false },
  compact: { type: Boolean, required: false },
  spacingOffset: { type: Number, required: false, default: 0 },
  class: { type: null, required: false },
  ui: { type: Object, required: false }
});
const slots = defineSlots();
const props = useComponentProps("chatMessages", _props);
const getProxySlots = () => omit(slots, ["default", "indicator", "viewport"]);
const showIndicator = computed(() => {
  if (props.status === "submitted") return true;
  if (props.status !== "streaming") return false;
  const lastMessage = props.messages?.[props.messages.length - 1];
  return lastMessage?.role === "assistant" && !lastMessage.parts?.length;
});
const appConfig = useAppConfig();
const userProps = toRef(() => defu(props.user, { side: "right", variant: "soft" }));
const assistantProps = toRef(() => defu(props.assistant, { side: "left", variant: "naked" }));
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.chatMessages || {} })({
  compact: props.compact
}));
const el = ref(null);
const parent = ref(null);
const messagesRefs = ref(/* @__PURE__ */ new Map());
const showAutoScroll = ref(false);
const lastMessageHeight = ref(0);
const lastMessageSubmitted = ref(false);
const lastScrollTop = ref(0);
const userScrolledUp = ref(false);
function registerMessageRef(id, element) {
  const elInstance = element?.$el;
  if (elInstance) {
    messagesRefs.value.set(id, elInstance);
  }
}
function scrollToMessage(id) {
  const element = messagesRefs.value.get(id);
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}
function scrollToBottom(smooth = true) {
  if (!parent.value) {
    return;
  }
  if (smooth) {
    parent.value.scrollTo({ top: parent.value.scrollHeight, behavior: "smooth" });
  } else {
    parent.value.scrollTop = parent.value.scrollHeight;
  }
}
watchThrottled([() => props.messages, () => props.status], ([_, status]) => {
  if (!props.messages?.length) {
    showAutoScroll.value = false;
    userScrolledUp.value = false;
    lastScrollTop.value = 0;
    messagesRefs.value.clear();
    return;
  }
  if (status !== "streaming") {
    return;
  }
  checkScrollPosition();
}, { deep: true, throttle: 50, leading: true });
watch(() => props.status, (status) => {
  if (status !== "submitted") {
    return;
  }
  const lastMessage = props.messages?.[props.messages.length - 1];
  if (!lastMessage || lastMessage.role !== "user") {
    return;
  }
  userScrolledUp.value = false;
  nextTick(() => {
    lastMessageSubmitted.value = true;
    updateLastMessageHeight();
    nextTick(() => {
      scrollToMessage(lastMessage.id);
    });
  });
});
function checkScrollPosition() {
  if (!parent.value) {
    return;
  }
  const scrollPosition = parent.value.scrollTop + parent.value.clientHeight;
  const scrollHeight = parent.value.scrollHeight;
  const threshold = 100;
  showAutoScroll.value = scrollHeight - scrollPosition >= threshold;
  if (parent.value.scrollTop < lastScrollTop.value) {
    userScrolledUp.value = true;
  } else if (scrollHeight - scrollPosition < threshold) {
    userScrolledUp.value = false;
  }
  lastScrollTop.value = parent.value.scrollTop;
}
function onAutoScrollClick() {
  userScrolledUp.value = false;
  scrollToBottom();
}
function getScrollParent(node) {
  if (!node) {
    return document.documentElement;
  }
  const overflowRegex = /auto|scroll/;
  let current = node;
  while (current && current !== document.body && current !== document.documentElement) {
    const style = window.getComputedStyle(current);
    if (overflowRegex.test(style.overflowY)) {
      return current;
    }
    current = current.parentElement;
  }
  return document.documentElement;
}
function updateLastMessageHeight() {
  if (!el.value || !parent.value || !props.messages?.length || !lastMessageSubmitted.value) {
    return;
  }
  const { height: parentHeight } = useElementBounding(parent.value);
  const lastMessage = props.messages.findLast((m) => m.role === "user");
  if (!lastMessage) {
    return;
  }
  const lastMessageEl = messagesRefs.value.get(lastMessage.id);
  if (!lastMessageEl) {
    return;
  }
  let spacingOffset = props.spacingOffset || 0;
  const elComputedStyle = window.getComputedStyle(el.value);
  const parentComputedStyle = window.getComputedStyle(parent.value);
  spacingOffset += Number.parseFloat(elComputedStyle.rowGap) || Number.parseFloat(elComputedStyle.gap) || 0;
  spacingOffset += Number.parseFloat(parentComputedStyle.paddingTop) || 0;
  spacingOffset += Number.parseFloat(parentComputedStyle.paddingBottom) || 0;
  lastMessageHeight.value = Math.max(parentHeight.value - lastMessageEl.offsetHeight - spacingOffset, 0);
}
onMounted(() => {
  parent.value = getScrollParent(el.value);
  if (!parent.value) {
    return;
  }
  lastScrollTop.value = parent.value.scrollTop;
  if (props.shouldScrollToBottom) {
    scrollToBottom(false);
    setTimeout(() => {
      scrollToBottom(false);
    }, 100);
  } else {
    nextTick(() => {
      checkScrollPosition();
    });
  }
  useEventListener(parent, "scroll", checkScrollPosition);
  useEventListener(window, "resize", () => nextTick(updateLastMessageHeight));
  if (el.value) {
    useMutationObserver(el, () => {
      if (props.shouldAutoScroll && props.status === "streaming" && !userScrolledUp.value) {
        scrollToBottom(false);
      }
    }, { childList: true, subtree: true });
  }
});
</script>

<template>
  <div
    ref="el"
    :data-status="props.status"
    data-slot="root"
    :class="ui.root({ class: [props.ui?.root, props.class] })"
    :style="{ '--last-message-height': `${lastMessageHeight}px` }"
  >
    <slot>
      <template v-for="message in props.messages" :key="message.id">
        <UChatMessage
          v-if="message.parts?.length"
          v-bind="{ ...message.role === 'user' ? userProps : assistantProps, ...message }"
          :ref="(el) => registerMessageRef(message.id, el)"
          :compact="props.compact"
        >
          <template v-for="(_, name) in getProxySlots()" #[name]="slotData">
            <slot :name="name" v-bind="{ ...slotData, message }" />
          </template>
        </UChatMessage>
      </template>
    </slot>

    <UChatMessage
      v-if="showIndicator"
      id="indicator"
      role="assistant"
      v-bind="{ ...assistantProps, actions: void 0, parts: [] }"
      :compact="props.compact"
    >
      <template #content>
        <slot name="indicator" :ui="ui">
          <div data-slot="indicator" :class="ui.indicator({ class: props.ui?.indicator })">
            <span />
            <span />
            <span />
          </div>
        </slot>
      </template>
    </UChatMessage>

    <Presence :present="showAutoScroll">
      <div :data-state="showAutoScroll ? 'open' : 'closed'" data-slot="viewport" :class="ui.viewport({ class: props.ui?.viewport })">
        <slot name="viewport" :ui="ui" :on-click="onAutoScrollClick">
          <UButton
            v-if="props.autoScroll"
            :icon="props.autoScrollIcon || appConfig.ui.icons.arrowDown"
            color="neutral"
            variant="outline"
            v-bind="typeof props.autoScroll === 'object' ? props.autoScroll : {}"
            data-slot="autoScroll"
            :class="ui.autoScroll({ class: props.ui?.autoScroll })"
            @click="onAutoScrollClick"
          />
        </slot>
      </div>
    </Presence>
  </div>
</template>
