export declare function useScrollspy(): {
    visibleHeadings: import("vue").Ref<string[], string[]>;
    activeHeadings: import("vue").Ref<string[], string[]>;
    updateHeadings: (headings: Element[]) => void;
};
