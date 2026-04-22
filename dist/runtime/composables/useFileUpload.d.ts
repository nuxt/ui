import type { ComponentPublicInstance, MaybeRef } from 'vue';
export interface UseFileUploadOptions {
    /**
     * Specifies the allowed file types. Provide a comma-separated list of MIME types or file extensions.
     * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/accept
     * @defaultValue '*'
     */
    accept?: MaybeRef<string>;
    reset?: MaybeRef<boolean>;
    multiple?: MaybeRef<boolean>;
    dropzone?: boolean;
    onUpdate: (files: File[]) => void;
}
export declare function useFileUpload(options: UseFileUploadOptions): {
    isDragging: import("vue").Ref<boolean, boolean>;
    open: () => void;
    inputRef: import("vue").Ref<ComponentPublicInstance | undefined, ComponentPublicInstance | undefined>;
    dropzoneRef: import("vue").Ref<HTMLDivElement | undefined, HTMLDivElement | undefined>;
};
