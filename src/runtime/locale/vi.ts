import type { Messages } from '../types/locale'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'Tiếng Việt',
  code: 'vi',
  messages: {
    alert: {
      close: 'Đóng'
    },
    authForm: {
      hidePassword: 'Ẩn mật khẩu',
      showPassword: 'Hiển thị mật khẩu',
      submit: 'Tiếp tục'
    },
    banner: {
      close: 'Đóng'
    },
    breadcrumb: {
      label: 'đường dẫn điều hướng'
    },
    calendar: {
      label: 'Ngày sự kiện',
      monthPicker: 'Bộ chọn tháng',
      nextMonth: 'Tháng sau',
      nextYear: 'Năm sau',
      prevMonth: 'Tháng trước',
      prevYear: 'Năm trước',
      yearPicker: 'Bộ chọn năm'
    },
    carousel: {
      dots: 'Chọn slide để hiển thị',
      goto: 'Đi tới ô {slide}',
      next: 'Sau',
      prev: 'Trước',
      roledescription: 'băng chuyền',
      slide: 'slide'
    },
    chatMessages: {
      autoScroll: 'Cuộn xuống dưới'
    },
    chatPrompt: {
      placeholder: 'Nhập tin nhắn của bạn ở đây…'
    },
    chatPromptSubmit: {
      label: 'Gửi',
      reload: 'Thử lại',
      stop: 'Dừng tạo'
    },
    chatReasoning: {
      thinking: 'Đang suy nghĩ…',
      thought: 'Đã suy nghĩ',
      thoughtFor: 'Đã suy nghĩ {duration}'
    },
    colorMode: {
      dark: 'Tối',
      light: 'Sáng',
      switchToDark: 'Chuyển sang chế độ tối',
      switchToLight: 'Chuyển sang chế độ sáng',
      system: 'Hệ thống'
    },
    commandPalette: {
      back: 'Quay lại',
      close: 'Đóng',
      noData: 'Không có dữ liệu',
      noMatch: 'Không có kết quả phù hợp',
      placeholder: 'Nhập lệnh hoặc tìm kiếm…'
    },
    contentSearch: {
      links: 'Liên kết',
      search: 'Kết quả',
      theme: 'Chủ đề'
    },
    contentSearchButton: {
      label: 'Tìm kiếm…'
    },
    contentToc: {
      title: 'Trong trang này'
    },
    dropdownMenu: {
      noMatch: 'Không có kết quả phù hợp',
      search: 'Tìm kiếm…'
    },
    dashboardSearch: {
      theme: 'Chủ đề'
    },
    dashboardSearchButton: {
      label: 'Tìm kiếm…'
    },
    dashboardSidebarCollapse: {
      collapse: 'Thu gọn thanh bên',
      expand: 'Mở rộng thanh bên'
    },
    dashboardSidebarToggle: {
      close: 'Đóng thanh bên',
      open: 'Mở thanh bên'
    },
    drawer: {
      close: 'Đóng'
    },
    error: {
      clear: 'Quay lại trang chủ'
    },
    fileUpload: {
      removeFile: 'Xóa {filename}'
    },
    header: {
      close: 'Đóng menu',
      open: 'Mở menu'
    },
    inputDate: {
      day: 'ngày',
      dayPeriod: 'SA/CH',
      era: 'kỷ nguyên',
      hour: 'giờ',
      minute: 'phút',
      month: 'tháng',
      second: 'giây',
      timeZoneName: 'múi giờ',
      year: 'năm'
    },
    inputMenu: {
      create: 'Tạo "{label}"',
      noData: 'Không có dữ liệu',
      noMatch: 'Không có kết quả phù hợp'
    },
    inputNumber: {
      decrement: 'Giảm',
      increment: 'Tăng'
    },
    inputRating: {
      rate: 'Đánh giá {value} trên {length}'
    },
    inputTime: {
      dayPeriod: 'SA/CH',
      hour: 'giờ',
      minute: 'phút',
      second: 'giây',
      timeZoneName: 'múi giờ'
    },
    listbox: {
      noData: 'Không có dữ liệu',
      noMatch: 'Không có kết quả phù hợp',
      search: 'Tìm kiếm…'
    },
    modal: {
      close: 'Đóng'
    },
    pagination: {
      first: 'Trang đầu tiên',
      last: 'Trang cuối cùng',
      next: 'Trang tiếp theo',
      page: 'Trang {page}',
      prev: 'Trang trước'
    },
    pinInput: {
      input: 'mã PIN, ký tự {index} trên {length}'
    },
    pricingTable: {
      caption: 'So sánh các kế hoạch giá'
    },
    prose: {
      codeCollapse: {
        closeText: 'Thu gọn',
        name: 'mã',
        openText: 'Mở rộng'
      },
      collapsible: {
        closeText: 'Ẩn',
        name: 'thuộc tính',
        openText: 'Hiển thị'
      },
      pre: {
        copy: 'Sao chép mã vào bộ nhớ tạm'
      },
      prompt: {
        copy: 'Sao chép lệnh',
        openIn: 'Mở trong {name}'
      }
    },
    sidebar: {
      close: 'Đóng',
      toggle: 'Chuyển đổi'
    },
    selectMenu: {
      create: 'Tạo "{label}"',
      noData: 'Không có dữ liệu',
      noMatch: 'Không có kết quả phù hợp',
      search: 'Tìm kiếm…'
    },
    skeleton: {
      label: 'đang tải'
    },
    slideover: {
      close: 'Đóng'
    },
    slider: {
      max: 'Tối đa',
      min: 'Tối thiểu',
      thumb: 'Con trượt',
      value: 'Giá trị {index} trên {total}'
    },
    table: {
      noData: 'Không có dữ liệu'
    },
    toast: {
      close: 'Đóng'
    },
    toaster: {
      label: 'Thông báo',
      viewport: 'Thông báo ({hotkey})'
    }
  }
})
