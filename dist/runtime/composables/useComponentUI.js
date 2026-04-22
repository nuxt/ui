import { computed } from "vue";
import defu from "defu";
import { createContext } from "reka-ui";
import { get } from "../utils/index.js";
const [injectThemeContext, provideThemeContext] = createContext("UTheme", "RootContext");
export { provideThemeContext };
export function useComponentUI(name, props) {
  const { ui } = injectThemeContext({ ui: computed(() => ({})) });
  return computed(() => {
    const themeOverrides = get(ui.value, name) || {};
    return defu(props.ui ?? {}, themeOverrides);
  });
}
