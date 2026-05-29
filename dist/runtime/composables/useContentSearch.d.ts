import type { ContentNavigationItem } from '@nuxt/content';
import type { ContentSearchFile, ContentSearchItem, ContentSearchLink, ContentSearchResult } from '../components/content/ContentSearch.vue';
declare function _useContentSearch(): {
    open: import("vue").Ref<boolean, boolean>;
    mapFile: (file: ContentSearchFile, link: ContentNavigationItem, ancestors?: ContentNavigationItem[]) => ContentSearchItem;
    mapNavigationItems: (children: ContentNavigationItem[], files: ContentSearchFile[], parent?: ContentNavigationItem) => ContentSearchItem[];
    mapLinks: (links: ContentSearchLink[]) => ContentSearchItem[];
    mapSearchResults: (results: ContentSearchResult[], navigation?: ContentNavigationItem[]) => ContentSearchItem[];
    postFilter: (query: string, items: ContentSearchItem[]) => ContentSearchItem[];
};
export declare const useContentSearch: typeof _useContentSearch;
export {};
