import type { Messages } from '../types'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'Urdu',
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
    calendar: {
      nextMonth: 'اگلا مہینہ',
      nextYear: 'اگلا سال',
      prevMonth: 'پچھلا مہینہ',
      prevYear: 'پچھلا سال'
    },
    carousel: {
      dots: 'دکھانے کے لیے سلائیڈ منتخب کریں',
      goto: 'سلائیڈ {slide} پر جائیں',
      next: 'اگلا',
      prev: 'پچھلا'
    },
    chatPrompt: {
      placeholder: 'یہاں اپنا پیغام لکھیں'
    },
    chatPromptSubmit: {
      label: 'پیغام بھیجیں'
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
      theme: 'تھیم'
    },
    contentSearchButton: {
      label: 'تلاش کریں…'
    },
    contentToc: {
      title: 'اس صفحے پر'
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
    inputMenu: {
      create: '"{label}" بنائیں',
      noData: 'کوئی ڈیٹا نہیں',
      noMatch: 'کوئی ملتا جلتا ڈیٹا نہیں ملا'
    },
    inputNumber: {
      decrement: 'کمی',
      increment: 'اضافہ'
    },
    modal: {
      close: 'بند کریں'
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
      }
    },
    selectMenu: {
      create: '"{label}" بنائیں',
      noData: 'کوئی ڈیٹا نہیں',
      noMatch: 'کوئی ملتا جلتا ڈیٹا نہیں ملا',
      search: 'تلاش کریں…'
    },
    slideover: {
      close: 'بند کریں'
    },
    table: {
      noData: 'کوئی ڈیٹا نہیں'
    },
    toast: {
      close: 'بند کریں'
    }
  }
})
