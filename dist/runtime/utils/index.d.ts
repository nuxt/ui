import type { GetItemKeys } from '../types/utils';
export declare function pick<Data extends object, Keys extends keyof Data>(data: Data, keys: Keys[]): Pick<Data, Keys>;
export declare function omit<Data extends object, Keys extends keyof Data>(data: Data, keys: Keys[]): Omit<Data, Keys>;
export declare function get(object: Record<string, any> | undefined, path: (string | number)[] | string, defaultValue?: any): any;
export declare function set(object: Record<string, any>, path: (string | number)[] | string, value: any): void;
export declare function looseToNumber(val: any): any;
export declare function compare<T>(value?: T, currentValue?: T, comparator?: string | ((a: T, b: T) => boolean)): boolean;
export declare function isEmpty(value: unknown): boolean;
export declare function getDisplayValue<T extends Array<any>, V>(items: T, value: V | undefined | null, options?: {
    valueKey?: GetItemKeys<T>;
    labelKey?: GetItemKeys<T>;
    by?: string | ((a: any, b: any) => boolean);
}): string | undefined;
export declare function isArrayOfArray<A extends any[] | any[][]>(item: A): item is A extends Array<infer T> ? T extends any[] ? T[] : never : never;
export declare function mergeClasses(appConfigClass?: string | string[], propClass?: string): "" | (string | undefined)[];
export declare function getSlotChildrenText(children: any): any;
export declare function transformUI(ui: any, uiProp?: any): any;
export declare function resolveBaseURL(path?: string, baseURL?: string): string | undefined;
export * from './content';
