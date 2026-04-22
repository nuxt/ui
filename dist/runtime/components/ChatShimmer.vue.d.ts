import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/chat-shimmer';
import type { ComponentConfig } from '../types/tv';
type ChatShimmer = ComponentConfig<typeof theme, AppConfig, 'chatShimmer'>;
export interface ChatShimmerProps {
    /**
     * The element or component this component should render as.
     * @defaultValue 'span'
     */
    as?: any;
    /**
     * The text to display with the shimmer effect.
     */
    text: string;
    /**
     * The duration of the shimmer animation in seconds.
     * @defaultValue 2
     */
    duration?: number;
    /**
     * The spread multiplier for the shimmer highlight. The actual spread is computed as `text.length * spread` in pixels.
     * @defaultValue 2
     */
    spread?: number;
    class?: any;
    ui?: ChatShimmer['slots'];
}
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: import("vue").DefineComponent<ChatShimmerProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ChatShimmerProps> & Readonly<{}>, {
    as: any;
    duration: number;
    spread: number;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
