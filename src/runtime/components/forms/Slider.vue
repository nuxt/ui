<template>
  <div :class="wrapperClass">
    <label
      class="absolute inset-0 z-10 rounded-l-full h-full pointer-events-none bg-current"
      :style="{ width: `${(modelValue / max) * 100}%` }"
    />
    <input
      :id="name"
      ref="input"
      :name="name"
      :min="min"
      :max="max"
      :value="modelValue"
      :disabled="disabled"
      type="range"
      :class="inputClass"
      v-bind="$attrs"
      @input="onInput"
      @focus="$emit('focus', $event)"
      @blur="$emit('blur', $event)"
    />
  </div>
</template>

<script lang="ts">
import { ref, computed, onMounted, defineComponent } from "vue";
import type { PropType } from "vue";
import { defu } from "defu";
import { classNames } from "../../utils";
import { useAppConfig } from "#imports";
// TODO: Remove
// @ts-expect-error
import appConfig from "#build/app.config";

export default defineComponent({
  props: {
    modelValue: {
      type: Number,
      required: true,
      default: 0,
    },
    name: {
      type: String,
      default: null,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    autofocus: {
      type: Boolean,
      default: false,
    },
    min: {
      type: Number,
      default: 0,
    },
    max: {
      type: Number,
      default: 100,
    },
    size: {
      type: String,
      default: () => appConfig.ui.slider.default.size,
      validator(value: string) {
        return Object.keys(appConfig.ui.slider.size).includes(value);
      },
    },
    color: {
      type: String,
      default: () => appConfig.ui.slider.default.color,
      validator(value: string) {
        return appConfig.ui.colors.includes(value);
      },
    },
    ui: {
      type: Object as PropType<Partial<typeof appConfig.ui.slider>>,
      default: () => appConfig.ui.slider,
    },
  },
  emits: ["update:modelValue", "focus", "blur"],
  setup(props, { emit, slots }) {
    // TODO: Remove
    const appConfig = useAppConfig();

    console.log(props.ui);

    const ui = computed<Partial<typeof appConfig.ui.slider>>(() =>
      defu({}, props.ui, appConfig.ui.slider)
    );

    const onInput = (event: InputEvent) => {
      emit("update:modelValue", (event.target as any).value);
    };

    const inputClass = computed(() => {
      return classNames(
        ui.value.base,
        ui.value.thumb.base.replaceAll("{color}", props.color),
        ui.value.thumb.size[props.size],
        ui.value.size[props.size]
        /*  ui.value.rounded,
          ui.value.placeholder,
          ui.value.size[props.size],
          props.padded ? ui.value.padding[props.size] : 'p-0',*/
      );
    });

    const wrapperClass = computed(() => {
      return classNames(
        ui.value.wrapper.replaceAll("{color}", props.color),
        ui.value.size[props.size]
      );
    });

    // eslint-disable-next-line vue/no-dupe-keys
    return { ui, onInput, inputClass, wrapperClass };
  },
});
</script>

<style scoped></style>
