import type { Messages } from '../types'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'Беларуская',
  code: 'be',
  messages: {
    alert: {
      close: 'Закрыць'
    },
    authForm: {
      hidePassword: 'Схаваць пароль',
      showPassword: 'Паказаць пароль',
      submit: 'Працягнуць'
    },
    calendar: {
      cancel: 'Скасаваць',
      ok: 'ОК',
      today: 'Сёння'
    },
    commandPalette: {
      placeholder: 'Увядзіце каманду або пошук…'
    },
    dropdown: {
      select: 'Выбраць'
    },
    empty: {
      noData: 'Няма даных'
    },
    input: {
      clear: 'Ачысціць'
    },
    modal: {
      close: 'Закрыць'
    },
    pagination: {
      next: 'Далей',
      prev: 'Назад'
    },
    select: {
      noMatch: 'Супадзенняў не знойдзена',
      search: 'Пошук…'
    },
    slideover: {
      close: 'Закрыць'
    },
    table: {
      noData: 'Няма даных'
    },
    toast: {
      close: 'Закрыць'
    }
  }
})
