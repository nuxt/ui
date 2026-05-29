import { computed, isRef } from "vue";
import { useEmitAsProps } from "reka-ui";
export function useForwardProps(source, emits) {
  const emitAsProps = emits ? useEmitAsProps(emits) : {};
  return computed(() => {
    const src = isRef(source) ? source.value : source;
    const out = { ...emitAsProps };
    for (const key in src) {
      const value = src[key];
      if (value !== void 0) out[key] = value;
    }
    return out;
  });
}
