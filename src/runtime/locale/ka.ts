import type { Messages } from '../types'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'ქართული',
  code: 'ka',
  messages: {
    alert: {
      close: 'დახურვა'
    },
    authForm: {
      hidePassword: 'პაროლის დამალვა',
      showPassword: 'პაროლის ჩვენება',
      submit: 'გაგრძელება'
    },
    banner: {
      close: 'დახურვა'
    },
    calendar: {
      nextMonth: 'შემდეგი თვე',
      nextYear: 'შემდეგი წელი',
      prevMonth: 'წინა თვე',
      prevYear: 'წინა წელი'
    },
    carousel: {
      dots: 'აირჩიეთ სლაიდი საჩვენებლად',
      goto: 'გადასვლა სლაიდ {slide}-ზე',
      next: 'შემდეგი',
      prev: 'წინა'
    },
    chatPrompt: {
      placeholder: 'დაწერეთ თქვენი მესიჯი აქ…'
    },
    chatPromptSubmit: {
      label: 'შეტყობინების გაგზავნა'
    },
    colorMode: {
      dark: 'ბნელი',
      light: 'ნათელი',
      switchToDark: 'ბნელ რეჯიმზე გადასვლა',
      switchToLight: 'ნათელ რეჯიმზე გადასვლა',
      system: 'სისტემური'
    },
    commandPalette: {
      back: 'უკან',
      close: 'დახურვა',
      noData: 'მონაცემები არ არის',
      noMatch: 'შესატყვისი მონაცემები არ არის',
      placeholder: 'ჩაწერეთ ბრძანება ან ძიება…'
    },
    contentSearch: {
      links: 'ბმულები',
      theme: 'თემა'
    },
    contentSearchButton: {
      label: 'ძიება…'
    },
    contentToc: {
      title: 'ამ გვერდზე'
    },
    dashboardSearch: {
      theme: 'თემა'
    },
    dashboardSearchButton: {
      label: 'ძიება…'
    },
    dashboardSidebarCollapse: {
      collapse: 'გვერდითი ზოლის ჩაკეცვა',
      expand: 'გვერდითი ზოლის გაშლა'
    },
    dashboardSidebarToggle: {
      close: 'გვერდითი ზოლის დახურვა',
      open: 'გვერდითი ზოლის გახსნა'
    },
    error: {
      // While "home" translates as "სახლი", I chose to use "მთავარი" (meaning "main") as contextually this sounds better.
      // If any Georgian prefers literal translation, please submit patch.
      clear: 'მთავარზე დაბრუნება'
    },
    fileUpload: {
      removeFile: 'მოაშორე {filename}'
    },
    header: {
      close: 'მენიუს დახურვა',
      open: 'მენიუს გახსნა'
    },
    inputMenu: {
      create: 'შექმენი "{label}"',
      noData: 'მონაცემები არ არის',
      noMatch: 'შესატყვისი მონაცემები არ არის'
    },
    inputNumber: {
      decrement: 'დაკლება',
      increment: 'დამატება'
    },
    modal: {
      close: 'დახურვა'
    },
    pricingTable: {
      caption: 'ფასის გეგმების შედარება'
    },
    prose: {
      codeCollapse: {
        closeText: 'ჩაკეცვა',
        name: 'კოდი',
        openText: 'გაშლა'
      },
      collapsible: {
        closeText: 'დახურვა',
        name: 'თვისებები',
        openText: 'ჩვენება'
      },
      pre: {
        copy: 'კოდის კოპირება ბუფერში'
      }
    },
    selectMenu: {
      create: 'დაამატე "{label}"', // "Create" translates as "შექმნა", but since we are simply adding new choice, creating sounds wrong, thus I chose to use "დაამატე", meaning "add".
      noData: 'მონაცემები არ არის',
      noMatch: 'შესატყვისი მონაცემები არ არის',
      search: 'ძიება…'
    },
    slideover: {
      close: 'დახურვა'
    },
    table: {
      noData: 'მონაცემები არ არის'
    },
    toast: {
      close: 'დახურვა'
    }
  }
})
