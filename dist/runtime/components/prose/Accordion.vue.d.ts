import type { VNode } from 'vue';
import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/prose/accordion';
import type { AccordionProps } from '../../types';
import type { ComponentConfig } from '../../types/tv';
type ProseAccordion = ComponentConfig<typeof theme, AppConfig, 'accordion', 'ui.prose'>;
export interface ProseAccordionProps {
    type?: 'single' | 'multiple';
    class?: any;
    ui?: ProseAccordion['slots'] & AccordionProps['ui'];
}
export interface ProseAccordionSlots {
    default(props?: {}): VNode[];
}
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: __VLS_WithSlots<import("vue").DefineComponent<ProseAccordionProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ProseAccordionProps> & Readonly<{}>, {
    type: "single" | "multiple";
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>, ProseAccordionSlots>;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
