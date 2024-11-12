import { defineLocale } from '../composables/defineLocale'

export default defineLocale({
  name: 'العربية',
  code: 'ar',
  dir: 'rtl',
  ui: {
    inputMenu: {
      noMatch: 'لا توجد نتائج مطابقة',
      noData: 'لا توجد بيانات',
      create: 'إنشاء "{label}"'
    },
    commandPalette: {
      noMatch: 'لا توجد نتائج مطابقة',
      noData: 'لا توجد بيانات',
      close: 'إغلاق'
    },
    selectMenu: {
      noMatch: 'لا توجد نتائج مطابقة',
      noData: 'لا توجد بيانات',
      create: 'إنشاء "{label}"'
    },
    toast: {
      close: 'إغلاق'
    },
    carousel: {
      prev: 'السابق',
      next: 'التالي',
      goto: 'الذهاب إلي شريحة {slide}'
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
    }
  }
})
