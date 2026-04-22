import type { LinkProps } from '../types';
export declare const linkKeys: readonly ["active", "activeClass", "ariaCurrentValue", "as", "disabled", "download", "exact", "exactActiveClass", "exactHash", "exactQuery", "external", "form", "formaction", "formenctype", "formmethod", "formnovalidate", "formtarget", "href", "hreflang", "inactiveClass", "media", "noPrefetch", "noRel", "onClick", "ping", "prefetch", "prefetchOn", "prefetchedClass", "referrerpolicy", "rel", "replace", "target", "title", "to", "trailingSlash", "type", "viewTransition"];
export declare function pickLinkProps(link: LinkProps & {
    [key: string]: any;
}): import("@vueuse/shared").ReactivePickReturn<LinkProps & {
    [key: string]: any;
}, string>;
export declare function isPartiallyEqual(item1: any, item2: any): boolean;
