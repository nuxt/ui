import type { Messages } from '../types'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'Urdu',
  code: 'ur',
  dir: 'rtl',
  messages: {
    inputMenu: {
      noMatch: 'کوئی ملتا جلتا ڈیٹا نہیں ملا',
      noData: 'کوئی ڈیٹا نہیں',
      create: '"{label}" بنائیں'
    },
    calendar: {
      prevYear: 'پچھلا سال',
      nextYear: 'اگلا سال',
      prevMonth: 'پچھلا مہینہ',
      nextMonth: 'اگلا مہینہ'
    },
    inputNumber: {
      increment: 'اضافہ',
      decrement: 'کمی'
    },
    commandPalette: {
      placeholder: 'کمانڈ ٹائپ کریں یا تلاش کریں...',
      noMatch: 'کوئی ملتا جلتا ڈیٹا نہیں ملا',
      noData: 'کوئی ڈیٹا نہیں',
      close: 'بند کریں',
      back: 'واپس'
    },
    selectMenu: {
      noMatch: 'کوئی ملتا جلتا ڈیٹا نہیں ملا',
      noData: 'کوئی ڈیٹا نہیں',
      create: '"{label}" بنائیں',
      search: 'تلاش کریں...'
    },
    toast: {
      close: 'بند کریں'
    },
    carousel: {
      prev: 'پچھلا',
      next: 'اگلا',
      goto: 'سلائیڈ {slide} پر جائیں'
    },
    modal: {
      close: 'بند کریں'
    },
    slideover: {
      close: 'بند کریں'
    },
    alert: {
      close: 'بند کریں'
    },
    table: {
      noData: 'کوئی ڈیٹا نہیں'
    }
  }
})
