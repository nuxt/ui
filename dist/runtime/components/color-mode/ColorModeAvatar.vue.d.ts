import type { AvatarProps } from '../../types';
export interface ColorModeAvatarProps extends Omit<AvatarProps, 'src'> {
    light: string;
    dark: string;
}
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: import("vue").DefineComponent<ColorModeAvatarProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ColorModeAvatarProps> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
