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
/**
 * Reads `size` / `orientation` from a wrapping `<UFieldGroup>` (or `<UButtonGroup>`, etc.).
 *
 * **Always pass the raw `_props`, never the `useComponentProps` proxy** — the
 * fallback `props?.size ?? fieldGroup?.value.size` must keep the closer context
 * winning over `<UTheme :props>`. To still apply theme defaults on bare inputs,
 * fall back to the proxy at the `tv()` call site: `size: groupSize.value ?? props.size`.
 */
export declare function useFieldGroup<T>(props: Props<T>): {
    orientation: ComputedRef<"horizontal" | "vertical" | undefined>;
    size: ComputedRef<"md" | "xs" | "sm" | "lg" | "xl" | NonNullable<GetObjectField<T, "size">> | undefined>;
};
export declare const FieldGroupReset: import("vue").DefineComponent<{}, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
    [key: string]: any;
}>[] | undefined, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export {};
