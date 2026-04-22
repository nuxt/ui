type KbdKeysSpecificMap = {
    meta: string;
    alt: string;
    ctrl: string;
};
export declare const kbdKeysMap: {
    meta: string;
    ctrl: string;
    alt: string;
    win: string;
    command: string;
    shift: string;
    control: string;
    option: string;
    enter: string;
    delete: string;
    backspace: string;
    escape: string;
    tab: string;
    capslock: string;
    arrowup: string;
    arrowright: string;
    arrowdown: string;
    arrowleft: string;
    pageup: string;
    pagedown: string;
    home: string;
    end: string;
};
export type KbdKey = keyof typeof kbdKeysMap;
export type KbdKeySpecific = keyof KbdKeysSpecificMap;
export declare const useKbd: () => {
    macOS: import("vue").ComputedRef<false | "" | RegExpMatchArray | null>;
    getKbdKey: (value?: KbdKey | string) => string | undefined;
};
export {};
