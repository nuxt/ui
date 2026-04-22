import type { ButtonHTMLAttributes, VNode } from 'vue';
interface BaseLinkProps {
    /**
     * Route Location the link should navigate to when clicked on.
     */
    to?: string;
    /**
     * An alias for `to`. If used with `to`, `href` will be ignored
     */
    href?: string;
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
}
export interface LinkProps extends BaseLinkProps {
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
    /** The class to apply when the link is active. */
    activeClass?: string;
    /** The value of the `aria-current` attribute when the link is active. */
    ariaCurrentValue?: string;
    custom?: boolean;
    /** When `true`, only styles from `class`, `activeClass`, and `inactiveClass` will be applied. */
    raw?: boolean;
    class?: any;
}
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
    ariaCurrentValue: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>, LinkSlots>;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
