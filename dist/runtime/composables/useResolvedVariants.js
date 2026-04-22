import { computed, toValue } from "vue";
import { useAppConfig } from "#imports";
import { get } from "../utils/index.js";
export function useResolvedVariants(name, props, theme, keys, overrides) {
  const appConfig = useAppConfig();
  const result = {};
  for (const key of keys) {
    result[key] = computed(() => {
      const value = overrides?.[key] !== void 0 ? toValue(overrides[key]) : get(props, key);
      return value ?? appConfig.ui?.[name]?.defaultVariants?.[key] ?? theme.defaultVariants?.[key];
    });
  }
  return result;
}
