import type { ContentNavigationItem } from '@nuxt/content';
type MapContentNavigationItemOptions = {
    labelAttribute?: string;
    deep?: number;
};
export declare function mapContentNavigationItem(item: ContentNavigationItem, options?: MapContentNavigationItemOptions, currentDepth?: number): Omit<ContentNavigationItem, "title" | "path"> & {
    label?: string;
    to?: string;
};
export declare function mapContentNavigation(navigation: ContentNavigationItem[], options?: MapContentNavigationItemOptions): (Omit<ContentNavigationItem, "title" | "path"> & {
    label?: string;
    to?: string;
})[];
export {};
