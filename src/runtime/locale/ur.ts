import type { Messages } from '../types/locale'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'اردو',
  code: 'ur',
  dir: 'rtl',
  messages: {
    alert: {
      close: 'بند کریں'
    },
    authForm: {
      hidePassword: 'پاس ورڈ چھپائیں',
      showPassword: 'پاس ورڈ دکھائیں',
      submit: 'جاری رکھیں'
    },
    banner: {
      close: 'بند کریں'
    },
    breadcrumb: {
      label: 'نیویگیشن کا راستہ'
    },
    calendar: {
      label: 'تقریب کی تاریخ',
      monthPicker: 'مہینے کا انتخاب',
      nextMonth: 'اگلا مہینہ',
      nextYear: 'اگلا سال',
      prevMonth: 'پچھلا مہینہ',
      prevYear: 'پچھلا سال',
      yearPicker: 'سال کا انتخاب'
    },
    carousel: {
      dots: 'دکھانے کے لیے سلائیڈ منتخب کریں',
      goto: 'سلائیڈ {slide} پر جائیں',
      next: 'اگلا',
      prev: 'پچھلا',
      roledescription: 'کیروسل',
      slide: 'سلائیڈ'
    },
    chatMessages: {
      autoScroll: 'نیچے سکرول کریں'
    },
    chatPrompt: {
      placeholder: 'یہاں اپنا پیغام لکھیں'
    },
    chatPromptSubmit: {
      label: 'پیغام بھیجیں',
      reload: 'دوبارہ کوشش کریں',
      stop: 'تخلیق روکیں'
    },
    chatReasoning: {
      thinking: 'سوچ رہا ہے…',
      thought: 'سوچا',
      thoughtFor: '{duration} سوچا'
    },
    colorMode: {
      dark: 'تاریک',
      light: 'روشن',
      switchToDark: 'تاریک موڈ میں تبدیل کریں',
      switchToLight: 'روشن موڈ میں تبدیل کریں',
      system: 'سسٹم'
    },
    commandPalette: {
      back: 'واپس',
      close: 'بند کریں',
      noData: 'کوئی ڈیٹا نہیں',
      noMatch: 'کوئی ملتا جلتا ڈیٹا نہیں ملا',
      placeholder: 'کمانڈ ٹائپ کریں یا تلاش کریں…'
    },
    contentSearch: {
      links: 'لنکس',
      search: 'نتائج',
      theme: 'تھیم'
    },
    contentSearchButton: {
      label: 'تلاش کریں…'
    },
    contentToc: {
      title: 'اس صفحے پر'
    },
    dropdownMenu: {
      noMatch: 'کوئی ملتا جلتا ڈیٹا نہیں ملا',
      search: 'تلاش کریں…'
    },
    dashboardSearch: {
      theme: 'تھیم'
    },
    dashboardSearchButton: {
      label: 'تلاش کریں…'
    },
    dashboardSidebarCollapse: {
      collapse: 'سائیڈ بار کو سکیڑیں',
      expand: 'سائیڈ بار کو پھیلائیں'
    },
    dashboardSidebarToggle: {
      close: 'سائیڈ بار بند کریں',
      open: 'سائیڈ بار کھولیں'
    },
    drawer: {
      close: 'بند کریں'
    },
    error: {
      clear: 'ہوم پیج پر واپس جائیں'
    },
    fileUpload: {
      removeFile: '{filename} ہٹائیں'
    },
    header: {
      close: 'مینو بند کریں',
      open: 'مینو کھولیں'
    },
    inputDate: {
      day: 'دن',
      dayPeriod: 'AM/PM',
      era: 'دور',
      hour: 'گھنٹہ',
      minute: 'منٹ',
      month: 'مہینہ',
      second: 'سیکنڈ',
      timeZoneName: 'ٹائم زون',
      year: 'سال'
    },
    inputMenu: {
      create: '"{label}" بنائیں',
      noData: 'کوئی ڈیٹا نہیں',
      noMatch: 'کوئی ملتا جلتا ڈیٹا نہیں ملا'
    },
    inputNumber: {
      decrement: 'کمی',
      increment: 'اضافہ'
    },
    inputRating: {
      rate: '{length} میں سے {value} کی درجہ بندی کریں'
    },
    inputTime: {
      dayPeriod: 'AM/PM',
      hour: 'گھنٹہ',
      minute: 'منٹ',
      second: 'سیکنڈ',
      timeZoneName: 'ٹائم زون'
    },
    listbox: {
      noData: 'کوئی ڈیٹا نہیں',
      noMatch: 'کوئی ملتا جلتا ڈیٹا نہیں ملا',
      search: 'تلاش کریں…'
    },
    modal: {
      close: 'بند کریں'
    },
    pagination: {
      first: 'پہلا صفحہ',
      last: 'آخری صفحہ',
      next: 'اگلا صفحہ',
      page: 'صفحہ {page}',
      prev: 'پچھلا صفحہ'
    },
    pinInput: {
      input: 'PIN کوڈ، {length} میں سے حرف {index}'
    },
    pricingTable: {
      caption: 'قیمت پلنز کی مقایسہ'
    },
    prose: {
      codeCollapse: {
        closeText: 'سکیڑیں',
        name: 'کوڈ',
        openText: 'پھیلائیں'
      },
      collapsible: {
        closeText: 'چھپائیں',
        name: 'خصوصیات',
        openText: 'دکھائیں'
      },
      pre: {
        copy: 'کوڈ کاپی کریں'
      },
      prompt: {
        copy: 'پرامپٹ کاپی کریں',
        openIn: '{name} میں کھولیں'
      }
    },
    sidebar: {
      close: 'بند کریں',
      toggle: 'ٹوگل کریں'
    },
    selectMenu: {
      create: '"{label}" بنائیں',
      noData: 'کوئی ڈیٹا نہیں',
      noMatch: 'کوئی ملتا جلتا ڈیٹا نہیں ملا',
      search: 'تلاش کریں…'
    },
    skeleton: {
      label: 'لوڈ ہو رہا ہے'
    },
    slideover: {
      close: 'بند کریں'
    },
    slider: {
      max: 'زیادہ سے زیادہ',
      min: 'کم سے کم',
      thumb: 'ہینڈل',
      value: '{total} میں سے قدر {index}'
    },
    table: {
      noData: 'کوئی ڈیٹا نہیں'
    },
    toast: {
      close: 'بند کریں'
    },
    toaster: {
      label: 'اطلاع',
      viewport: 'اطلاعات ({hotkey})'
    }
  }
})
