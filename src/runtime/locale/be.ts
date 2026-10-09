import type { Messages } from '../types/locale'
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
    breadcrumb: {
      label: 'навігацыйны ланцужок'
    },
    calendar: {
      label: 'Дата падзеі',
      monthPicker: 'Выбар месяца',
      nextMonth: 'Наступны месяц',
      nextYear: 'Наступны год',
      prevMonth: 'Папярэдні месяц',
      prevYear: 'Папярэдні год',
      yearPicker: 'Выбар года'
    },
    carousel: {
      dots: 'Выберыце слайд для адлюстравання',
      goto: 'Перайсці да {slide}',
      next: 'Далей',
      prev: 'Назад',
      roledescription: 'карусель',
      slide: 'слайд'
    },
    chatMessages: {
      autoScroll: 'Пракруціць уніз'
    },
    chatPrompt: {
      placeholder: 'Увядзіце сваё паведамленне тут…'
    },
    chatPromptSubmit: {
      label: 'Адправіць',
      reload: 'Паўтарыць',
      stop: 'Спыніць генерацыю'
    },
    chatReasoning: {
      thinking: 'Думае…',
      thought: 'Падумаў',
      thoughtFor: 'Думаў {duration}'
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
      search: 'Вынікі',
      theme: 'Тэма'
    },
    contentSearchButton: {
      label: 'Пошук…'
    },
    contentToc: {
      title: 'На гэтай старонцы'
    },
    dropdownMenu: {
      noMatch: 'Супадзенняў не знойдзена',
      search: 'Пошук…'
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
    drawer: {
      close: 'Закрыць'
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
    inputDate: {
      day: 'дзень',
      dayPeriod: 'AM/PM',
      era: 'эра',
      hour: 'гадзіна',
      minute: 'хвіліна',
      month: 'месяц',
      second: 'секунда',
      timeZoneName: 'часавы пояс',
      year: 'год'
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
    inputRating: {
      rate: 'Ацаніць на {value} з {length}'
    },
    inputTime: {
      dayPeriod: 'AM/PM',
      hour: 'гадзіна',
      minute: 'хвіліна',
      second: 'секунда',
      timeZoneName: 'часавы пояс'
    },
    listbox: {
      noData: 'Няма даных',
      noMatch: 'Супадзенняў не знойдзена',
      search: 'Пошук…'
    },
    modal: {
      close: 'Закрыць'
    },
    pagination: {
      first: 'Першая старонка',
      last: 'Апошняя старонка',
      next: 'Наступная старонка',
      page: 'Старонка {page}',
      prev: 'Папярэдняя старонка'
    },
    pinInput: {
      input: 'PIN-код, сімвал {index} з {length}'
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
      },
      prompt: {
        copy: 'Скапіяваць запыт',
        openIn: 'Адкрыць у {name}'
      }
    },
    sidebar: {
      close: 'Закрыць',
      toggle: 'Пераключыць'
    },
    selectMenu: {
      create: 'Стварыць "{label}"',
      noData: 'Няма даных',
      noMatch: 'Супадзенняў не знойдзена',
      search: 'Пошук…'
    },
    skeleton: {
      label: 'загрузка'
    },
    slideover: {
      close: 'Закрыць'
    },
    slider: {
      max: 'Максімум',
      min: 'Мінімум',
      thumb: 'Паўзунок',
      value: 'Значэнне {index} з {total}'
    },
    table: {
      noData: 'Няма даных'
    },
    toast: {
      close: 'Закрыць'
    },
    toaster: {
      label: 'Апавяшчэнне',
      viewport: 'Апавяшчэнні ({hotkey})'
    }
  }
})
