import type { Messages } from '../types/locale'
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
    breadcrumb: {
      label: 'նավիգացիոն ուղի'
    },
    calendar: {
      label: 'Իրադարձության ամսաթիվ',
      monthPicker: 'Ամսի ընտրիչ',
      nextMonth: 'Հաջորդ ամիս',
      nextYear: 'Հաջորդ տարի',
      prevMonth: 'Նախորդ ամիս',
      prevYear: 'Նախորդ տարի',
      yearPicker: 'Տարվա ընտրիչ'
    },
    carousel: {
      dots: 'Ընտրեք ցուցադրելու սլայդը',
      goto: 'Անցնել {slide}-ին',
      next: 'Առաջ',
      prev: 'Հետ',
      roledescription: 'կարուսել',
      slide: 'սլայդ'
    },
    chatMessages: {
      autoScroll: 'Ոլորել ներքև'
    },
    chatPrompt: {
      placeholder: 'Շարունակել'
    },
    chatPromptSubmit: {
      label: 'Շարունակել',
      reload: 'Կրկին փորձել',
      stop: 'Դադարեցնել ստեղծումը'
    },
    chatReasoning: {
      thinking: 'Մտածում է…',
      thought: 'Մտածեց',
      thoughtFor: 'Մտածեց {duration}'
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
      search: 'Արդյունքներ',
      theme: 'Թեմա'
    },
    contentSearchButton: {
      label: 'Որոնել…'
    },
    contentToc: {
      title: 'Այս էջում'
    },
    dropdownMenu: {
      noMatch: 'Համընկնումներ չեն գտնվել',
      search: 'Որոնում…'
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
    drawer: {
      close: 'Փակել'
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
    inputDate: {
      day: 'օր',
      dayPeriod: 'AM/PM',
      era: 'դարաշրջան',
      hour: 'ժամ',
      minute: 'րոպե',
      month: 'ամիս',
      second: 'վայրկյան',
      timeZoneName: 'ժամային գոտի',
      year: 'տարի'
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
    inputRating: {
      rate: 'Գնահատել {value}՝ {length}-ից'
    },
    inputTime: {
      dayPeriod: 'AM/PM',
      hour: 'ժամ',
      minute: 'րոպե',
      second: 'վայրկյան',
      timeZoneName: 'ժամային գոտի'
    },
    listbox: {
      noData: 'Տվյալներ չկան',
      noMatch: 'Համընկնումներ չեն գտնվել',
      search: 'Որոնում…'
    },
    modal: {
      close: 'Փակել'
    },
    pagination: {
      first: 'Առաջին էջ',
      last: 'Վերջին էջ',
      next: 'Հաջորդ էջ',
      page: 'Էջ {page}',
      prev: 'Նախորդ էջ'
    },
    pinInput: {
      input: 'PIN կոդ, նիշ {index}՝ {length}-ից'
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
      },
      prompt: {
        copy: 'Պատճենել հարցումը',
        openIn: 'Բացել {name}-ում'
      }
    },
    sidebar: {
      close: 'Փակել',
      toggle: 'Փոխարկել'
    },
    selectMenu: {
      create: 'Ստեղծել "{label}"',
      noData: 'Տվյալներ չկան',
      noMatch: 'Համընկնումներ չեն գտնվել',
      search: 'Որոնում…'
    },
    skeleton: {
      label: 'բեռնում'
    },
    slideover: {
      close: 'Փակել'
    },
    slider: {
      max: 'Առավելագույն',
      min: 'Նվազագույն',
      thumb: 'Սահիչ',
      value: 'Արժեք {index}՝ {total}-ից'
    },
    table: {
      noData: 'Տվյալներ չկան'
    },
    toast: {
      close: 'Փակել'
    },
    toaster: {
      label: 'Ծանուցում',
      viewport: 'Ծանուցումներ ({hotkey})'
    }
  }
})
