/**
 * Prevents Enter-to-submit from firing during IME composition.
 *
 * Handles the Safari quirk where `compositionend` fires before `keydown`,
 * making `event.isComposing` unreliable (https://bugs.webkit.org/show_bug.cgi?id=165004).
 */
export declare function useIMEGuard(callback: (event: KeyboardEvent) => void): {
    onKeydown: (event: KeyboardEvent) => void;
    onCompositionEnd: () => void;
};
