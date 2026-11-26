import type { Messages } from '../types/locale'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'Српски',
  code: 'sr',
  messages: {
    alert: {
      close: 'Затвори'
    },
    authForm: {
      hidePassword: 'Сакриј лозинку',
      showPassword: 'Прикажи лозинку',
      submit: 'Настави'
    },
    banner: {
      close: 'Затвори'
    },
    breadcrumb: {
      label: 'навигациона путања'
    },
    calendar: {
      label: 'Датум догађаја',
      monthPicker: 'Избор месеца',
      nextMonth: 'Следећи месец',
      nextYear: 'Следећа година',
      prevMonth: 'Претходни месец',
      prevYear: 'Претходна година',
      yearPicker: 'Избор године'
    },
    carousel: {
      dots: 'Изабери слајд за приказ',
      goto: 'Иди на слајд {slide}',
      next: 'Следећи',
      prev: 'Претходни',
      roledescription: 'карусел',
      slide: 'слајд'
    },
    chatAttachment: {
      uploading: 'Отпремање',
      error: 'Отпремање није успело'
    },
    chatMessages: {
      autoScroll: 'Помери на дно',
      thinking: 'Размишљам…'
    },
    chatPrompt: {
      placeholder: 'Унеси поруку овде…',
      queue: 'Поруке на чекању',
      sendNow: 'Пошаљи одмах',
      edit: 'Измени',
      remove: 'Уклони'
    },
    chatPromptSubmit: {
      label: 'Пошаљи упит',
      reload: 'Покушај поново',
      stop: 'Заустави генерисање'
    },
    colorMode: {
      dark: 'Тамно',
      light: 'Светло',
      switchToDark: 'Пребаци на тамни режим',
      switchToLight: 'Пребаци на светли режим',
      system: 'Систем'
    },
    commandPalette: {
      back: 'Назад',
      close: 'Затвори',
      noData: 'Нема података',
      noMatch: 'Нема одговарајућих података',
      placeholder: 'Унеси команду или претражи…',
      results: 'Резултати'
    },
    contentSearch: {
      links: 'Линкови',
      search: 'Резултати',
      theme: 'Тема'
    },
    contentSearchButton: {
      label: 'Претражи…'
    },
    contentToc: {
      title: 'На овој страници'
    },
    dropdownMenu: {
      noMatch: 'Нема одговарајућих података',
      search: 'Претражи…'
    },
    dashboardSearch: {
      theme: 'Тема'
    },
    dashboardSearchButton: {
      label: 'Претражи…'
    },
    dashboardSidebarCollapse: {
      collapse: 'Скупи бочну траку',
      expand: 'Прошири бочну траку'
    },
    dashboardSidebarToggle: {
      close: 'Затвори бочну траку',
      open: 'Отвори бочну траку'
    },
    drawer: {
      close: 'Затвори'
    },
    editorEmojiMenu: {
      label: 'Емоџији'
    },
    editorMentionMenu: {
      label: 'Помињања'
    },
    editorSuggestionMenu: {
      label: 'Предлози'
    },
    error: {
      clear: 'Назад на почетну'
    },
    fileUpload: {
      removeFile: 'Уклони {filename}'
    },
    header: {
      close: 'Затвори мени',
      open: 'Отвори мени'
    },
    inputDate: {
      day: 'дан',
      dayPeriod: 'пре подне/по подне',
      era: 'ера',
      hour: 'сат',
      minute: 'минут',
      month: 'месец',
      second: 'секунд',
      timeZoneName: 'временска зона',
      year: 'година'
    },
    inputMenu: {
      create: 'Креирај "{label}"',
      noData: 'Нема података',
      noMatch: 'Нема одговарајућих података',
      trigger: 'Прикажи опције'
    },
    inputNumber: {
      decrement: 'Смањи',
      increment: 'Повећај',
      roledescription: 'нумеричко поље'
    },
    inputRating: {
      rate: 'Оцени {value} од {length}'
    },
    inputTime: {
      dayPeriod: 'пре подне/по подне',
      hour: 'сат',
      minute: 'минут',
      second: 'секунд',
      timeZoneName: 'временска зона'
    },
    listbox: {
      noData: 'Нема података',
      noMatch: 'Нема одговарајућих података',
      search: 'Претражи…'
    },
    modal: {
      close: 'Затвори'
    },
    pagination: {
      first: 'Прва страница',
      last: 'Последња страница',
      next: 'Следећа страница',
      page: 'Страница {page}',
      prev: 'Претходна страница'
    },
    pinInput: {
      input: 'ПИН поље {index} од {length}'
    },
    pricingTable: {
      caption: 'Поређење ценовних планова'
    },
    prose: {
      codeCollapse: {
        closeText: 'Скупи',
        label: '{text} {name}',
        name: 'код',
        openText: 'Прошири'
      },
      collapsible: {
        closeText: 'Сакриј',
        label: '{text} {name}',
        name: 'својства',
        openText: 'Прикажи'
      },
      pre: {
        copy: 'Копирај код у привремену меморију'
      },
      prompt: {
        copy: 'Копирај упит',
        openIn: 'Отвори у {name}'
      }
    },
    chatReasoning: {
      thinking: 'Размишљам…',
      thought: 'Размишљање',
      thoughtFor: 'Размишљање: {duration}'
    },
    sidebar: {
      close: 'Затвори',
      toggle: 'Прикажи/сакриј'
    },
    selectMenu: {
      create: 'Креирај "{label}"',
      noData: 'Нема података',
      noMatch: 'Нема одговарајућих података',
      search: 'Претражи…'
    },
    skeleton: {
      label: 'учитавање'
    },
    slideover: {
      close: 'Затвори'
    },
    slider: {
      max: 'Максимум',
      min: 'Минимум',
      thumb: 'Клизач',
      value: 'Вредност {index} од {total}'
    },
    stepper: {
      label: 'напредак'
    },
    table: {
      noData: 'Нема података'
    },
    toast: {
      close: 'Затвори'
    },
    toaster: {
      label: 'Обавештење',
      viewport: 'Обавештења ({hotkey})'
    }
  }
})
