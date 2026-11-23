import type { Messages } from '../types/locale'
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
    breadcrumb: {
      label: 'ნავიგაციის ბილიკი'
    },
    calendar: {
      label: 'მოვლენის თარიღი',
      monthPicker: 'თვის ამრჩევი',
      nextMonth: 'შემდეგი თვე',
      nextYear: 'შემდეგი წელი',
      prevMonth: 'წინა თვე',
      prevYear: 'წინა წელი',
      yearPicker: 'წლის ამრჩევი'
    },
    carousel: {
      dots: 'აირჩიეთ სლაიდი საჩვენებლად',
      goto: 'გადასვლა სლაიდ {slide}-ზე',
      next: 'შემდეგი',
      prev: 'წინა',
      roledescription: 'კარუსელი',
      slide: 'სლაიდი'
    },
    chatAttachment: {
      uploading: 'იტვირთება',
      error: 'ატვირთვა ვერ მოხერხდა'
    },
    chatMessages: {
      autoScroll: 'ქვემოთ გადახვევა'
    },
    chatPrompt: {
      placeholder: 'დაწერეთ თქვენი შეტყობინება აქ…',
      queue: 'რიგში მყოფი შეტყობინებები',
      sendNow: 'ახლავე გაგზავნა',
      edit: 'რედაქტირება',
      remove: 'წაშლა'
    },
    chatPromptSubmit: {
      label: 'შეტყობინების გაგზავნა',
      reload: 'ხელახლა ცდა',
      stop: 'გენერირების შეჩერება'
    },
    chatReasoning: {
      thinking: 'ფიქრობს…',
      thought: 'იფიქრა',
      thoughtFor: '{duration} ფიქრობდა'
    },
    colorMode: {
      dark: 'ბნელი',
      light: 'ნათელი',
      switchToDark: 'ბნელ რეჟიმზე გადასვლა',
      switchToLight: 'ნათელ რეჟიმზე გადასვლა',
      system: 'სისტემური'
    },
    commandPalette: {
      back: 'უკან',
      close: 'დახურვა',
      noData: 'მონაცემები არ არის',
      noMatch: 'შესატყვისი მონაცემები არ არის',
      placeholder: 'ჩაწერეთ ბრძანება ან მოძებნეთ…',
      results: 'შედეგები'
    },
    contentSearch: {
      links: 'ბმულები',
      search: 'შედეგები',
      theme: 'თემა'
    },
    contentSearchButton: {
      label: 'ძიება…'
    },
    contentToc: {
      title: 'ამ გვერდზე'
    },
    dropdownMenu: {
      noMatch: 'შესატყვისი მონაცემები არ არის',
      search: 'ძიება…'
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
    drawer: {
      close: 'დახურვა'
    },
    editorEmojiMenu: {
      label: 'ემოჯები'
    },
    editorMentionMenu: {
      label: 'მოხსენიებები'
    },
    editorSuggestionMenu: {
      label: 'შემოთავაზებები'
    },
    error: {
      // While "home" translates as "სახლი", I chose to use "მთავარი" (meaning "main") as contextually this sounds better.
      // If any Georgian prefers literal translation, please submit patch.
      clear: 'მთავარზე დაბრუნება'
    },
    fileUpload: {
      removeFile: '{filename}-ის წაშლა'
    },
    header: {
      close: 'მენიუს დახურვა',
      open: 'მენიუს გახსნა'
    },
    inputDate: {
      day: 'დღე',
      dayPeriod: 'AM/PM',
      era: 'ეპოქა',
      hour: 'საათი',
      minute: 'წუთი',
      month: 'თვე',
      second: 'წამი',
      timeZoneName: 'სასაათო სარტყელი',
      year: 'წელი'
    },
    inputMenu: {
      create: 'დაამატე "{label}"',
      noData: 'მონაცემები არ არის',
      noMatch: 'შესატყვისი მონაცემები არ არის',
      trigger: 'ვარიანტების ჩვენება'
    },
    inputNumber: {
      decrement: 'დაკლება',
      increment: 'დამატება',
      roledescription: 'რიცხვითი ველი'
    },
    inputRating: {
      rate: 'შეფასება {value} {length}-დან'
    },
    inputTime: {
      dayPeriod: 'AM/PM',
      hour: 'საათი',
      minute: 'წუთი',
      second: 'წამი',
      timeZoneName: 'სასაათო სარტყელი'
    },
    listbox: {
      noData: 'მონაცემები არ არის',
      noMatch: 'შესატყვისი მონაცემები არ არის',
      search: 'ძიება…'
    },
    modal: {
      close: 'დახურვა'
    },
    pagination: {
      first: 'პირველი გვერდი',
      last: 'ბოლო გვერდი',
      next: 'შემდეგი გვერდი',
      page: 'გვერდი {page}',
      prev: 'წინა გვერდი'
    },
    pinInput: {
      input: 'PIN კოდი, სიმბოლო {index} {length}-დან'
    },
    pricingTable: {
      caption: 'ფასის გეგმების შედარება'
    },
    prose: {
      codeCollapse: {
        closeText: 'ჩაკეცვა',
        label: '{name} {text}',
        name: 'კოდის',
        openText: 'გაშლა'
      },
      collapsible: {
        closeText: 'დამალვა',
        label: '{name} {text}',
        name: 'თვისებების',
        openText: 'ჩვენება'
      },
      pre: {
        copy: 'კოდის კოპირება ბუფერში'
      },
      prompt: {
        copy: 'მოთხოვნის კოპირება',
        openIn: 'გახსნა {name}-ში'
      }
    },
    sidebar: {
      close: 'დახურვა',
      toggle: 'გადართვა'
    },
    selection: {
      summary: 'არჩეულია: {count}'
    },
    selectMenu: {
      create: 'დაამატე "{label}"', // "Create" translates as "შექმნა", but since we are simply adding new choice, creating sounds wrong, thus I chose to use "დაამატე", meaning "add".
      noData: 'მონაცემები არ არის',
      noMatch: 'შესატყვისი მონაცემები არ არის',
      search: 'ძიება…'
    },
    skeleton: {
      label: 'იტვირთება'
    },
    slideover: {
      close: 'დახურვა'
    },
    slider: {
      max: 'მაქსიმუმი',
      min: 'მინიმუმი',
      thumb: 'სახელური',
      value: 'მნიშვნელობა {index} {total}-დან'
    },
    stepper: {
      label: 'პროგრესი'
    },
    table: {
      noData: 'მონაცემები არ არის'
    },
    toast: {
      close: 'დახურვა'
    },
    toaster: {
      label: 'შეტყობინება',
      viewport: 'შეტყობინებები ({hotkey})'
    }
  }
})
