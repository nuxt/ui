import type { ContentNavigationItem } from '@nuxt/content';
import type { ContentSearchFile, ContentSearchItem } from '../components/content/ContentSearch.vue';
declare function _useContentSearch(): {
    open: import("vue").Ref<boolean, boolean>;
    mapFile: (file: ContentSearchFile, link: ContentNavigationItem, parent?: ContentNavigationItem) => ContentSearchItem;
    mapNavigationItems: (children: ContentNavigationItem[], files: ContentSearchFile[], parent?: ContentNavigationItem) => ContentSearchItem[];
    postFilter: (query: string, items: ContentSearchItem[]) => ContentSearchItem[];
};
export declare const useContentSearch: typeof _useContentSearch;
export {};
