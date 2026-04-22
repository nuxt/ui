import type { VNode } from 'vue';
import type { AppConfig } from '@nuxt/schema';
import type { UseFileDialogReturn } from '@vueuse/core';
import theme from '#build/ui/file-upload';
import type { ButtonProps, IconProps, LinkPropsKeys } from '../types';
import type { InputHTMLAttributes } from '../types/html';
import type { ComponentConfig } from '../types/tv';
type FileUpload = ComponentConfig<typeof theme, AppConfig, 'fileUpload'>;
export interface FileUploadProps<M extends boolean = false> extends /** @vue-ignore */ Pick<InputHTMLAttributes, 'form' | 'formaction' | 'formenctype' | 'formmethod' | 'formnovalidate' | 'formtarget'> {
    /**
     * The element or component this component should render as.
     * @defaultValue 'div'
     */
    as?: any;
    id?: string;
    name?: string;
    /**
     * The icon to display.
     * @defaultValue appConfig.ui.icons.upload
     * @IconifyIcon
     */
    icon?: IconProps['name'];
    label?: string;
    description?: string;
    /**
     * @defaultValue 'primary'
     */
    color?: FileUpload['variants']['color'];
    /**
     * The `button` variant is only available when `multiple` is `false`.
     * @defaultValue 'area'
     */
    variant?: FileUpload['variants']['variant'];
    /**
     * @defaultValue 'md'
     */
    size?: FileUpload['variants']['size'];
    /**
     * The layout of how files are displayed.
     * Only works when `variant` is `area`.
     * @defaultValue 'list'
     */
    layout?: FileUpload['variants']['layout'];
    /**
     * The position of the files.
     * Only works when `variant` is `area` and when `layout` is `list`.
     * @defaultValue 'outside'
     */
    position?: FileUpload['variants']['position'];
    /** Highlight the ring color like a focus state. */
    highlight?: boolean;
    /**
     * Specifies the allowed file types for the input. Provide a comma-separated list of MIME types or file extensions (e.g., "image/png,application/pdf,.jpg").
     * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/accept
     * @defaultValue '*'
     */
    accept?: string;
    multiple?: M & boolean;
    /**
     * Reset the file input when the dialog is opened.
     * @defaultValue false
     */
    reset?: boolean;
    /**
     * Create a zone that allows the user to drop files onto it.
     * @defaultValue true
     */
    dropzone?: boolean;
    /**
     * Make the dropzone interactive when the user is clicking on it.
     * @defaultValue true
     */
    interactive?: boolean;
    required?: boolean;
    disabled?: boolean;
    /**
     * The icon to display for the file.
     * @defaultValue appConfig.ui.icons.file
     * @IconifyIcon
     */
    fileIcon?: IconProps['name'];
    /**
     * Preview the file (currently only `<img>` is rendered)
     * When set false, only `fileIcon` is displayed
     * @defaultValue true
     */
    fileImage?: boolean;
    /**
     * Configure the delete button for the file.
     * When `layout` is `grid`, the default is `{ color: 'neutral', variant: 'solid', size: 'xs' }`{lang="ts-type"}
     * When `layout` is `list`, the default is `{ color: 'neutral', variant: 'link' }`{lang="ts-type"}
     */
    fileDelete?: boolean | Omit<ButtonProps, LinkPropsKeys>;
    /**
     * The icon displayed to delete a file.
     * @defaultValue appConfig.ui.icons.close
     * @IconifyIcon
     */
    fileDeleteIcon?: IconProps['name'];
    /**
     * Show the file preview/list after upload.
     * @defaultValue true
     */
    preview?: boolean;
    class?: any;
    ui?: FileUpload['slots'];
}
export interface FileUploadEmits {
    change: [event: Event];
}
type FileUploadFiles<M> = (M extends true ? File[] : File) | null;
export interface FileUploadSlots<M extends boolean = false> {
    'default'?(props: {
        open: UseFileDialogReturn['open'];
        removeFile: (index?: number) => void;
        ui: FileUpload['ui'];
    }): VNode[];
    'leading'?(props: {
        ui: FileUpload['ui'];
    }): VNode[];
    'label'?(props?: {}): VNode[];
    'description'?(props?: {}): VNode[];
    'actions'?(props: {
        files: FileUploadFiles<M> | undefined;
        open: UseFileDialogReturn['open'];
        removeFile: (index?: number) => void;
    }): VNode[];
    'files'?(props: {
        files: FileUploadFiles<M>;
    }): VNode[];
    'files-top'?(props: {
        files: FileUploadFiles<M>;
        open: UseFileDialogReturn['open'];
        removeFile: (index?: number) => void;
    }): VNode[];
    'files-bottom'?(props: {
        files: FileUploadFiles<M>;
        open: UseFileDialogReturn['open'];
        removeFile: (index?: number) => void;
    }): VNode[];
    'file'?(props: {
        file: File;
        index: number;
    }): VNode[];
    'file-leading'?(props: {
        file: File;
        index: number;
        ui: FileUpload['ui'];
    }): VNode[];
    'file-name'?(props: {
        file: File;
        index: number;
    }): VNode[];
    'file-size'?(props: {
        file: File;
        index: number;
    }): VNode[];
    'file-trailing'?(props: {
        file: File;
        index: number;
        ui: FileUpload['ui'];
    }): VNode[];
}
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: <M extends boolean = false>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_exposed?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: import("vue").PublicProps & __VLS_PrettifyLocal<(FileUploadProps<M> & {
        modelValue?: (M extends true ? File[] : File) | null;
    }) & {
        onChange?: ((event: Event) => any) | undefined;
        "onUpdate:modelValue"?: ((value: (M extends true ? File[] : File) | null | undefined) => any) | undefined;
    }> & (typeof globalThis extends {
        __VLS_PROPS_FALLBACK: infer P;
    } ? P : {});
    expose: (exposed: import("vue").ShallowUnwrapRef<{
        inputRef: Readonly<import("vue").Ref<HTMLInputElement, HTMLInputElement>>;
        dropzoneRef: import("vue").Ref<HTMLDivElement | undefined, HTMLDivElement | undefined>;
    }>) => void;
    attrs: any;
    slots: FileUploadSlots<M>;
    emit: ((evt: "change", event: Event) => void) & ((event: "update:modelValue", value: (M extends true ? File[] : File) | null | undefined) => void);
}>) => import("vue").VNode & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
type __VLS_PrettifyLocal<T> = (T extends any ? {
    [K in keyof T]: T[K];
} : {
    [K in keyof T as K]: T[K];
}) & {};
