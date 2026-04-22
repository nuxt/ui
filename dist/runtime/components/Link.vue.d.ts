import type { VNode } from 'vue';
import type { RouterLinkProps, RouteLocationRaw } from 'vue-router';
import type { ButtonHTMLAttributes, AnchorHTMLAttributes } from '../types/html';
interface NuxtLinkProps extends Omit<RouterLinkProps, 'to'> {
    /**
     * Route Location the link should navigate to when clicked on.
     */
    to?: RouteLocationRaw;
    /**
     * An alias for `to`. If used with `to`, `href` will be ignored
     */
    href?: NuxtLinkProps['to'];
    /**
     * Forces the link to be considered as external (true) or internal (false). This is helpful to handle edge-cases
     */
    external?: boolean;
    /**
     * Where to display the linked URL, as the name for a browsing context.
     */
    target?: '_blank' | '_parent' | '_self' | '_top' | (string & {}) | null;
    /**
     * A rel attribute value to apply on the link. Defaults to "noopener noreferrer" for external links.
     */
    rel?: 'noopener' | 'noreferrer' | 'nofollow' | 'sponsored' | 'ugc' | (string & {}) | null;
    /**
     * If set to true, no rel attribute will be added to the link
     */
    noRel?: boolean;
    /**
     * A class to apply to links that have been prefetched.
     */
    prefetchedClass?: string;
    /**
     * When enabled will prefetch middleware, layouts and payloads of links in the viewport.
     */
    prefetch?: boolean;
    /**
     * Allows controlling when to prefetch links. By default, prefetch is triggered only on visibility.
     */
    prefetchOn?: 'visibility' | 'interaction' | Partial<{
        visibility: boolean;
        interaction: boolean;
    }>;
    /**
     * Escape hatch to disable `prefetch` attribute.
     */
    noPrefetch?: boolean;
    /**
     * An option to either add or remove trailing slashes in the `href` for this specific link.
     * Overrides the global `trailingSlash` option if provided.
     */
    trailingSlash?: 'append' | 'remove';
}
export interface LinkProps extends NuxtLinkProps, /** @vue-ignore */ Omit<ButtonHTMLAttributes, 'type' | 'disabled'>, /** @vue-ignore */ Omit<AnchorHTMLAttributes, 'href' | 'target' | 'rel' | 'type'> {
    /**
     * The element or component this component should render as when not a link.
     * @defaultValue 'button'
     */
    as?: any;
    /**
     * The type of the button when not a link.
     * @defaultValue 'button'
     */
    type?: ButtonHTMLAttributes['type'];
    disabled?: boolean;
    /** Force the link to be active independent of the current route. */
    active?: boolean;
    /** Will only be active if the current route is an exact match. */
    exact?: boolean;
    /** Allows controlling how the current route query sets the link as active. */
    exactQuery?: boolean | 'partial';
    /** Will only be active if the current route hash is an exact match. */
    exactHash?: boolean;
    /** The class to apply when the link is inactive. */
    inactiveClass?: string;
    custom?: boolean;
    /** When `true`, only styles from `class`, `activeClass`, and `inactiveClass` will be applied. */
    raw?: boolean;
    class?: any;
}
/**
 * Link-related props that can be omitted from ButtonProps when link functionality is not needed.
 * Use this with `Omit<ButtonProps, LinkPropsKeys>` in components where buttons should not act as links.
 */
export type LinkPropsKeys = 'to' | 'href' | 'target' | 'rel' | 'noRel' | 'external' | 'prefetch' | 'prefetchOn' | 'prefetchedClass' | 'noPrefetch' | 'trailingSlash' | 'replace' | 'ariaCurrentValue' | 'active' | 'activeClass' | 'exact' | 'exactQuery' | 'exactHash' | 'inactiveClass' | 'download' | 'ping' | 'referrerpolicy' | 'hreflang' | 'media';
export interface LinkSlots {
    default?(props: {
        active: boolean;
    }): VNode[];
}
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: __VLS_WithSlots<import("vue").DefineComponent<LinkProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<LinkProps> & Readonly<{}>, {
    active: boolean;
    as: any;
    type: "reset" | "submit" | "button";
    ariaCurrentValue: "page" | "step" | "location" | "date" | "time" | "true" | "false";
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>, LinkSlots>;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
