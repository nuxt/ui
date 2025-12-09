import type { Messages } from '../types'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'Հայերեն',
  code: 'hy',
  messages: {
    alert: {
      close: 'Փակել'
    },
    authForm: {
      hidePassword: 'Թաքցնել գաղտնաբառը',
      showPassword: 'Ցույց տալ գաղտնաբառը',
      submit: 'Շարունակել'
    },
    banner: {
      close: 'Փակել'
    },
    calendar: {
      nextMonth: 'Հաջորդ ամիս',
      nextYear: 'Հաջորդ տարի',
      prevMonth: 'Նախորդ ամիս',
      prevYear: 'Նախորդ տարի'
    },
    carousel: {
      dots: 'Ընտրեք ցուցադրելու սլայդը',
      goto: 'Անցնել {slide}-ին',
      next: 'Առաջ',
      prev: 'Հետ'
    },
    chatPrompt: {
      placeholder: 'Շարունակել'
    },
    chatPromptSubmit: {
      label: 'Շարունակել'
    },
    colorMode: {
      dark: 'Մուգ',
      light: 'Լուսավոր',
      switchToDark: 'Անցնել մուգ ռեժիմի',
      switchToLight: 'Անցնել լուսավոր ռեժիմի',
      system: 'Համակարգային'
    },
    commandPalette: {
      back: 'Հետ',
      close: 'Փակել',
      noData: 'Տվյալներ չկան',
      noMatch: 'Համընկնումներ չեն գտնվել',
      placeholder: 'Մուտքագրեք հրաման կամ որոնեք…'
    },
    contentSearch: {
      links: 'Հղումներ',
      theme: 'Թեմա'
    },
    contentSearchButton: {
      label: 'Որոնել…'
    },
    contentToc: {
      title: 'Այս էջում'
    },
    dashboardSearch: {
      theme: 'Թեմա'
    },
    dashboardSearchButton: {
      label: 'Որոնել…'
    },
    dashboardSidebarCollapse: {
      collapse: 'Կոլապսել կողային վահանակը',
      expand: 'Ընդլայնել կողային վահանակը'
    },
    dashboardSidebarToggle: {
      close: 'Փակել կողային վահանակը',
      open: 'Բացել կողային վահանակը'
    },
    error: {
      clear: 'Վերադառնալ գլխավոր էջ'
    },
    fileUpload: {
      removeFile: 'Ջնջել {filename}'
    },
    header: {
      close: 'Փակել ընտրացանկը',
      open: 'Բացել ընտրացանկը'
    },
    inputMenu: {
      create: 'Ստեղծել "{label}"',
      noData: 'Տվյալներ չկան',
      noMatch: 'Համընկնումներ չեն գտնվել'
    },
    inputNumber: {
      decrement: 'Պակասեցնել',
      increment: 'Ավելացնել'
    },
    modal: {
      close: 'Փակել'
    },
    pricingTable: {
      caption: 'Գնումների համեմատություն'
    },
    prose: {
      codeCollapse: {
        closeText: 'Կոլապսել',
        name: 'կոդ',
        openText: 'Ընդլայնել'
      },
      collapsible: {
        closeText: 'Թաքցնել',
        name: 'հատկություններ',
        openText: 'Ցույց տալ'
      },
      pre: {
        copy: 'Պատճենել կոդը սեղմատախտակին'
      }
    },
    selectMenu: {
      create: 'Ստեղծել "{label}"',
      noData: 'Տվյալներ չկան',
      noMatch: 'Համընկնումներ չեն գտնվել',
      search: 'Որոնում…'
    },
    slideover: {
      close: 'Փակել'
    },
    table: {
      noData: 'Տվյալներ չկան'
    },
    toast: {
      close: 'Փակել'
    }
  }
})
