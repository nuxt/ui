import { h, cloneVNode, computed, defineComponent } from "vue";
import type { PropType } from "vue";
import { defu } from "defu";
import { getSlotsChildren } from "../../utils";
import { useAppConfig } from "#imports";
// TODO: Remove
// @ts-expect-error
import appConfig from "#build/app.config";

// const appConfig = useAppConfig()

export default defineComponent({
  props: {
    size: {
      type: String,
      default: null,
      validator(value: string) {
        return Object.keys(appConfig.ui.button.size).includes(value);
      },
    },
    ui: {
      type: Object as PropType<Partial<typeof appConfig.ui.buttonGroup>>,
      default: () => appConfig.ui.buttonGroup,
    },
  },
  setup(props, { slots }) {
    // TODO: Remove
    const appConfig = useAppConfig();

    const ui = computed<Partial<typeof appConfig.ui.buttonGroup>>(() =>
      defu({}, props.ui, appConfig.ui.buttonGroup)
    );

    const children = computed(() => getSlotsChildren(slots));

    const rounded = computed(
      () =>
        ({
          "rounded-none": { left: "rounded-s-none", right: "rounded-e-none" },
          "rounded-sm": { left: "rounded-s-sm", right: "rounded-e-sm" },
          rounded: { left: "rounded-s", right: "rounded-e" },
          "rounded-md": { left: "rounded-s-md", right: "rounded-e-md" },
          "rounded-lg": { left: "rounded-s-lg", right: "rounded-e-lg" },
          "rounded-xl": { left: "rounded-s-xl", right: "rounded-e-xl" },
          "rounded-2xl": { left: "rounded-s-2xl", right: "rounded-e-2xl" },
          "rounded-3xl": { left: "rounded-s-3xl", right: "rounded-e-3xl" },
          "rounded-full": { left: "rounded-s-full", right: "rounded-e-full" },
        }[ui.value.rounded])
    );

    const clones = computed(() =>
      children.value.map((node, index) => {
        const vProps: any = {};

        if (props.size) {
          vProps.size = props.size;
        }

        vProps.class = node.props.class || "";
        vProps.class += " !shadow-none";
        vProps.ui = node.props.ui || {};
        vProps.ui.rounded = "";

        if (index === 0) {
          vProps.ui.rounded = rounded.value.left;
        }

        if (index === children.value.length - 1) {
          vProps.ui.rounded = rounded.value.right;
        }

        return cloneVNode(node, vProps);
      })
    );

    return () =>
      h(
        "div",
        { class: [ui.value.wrapper, ui.value.rounded, ui.value.shadow] },
        clones.value
      );
  },
});
