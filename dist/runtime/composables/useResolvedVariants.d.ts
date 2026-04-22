import type { ComputedRef, MaybeRefOrGetter } from 'vue';
/**
 * Resolve variant values that are consumed in template logic (e.g. `<component :is="...">`).
 *
 * `tv()`'s `defaultVariants` only apply when computing classes — they don't affect
 * template conditionals that read the prop directly. This mirrors tv's priority:
 * `props[key]` > `app.config.ts` `defaultVariants[key]` > `theme.defaultVariants[key]`.
 *
 * @example
 * const { variant } = useResolvedVariants('radioGroup', props, theme, ['variant'])
 *
 * // For nested prop paths, override with a getter:
 * const { position } = useResolvedVariants('select', props, theme, ['position'], {
 *   position: () => props.content?.position
 * })
 *
 * Related: #6360
 */
export declare function useResolvedVariants<K extends string>(name: string, props: Record<string, any>, theme: Record<string, any>, keys: K[], overrides?: Partial<Record<K, MaybeRefOrGetter<any>>>): {
    [P in K]: ComputedRef<any>;
};
