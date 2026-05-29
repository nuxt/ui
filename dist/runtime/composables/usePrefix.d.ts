/**
 * Prefixes Tailwind utility class strings with the configured `theme.prefix`,
 * so static utility classes inside Nuxt UI components match the consumer's
 * Tailwind `prefix(...)` configuration.
 */
export declare function usePrefix(): (classString: string) => string;
