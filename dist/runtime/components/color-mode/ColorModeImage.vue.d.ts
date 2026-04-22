import type { ImgHTMLAttributes } from '../../types/html';
export interface ColorModeImageProps extends /** @vue-ignore */ Omit<ImgHTMLAttributes, 'src'> {
    dark: string;
    light: string;
}
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: import("vue").DefineComponent<ColorModeImageProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ColorModeImageProps> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
