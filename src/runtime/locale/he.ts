import type { Messages } from '../types'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'Hebrew',
  code: 'he',
  dir: 'rtl',
  messages: {
    inputMenu: {
      noMatch: 'אין התאמה',
      noData: 'אין נתונים',
      create: 'צור "{label}"'
    },
    calendar: {
      prevYear: 'שנה קודמת',
      nextYear: 'שנה הבאה',
      prevMonth: 'חודש קודם',
      nextMonth: 'חודש הבא'
    },
    inputNumber: {
      increment: 'הוסף',
      decrement: 'הפחת'
    },
    commandPalette: {
      placeholder: 'הקלד פקודה...',
      noMatch: 'לא נמצאה התאמה',
      noData: 'אין נתונים זמינים',
      close: 'סגור'
    },
    selectMenu: {
      noMatch: 'לא נמצאה התאמה',
      noData: 'אין נתונים',
      create: 'צור "{label}"',
      search: 'חפש...'
    },
    toast: { close: 'סגור' },
    carousel: {
      prev: 'הקודם',
      next: 'הבא',
      goto: 'מעבר ל {slide}'
    },
    modal: {
      close: 'סגור'
    },
    slideover: {
      close: 'סגור'
    },
    alert: {
      close: 'סגור'
    },
    table: {
      noData: 'אין נתונים להצגה'
    }
  }
})
