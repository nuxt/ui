import type { VNode } from 'vue';
import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/chat-prompt';
import type { TextareaProps, TextareaSlots } from '../types';
import type { ComponentConfig } from '../types/tv';
type ChatPrompt = ComponentConfig<typeof theme, AppConfig, 'chatPrompt'>;
export interface ChatPromptProps extends Pick<TextareaProps, 'rows' | 'autofocus' | 'autofocusDelay' | 'autoresize' | 'autoresizeDelay' | 'maxrows' | 'icon' | 'avatar' | 'loading' | 'loadingIcon' | 'disabled'> {
    /**
     * The element or component this component should render as.
     * @defaultValue 'form'
     */
    as?: any;
    /**
     * The placeholder text for the textarea.
     * @defaultValue t('chatPrompt.placeholder')
     */
    placeholder?: string;
    /**
     * @defaultValue 'outline'
     */
    variant?: ChatPrompt['variants']['variant'];
    error?: Error;
    class?: any;
    ui?: ChatPrompt['slots'] & TextareaProps['ui'];
}
export interface ChatPromptEmits {
    submit: [event: Event];
    close: [event: Event];
}
export interface ChatPromptSlots extends TextareaSlots {
    header?(props?: {}): VNode[];
    footer?(props?: {}): VNode[];
}
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: __VLS_WithSlots<import("vue").DefineComponent<ChatPromptProps & {
    modelValue?: string;
}, {
    textareaRef: Readonly<import("vue").Ref<HTMLTextAreaElement | null | undefined, HTMLTextAreaElement | null | undefined>>;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    close: (event: Event) => any;
    submit: (event: Event) => any;
    "update:modelValue": (value: string) => any;
}, string, import("vue").PublicProps, Readonly<ChatPromptProps & {
    modelValue?: string;
}> & Readonly<{
    onClose?: ((event: Event) => any) | undefined;
    onSubmit?: ((event: Event) => any) | undefined;
    "onUpdate:modelValue"?: ((value: string) => any) | undefined;
}>, {
    as: any;
    autofocus: boolean;
    rows: number;
    autoresize: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>, ChatPromptSlots>;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
