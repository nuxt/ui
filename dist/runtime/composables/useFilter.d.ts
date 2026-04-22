export declare function useFilter(): {
    score: (value: string, searchTerm: string) => number | null;
    scoreItem: (item: any, searchTerm: string, fields: string[]) => number | null;
    filter: <T>(items: T[], searchTerm: string, fields: string[]) => T[];
    filterGroups: <T>(groups: T[][], searchTerm: string, options: {
        fields: string[];
        isStructural?: (item: T) => boolean;
    }) => T[][];
};
