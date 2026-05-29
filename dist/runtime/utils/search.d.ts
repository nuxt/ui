import type { FuseResult } from 'fuse.js';
import type { GetItemKeys } from '../types/utils';
export declare function sanitizeSnippet(snippet: string): string;
export declare function highlight<T>(item: T & {
    matches?: FuseResult<T>['matches'];
}, searchTerm: string, forceKey?: GetItemKeys<T>, omitKeys?: GetItemKeys<T>[], useTokenSearch?: boolean): string | undefined;
