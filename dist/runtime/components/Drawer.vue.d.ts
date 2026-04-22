import type { VNode } from 'vue';
import type { DrawerRootProps, DrawerRootEmits } from 'vaul-vue';
import type { DialogContentProps, DialogContentEmits } from 'reka-ui';
import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/drawer';
import type { EmitsToProps } from '../types/utils';
import type { ComponentConfig } from '../types/tv';
type Drawer = ComponentConfig<typeof theme, AppConfig, 'drawer'>;
export interface DrawerProps extends Pick<DrawerRootProps, 'activeSnapPoint' | 'closeThreshold' | 'shouldScaleBackground' | 'setBackgroundColorOnScale' | 'scrollLockTimeout' | 'fixed' | 'dismissible' | 'modal' | 'open' | 'defaultOpen' | 'nested' | 'direction' | 'noBodyStyles' | 'handleOnly' | 'preventScrollRestoration' | 'snapPoints'> {
    /**
     * The element or component this component should render as.
     * @defaultValue 'div'
     */
    as?: any;
    title?: string;
    description?: string;
    /**
     * Whether to inset the drawer from the edges.
     * @defaultValue false
     */
    inset?: boolean;
    /** The content of the drawer. */
    content?: Omit<DialogContentProps, 'as' | 'asChild' | 'forceMount'> & Partial<EmitsToProps<DialogContentEmits>>;
    /**
     * Render an overlay behind the drawer.
     * @defaultValue true
     */
    overlay?: boolean;
    /**
     * Render a handle on the drawer.
     * @defaultValue true
     */
    handle?: boolean;
    /**
     * Render the drawer in a portal.
     * @defaultValue true
     */
    portal?: boolean | string | HTMLElement;
    /**
     * Whether the drawer is nested in another drawer.
     * @defaultValue false
     */
    nested?: boolean;
    class?: any;
    ui?: Drawer['slots'];
}
export interface DrawerEmits extends DrawerRootEmits {
    (e: 'close:prevent'): void;
}
export interface DrawerSlots {
    default?(props?: {}): VNode[];
    content?(props?: {}): VNode[];
    header?(props?: {}): VNode[];
    title?(props?: {}): VNode[];
    description?(props?: {}): VNode[];
    body?(props?: {}): VNode[];
    footer?(props?: {}): VNode[];
}
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: __VLS_WithSlots<import("vue").DefineComponent<DrawerProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    close: () => any;
    drag: (percentageDragged: number) => any;
    "update:open": (open: boolean) => any;
    "close:prevent": () => any;
    release: (open: boolean) => any;
    "update:activeSnapPoint": (val: string | number) => any;
    animationEnd: (open: boolean) => any;
}, string, import("vue").PublicProps, Readonly<DrawerProps> & Readonly<{
    onClose?: (() => any) | undefined;
    onDrag?: ((percentageDragged: number) => any) | undefined;
    "onUpdate:open"?: ((open: boolean) => any) | undefined;
    "onClose:prevent"?: (() => any) | undefined;
    onRelease?: ((open: boolean) => any) | undefined;
    "onUpdate:activeSnapPoint"?: ((val: string | number) => any) | undefined;
    onAnimationEnd?: ((open: boolean) => any) | undefined;
}>, {
    overlay: boolean;
    modal: boolean;
    portal: boolean | string | HTMLElement;
    direction: import("vaul-vue").DrawerDirection;
    handle: boolean;
    dismissible: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>, DrawerSlots>;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
