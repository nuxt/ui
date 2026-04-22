import type { Ref, MaybeRef } from 'vue';
import type { Locale, Direction } from '../types/locale';
export type TranslatorOption = Record<string, string | number>;
export type Translator = (path: string, option?: TranslatorOption) => string;
export type LocaleContext<M> = {
    locale: Ref<Locale<M>>;
    lang: Ref<string>;
    dir: Ref<Direction>;
    code: Ref<string>;
    t: Translator;
};
export declare function buildTranslator<M>(locale: MaybeRef<Locale<M>>): Translator;
export declare function translate<M>(path: string, option: undefined | TranslatorOption, locale: Locale<M>): string;
export declare function buildLocaleContext<M>(locale: MaybeRef<Locale<M>>): LocaleContext<M>;
