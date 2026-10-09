import type { Messages } from '../types/locale'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'العربية',
  code: 'ar',
  dir: 'rtl',
  messages: {
    alert: {
      close: 'إغلاق'
    },
    authForm: {
      hidePassword: 'إخفاء كلمة المرور',
      showPassword: 'إظهار كلمة المرور',
      submit: 'متابعة'
    },
    banner: {
      close: 'إغلاق'
    },
    breadcrumb: {
      label: 'مسار التنقل'
    },
    calendar: {
      label: 'تاريخ الحدث',
      monthPicker: 'منتقي الشهر',
      nextMonth: 'الشهر المقبل',
      nextYear: 'السنة المقبلة',
      prevMonth: 'الشهر السابق',
      prevYear: 'السنة السابقة',
      yearPicker: 'منتقي السنة'
    },
    carousel: {
      dots: 'اختر الشريحة المراد عرضها',
      goto: 'الذهاب إلى شريحة {slide}',
      next: 'التالي',
      prev: 'السابق',
      roledescription: 'عرض شرائح',
      slide: 'شريحة'
    },
    chatMessages: {
      autoScroll: 'التمرير إلى الأسفل'
    },
    chatPrompt: {
      placeholder: 'اكتب رسالتك هنا…'
    },
    chatPromptSubmit: {
      label: 'إرسال',
      reload: 'إعادة المحاولة',
      stop: 'إيقاف التوليد'
    },
    chatReasoning: {
      thinking: 'يفكّر…',
      thought: 'فكّر',
      thoughtFor: 'فكّر لمدة {duration}'
    },
    colorMode: {
      dark: 'داكن',
      light: 'فاتح',
      switchToDark: 'التبديل إلى الوضع الداكن',
      switchToLight: 'التبديل إلى الوضع الفاتح',
      system: 'النظام'
    },
    commandPalette: {
      back: 'رجوع',
      close: 'إغلاق',
      noData: 'لا توجد بيانات',
      noMatch: 'لا توجد نتائج مطابقة',
      placeholder: 'اكتب أمرًا أو ابحث…'
    },
    contentSearch: {
      links: 'الروابط',
      search: 'النتائج',
      theme: 'السمة'
    },
    contentSearchButton: {
      label: 'بحث…'
    },
    contentToc: {
      title: 'في هذه الصفحة'
    },
    dropdownMenu: {
      noMatch: 'لا توجد نتائج مطابقة',
      search: 'بحث…'
    },
    dashboardSearch: {
      theme: 'السمة'
    },
    dashboardSearchButton: {
      label: 'بحث…'
    },
    dashboardSidebarCollapse: {
      collapse: 'طي الشريط الجانبي',
      expand: 'توسيع الشريط الجانبي'
    },
    dashboardSidebarToggle: {
      close: 'إغلاق الشريط الجانبي',
      open: 'فتح الشريط الجانبي'
    },
    drawer: {
      close: 'إغلاق'
    },
    error: {
      clear: 'العودة إلى الصفحة الرئيسية'
    },
    fileUpload: {
      removeFile: 'إزالة {filename}'
    },
    header: {
      close: 'إغلاق القائمة',
      open: 'فتح القائمة'
    },
    inputDate: {
      day: 'اليوم',
      dayPeriod: 'ص/م',
      era: 'العصر',
      hour: 'الساعة',
      minute: 'الدقيقة',
      month: 'الشهر',
      second: 'الثانية',
      timeZoneName: 'المنطقة الزمنية',
      year: 'السنة'
    },
    inputMenu: {
      create: 'إنشاء "{label}"',
      noData: 'لا توجد بيانات',
      noMatch: 'لا توجد نتائج مطابقة'
    },
    inputNumber: {
      decrement: 'تقليل',
      increment: 'زيادة'
    },
    inputRating: {
      rate: 'تقييم {value} من {length}'
    },
    inputTime: {
      dayPeriod: 'ص/م',
      hour: 'الساعة',
      minute: 'الدقيقة',
      second: 'الثانية',
      timeZoneName: 'المنطقة الزمنية'
    },
    listbox: {
      noData: 'لا توجد بيانات',
      noMatch: 'لا توجد نتائج مطابقة',
      search: 'بحث…'
    },
    modal: {
      close: 'إغلاق'
    },
    pagination: {
      first: 'الصفحة الأولى',
      last: 'الصفحة الأخيرة',
      next: 'الصفحة التالية',
      page: 'الصفحة {page}',
      prev: 'الصفحة السابقة'
    },
    pinInput: {
      input: 'رمز PIN، الخانة {index} من {length}'
    },
    pricingTable: {
      caption: 'مقارنة الخطط السعرية'
    },
    prose: {
      codeCollapse: {
        closeText: 'طي',
        name: 'كود',
        openText: 'توسيع'
      },
      collapsible: {
        closeText: 'إخفاء',
        name: 'خصائص',
        openText: 'إظهار'
      },
      pre: {
        copy: 'نسخ الكود إلى الحافظة'
      },
      prompt: {
        copy: 'نسخ التعليمات',
        openIn: 'فتح في {name}'
      }
    },
    sidebar: {
      close: 'إغلاق',
      toggle: 'تبديل'
    },
    selectMenu: {
      create: 'إنشاء "{label}"',
      noData: 'لا توجد بيانات',
      noMatch: 'لا توجد نتائج مطابقة',
      search: 'بحث…'
    },
    skeleton: {
      label: 'جارٍ التحميل'
    },
    slideover: {
      close: 'إغلاق'
    },
    slider: {
      max: 'الحد الأقصى',
      min: 'الحد الأدنى',
      thumb: 'مقبض',
      value: 'القيمة {index} من {total}'
    },
    table: {
      noData: 'لا توجد بيانات'
    },
    toast: {
      close: 'إغلاق'
    },
    toaster: {
      label: 'إشعار',
      viewport: 'الإشعارات ({hotkey})'
    }
  }
})
