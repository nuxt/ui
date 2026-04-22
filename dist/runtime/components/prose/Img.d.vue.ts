import type { AppConfig } from '@nuxt/schema';
import type { ComponentConfig } from '../../types/tv';
import theme from '#build/ui/prose/img';
type ProseImg = ComponentConfig<typeof theme, AppConfig, 'img', 'ui.prose'>;
export interface ProseImgProps {
    src: string;
    alt: string;
    width?: string | number;
    height?: string | number;
    class?: any;
    /**
     * Zoom image on click
     * @defaultValue true
     */
    zoom?: boolean;
    ui?: ProseImg['slots'];
}
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: import("vue").DefineComponent<ProseImgProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ProseImgProps> & Readonly<{}>, {
    zoom: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
