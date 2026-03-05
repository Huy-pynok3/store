// Error message translations
export const ERROR_MESSAGES: Record<string, string> = {
  // Auth errors
  'EMAIL_ALREADY_EXISTS': 'Email đã được sử dụng',
  'USERNAME_ALREADY_EXISTS': 'Tên tài khoản đã tồn tại',
  'INVALID_CREDENTIALS': 'Email hoặc mật khẩu không đúng',
  'ACCOUNT_DISABLED': 'Tài khoản đã bị vô hiệu hóa',
  'GOOGLE_LOGIN_FAILED': 'Đăng nhập Google thất bại',
  'REGISTER_SUCCESS': 'Đăng ký thành công',
  
  // Validation errors
  'Passwords do not match': 'Mật khẩu không khớp',
  'passwordConfirm must be a string': 'Vui lòng nhập lại mật khẩu',
  'Username can only contain letters, numbers and underscores': 'Tên tài khoản chỉ được chứa chữ cái, số và dấu gạch dưới',
  
  // Generic errors
  'Bad Request': 'Yêu cầu không hợp lệ',
  'Unauthorized': 'Không có quyền truy cập',
  'Forbidden': 'Truy cập bị từ chối',
  'Not Found': 'Không tìm thấy',
  'Internal Server Error': 'Lỗi máy chủ',
  'Service Unavailable': 'Dịch vụ không khả dụng',
}

// Helper function to get translated error message
export function getErrorMessage(error: string | undefined): string {
  if (!error) return 'Có lỗi xảy ra, vui lòng thử lại'
  
  // Check if error exists in our translations
  if (ERROR_MESSAGES[error]) {
    return ERROR_MESSAGES[error]
  }
  
  // Check if error contains any known error message
  for (const [key, value] of Object.entries(ERROR_MESSAGES)) {
    if (error.includes(key)) {
      return value
    }
  }
  
  // Return original error if no translation found
  return error
}
