'use client'

import Link from 'next/link'
import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
import { API_ENDPOINTS } from '@/lib/api'
import { PasswordInput } from '@/components/ui'
import { getErrorMessage } from '@/lib/errorMessages'

interface LoginPopupProps {
  isOpen: boolean
  onClose: () => void
}

export default function LoginPopup({ isOpen, onClose }: LoginPopupProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: true
  })
  const [errors, setErrors] = useState({
    email: '',
    password: ''
  })

  if (!isOpen) return null

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateField = (fieldName: string, value: string): string => {
    let error = ''
    
    switch (fieldName) {
      case 'email':
        if (!value) {
          error = 'Vui lòng nhập email'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Email không hợp lệ'
        }
        break
      case 'password':
        if (!value) {
          error = 'Vui lòng nhập mật khẩu'
        }
        break
    }
    
    return error
  }

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (isSubmitting) return

    // Validate fields in order - only show first error
    const emailError = validateField('email', formData.email)
    if (emailError) {
      setErrors({ email: emailError, password: '' })
      return
    }
    
    const passwordError = validateField('password', formData.password)
    if (passwordError) {
      setErrors({ email: '', password: passwordError })
      return
    }
    
    // Clear all errors if validation passes
    setErrors({ email: '', password: '' })

    setIsSubmitting(true)

    try {
      const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          rememberMe: formData.rememberMe,
        }),
      })

      const data = await response.json()

      if (response.ok && data.access_token) {
        // Store JWT token
        localStorage.setItem('access_token', data.access_token)
        localStorage.setItem('isLoggedIn', 'true')
        
        // Dispatch storage event to update other components
        window.dispatchEvent(new Event('storage'))
        
        // Close popup
        onClose()
        
        // Show success message
        await Swal.fire({
          icon: 'success',
          title: 'Đăng nhập thành công!',
          text: 'Chào mừng bạn quay trở lại',
          confirmButtonText: 'OK',
          timer: 1500
        })
        
        // Reload to update UI
        window.location.reload()
      } else {
        // Show error message
        await Swal.fire({
          icon: 'error',
          title: 'Đăng nhập thất bại',
          text: getErrorMessage(data.message),
          confirmButtonText: 'OK'
        })
      }
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Không thể kết nối đến máy chủ',
        confirmButtonText: 'OK'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoogleLogin = () => {
    onClose() // Close popup before navigation
    window.location.href = API_ENDPOINTS.AUTH.GOOGLE
  }

  const handleRegisterClick = () => {
    onClose() // Close popup before navigation
    router.push('/dang-ky')
  }

  const handleForgotPassword = () => {
    onClose()
    router.push('/quen-mat-khau')
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 z-[200]"
        onClick={onClose}
      />

      {/* Popup */}
      <div className="fixed top-[100px] right-8 w-full max-w-[320px] bg-white rounded shadow-lg p-6 z-[201]">
        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-800 text-center mb-6">Đăng nhập</h2>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email Input */}
          <div>
            <input
              type="email"
              name="email"
              placeholder="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 ${
                errors.email 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:border-primary focus:ring-primary'
              }`}
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password Input with Forgot Link */}
          <div>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <PasswordInput
                  name="password"
                  placeholder="Mật khẩu"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 ${
                    errors.password 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:border-primary focus:ring-primary'
                  }`}
                />
              </div>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-xs text-gray-500 hover:text-primary whitespace-nowrap"
              >
                Quên mật khẩu
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">{errors.password}</p>
            )}
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="remember"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleInputChange}
              className="w-3.5 h-3.5 text-primary border-gray-300 rounded focus:ring-primary cursor-pointer"
            />
            <label htmlFor="remember" className="ml-2 text-sm text-gray-700 cursor-pointer">
              Ghi nhớ đăng nhập
            </label>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2.5 rounded text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>

          {/* Google Login */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2.5 rounded text-sm transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Google Login</span>
          </button>
        </form>

        {/* Register Link */}
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={handleRegisterClick}
            className="text-sm text-gray-600 hover:text-primary transition-colors"
          >
            Đăng ký
          </button>
        </div>
      </div>
    </>
  )
}
