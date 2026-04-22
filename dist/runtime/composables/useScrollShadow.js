import { computed, toValue } from "vue";
import { useScroll } from "@vueuse/core";
export function useScrollShadow(element, options = {}) {
  const { arrivedState } = useScroll(element);
  const style = computed(() => {
    const el = toValue(element);
    const orientation = toValue(options.orientation) ?? "vertical";
    const [startKey, endKey] = orientation === "horizontal" ? ["left", "right"] : ["top", "bottom"];
    const showStart = !arrivedState[startKey];
    const showEnd = !arrivedState[endKey];
    if (!showStart && !showEnd) return void 0;
    const overflows = el ? orientation === "horizontal" ? el.scrollWidth > el.clientWidth : el.scrollHeight > el.clientHeight : false;
    if (!overflows) return void 0;
    const size = `${toValue(options.size) ?? 24}px`;
    const angle = orientation === "horizontal" ? "90deg" : "180deg";
    if (showStart && showEnd) {
      return { maskImage: `linear-gradient(${angle}, transparent, #000 ${size}, #000 calc(100% - ${size}), transparent)` };
    }
    if (showStart) {
      return { maskImage: `linear-gradient(${angle}, transparent, #000 ${size})` };
    }
    return { maskImage: `linear-gradient(${angle}, #000, #000 calc(100% - ${size}), transparent)` };
  });
  const isOverflowing = computed(() => {
    void (arrivedState.top, arrivedState.bottom, arrivedState.left, arrivedState.right);
    const el = toValue(element);
    if (!el) return false;
    const orientation = toValue(options.orientation) ?? "vertical";
    return orientation === "horizontal" ? el.scrollWidth > el.clientWidth : el.scrollHeight > el.clientHeight;
  });
  return {
    style,
    isOverflowing,
    arrivedState
  };
}
