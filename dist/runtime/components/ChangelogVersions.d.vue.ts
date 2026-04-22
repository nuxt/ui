import type { VNode } from 'vue';
import type { AppConfig } from '@nuxt/schema';
import type { SpringOptions, UseScrollOptions } from 'motion-v';
import theme from '#build/ui/changelog-versions';
import type { ChangelogVersionProps, ChangelogVersionSlots } from '../types';
import type { ComponentConfig } from '../types/tv';
type ChangelogVersions = ComponentConfig<typeof theme, AppConfig, 'changelogVersions'>;
export interface ChangelogVersionsProps<T extends ChangelogVersionProps = ChangelogVersionProps> {
    /**
     * The element or component this component should render as.
     * @defaultValue 'div'
     */
    as?: any;
    versions?: T[];
    /**
     * Display an indicator bar on the left.
     * By default, the indicator will track the scroll of the page. (https://motion.dev/docs/vue-use-scroll#page-scroll)
     * @defaultValue true
     * @see https://motion.dev/docs/vue-use-scroll#api
     */
    indicator?: boolean | UseScrollOptions;
    /**
     * Enable scrolling motion effect on the indicator bar.
     * `{ damping: 30, restDelta: 0.001 }`{lang="ts-type"}
     * @defaultValue true
     * @see https://motion.dev/docs/vue-transitions#spring
     */
    indicatorMotion?: boolean | SpringOptions;
    class?: any;
    ui?: ChangelogVersions['slots'];
}
type ExtendSlotWithVersion<T extends ChangelogVersionProps, K extends keyof ChangelogVersionSlots> = Required<ChangelogVersionSlots>[K] extends (props: infer P) => VNode[] ? (props: P & {
    version: T;
}) => VNode[] : Required<ChangelogVersionSlots>[K];
export type ChangelogVersionsSlots<T extends ChangelogVersionProps = ChangelogVersionProps> = {
    [K in keyof ChangelogVersionSlots]?: ExtendSlotWithVersion<T, K>;
} & {
    default?(props?: {}): VNode[];
    indicator?(props?: {}): VNode[];
};
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: <T extends ChangelogVersionProps>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_exposed?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: import("vue").PublicProps & __VLS_PrettifyLocal<ChangelogVersionsProps<T>> & (typeof globalThis extends {
        __VLS_PROPS_FALLBACK: infer P;
    } ? P : {});
    expose: (exposed: {}) => void;
    attrs: any;
    slots: ChangelogVersionsSlots<T>;
    emit: {};
}>) => import("vue").VNode & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
type __VLS_PrettifyLocal<T> = (T extends any ? {
    [K in keyof T]: T[K];
} : {
    [K in keyof T as K]: T[K];
}) & {};
