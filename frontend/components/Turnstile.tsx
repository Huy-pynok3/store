'use client'

import { useEffect, useRef } from 'react'

interface TurnstileProps {
  onVerify: (token: string) => void
  onError?: () => void
  onExpire?: () => void
}

export default function Turnstile({ onVerify, onError, onExpire }: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetId = useRef<string | null>(null)
  const onVerifyRef = useRef(onVerify)
  const onErrorRef = useRef(onError)
  const onExpireRef = useRef(onExpire)

  useEffect(() => {
    onVerifyRef.current = onVerify
    onErrorRef.current = onError
    onExpireRef.current = onExpire
  }, [onVerify, onError, onExpire])

  useEffect(() => {
    if (!containerRef.current) return

    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
    if (!siteKey) {
      console.error('NEXT_PUBLIC_TURNSTILE_SITE_KEY not configured')
      return
    }

    // Wait for Turnstile to load
    const checkTurnstile = setInterval(() => {
      if (window.turnstile) {
        clearInterval(checkTurnstile)
        
        console.log('Turnstile loaded, rendering widget with sitekey:', siteKey)
        
        // Render Turnstile widget
        try {
          widgetId.current = window.turnstile.render(containerRef.current, {
            sitekey: siteKey,
            callback: (token: string) => {
              console.log('Turnstile verified, token received')
              onVerifyRef.current(token)
            },
            'error-callback': () => {
              console.error('Turnstile error')
              onErrorRef.current?.()
            },
            'expired-callback': () => {
              console.warn('Turnstile token expired')
              onExpireRef.current?.()
            },
            theme: 'light',
            size: 'normal',
          })
          console.log('Turnstile widget rendered with ID:', widgetId.current)
        } catch (error) {
          console.error('Error rendering Turnstile:', error)
        }
      }
    }, 100)

    return () => {
      clearInterval(checkTurnstile)
      if (widgetId.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetId.current)
        } catch (error) {
          console.error('Error removing Turnstile:', error)
        }
      }
    }
  }, [])

  return (
    <div className="flex flex-col items-center gap-2">
      <div ref={containerRef} />
      <p className="text-xs text-gray-500">Xác minh bạn không phải robot</p>
    </div>
  )
}

// Type declaration for window.turnstile
declare global {
  interface Window {
    turnstile: {
      render: (container: HTMLElement | null, options: any) => string
      remove: (widgetId: string) => void
      reset: (widgetId: string) => void
    }
  }
}
