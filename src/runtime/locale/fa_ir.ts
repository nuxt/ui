import type { Messages } from '../types'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'فارسی',
  code: 'fa-IR',
  dir: 'rtl',
  messages: {
    inputMenu: {
      noMatch: 'داده‌ای یافت نشد',
      noData: 'داده‌ای موجود نیست',
      create: 'ایجاد "{label}"'
    },
    calendar: {
      prevYear: 'سال گذشته',
      nextYear: 'سال آینده',
      prevMonth: 'ماه گذشته',
      nextMonth: 'ماه آینده'
    },
    inputNumber: {
      increment: 'افزایش',
      decrement: 'کاهش'
    },
    commandPalette: {
      placeholder: 'یک دستور وارد کنید یا جستجو کنید...',
      noMatch: 'داده‌ای یافت نشد',
      noData: 'داده‌ای موجود نیست',
      close: 'بستن',
      back: 'بازگشت'
    },
    selectMenu: {
      noMatch: 'داده‌ای یافت نشد',
      noData: 'داده‌ای موجود نیست',
      create: 'ایجاد "{label}"',
      search: 'جستجو...'
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
