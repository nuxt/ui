import type { Locale, Direction } from '../types/locale';
import type { DeepPartial } from '../types/utils';
interface DefineLocaleOptions<M> {
    name: string;
    code: string;
    dir?: Direction;
    messages: M;
}
export declare function defineLocale<M>(options: DefineLocaleOptions<M>): Locale<M>;
export declare function extendLocale<M>(locale: Locale<M>, options: Partial<DefineLocaleOptions<DeepPartial<M>>>): Locale<M>;
export {};
