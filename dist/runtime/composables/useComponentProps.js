import { computed, getCurrentInstance } from "vue";
import defu from "defu";
import { createContext } from "reka-ui";
import { useAppConfig } from "#imports";
import { get } from "../utils/index.js";
const [_injectThemeContext, provideThemeContext] = createContext("UTheme", "RootContext");
export const defaultThemeContext = {
  defaults: computed(() => ({}))
};
export function injectThemeContext(fallback = defaultThemeContext) {
  return _injectThemeContext(fallback);
}
export { provideThemeContext };
function camelCase(str) {
  return str.replace(/-(\w)/g, (_, c) => c.toUpperCase());
}
function kebabCase(str) {
  return str.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
}
function propIsDefined(vnode, prop) {
  if (!vnode || !vnode.props) return false;
  return vnode.props[camelCase(prop)] !== void 0 || vnode.props[kebabCase(prop)] !== void 0;
}
export function useComponentProps(name, props) {
  const vm = getCurrentInstance();
  const { defaults } = injectThemeContext();
  const appConfig = useAppConfig();
  return new Proxy(props, {
    get(target, prop, receiver) {
      if (prop === "__v_isReactive") return true;
      if (prop === "__v_raw") return target;
      const raw = Reflect.get(target, prop, receiver);
      if (typeof prop !== "string") return raw;
      const themeEntry = name.includes(".") ? get(defaults.value, name) : defaults.value[name];
      if (prop === "ui") {
        const themeUi = themeEntry?.ui;
        if (!raw && !themeUi) return raw;
        return defu(raw ?? {}, themeUi ?? {});
      }
      if (vm && propIsDefined(vm.vnode, prop)) return raw;
      const themeValue = themeEntry?.[prop];
      if (themeValue !== void 0) return themeValue;
      const propDef = vm?.type?.props?.[prop];
      if (propDef && Object.prototype.hasOwnProperty.call(propDef, "default")) {
        return raw;
      }
      const appConfigEntry = name.includes(".") ? get(appConfig.ui ?? {}, name) : appConfig.ui?.[name];
      return appConfigEntry?.defaultVariants?.[prop];
    },
    // `has`, `ownKeys`, and `getOwnPropertyDescriptor` reflect the underlying
    // `defineProps` schema only — theme defaults are NOT enumerable. As a
    // result, `Object.keys(props)`, `for…in`, and `{ ...props }` see only the
    // declared prop keys, but each value lookup still flows through the proxy.
    // This is the contract our internal `useForwardProps` relies on.
    has: (t, p) => Reflect.has(t, p),
    ownKeys: (t) => Reflect.ownKeys(t),
    getOwnPropertyDescriptor: (t, p) => Reflect.getOwnPropertyDescriptor(t, p)
  });
}
