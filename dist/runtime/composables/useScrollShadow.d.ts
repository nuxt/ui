import type { CSSProperties, MaybeRef, MaybeRefOrGetter } from 'vue';
export interface UseScrollShadowOptions {
    /**
     * The shadow size in pixels.
     * @defaultValue 24
     */
    size?: MaybeRefOrGetter<number>;
    /**
     * The scroll direction to apply shadows.
     * @defaultValue 'vertical'
     */
    orientation?: MaybeRefOrGetter<'vertical' | 'horizontal'>;
}
export declare function useScrollShadow(element: MaybeRef<HTMLElement | null | undefined>, options?: UseScrollShadowOptions): {
    style: import("vue").ComputedRef<CSSProperties | undefined>;
    isOverflowing: import("vue").ComputedRef<boolean>;
    arrivedState: {
        left: boolean;
        right: boolean;
        top: boolean;
        bottom: boolean;
    };
};
