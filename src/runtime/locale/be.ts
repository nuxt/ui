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
    banner: {
      close: 'Закрыць'
    },
    calendar: {
      nextMonth: 'Наступны месяц',
      nextYear: 'Наступны год',
      prevMonth: 'Папярэдні месяц',
      prevYear: 'Папярэдні год'
    },
    carousel: {
      dots: 'Выберыце слайд для адлюстравання',
      goto: 'Перайсці да {slide}',
      next: 'Далей',
      prev: 'Назад'
    },
    chatPrompt: {
      placeholder: 'Увядзіце сваё паведамленне тут…'
    },
    chatPromptSubmit: {
      label: 'Адправіць'
    },
    colorMode: {
      dark: 'Цёмная',
      light: 'Светлая',
      switchToDark: 'Пераключыцца на цёмны рэжым',
      switchToLight: 'Пераключыцца на светлы рэжым',
      system: 'Сістэмная'
    },
    commandPalette: {
      back: 'Назад',
      close: 'Закрыць',
      noData: 'Няма даных',
      noMatch: 'Супадзенняў не знойдзена',
      placeholder: 'Увядзіце каманду або выканайце пошук…'
    },
    contentSearch: {
      links: 'Спасылкі',
      theme: 'Тэма'
    },
    contentSearchButton: {
      label: 'Пошук…'
    },
    contentToc: {
      title: 'На гэтай старонцы'
    },
    dashboardSearch: {
      theme: 'Тэма'
    },
    dashboardSearchButton: {
      label: 'Пошук…'
    },
    dashboardSidebarCollapse: {
      collapse: 'Згарнуць бакавую панэль',
      expand: 'Разгарнуць бакавую панэль'
    },
    dashboardSidebarToggle: {
      close: 'Закрыць бакавую панэль',
      open: 'Адкрыць бакавую панэль'
    },
    error: {
      clear: 'Вярнуцца на галоўную'
    },
    fileUpload: {
      removeFile: 'Выдаліць {filename}'
    },
    header: {
      close: 'Закрыць меню',
      open: 'Адкрыць меню'
    },
    inputMenu: {
      create: 'Стварыць "{label}"',
      noData: 'Няма даных',
      noMatch: 'Супадзенняў не знойдзена'
    },
    inputNumber: {
      decrement: 'Паменшыць',
      increment: 'Павялічыць'
    },
    modal: {
      close: 'Закрыць'
    },
    pricingTable: {
      caption: 'Параўнанне платных планаў'
    },
    prose: {
      codeCollapse: {
        closeText: 'Згарнуць',
        name: 'код',
        openText: 'Разгарнуць'
      },
      collapsible: {
        closeText: 'Схаваць',
        name: 'уласцівасці',
        openText: 'Паказаць'
      },
      pre: {
        copy: 'Скапіяваць код у буфер абмену'
      }
    },
    selectMenu: {
      create: 'Стварыць "{label}"',
      noData: 'Няма даных',
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
