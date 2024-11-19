import { defineLocale } from '../composables/defineLocale'

export default defineLocale({
  name: 'فارسی',
  code: 'fa-ir',
  messages: {
    inputMenu: {
      noMatch: 'داده‌ای یافت نشد',
      noData: 'داده‌ای موجود نیست',
      create: 'ایجاد "{label}"'
    },
    inputNumber: {
      increment: 'افزایش',
      decrement: 'کاهش'
    },
    commandPalette: {
      noMatch: 'داده‌ای یافت نشد',
      noData: 'داده‌ای موجود نیست',
      close: 'بستن'
    },
    selectMenu: {
      noMatch: 'داده‌ای یافت نشد',
      noData: 'داده‌ای موجود نیست',
      create: 'ایجاد "{label}"'
    },
    toast: {
      close: 'بستن'
    },
    carousel: {
      prev: 'قبلی',
      next: 'بعدی',
      goto: 'رفتن به اسلاید {slide}'
    },
    modal: {
      close: 'بستن'
    },
    slideover: {
      close: 'بستن'
    },
    alert: {
      close: 'بستن'
    },
    table: {
      noData: 'داده‌ای موجود نیست'
    }
  }
})
