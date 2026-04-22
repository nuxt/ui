import type { VNode } from 'vue';
import type { AppConfig } from '@nuxt/schema';
import type { EmblaCarouselType, EmblaOptionsType } from 'embla-carousel';
import type { AutoplayOptionsType } from 'embla-carousel-autoplay';
import type { AutoScrollOptionsType } from 'embla-carousel-auto-scroll';
import type { AutoHeightOptionsType } from 'embla-carousel-auto-height';
import type { ClassNamesOptionsType } from 'embla-carousel-class-names';
import type { FadeOptionsType } from 'embla-carousel-fade';
import type { WheelGesturesPluginOptions } from 'embla-carousel-wheel-gestures';
import theme from '#build/ui/carousel';
import type { ButtonProps, IconProps, LinkPropsKeys } from '../types';
import type { AcceptableValue } from '../types/utils';
import type { ComponentConfig } from '../types/tv';
type Carousel = ComponentConfig<typeof theme, AppConfig, 'carousel'>;
export type CarouselValue = AcceptableValue;
export type CarouselItem = CarouselValue | {
    class?: any;
    ui?: Pick<Carousel['slots'], 'item'>;
    [key: string]: any;
};
export interface CarouselProps<T extends CarouselItem = CarouselItem> extends Omit<EmblaOptionsType, 'axis' | 'container' | 'slides' | 'direction'> {
    /**
     * The element or component this component should render as.
     * @defaultValue 'div'
     */
    as?: any;
    /**
     * Configure the prev button when arrows are enabled.
     * @defaultValue { size: 'md', color: 'neutral', variant: 'link' }
     */
    prev?: Omit<ButtonProps, LinkPropsKeys>;
    /**
     * The icon displayed in the prev button.
     * @defaultValue appConfig.ui.icons.arrowLeft
     * @IconifyIcon
     */
    prevIcon?: IconProps['name'];
    /**
     * Configure the next button when arrows are enabled.
     * @defaultValue { size: 'md', color: 'neutral', variant: 'link' }
     */
    next?: Omit<ButtonProps, LinkPropsKeys>;
    /**
     * The icon displayed in the next button.
     * @defaultValue appConfig.ui.icons.arrowRight
     * @IconifyIcon
     */
    nextIcon?: IconProps['name'];
    /**
     * Display prev and next buttons to scroll the carousel.
     * @defaultValue false
     */
    arrows?: boolean;
    /**
     * Display dots to scroll to a specific slide.
     * @defaultValue false
     */
    dots?: boolean;
    /**
     * The orientation of the carousel.
     * @defaultValue 'horizontal'
     */
    orientation?: Carousel['variants']['orientation'];
    items?: T[];
    /**
     * Enable Autoplay plugin
     * @see https://www.embla-carousel.com/plugins/autoplay/
     */
    autoplay?: boolean | AutoplayOptionsType;
    /**
     * Enable Auto Scroll plugin
     * @see https://www.embla-carousel.com/plugins/auto-scroll/
     */
    autoScroll?: boolean | AutoScrollOptionsType;
    /**
     * Enable Auto Height plugin
     * @see https://www.embla-carousel.com/plugins/auto-height/
     */
    autoHeight?: boolean | AutoHeightOptionsType;
    /**
     * Enable Class Names plugin
     * @see https://www.embla-carousel.com/plugins/class-names/
     */
    classNames?: boolean | ClassNamesOptionsType;
    /**
     * Enable Fade plugin
     * @see https://www.embla-carousel.com/plugins/fade/
     */
    fade?: boolean | FadeOptionsType;
    /**
     * Enable Wheel Gestures plugin
     * @see https://www.embla-carousel.com/plugins/wheel-gestures/
     */
    wheelGestures?: boolean | WheelGesturesPluginOptions;
    class?: any;
    ui?: Carousel['slots'];
}
export type CarouselSlots<T extends CarouselItem = CarouselItem> = {
    default?(props: {
        item: T;
        index: number;
    }): VNode[];
};
export interface CarouselEmits {
    /**
     * Emitted when the selected slide changes
     * @param selectedIndex The index of the selected slide
     */
    select: [selectedIndex: number];
}
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: <T extends CarouselItem>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_exposed?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: import("vue").PublicProps & __VLS_PrettifyLocal<CarouselProps<T> & {
        onSelect?: ((selectedIndex: number) => any) | undefined;
    }> & (typeof globalThis extends {
        __VLS_PROPS_FALLBACK: infer P;
    } ? P : {});
    expose: (exposed: import("vue").ShallowUnwrapRef<{
        emblaRef: import("vue").Ref<HTMLElement | undefined, HTMLElement | undefined>;
        emblaApi: import("vue").Ref<EmblaCarouselType | undefined, EmblaCarouselType | undefined>;
    }>) => void;
    attrs: any;
    slots: CarouselSlots<T>;
    emit: (evt: "select", selectedIndex: number) => void;
}>) => import("vue").VNode & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
type __VLS_PrettifyLocal<T> = (T extends any ? {
    [K in keyof T]: T[K];
} : {
    [K in keyof T as K]: T[K];
}) & {};
