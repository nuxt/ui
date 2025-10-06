import type { Messages } from '../types'
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
    calendar: {
      nextMonth: 'الشهر المقبل',
      nextYear: 'السنة المقبلة',
      prevMonth: 'الشهر السابق',
      prevYear: 'السنة السابقة'
    },
    carousel: {
      dots: 'اختر الشريحة المراد عرضها',
      goto: 'الذهاب إلى شريحة {slide}',
      next: 'التالي',
      prev: 'السابق'
    },
    chatPrompt: {
      placeholder: 'اكتب رسالتك هنا…'
    },
    chatPromptSubmit: {
      label: 'إرسال'
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
      theme: 'السمة'
    },
    contentSearchButton: {
      label: 'بحث…'
    },
    contentToc: {
      title: 'في هذه الصفحة'
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
    inputMenu: {
      create: 'إنشاء "{label}"',
      noData: 'لا توجد بيانات',
      noMatch: 'لا توجد نتائج مطابقة'
    },
    inputNumber: {
      decrement: 'تقليل',
      increment: 'زيادة'
    },
    modal: {
      close: 'إغلاق'
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
      }
    },
    selectMenu: {
      create: 'إنشاء "{label}"',
      noData: 'لا توجد بيانات',
      noMatch: 'لا توجد نتائج مطابقة',
      search: 'بحث…'
    },
    slideover: {
      close: 'إغلاق'
    },
    table: {
      noData: 'لا توجد بيانات'
    },
    toast: {
      close: 'إغلاق'
    }
  }
})
