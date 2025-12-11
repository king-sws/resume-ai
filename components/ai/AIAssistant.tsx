/* eslint-disable @typescript-eslint/no-explicit-any */
// components/ai/AIAssistant.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Sparkles, Loader2, X, Minimize2, Maximize2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface AIAssistantProps {
  resumeId?: string
  context?: {
    section?: string
    data?: any
  }
}

export function AIAssistant({ resumeId, context }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hi! I\'m your AI resume assistant. I can help you improve your resume, suggest better phrasing, or answer any career-related questions. How can I help you today?',
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [creditsRemaining, setCreditsRemaining] = useState<number | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          resumeId,
          context,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response')
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      }

      setMessages(prev => [...prev, assistantMessage])
      setCreditsRemaining(data.creditsRemaining)
    } catch (error) {
      const errorMessage: Message = {
        role: 'assistant',
        content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-4 rounded-full bg-linear-to-r from-[#50a3f8] to-[#2fabb8] text-white shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 z-50 group"
      >
        <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />
        <span className="absolute -top-2 -right-2 px-2 py-1 text-xs font-bold bg-red-500 text-white rounded-full animate-pulse">
          AI
        </span>
      </button>
    )
  }

  return (
    <div
      className={`fixed ${
        isMinimized ? 'bottom-6 right-6 w-80' : 'bottom-6 right-6 w-96'
      } bg-[#242525] border border-[#2a2b2b] rounded-2xl shadow-2xl z-50 flex flex-col transition-all duration-300`}
      style={{ height: isMinimized ? '60px' : '600px' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#2a2b2b] bg-linear-to-r from-[#50a3f8] to-[#2fabb8] rounded-t-2xl">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-white/10">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white">AI Assistant</h3>
            {creditsRemaining !== null && (
              <p className="text-xs text-white/70">
                {creditsRemaining} credits remaining
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
          >
            {isMinimized ? (
              <Maximize2 className="w-4 h-4 text-white" />
            ) : (
              <Minimize2 className="w-4 h-4 text-white" />
            )}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-linear-to-r from-[#50a3f8] to-[#2fabb8] text-white'
                      : 'bg-[#2a2b2b] text-[#e5e7eb]'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <p className="text-xs mt-1 opacity-60">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-[#2a2b2b] rounded-2xl px-4 py-3">
                  <Loader2 className="w-5 h-5 text-[#50a3f8] animate-spin" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-[#2a2b2b]">
            <div className="flex gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about your resume..."
                className="flex-1 bg-[#2a2b2b] border border-[#3a3b3b] rounded-xl px-4 py-3 text-sm text-white placeholder:text-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#50a3f8] resize-none"
                rows={2}
                disabled={isLoading}
              />
              <Button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                className="bg-linear-to-r from-[#50a3f8] to-[#2fabb8] hover:opacity-90 text-white self-end"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}