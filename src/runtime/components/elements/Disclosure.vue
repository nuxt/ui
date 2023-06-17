<template>
  <div :class="[ui.wrapper, ui.rounded ,ui.gap[size]]">
    <Disclosure
      v-for="(item, index) in items"
      v-slot="{ open }"
      :key="index"
      :default-open="defaultOpenAll || item.opened"
      :class="[ui.base, ui.rounded]"
      as="div"
    >
      <DisclosureButton :class="disclosureButtonClass" :disabled="item.disabled">
        <slot name="button" :title="item.title" :index="index" :leading-icon="item.leadingIcon" :is-open="open">
          <div class="flex justify-center items-center">
            <UIcon
              v-if="item.leadingIcon"
              :name="item.leadingIcon"
              :class="[ui.button.icon.size[size], leadingIconClass]"
            />
            <span>{{ item.title }}</span>
          </div>
          <UIcon
            :name="!open ? openIcon : (closeIcon ? closeIcon : openIcon)"
            :class="[
              open && !closeIcon ? 'rotate-180 transform' : '',
              ui.button.icon.size[size],
            ]"
          />
        </slot>
      </DisclosureButton>

      <transition v-bind="ui.transition">
        <DisclosurePanel
          :class="[contentClass, ui.rounded, ui.size[size]]"
          as="div"
        >
          <slot :name="`item-${index+1}-content`" :content="item.content">
            {{ item.content }}
          </slot>
        </DisclosurePanel>
      </transition>
    </Disclosure>
  </div>
</template>

<script lang="ts">
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import type { PropType } from "vue";
import { defineComponent, computed } from "vue";
import { defu } from "defu";
import UIcon from "../elements/Icon.vue";
import { classNames } from "../../utils";
import { useAppConfig } from "#imports";
// TODO: Remove
// @ts-expect-error
import appConfig from "#build/app.config";

export default defineComponent({
  components: {
    // eslint-disable-next-line vue/no-reserved-component-names
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    UIcon,
  },
  props: {
    items: {
      type: Array as PropType<{
          title: string;
          content?: string;
          leadingIcon?: string;
          opened?: boolean;
          disabled?: boolean;
        }[]>,
      default: () => [],
    },
    defaultOpenAll: {
      type: Boolean,
      default: false,
    },
    openIcon: {
      type: String,
      default: () => appConfig.ui.disclosure.default.openIcon,
    },
    closeIcon: {
      type: String,
      default: () => appConfig.ui.disclosure.default.closeIcon,
    },
    size: {
      type: String,
      default: () => appConfig.ui.disclosure.default.size,
      validator(value: string) {
        return Object.keys(appConfig.ui.disclosure.size).includes(value);
      },
    },
    leadingIconClass: {
      type: String,
      default: () => appConfig.ui.disclosure.default.leadingIconClass,
    },
    contentClass:{
      type: String,
      default: () => appConfig.ui.disclosure.default.contentClass,
    },
    color: {
      type: String,
      default: () => appConfig.ui.disclosure.default.color,
      validator(value: string) {
        return [...appConfig.ui.colors].includes(value);
      },
    },
    ui: {
      type: Object as PropType<Partial<typeof appConfig.ui.disclosure>>,
      default: () => appConfig.ui.disclosure,
    },
  },
  setup(props) {
    // TODO: Remove
    const appConfig = useAppConfig();

    const ui = computed<Partial<typeof appConfig.ui.disclosure>>(() =>
      defu({}, props.ui, appConfig.ui.disclosure)
    );

    const disclosureButtonClass = computed(() => {
      if (useSlots().button) {
        return ui.value.base;
      }

      return classNames(
        ui.value.base,
        ui.value.rounded,
        ui.value.shadow,
        ui.value.size[props.size],
        ui.value.button.class.replaceAll("{color}", props.color)
      );
    });

    return {
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      disclosureButtonClass,
    };
  },
});
</script>
