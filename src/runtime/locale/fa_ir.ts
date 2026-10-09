import type { Messages } from '../types/locale'
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
    breadcrumb: {
      label: 'مسیر ناوبری'
    },
    calendar: {
      label: 'تاریخ رویداد',
      monthPicker: 'انتخابگر ماه',
      nextMonth: 'ماه آینده',
      nextYear: 'سال آینده',
      prevMonth: 'ماه گذشته',
      prevYear: 'سال گذشته',
      yearPicker: 'انتخابگر سال'
    },
    carousel: {
      dots: 'اسلاید مورد نظر برای نمایش را انتخاب کنید',
      goto: 'رفتن به اسلاید {slide}',
      next: 'بعدی',
      prev: 'قبلی',
      roledescription: 'کاروسل',
      slide: 'اسلاید'
    },
    chatMessages: {
      autoScroll: 'پیمایش به پایین'
    },
    chatPrompt: {
      placeholder: 'اینجا پیام خود را بنویسید…'
    },
    chatPromptSubmit: {
      label: 'ارسال',
      reload: 'تلاش دوباره',
      stop: 'توقف تولید'
    },
    chatReasoning: {
      thinking: 'در حال فکر کردن…',
      thought: 'فکر کرد',
      thoughtFor: 'به مدت {duration} فکر کرد'
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
      search: 'نتایج',
      theme: 'تم'
    },
    contentSearchButton: {
      label: 'جستجو…'
    },
    contentToc: {
      title: 'در این صفحه'
    },
    dropdownMenu: {
      noMatch: 'داده‌ای یافت نشد',
      search: 'جستجو…'
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
    drawer: {
      close: 'بستن'
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
    inputDate: {
      day: 'روز',
      dayPeriod: 'ق.ظ/ب.ظ',
      era: 'دوره',
      hour: 'ساعت',
      minute: 'دقیقه',
      month: 'ماه',
      second: 'ثانیه',
      timeZoneName: 'منطقه زمانی',
      year: 'سال'
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
    inputRating: {
      rate: 'امتیاز {value} از {length}'
    },
    inputTime: {
      dayPeriod: 'ق.ظ/ب.ظ',
      hour: 'ساعت',
      minute: 'دقیقه',
      second: 'ثانیه',
      timeZoneName: 'منطقه زمانی'
    },
    listbox: {
      noData: 'داده‌ای موجود نیست',
      noMatch: 'داده‌ای یافت نشد',
      search: 'جستجو…'
    },
    modal: {
      close: 'بستن'
    },
    pagination: {
      first: 'صفحه‌ی اول',
      last: 'صفحه‌ی آخر',
      next: 'صفحه‌ی بعد',
      page: 'صفحه‌ی {page}',
      prev: 'صفحه‌ی قبلی'
    },
    pinInput: {
      input: 'کد PIN، نویسه {index} از {length}'
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
      },
      prompt: {
        copy: 'کپی دستور',
        openIn: 'باز کردن در {name}'
      }
    },
    sidebar: {
      close: 'بستن',
      toggle: 'تغییر وضعیت'
    },
    selectMenu: {
      create: 'ایجاد "{label}"',
      noData: 'داده‌ای موجود نیست',
      noMatch: 'داده‌ای یافت نشد',
      search: 'جستجو…'
    },
    skeleton: {
      label: 'در حال بارگذاری'
    },
    slideover: {
      close: 'بستن'
    },
    slider: {
      max: 'حداکثر',
      min: 'حداقل',
      thumb: 'دستگیره',
      value: 'مقدار {index} از {total}'
    },
    table: {
      noData: 'داده‌ای موجود نیست'
    },
    toast: {
      close: 'بستن'
    },
    toaster: {
      label: 'اعلان',
      viewport: 'اعلان‌ها ({hotkey})'
    }
  }
})
