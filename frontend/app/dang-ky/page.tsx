'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, FormEvent, useCallback } from 'react'
import Swal from 'sweetalert2'
import { Button, Card, Input, PasswordInput } from '@/components/ui'
import Turnstile from '@/components/Turnstile'
import { API_ENDPOINTS } from '@/lib/api'
import { getErrorMessage } from '@/lib/errorMessages'

export default function RegisterPage() {
  const router = useRouter()
  const isTurnstileEnabled = process.env.NEXT_PUBLIC_TURNSTILE_ENABLED === 'true'
  
  // Registration form state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState('')
  const [turnstileRenderKey, setTurnstileRenderKey] = useState(0)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    passwordConfirm: '',
    agreeTerms: true
  })
  
  // Validation errors
  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
    passwordConfirm: '',
    agreeTerms: ''
  })

  // Login form state
  const [isLoginSubmitting, setIsLoginSubmitting] = useState(false)
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    rememberMe: true
  })
  
  // Login validation errors
  const [loginErrors, setLoginErrors] = useState({
    email: '',
    password: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target
    const fieldName = id.replace('register-', '')
    
    setFormData(prev => ({
      ...prev,
      [fieldName]: type === 'checkbox' ? checked : value
    }))
    
    // Clear error when user starts typing
    if (errors[fieldName as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: ''
      }))
    }
    
    // Real-time validation
    validateField(fieldName, type === 'checkbox' ? checked : value)
  }
  
  const validateField = (fieldName: string, value: string | boolean) => {
    let error = ''
    
    switch (fieldName) {
      case 'username':
        if (!value) {
          error = 'Vui lòng nhập tài khoản'
        } else if (typeof value === 'string' && value.length < 3) {
          error = 'Tài khoản phải có ít nhất 3 ký tự'
        } else if (typeof value === 'string' && value.length > 20) {
          error = 'Tài khoản không được vượt quá 20 ký tự'
        }
        break
      case 'email':
        if (!value) {
          error = 'Vui lòng nhập email'
        } else if (typeof value === 'string' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Email không hợp lệ'
        }
        break
      case 'password':
        if (!value) {
          error = 'Vui lòng nhập mật khẩu'
        } else if (typeof value === 'string' && value.length < 6) {
          error = 'Mật khẩu phải có ít nhất 6 ký tự'
        }
        // Check password confirmation match if it exists
        if (formData.passwordConfirm && value !== formData.passwordConfirm) {
          setErrors(prev => ({
            ...prev,
            passwordConfirm: 'Mật khẩu không khớp'
          }))
        } else if (formData.passwordConfirm) {
          setErrors(prev => ({
            ...prev,
            passwordConfirm: ''
          }))
        }
        break
      case 'passwordConfirm':
        if (!value) {
          error = 'Vui lòng nhập lại mật khẩu'
        } else if (value !== formData.password) {
          error = 'Mật khẩu không khớp'
        }
        break
      case 'agreeTerms':
        if (!value) {
          error = 'Vui lòng đồng ý với điều khoản sử dụng'
        }
        break
    }
    
    setErrors(prev => ({
      ...prev,
      [fieldName]: error
    }))
    
    return error
  }

  const handleLoginInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target
    const fieldName = id.replace('login-', '')
    
    setLoginData(prev => ({
      ...prev,
      [fieldName]: type === 'checkbox' ? checked : value
    }))
    
    // Clear error when user starts typing
    if (loginErrors[fieldName as keyof typeof loginErrors]) {
      setLoginErrors(prev => ({
        ...prev,
        [fieldName]: ''
      }))
    }
  }
  
  const validateLoginField = (fieldName: string, value: string): string => {
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

  const handleLoginSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (isLoginSubmitting) return

    // Validate fields in order - only show first error
    const emailError = validateLoginField('email', loginData.email)
    if (emailError) {
      setLoginErrors({ email: emailError, password: '' })
      return
    }
    
    const passwordError = validateLoginField('password', loginData.password)
    if (passwordError) {
      setLoginErrors({ email: '', password: passwordError })
      return
    }
    
    // Clear all errors if validation passes
    setLoginErrors({ email: '', password: '' })

    setIsLoginSubmitting(true)

    try {
      const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: loginData.email,
          password: loginData.password,
          rememberMe: loginData.rememberMe,
        }),
      })

      const data = await response.json()

      if (response.ok && data.access_token) {
        // Store JWT token
        localStorage.setItem('access_token', data.access_token)
        localStorage.setItem('isLoggedIn', 'true')
        
        // Show success message (optional)
        await Swal.fire({
          icon: 'success',
          title: 'Đăng nhập thành công!',
          text: 'Chào mừng bạn quay trở lại',
          confirmButtonText: 'OK',
          timer: 1500
        })
        
        // Redirect to homepage
        router.push('/')
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
      setIsLoginSubmitting(false)
    }
  }

  const handleGoogleLogin = () => {
    // Redirect to Google OAuth endpoint
    window.location.href = API_ENDPOINTS.AUTH.GOOGLE
  }

  const handleTurnstileVerify = useCallback((token: string) => {
    setTurnstileToken(token)
  }, [])

  const handleTurnstileError = useCallback(() => {
    setTurnstileToken('')
  }, [])

  const handleTurnstileExpire = useCallback(() => {
    setTurnstileToken('')
  }, [])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (isSubmitting) return

    // Check Turnstile if enabled
    if (isTurnstileEnabled && !turnstileToken) {
      await Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Vui lòng xác minh bạn không phải robot',
        confirmButtonText: 'OK'
      })
      return
    }

    // Validate fields in order - only show first error
    const usernameError = validateField('username', formData.username)
    if (usernameError) {
      setErrors({ username: usernameError, email: '', password: '', passwordConfirm: '', agreeTerms: '' })
      return
    }
    
    const emailError = validateField('email', formData.email)
    if (emailError) {
      setErrors({ username: '', email: emailError, password: '', passwordConfirm: '', agreeTerms: '' })
      return
    }
    
    const passwordError = validateField('password', formData.password)
    if (passwordError) {
      setErrors({ username: '', email: '', password: passwordError, passwordConfirm: '', agreeTerms: '' })
      return
    }
    
    const passwordConfirmError = validateField('passwordConfirm', formData.passwordConfirm)
    if (passwordConfirmError) {
      setErrors({ username: '', email: '', password: '', passwordConfirm: passwordConfirmError, agreeTerms: '' })
      return
    }
    
    const agreeTermsError = validateField('agreeTerms', formData.agreeTerms)
    if (agreeTermsError) {
      setErrors({ username: '', email: '', password: '', passwordConfirm: '', agreeTerms: agreeTermsError })
      return
    }
    
    // Clear all errors if validation passes
    setErrors({ username: '', email: '', password: '', passwordConfirm: '', agreeTerms: '' })

    setIsSubmitting(true)

    try {
      const response = await fetch(API_ENDPOINTS.AUTH.REGISTER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          passwordConfirm: formData.passwordConfirm,
          turnstileToken: turnstileToken,
        }),
      })

      const data = await response.json()

      if (response.ok && data.message === 'REGISTER_SUCCESS') {
        // Auto-fill login form with registered credentials
        setLoginData({
          email: formData.email,
          password: formData.password,
          rememberMe: true
        })
        
        // Clear registration form
        setFormData({
          username: '',
          email: '',
          password: '',
          passwordConfirm: '',
          agreeTerms: true
        })
      } else {
        // Show error message
        await Swal.fire({
          icon: 'error',
          title: 'Đăng ký thất bại',
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
      // Turnstile token is single-use; always force new verification for next submit
      if (isTurnstileEnabled) {
        setTurnstileToken('')
        setTurnstileRenderKey(prev => prev + 1)
      }
      setIsSubmitting(false)
    }
  }
  return (
    <main className="min-h-[calc(100vh-260px)] bg-[#f5f5f5] py-8 px-3">
      <div className="max-w-[980px] mx-auto grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
        <Card className="p-5 md:p-6">
          <h1 className="text-[32px] md:text-[40px] leading-none font-bold text-[#3f3f3f] mb-4">
            Đăng nhập
          </h1>
          <div className="h-px bg-[#e9e9e9] mb-6" />

          <form className="space-y-5" onSubmit={handleLoginSubmit}>
            <div>
              <Input
                id="login-email"
                type="email"
                label="Email"
                fullWidth
                value={loginData.email}
                onChange={handleLoginInputChange}
                className={`h-10 ${loginErrors.email ? 'border-red-500 focus:border-red-500' : 'border-[#dcdcdc] focus:border-[#58bdd7]'}`}
              />
              {loginErrors.email && (
                <p className="text-xs text-red-500 mt-1">{loginErrors.email}</p>
              )}
            </div>

            <div>
              <PasswordInput
                id="login-password"
                label="Mật khẩu"
                fullWidth
                value={loginData.password}
                onChange={handleLoginInputChange}
                className={`h-10 ${loginErrors.password ? 'border-red-500 focus:border-red-500' : 'border-[#dcdcdc] focus:border-[#58bdd7]'}`}
              />
              {loginErrors.password && (
                <p className="text-xs text-red-500 mt-1">{loginErrors.password}</p>
              )}
            </div>

            <Link href="/quen-mat-khau" className="inline-block text-xs text-[#767676] hover:text-[#2dbf6a]">
              Quên mật khẩu
            </Link>

            <label className="flex items-center gap-2 text-[15px] text-[#555] cursor-pointer">
              <input 
                type="checkbox" 
                checked={loginData.rememberMe}
                onChange={handleLoginInputChange}
                id="login-rememberMe"
                className="accent-[#2dbf6a]" 
              />
              Ghi nhớ đăng nhập
            </label>

            <Button
              type="submit"
              variant="success"
              size="sm"
              disabled={isLoginSubmitting}
              className="h-10 w-full sm:w-auto px-5 bg-[#2fbf4a] hover:bg-[#29a942] text-white text-[15px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoginSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </Button>

            <p className="text-[#555]">Or</p>

            <Button
              type="button"
              size="sm"
              onClick={handleGoogleLogin}
              className="h-9 w-full sm:w-auto px-4 bg-[#4285f4] hover:bg-[#357ae8] text-white text-sm flex items-center justify-center gap-2"
            >
              <div className="w-5 h-5 bg-white rounded flex items-center justify-center">
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </div>
              <span>Login with Google</span>
            </Button>
          </form>
        </Card>

        <Card className="p-5 md:p-6">
          <h2 className="text-[32px] md:text-[40px] leading-none font-bold text-[#3f3f3f] mb-4">Đăng ký</h2>
          <p className="text-[15px] text-[#65a768] mb-4">
            Chú ý: Nếu bạn sử dụng các chương trình Bypass Captcha có thể không đăng ký tài khoản được.
          </p>
          <div className="h-px bg-[#e9e9e9] mb-6" />

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input
                  id="register-username"
                  type="text"
                  label="Tài khoản"
                  fullWidth
                  value={formData.username}
                  onChange={handleInputChange}
                  className={`h-10 ${errors.username ? 'border-red-500 focus:border-red-500' : 'border-[#dcdcdc] focus:border-[#58bdd7]'}`}
                />
                {errors.username && (
                  <p className="text-xs text-red-500 mt-1">{errors.username}</p>
                )}
              </div>

              <div>
                <Input
                  id="register-email"
                  type="email"
                  label="Email"
                  fullWidth
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`h-10 ${errors.email ? 'border-red-500 focus:border-red-500' : 'border-[#dcdcdc] focus:border-[#58bdd7]'}`}
                />
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <PasswordInput
                  id="register-password"
                  label="Mật khẩu"
                  fullWidth
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`h-10 ${errors.password ? 'border-red-500 focus:border-red-500' : 'border-[#dcdcdc] focus:border-[#58bdd7]'}`}
                />
                {errors.password && (
                  <p className="text-xs text-red-500 mt-1">{errors.password}</p>
                )}
              </div>

              <div>
                <PasswordInput
                  id="register-passwordConfirm"
                  label="Nhập lại mật khẩu"
                  fullWidth
                  value={formData.passwordConfirm}
                  onChange={handleInputChange}
                  className={`h-10 ${errors.passwordConfirm ? 'border-red-500 focus:border-red-500' : 'border-[#dcdcdc] focus:border-[#58bdd7]'}`}
                />
                {errors.passwordConfirm && (
                  <p className="text-xs text-red-500 mt-1">{errors.passwordConfirm}</p>
                )}
              </div>
            </div>

            <div>
              <label className="flex items-start gap-2 text-[15px] text-[#555] cursor-pointer leading-tight">
                <input 
                  type="checkbox" 
                  checked={formData.agreeTerms}
                  onChange={handleInputChange}
                  id="register-agreeTerms"
                  className="accent-[#2dbf6a] mt-0.5" 
                />
                <span>Tôi đã đọc và đồng ý với Điều khoản sử dụng Tạp Hóa MMO</span>
              </label>
              {errors.agreeTerms && (
                <p className="text-xs text-red-500 mt-1 ml-6">{errors.agreeTerms}</p>
              )}
            </div>

            {isTurnstileEnabled && (
              <div>
                <Turnstile 
                  key={turnstileRenderKey}
                  onVerify={handleTurnstileVerify}
                  onError={handleTurnstileError}
                  onExpire={handleTurnstileExpire}
                />
              </div>
            )}

            <Button
              type="submit"
              variant="success"
              size="sm"
              disabled={isSubmitting}
              className="h-10 w-full sm:w-auto px-5 bg-[#2fbf4a] hover:bg-[#29a942] text-white text-[15px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Đang xử lý...' : 'Đăng ký'}
            </Button>
          </form>
        </Card>
      </div>
    </main>
  )
}
