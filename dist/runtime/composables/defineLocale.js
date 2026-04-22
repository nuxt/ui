import { defu } from "defu";
// @__NO_SIDE_EFFECTS__
export function defineLocale(options) {
  return defu(options, { dir: "ltr" });
}
// @__NO_SIDE_EFFECTS__
export function extendLocale(locale, options) {
  return defu(options, locale);
}
