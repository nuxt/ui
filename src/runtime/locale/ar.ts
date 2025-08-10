import type { Messages } from '../types'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'العربية',
  code: 'ar',
  dir: 'rtl',
  messages: {
    inputMenu: {
      noMatch: 'لا توجد نتائج مطابقة',
      noData: 'لا توجد بيانات',
      create: 'إنشاء "{label}"'
    },
    calendar: {
      prevYear: 'السنة السابقة',
      nextYear: 'السنة المقبلة',
      prevMonth: 'الشهر السابق',
      nextMonth: 'الشهر المقبل'
    },
    inputNumber: {
      increment: 'زيادة',
      decrement: 'تقليل'
    },
    commandPalette: {
      placeholder: 'اكتب أمرًا أو ابحث...',
      noMatch: 'لا توجد نتائج مطابقة',
      noData: 'لا توجد بيانات',
      close: 'إغلاق',
      back: 'رجوع'
    },
    selectMenu: {
      noMatch: 'لا توجد نتائج مطابقة',
      noData: 'لا توجد بيانات',
      create: 'إنشاء "{label}"',
      search: 'بحث...'
    },
    toast: {
      close: 'إغلاق'
    },
    carousel: {
      prev: 'السابق',
      next: 'التالي',
      dots: 'اختر الشريحة المراد عرضها',
      goto: 'الذهاب إلى شريحة {slide}'
    },
    modal: {
      close: 'إغلاق'
    },
    slideover: {
      close: 'إغلاق'
    },
    alert: {
      close: 'إغلاق'
    },
    table: {
      noData: 'لا توجد بيانات'
    },
    fileUpload: {
      removeFile: 'إزالة {filename}'
    }
  }
})
