'use client'

import { FormEvent, KeyboardEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react'
import { Avatar, LoadingSpinner } from '@/components/ui'
import { useAuth } from '@/hooks/useAuth'
import { API_ENDPOINTS } from '@/lib/api'

type ConversationListItem = {
  id: string
  type: 'DIRECT' | 'SUPPORT'
  title: string
  updatedAt: string
  unreadCount: number
  latestMessage: {
    id: string
    content: string
    createdAt: string
    senderId: string
    senderName: string
  } | null
  otherParticipant: {
    id: string
    username: string
    fullName: string | null
    role: string
    online: boolean
    lastSeenAt: string | null
  } | null
}

type ChatMessage = {
  id: string
  content: string
  createdAt: string
  sender: {
    id: string
    username: string
    fullName: string | null
  }
}

type ConversationDetail = {
  id: string
  type: 'DIRECT' | 'SUPPORT'
  title: string | null
  participants: Array<{
    id: string
    username: string
    fullName: string | null
    role: string
    online: boolean
    lastSeenAt: string | null
  }>
  messages: ChatMessage[]
}

type NewMessageEvent = {
  conversationId: string
  message: ChatMessage
}

const SUPPORT_AVATAR_SRC =
  '/images/support-avatar.webp'

function formatConversationDate(value: string) {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
  }).format(new Date(value))
}

function formatMessageTime(value: string) {
  return new Intl.DateTimeFormat('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
  }).format(new Date(value))
}

function formatPresenceStatus(isOnline: boolean, lastSeenAt: string | null | undefined) {
  if (isOnline) {
    return 'Online'
  }

  if (!lastSeenAt) {
    return 'Online'
  }

  const diffMs = Date.now() - new Date(lastSeenAt).getTime()
  const diffMinutes = Math.max(1, Math.floor(diffMs / 60000))

  if (diffMinutes < 60) {
    return `Online ${diffMinutes} phút trước`
  }

  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) {
    return `Online ${diffHours} giờ trước`
  }

  const diffDays = Math.floor(diffHours / 24)
  return `Online ${diffDays} ngày trước`
}

function getChatAvatarSrc(role: string | null | undefined) {
  return role === 'ADMIN' ? SUPPORT_AVATAR_SRC : undefined
}

async function playNotificationSound() {
  if (typeof window === 'undefined') {
    return
  }

  const audioContextClass =
    window.AudioContext ||
    (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext

  if (!audioContextClass) {
    return
  }

  const context = new audioContextClass()
  if (context.state === 'suspended') {
    try {
      await context.resume()
    } catch {
      return
    }
  }

  const oscillator = context.createOscillator()
  const gainNode = context.createGain()

  oscillator.type = 'sine'
  oscillator.frequency.setValueAtTime(880, context.currentTime)
  gainNode.gain.setValueAtTime(0.0001, context.currentTime)
  gainNode.gain.exponentialRampToValueAtTime(0.06, context.currentTime + 0.01)
  gainNode.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.22)

  oscillator.connect(gainNode)
  gainNode.connect(context.destination)
  oscillator.start()
  oscillator.stop(context.currentTime + 0.24)
  oscillator.onended = () => {
    void context.close()
  }
}

async function authorizedFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const token = localStorage.getItem('access_token')
  if (!token) {
    throw new Error('Vui long dang nhap de su dung chat')
  }

  const response = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(init?.headers ?? {}),
    },
    cache: 'no-store',
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || 'Không thể kết nối chat')
  }

  return response.json()
}

function emitWithAck<TResponse>(socket: Socket, eventName: string, payload: unknown) {
  return new Promise<TResponse>((resolve, reject) => {
    socket.timeout(5000).emit(eventName, payload, (error: Error | null, response: TResponse) => {
      if (error) {
        reject(error)
        return
      }

      resolve(response)
    })
  })
}

export default function ChatBoxPage() {
  const { isLoggedIn, user, loading } = useAuth()
  const [mobileView, setMobileView] = useState<'list' | 'detail'>('list')
  const [conversations, setConversations] = useState<ConversationListItem[]>([])
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)
  const [conversationDetail, setConversationDetail] = useState<ConversationDetail | null>(null)
  const [messageInput, setMessageInput] = useState('')
  const [isLoadingConversations, setIsLoadingConversations] = useState(true)
  const [isLoadingMessages, setIsLoadingMessages] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSocketConnected, setIsSocketConnected] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showConversationMenu, setShowConversationMenu] = useState(false)
  const [mobileKeyboardOffset, setMobileKeyboardOffset] = useState(0)
  const [isComposerFocused, setIsComposerFocused] = useState(false)
  const knownIncomingMessageIds = useRef<Set<string>>(new Set())
  const shouldAutoScrollRef = useRef(true)
  const previousMessageCountRef = useRef(0)
  const messageContainerRef = useRef<HTMLDivElement | null>(null)
  const socketRef = useRef<Socket | null>(null)
  const selectedConversationIdRef = useRef<string | null>(null)
  const emojiPickerRef = useRef<HTMLDivElement | null>(null)
  const conversationMenuRef = useRef<HTMLDivElement | null>(null)

  const updateKeyboardOffset = useCallback(() => {
    if (typeof window === 'undefined' || window.innerWidth >= 1024) {
      setMobileKeyboardOffset(0)
      return
    }

    const viewport = window.visualViewport
    if (!viewport) {
      setMobileKeyboardOffset(0)
      return
    }

    const offset = Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop)
    setMobileKeyboardOffset(offset > 120 ? offset : 0)
  }, [])

  useEffect(() => {
    selectedConversationIdRef.current = selectedConversationId
  }, [selectedConversationId])

  useEffect(() => {
    if (typeof window === 'undefined' || !window.visualViewport) {
      return
    }

    const handleViewportChange = () => {
      window.requestAnimationFrame(updateKeyboardOffset)
    }

    handleViewportChange()
    window.visualViewport.addEventListener('resize', handleViewportChange)
    window.visualViewport.addEventListener('scroll', handleViewportChange)
    window.addEventListener('resize', handleViewportChange)

    return () => {
      window.visualViewport?.removeEventListener('resize', handleViewportChange)
      window.visualViewport?.removeEventListener('scroll', handleViewportChange)
      window.removeEventListener('resize', handleViewportChange)
    }
  }, [updateKeyboardOffset])

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node

      if (showEmojiPicker && emojiPickerRef.current && !emojiPickerRef.current.contains(target)) {
        setShowEmojiPicker(false)
      }

      if (
        showConversationMenu &&
        conversationMenuRef.current &&
        !conversationMenuRef.current.contains(target)
      ) {
        setShowConversationMenu(false)
      }
    }

    window.addEventListener('mousedown', handleOutsideClick)
    return () => {
      window.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [showConversationMenu, showEmojiPicker])

  const selectedConversation = useMemo(
    () => conversations.find((item) => item.id === selectedConversationId) ?? null,
    [conversations, selectedConversationId],
  )

  const selectedParticipant = useMemo(() => {
    const participantFromDetail =
      conversationDetail?.participants.find((participant) => participant.id !== user?.id) ?? null

    if (participantFromDetail) {
      return participantFromDetail
    }

    return selectedConversation?.otherParticipant ?? null
  }, [conversationDetail?.participants, selectedConversation?.otherParticipant, user?.id])

  const selectedParticipantStatus = useMemo(
    () => formatPresenceStatus(Boolean(selectedParticipant?.online), selectedParticipant?.lastSeenAt),
    [selectedParticipant?.lastSeenAt, selectedParticipant?.online],
  )
  const shouldDockComposerToKeyboard = isComposerFocused && mobileKeyboardOffset > 0
  const socketBaseUrl = API_ENDPOINTS.CHAT.CONVERSATIONS.replace('/api/chat/conversations', '')

  useEffect(() => {
    if (!isLoggedIn) {
      setConversations([])
      setSelectedConversationId(null)
      setConversationDetail(null)
      setIsLoadingConversations(false)
      return
    }

    let isMounted = true
    const loadConversations = async (isInitial = false) => {
      if (isInitial) {
        setIsLoadingConversations(true)
      }
      try {
        const data = await authorizedFetch<ConversationListItem[]>(API_ENDPOINTS.CHAT.CONVERSATIONS)
        if (!isMounted) {
          return
        }

        const incomingFromOthers = data
          .map((conversation) => conversation.latestMessage)
          .filter((message): message is NonNullable<ConversationListItem['latestMessage']> => Boolean(message))
          .filter((message) => message.senderId !== user?.id)

        const hasNewIncomingMessage = incomingFromOthers.some(
          (message) => !knownIncomingMessageIds.current.has(message.id),
        )

        incomingFromOthers.forEach((message) => {
          knownIncomingMessageIds.current.add(message.id)
        })

        setConversations(data)
        setSelectedConversationId((currentId) => {
          if (currentId && data.some((conversation) => conversation.id === currentId)) {
            return currentId
          }

          return data[0]?.id ?? null
        })
        setError(null)

        if (!isInitial && hasNewIncomingMessage) {
          void playNotificationSound()
        }
      } catch (fetchError) {
        if (isMounted) {
          setError(fetchError instanceof Error ? fetchError.message : 'Khong tai duoc danh sach chat')
        }
      } finally {
        if (isMounted && isInitial) {
          setIsLoadingConversations(false)
        }
      }
    }

    void loadConversations(true)
    const intervalId = window.setInterval(() => {
      void loadConversations(false)
    }, 5000)

    return () => {
      isMounted = false
      window.clearInterval(intervalId)
    }
  }, [isLoggedIn, user?.id])

  useEffect(() => {
    if (!selectedConversationId || !isLoggedIn) {
      setConversationDetail(null)
      return
    }

    let isMounted = true
    const loadMessages = async (isInitial = false) => {
      if (isInitial) {
        setIsLoadingMessages(true)
      }
      try {
        const detail = await authorizedFetch<ConversationDetail>(
          API_ENDPOINTS.CHAT.conversationMessages(selectedConversationId),
        )
        if (!isMounted) {
          return
        }

        const incomingMessages = detail.messages
          .filter((message) => message.sender.id !== user?.id)
        const hasNewIncomingMessage = incomingMessages.some(
          (message) => !knownIncomingMessageIds.current.has(message.id),
        )

        incomingMessages.forEach((message) => {
          knownIncomingMessageIds.current.add(message.id)
        })

        setConversationDetail(detail)
        setConversations((current) =>
          current.map((conversation) =>
            conversation.id === selectedConversationId
              ? {
                  ...conversation,
                  unreadCount: 0,
                  latestMessage: detail.messages.length
                    ? {
                        id: detail.messages[detail.messages.length - 1].id,
                        content: detail.messages[detail.messages.length - 1].content,
                        createdAt: detail.messages[detail.messages.length - 1].createdAt,
                        senderId: detail.messages[detail.messages.length - 1].sender.id,
                        senderName:
                          detail.messages[detail.messages.length - 1].sender.fullName ??
                          detail.messages[detail.messages.length - 1].sender.username,
                      }
                    : conversation.latestMessage,
                }
              : conversation,
          ),
        )

        if (detail.messages.length > 0) {
          void authorizedFetch<{ success: boolean }>(API_ENDPOINTS.CHAT.conversationRead(selectedConversationId), {
            method: 'POST',
            body: JSON.stringify({}),
          })
        }

        if (!isInitial && hasNewIncomingMessage) {
          void playNotificationSound()
        }
      } catch (fetchError) {
        if (isMounted) {
          setError(fetchError instanceof Error ? fetchError.message : 'Khong tai duoc tin nhan')
        }
      } finally {
        if (isMounted && isInitial) {
          setIsLoadingMessages(false)
        }
      }
    }

    void loadMessages(true)
    const intervalId = window.setInterval(() => {
      void loadMessages(false)
    }, 3000)

    return () => {
      isMounted = false
      window.clearInterval(intervalId)
    }
  }, [isLoggedIn, selectedConversationId, user?.id])

  useEffect(() => {
    if (!isLoggedIn) {
      setIsSocketConnected(false)
      socketRef.current?.disconnect()
      socketRef.current = null
      return
    }

    const token = localStorage.getItem('access_token')
    if (!token) {
      return
    }

    const socket = io(socketBaseUrl, {
      auth: { token },
    })
    socketRef.current = socket

    const handleConnect = () => {
      setIsSocketConnected(true)

      const joinedConversationId = selectedConversationIdRef.current
      if (joinedConversationId) {
        void emitWithAck<{ success: boolean }>(socket, 'chat:join', {
          conversationId: joinedConversationId,
        }).catch(() => {
          // ignore room rejoin errors
        })
      }
    }

    const handleDisconnect = () => {
      setIsSocketConnected(false)
    }

    const handleConversationRefresh = () => {
      void authorizedFetch<ConversationListItem[]>(API_ENDPOINTS.CHAT.CONVERSATIONS)
        .then((data) => {
          setConversations(data)
        })
        .catch(() => {
          // ignore transient refresh failures
        })
    }

    const handleNewMessage = (payload: NewMessageEvent) => {
      const isMine = payload.message.sender.id === user?.id
      const isCurrentConversation = payload.conversationId === selectedConversationIdRef.current
      const isNewIncoming = !isMine && !knownIncomingMessageIds.current.has(payload.message.id)

      knownIncomingMessageIds.current.add(payload.message.id)

      setConversations((current) =>
        current
          .map((conversation) => {
            if (conversation.id !== payload.conversationId) {
              return conversation
            }

            return {
              ...conversation,
              updatedAt: payload.message.createdAt,
              latestMessage: {
                id: payload.message.id,
                content: payload.message.content,
                createdAt: payload.message.createdAt,
                senderId: payload.message.sender.id,
                senderName: payload.message.sender.fullName ?? payload.message.sender.username,
              },
              unreadCount: isCurrentConversation || isMine ? 0 : conversation.unreadCount + 1,
            }
          })
          .sort((left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime()),
      )

      if (isCurrentConversation) {
        setConversationDetail((current) => {
          if (!current || current.id !== payload.conversationId) {
            return current
          }

          if (current.messages.some((message) => message.id === payload.message.id)) {
            return current
          }

          return {
            ...current,
            messages: [...current.messages, payload.message],
          }
        })

        if (!isMine) {
          void emitWithAck<{ success: boolean }>(socket, 'chat:read', {
            conversationId: payload.conversationId,
          }).catch(() => {
            // ignore read sync errors
          })
        }
      }

      if (isNewIncoming) {
        void playNotificationSound()
      }
    }

    socket.on('connect', handleConnect)
    socket.on('disconnect', handleDisconnect)
    socket.on('chat:conversation:refresh', handleConversationRefresh)
    socket.on('chat:message:new', handleNewMessage)

    return () => {
      socket.off('connect', handleConnect)
      socket.off('disconnect', handleDisconnect)
      socket.off('chat:conversation:refresh', handleConversationRefresh)
      socket.off('chat:message:new', handleNewMessage)
      socket.disconnect()
      if (socketRef.current === socket) {
        socketRef.current = null
      }
      setIsSocketConnected(false)
    }
  }, [isLoggedIn, socketBaseUrl, user?.id])

  useEffect(() => {
    if (!socketRef.current || !selectedConversationId) {
      return
    }

    const socket = socketRef.current
    void emitWithAck<{ success: boolean }>(socket, 'chat:join', {
      conversationId: selectedConversationId,
    }).catch(() => {
      // ignore join errors, REST still works
    })

    return () => {
      void emitWithAck<{ success: boolean }>(socket, 'chat:leave', {
        conversationId: selectedConversationId,
      }).catch(() => {
        // ignore leave errors
      })
    }
  }, [selectedConversationId])

  useEffect(() => {
    if (!messageContainerRef.current) {
      return
    }

    const container = messageContainerRef.current
    const messageCount = conversationDetail?.messages.length ?? 0
    const previousMessageCount = previousMessageCountRef.current
    const hasNewMessage = messageCount > previousMessageCount

    if (hasNewMessage && shouldAutoScrollRef.current) {
      container.scrollTop = container.scrollHeight
    }

    previousMessageCountRef.current = messageCount
  }, [conversationDetail?.messages])

  useEffect(() => {
    const container = messageContainerRef.current
    if (!container) {
      return
    }

    const updateScrollIntent = () => {
      const distanceFromBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight
      shouldAutoScrollRef.current = distanceFromBottom < 80
    }

    updateScrollIntent()
    container.addEventListener('scroll', updateScrollIntent)

    return () => {
      container.removeEventListener('scroll', updateScrollIntent)
    }
  }, [selectedConversationId, conversationDetail?.messages.length])

  const handleSendMessage = async (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault()

    if (!selectedConversationId || !messageInput.trim() || isSending) {
      return
    }

    setIsSending(true)
    const content = messageInput.trim()

    try {
      const socket = socketRef.current
      if (!socket || !isSocketConnected) {
        throw new Error('Realtime socket is not connected')
      }

      const response = await emitWithAck<{ success: boolean; message: ChatMessage }>(
        socket,
        'chat:send',
        {
          conversationId: selectedConversationId,
          content,
        },
      )
      const message = response.message

      knownIncomingMessageIds.current.add(message.id)
      setConversationDetail((current) => {
        if (!current || current.id !== selectedConversationId) {
          return current
        }

        if (current.messages.some((item) => item.id === message.id)) {
          return current
        }

        return {
          ...current,
          messages: [...current.messages, message],
        }
      })
      setConversations((current) =>
        current
          .map((conversation) =>
            conversation.id === selectedConversationId
              ? {
                  ...conversation,
                  latestMessage: {
                    id: message.id,
                    content: message.content,
                    createdAt: message.createdAt,
                    senderId: message.sender.id,
                    senderName: message.sender.fullName ?? message.sender.username,
                  },
                  unreadCount: 0,
                  updatedAt: message.createdAt,
                }
              : conversation,
          )
          .sort((left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime()),
      )
      setMessageInput('')
      setError(null)
    } catch {
      try {
        const message = await authorizedFetch<ChatMessage>(
          API_ENDPOINTS.CHAT.conversationMessages(selectedConversationId),
          {
            method: 'POST',
            body: JSON.stringify({ content }),
          },
        )

        knownIncomingMessageIds.current.add(message.id)
        setConversationDetail((current) => {
          if (!current || current.id !== selectedConversationId) {
            return current
          }
          return {
            ...current,
            messages: [...current.messages, message],
          }
        })
        setConversations((current) =>
          current
            .map((conversation) =>
              conversation.id === selectedConversationId
                ? {
                    ...conversation,
                    latestMessage: {
                      id: message.id,
                      content: message.content,
                      createdAt: message.createdAt,
                      senderId: message.sender.id,
                      senderName: message.sender.fullName ?? message.sender.username,
                    },
                    unreadCount: 0,
                    updatedAt: message.createdAt,
                  }
                : conversation,
            )
            .sort((left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime()),
        )
        setMessageInput('')
        setError(null)
      } catch (sendError) {
        setError(sendError instanceof Error ? sendError.message : 'Khong gui duoc tin nhan')
      }
    } finally {
      setIsSending(false)
    }
  }

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      void handleSendMessage()
    }
  }

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setMessageInput((value) => `${value}${emojiData.emoji}`)
  }

  const handleMarkConversationRead = async () => {
    if (!selectedConversationId) {
      return
    }

    try {
      await authorizedFetch<{ success: boolean }>(API_ENDPOINTS.CHAT.conversationRead(selectedConversationId), {
        method: 'POST',
        body: JSON.stringify({}),
      })

      const socket = socketRef.current
      if (socket && isSocketConnected) {
        void emitWithAck<{ success: boolean }>(socket, 'chat:read', {
          conversationId: selectedConversationId,
        }).catch(() => {
          // ignore realtime read sync errors
        })
      }

      setConversations((current) =>
        current.map((conversation) =>
          conversation.id === selectedConversationId
            ? {
                ...conversation,
                unreadCount: 0,
              }
            : conversation,
        ),
      )
      setShowConversationMenu(false)
    } catch (markReadError) {
      setError(markReadError instanceof Error ? markReadError.message : 'Không đánh dấu đã đọc được')
    }
  }

  const handleRefreshCurrentConversation = async () => {
    if (!selectedConversationId) {
      return
    }

    try {
      const detail = await authorizedFetch<ConversationDetail>(
        API_ENDPOINTS.CHAT.conversationMessages(selectedConversationId),
      )
      setConversationDetail(detail)
      setConversations((current) =>
        current.map((conversation) =>
          conversation.id === selectedConversationId
            ? {
                ...conversation,
                unreadCount: 0,
                latestMessage: detail.messages.length
                  ? {
                      id: detail.messages[detail.messages.length - 1].id,
                      content: detail.messages[detail.messages.length - 1].content,
                      createdAt: detail.messages[detail.messages.length - 1].createdAt,
                      senderId: detail.messages[detail.messages.length - 1].sender.id,
                      senderName:
                        detail.messages[detail.messages.length - 1].sender.fullName ??
                        detail.messages[detail.messages.length - 1].sender.username,
                    }
                  : conversation.latestMessage,
              }
            : conversation,
        ),
      )
      setShowConversationMenu(false)
    } catch (refreshError) {
      setError(refreshError instanceof Error ? refreshError.message : 'Không làm mới được hội thoại')
    }
  }

  const handleCopyConversationId = async () => {
    if (!selectedConversationId) {
      return
    }

    try {
      await navigator.clipboard.writeText(selectedConversationId)
      setShowConversationMenu(false)
    } catch {
      setError('Không sao chép được mã hội thoại')
    }
  }

  if (loading || isLoadingConversations) {
    return (
      <div className="bg-[#f2f2f2]">
        <div className="mx-auto max-w-[1020px] px-3 pb-3 pt-2 sm:pb-8 sm:pt-3">
          <div className="flex min-h-[420px] items-center justify-center border border-[#d8d8d8] bg-white">
            <LoadingSpinner />
          </div>
        </div>
      </div>
    )
  }

  if (!isLoggedIn) {
    return (
      <div className="bg-[#f2f2f2]">
        <div className="mx-auto max-w-[1020px] px-3 pb-3 pt-2 sm:pb-8 sm:pt-3">
        <div className="border border-[#d8d8d8] bg-white px-6 py-10 text-center">
          <h1 className="text-[28px] font-semibold text-[#383838]">Tin nhan</h1>
          <p className="mt-3 text-[14px] text-[#6b6b6b]">Bạn cần đăng nhập để xem và gửi tin nhắn.</p>
        </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#f2f2f2]">
      <div className="mx-auto h-[calc(100dvh-132px)] max-w-[1020px] overflow-hidden px-3 pb-0 pt-2 sm:h-[calc(100dvh-150px)] sm:pt-3">
        <section className="h-full overflow-hidden border border-[#d8d8d8] bg-white lg:grid lg:grid-cols-[350px_1fr]">
        <aside className={`border-r border-[#d8d8d8] ${mobileView === 'detail' ? 'hidden lg:block' : 'block'}`}>
          <div className="grid grid-cols-[1fr_44px] border-b border-[#d8d8d8]">
            <div className="flex items-center gap-1 px-4 py-2.5">
              <h2 className="text-[22px] font-semibold leading-none text-[#383838]">Gần đây</h2>
              <i className="fas fa-volume-up text-[14px] text-[#5f5f5f]"></i>
            </div>
            <button type="button" className="flex items-center justify-center border-l border-[#d8d8d8] text-[18px] font-bold text-[#1f86aa] hover:bg-[#f6f6f6]">
              <span aria-hidden>&laquo;</span>
            </button>
          </div>

          <div className="h-[calc(100%-58px)] overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="px-4 py-10 text-center text-[13px] text-[#7c7c7c]">
                Chưa có cuộc trò chuyện nào.
              </div>
            ) : (
              conversations.map((chat) => {
                const isActive = chat.id === selectedConversationId

                return (
                  <button
                    key={chat.id}
                    type="button"
                    onClick={() => {
                      setSelectedConversationId(chat.id)
                      setMobileView('detail')
                    }}
                    className={`flex w-full items-start gap-3 border-b border-[#e8e8e8] px-3 py-3 text-left ${isActive ? 'bg-[#eceff1]' : 'bg-white hover:bg-[#f8f8f8]'}`}
                  >
                    <Avatar
                      alt={chat.title}
                      src={getChatAvatarSrc(chat.otherParticipant?.role)}
                      className={chat.otherParticipant?.role === 'ADMIN' ? 'h-10 w-10' : ''}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center justify-between gap-2">
                        <div className="flex min-w-0 items-center gap-2">
                          <p className="truncate text-[14px] font-semibold leading-none text-[#3a3a3a]">{chat.title}</p>
                          {chat.otherParticipant?.role === 'ADMIN' && (
                            <i className="fas fa-check-circle text-[12px] text-[#e73f36]"></i>
                          )}
                        </div>
                        <span className="shrink-0 text-[12px] text-[#4f4f4f]">{formatConversationDate(chat.updatedAt)}</span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-[12px] text-[#8a8a8a]">{chat.latestMessage?.content ?? 'Chưa có tin nhắn'}</p>
                        {chat.unreadCount > 0 && (
                          <span className="rounded-full bg-[#0b7f9f] px-2 py-0.5 text-[11px] font-semibold text-white">
                            {chat.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </aside>

        <div className={`${mobileView === 'list' ? 'hidden lg:flex' : 'flex'} h-full min-h-0 flex-1 flex-col`}>
          <div className="shrink-0 border-b border-[#d8d8d8] bg-[#f7f7f7] px-3 py-2">
            <div className="relative flex items-center justify-center">
              <div className="flex items-center justify-center gap-1 text-[18px] font-semibold leading-none text-[#3a3a3a]">
                {selectedParticipant?.role === 'ADMIN' && (
                  <Avatar
                    alt={selectedConversation?.title ?? 'support'}
                    src={SUPPORT_AVATAR_SRC}
                    className="h-10 w-10 border-[#f3bfd0]"
                  />
                )}
                <span>@{selectedConversation?.title ?? 'chat'}</span>
                {selectedParticipant?.role === 'ADMIN' && (
                  <i className="fas fa-check-circle text-[14px] text-[#e73f36]"></i>
                )}
                <span
                  className={`text-[18px] ${selectedParticipant?.online ? 'text-[#48a84f]' : 'text-[#8a8a8a]'}`}
                >
                  {selectedParticipantStatus}
                </span>
              </div>
            </div>
            <div className="mt-1 flex items-center gap-1 lg:block">
              <button
                type="button"
                onClick={() => setMobileView('list')}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-sm text-[28px] leading-none text-[#1f86aa] lg:hidden"
                aria-label="Quay lai danh sach hoi thoai"
              >
                &laquo;
              </button>
              <p className="block min-w-0 flex-1 overflow-hidden whitespace-nowrap text-ellipsis bg-[#f8cf42] px-2 py-0.5 text-left text-[10px] font-semibold text-[#2e2e2e] lg:mx-auto lg:w-fit lg:text-center">
                Xin hãy cảnh giác với giao dịch không được bảo hiểm bên ngoài sàn!
              </p>
            </div>
          </div>

          <div
            ref={messageContainerRef}
            className={`min-h-0 flex-1 space-y-3 overflow-y-auto bg-white px-3 py-4 sm:px-4 ${
              shouldDockComposerToKeyboard ? 'pb-[88px]' : 'pb-4'
            } lg:pb-4`}
          >
            {error && (
              <div className="rounded border border-[#f1c5c5] bg-[#fff3f3] px-3 py-2 text-[13px] text-[#a43f3f]">
                {error}
              </div>
            )}

            {isLoadingMessages ? (
              <div className="flex h-full items-center justify-center py-12">
                <LoadingSpinner />
              </div>
            ) : conversationDetail?.messages?.length ? (
              conversationDetail.messages.map((message) => {
                const isMine = message.sender.id === user?.id

                return (
                  <div key={message.id} className={`flex items-start gap-2 ${isMine ? 'justify-end' : 'justify-start'}`}>
                    {!isMine && (
                      <Avatar
                        alt={message.sender.fullName ?? message.sender.username}
                        src={getChatAvatarSrc(selectedParticipant?.role)}
                      />
                    )}
                    <div className={isMine ? 'max-w-[82%] sm:max-w-[68%]' : 'max-w-[82%] sm:max-w-[72%]'}>
                      <div className={`rounded-[4px] px-3 py-2 text-[16px] leading-[1.3] ${isMine ? 'bg-[#0b7f9f] text-white' : 'bg-[#efefef] text-[#3f3f3f]'}`}>
                        {message.content}
                      </div>
                      <p className={`mt-1 text-[11px] text-[#7a7a7a] ${isMine ? 'text-right' : ''}`}>
                        {formatMessageTime(message.createdAt)}
                      </p>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="flex h-full items-center justify-center py-12 text-[13px] text-[#7c7c7c]">
                Chưa có tin nhắn trong cuộc trò chuyện này.
              </div>
            )}
          </div>

          <div
            className={`shrink-0 border-t border-[#d8d8d8] bg-white px-3 py-2 ${
              shouldDockComposerToKeyboard ? 'fixed left-0 right-0 z-20' : 'sticky bottom-0 z-10'
            } lg:static lg:z-10`}
            style={{
              bottom: shouldDockComposerToKeyboard ? mobileKeyboardOffset : 0,
              paddingBottom: `calc(0.5rem + env(safe-area-inset-bottom, 0px))`,
            }}
          >
            <form onSubmit={handleSendMessage} className="flex items-center gap-3">
              <button type="button" className="text-[#707070]" aria-label="Dinh kem tep" disabled>
                <i className="far fa-file text-[18px]"></i>
              </button>
              <div ref={emojiPickerRef} className="relative">
                <button
                  type="button"
                  className="text-[#707070] hover:text-[#0b7f9f]"
                  aria-label="Bieu cam"
                  onClick={() => {
                    setShowEmojiPicker((value) => !value)
                    setShowConversationMenu(false)
                  }}
                >
                  <i className="far fa-smile text-[18px]"></i>
                </button>
                {showEmojiPicker && (
                  <div className="absolute bottom-10 left-0 z-20 overflow-hidden rounded border border-[#d8d8d8] bg-white shadow-lg">
                    <EmojiPicker
                      onEmojiClick={handleEmojiClick}
                      width={300}
                      height={360}
                      searchDisabled={false}
                      skinTonesDisabled
                      lazyLoadEmojis
                    />
                  </div>
                )}
              </div>
              <div ref={conversationMenuRef} className="relative">
                <button
                  type="button"
                  className="text-[#707070] hover:text-[#0b7f9f]"
                  aria-label="Tuy chon hoi thoai"
                  onClick={() => {
                    setShowConversationMenu((value) => !value)
                    setShowEmojiPicker(false)
                  }}
                >
                  <i className="fas fa-list text-[15px]"></i>
                </button>
                {showConversationMenu && (
                  <div className="absolute bottom-10 left-0 z-20 min-w-[170px] rounded border border-[#d8d8d8] bg-white py-1 shadow-lg">
                    <button
                      type="button"
                      className="block w-full px-3 py-2 text-left text-[13px] text-[#333] hover:bg-[#f2f2f2]"
                      onClick={handleMarkConversationRead}
                    >
                      Danh dau da doc
                    </button>
                    <button
                      type="button"
                      className="block w-full px-3 py-2 text-left text-[13px] text-[#333] hover:bg-[#f2f2f2]"
                      onClick={handleRefreshCurrentConversation}
                    >
                      Lam moi hoi thoai
                    </button>
                    <button
                      type="button"
                      className="block w-full px-3 py-2 text-left text-[13px] text-[#333] hover:bg-[#f2f2f2]"
                      onClick={handleCopyConversationId}
                    >
                      Sao chep ma hoi thoai
                    </button>
                  </div>
                )}
              </div>
              <input
                type="text"
                value={messageInput}
                onChange={(event) => setMessageInput(event.target.value)}
                onKeyDown={handleInputKeyDown}
                onFocus={() => {
                  setIsComposerFocused(true)
                  setMobileKeyboardOffset(0)
                  window.requestAnimationFrame(updateKeyboardOffset)
                  window.setTimeout(updateKeyboardOffset, 80)
                }}
                onBlur={() => {
                  setIsComposerFocused(false)
                  setMobileKeyboardOffset(0)
                }}
                placeholder="Type a message"
                disabled={!selectedConversationId || isSending}
                className="h-9 flex-1 text-[14px] outline-none placeholder:text-[#949494] disabled:cursor-not-allowed disabled:text-[#9b9b9b]"
              />
              <button
                type="submit"
                aria-label="Gui tin nhan"
                disabled={!selectedConversationId || !messageInput.trim() || isSending}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0f86aa] text-white hover:bg-[#0d7594]"
              >
                <i className="fas fa-paper-plane text-[15px]"></i>
              </button>
            </form>
          </div>
        </div>
        </section>
      </div>
    </div>
  )
}
