export * from './base';
export declare const useRoute: () => {
    fullPath: string;
    path: string;
    name: null;
    params: {};
    query: {};
    hash: string;
    meta: {};
    matched: never[];
    redirectedFrom: undefined;
};
export declare const useRouter: () => {
    push: () => Promise<void>;
    replace: () => Promise<void>;
    go: () => void;
    back: () => void;
    forward: () => void;
    beforeEach: () => () => void;
    beforeResolve: () => () => void;
    afterEach: () => () => void;
    onError: () => () => void;
    isReady: () => Promise<boolean>;
    currentRoute: import("vue").Ref<{
        fullPath: string;
        path: string;
        name: null;
        params: {};
        query: {};
        hash: string;
        meta: {};
        matched: never[];
        redirectedFrom: undefined;
    }, {
        fullPath: string;
        path: string;
        name: null;
        params: {};
        query: {};
        hash: string;
        meta: {};
        matched: never[];
        redirectedFrom: undefined;
    } | {
        fullPath: string;
        path: string;
        name: null;
        params: {};
        query: {};
        hash: string;
        meta: {};
        matched: never[];
        redirectedFrom: undefined;
    }>;
    options: {};
};
