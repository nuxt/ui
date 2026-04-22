import type { InjectionKey, ComputedRef } from 'vue';
import type { FieldGroupProps } from '../components/FieldGroup.vue';
import type { GetObjectField } from '../types/utils';
export declare const fieldGroupInjectionKey: InjectionKey<ComputedRef<{
    size: FieldGroupProps['size'];
    orientation: FieldGroupProps['orientation'];
}>>;
type Props<T> = {
    size?: GetObjectField<T, 'size'>;
};
export declare function useFieldGroup<T>(props: Props<T>): {
    orientation: ComputedRef<"horizontal" | "vertical" | undefined>;
    size: ComputedRef<"xs" | "sm" | "md" | "lg" | "xl" | NonNullable<GetObjectField<T, "size">> | undefined>;
};
export declare const FieldGroupReset: import("vue").DefineComponent<{}, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
    [key: string]: any;
}>[] | undefined, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export {};
