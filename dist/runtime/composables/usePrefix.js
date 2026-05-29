import { useAppConfig } from "#imports";
export function usePrefix() {
  const appConfig = useAppConfig();
  const prefix = appConfig.ui?.prefix;
  return (classString) => {
    if (!prefix || !classString) {
      return classString;
    }
    return classString.split(/\s+/).filter(Boolean).map((cls) => `${prefix}:${cls}`).join(" ");
  };
}
