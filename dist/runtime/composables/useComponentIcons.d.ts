import type { MaybeRefOrGetter } from 'vue';
import type { AvatarProps, IconProps } from '../types';
export interface UseComponentIconsProps {
    /**
     * Display an icon based on the `leading` and `trailing` props.
     * @IconifyIcon
     */
    icon?: IconProps['name'];
    /** Display an avatar on the left side. */
    avatar?: AvatarProps;
    /** When `true`, the icon will be displayed on the left side. */
    leading?: boolean;
    /**
     * Display an icon on the left side.
     * @IconifyIcon
     */
    leadingIcon?: IconProps['name'];
    /** When `true`, the icon will be displayed on the right side. */
    trailing?: boolean;
    /**
     * Display an icon on the right side.
     * @IconifyIcon
     */
    trailingIcon?: IconProps['name'];
    /** When `true`, the loading icon will be displayed. */
    loading?: boolean;
    /**
     * The icon when the `loading` prop is `true`.
     * @defaultValue appConfig.ui.icons.loading
     * @IconifyIcon
     */
    loadingIcon?: IconProps['name'];
}
export declare function useComponentIcons(componentProps: MaybeRefOrGetter<UseComponentIconsProps>): {
    isLeading: import("vue").ComputedRef<any>;
    isTrailing: import("vue").ComputedRef<any>;
    leadingIconName: import("vue").ComputedRef<any>;
    trailingIconName: import("vue").ComputedRef<any>;
};
