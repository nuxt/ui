import type { Messages } from '../types'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'فارسی',
  code: 'fa-IR',
  dir: 'rtl',
  messages: {
    alert: {
      close: 'بستن'
    },
    authForm: {
      hidePassword: 'پنهان کردن رمز عبور',
      showPassword: 'نمایش رمز عبور',
      submit: 'ادامه'
    },
    banner: {
      close: 'بستن'
    },
    calendar: {
      nextMonth: 'ماه آینده',
      nextYear: 'سال آینده',
      prevMonth: 'ماه گذشته',
      prevYear: 'سال گذشته'
    },
    carousel: {
      dots: 'اسلاید مورد نظر برای نمایش را انتخاب کنید',
      goto: 'رفتن به اسلاید {slide}',
      next: 'بعدی',
      prev: 'قبلی'
    },
    chatPrompt: {
      placeholder: 'اینجا پیام خود را بنویسید…'
    },
    chatPromptSubmit: {
      label: 'ارسال'
    },
    colorMode: {
      dark: 'تیره',
      light: 'روشن',
      switchToDark: 'تغییر به حالت تیره',
      switchToLight: 'تغییر به حالت روشن',
      system: 'سیستم'
    },
    commandPalette: {
      back: 'بازگشت',
      close: 'بستن',
      noData: 'داده‌ای موجود نیست',
      noMatch: 'داده‌ای یافت نشد',
      placeholder: 'یک دستور وارد کنید یا جستجو کنید…'
    },
    contentSearch: {
      links: 'پیوندها',
      theme: 'تم'
    },
    contentSearchButton: {
      label: 'جستجو…'
    },
    contentToc: {
      title: 'در این صفحه'
    },
    dashboardSearch: {
      theme: 'تم'
    },
    dashboardSearchButton: {
      label: 'جستجو…'
    },
    dashboardSidebarCollapse: {
      collapse: 'جمع کردن نوار کناری',
      expand: 'گسترش نوار کناری'
    },
    dashboardSidebarToggle: {
      close: 'بستن نوار کناری',
      open: 'باز کردن نوار کناری'
    },
    error: {
      clear: 'بازگشت به صفحه اصلی'
    },
    fileUpload: {
      removeFile: 'حذف {filename}'
    },
    header: {
      close: 'بستن منو',
      open: 'باز کردن منو'
    },
    inputMenu: {
      create: 'ایجاد "{label}"',
      noData: 'داده‌ای موجود نیست',
      noMatch: 'داده‌ای یافت نشد'
    },
    inputNumber: {
      decrement: 'کاهش',
      increment: 'افزایش'
    },
    modal: {
      close: 'بستن'
    },
    pricingTable: {
      caption: 'مقایسه طرح قیمت'
    },
    prose: {
      codeCollapse: {
        closeText: 'جمع کردن',
        name: 'کد',
        openText: 'گسترش'
      },
      collapsible: {
        closeText: 'پنهان',
        name: 'ویژگی‌ها',
        openText: 'نمایش'
      },
      pre: {
        copy: 'کپی کد در کلیپ‌بورد'
      }
    },
    selectMenu: {
      create: 'ایجاد "{label}"',
      noData: 'داده‌ای موجود نیست',
      noMatch: 'داده‌ای یافت نشد',
      search: 'جستجو…'
    },
    slideover: {
      close: 'بستن'
    },
    table: {
      noData: 'داده‌ای موجود نیست'
    },
    toast: {
      close: 'بستن'
    }
  }
})
