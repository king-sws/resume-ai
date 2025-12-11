// components/ai/AIAssistantPageClient.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import { 
  Send, 
  Brain,
  Zap,
  FileText,
  Crown,
  Lightbulb,
  Sparkles,
  Copy,
  Check,
  Clock,
  TrendingUp
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface Resume {
  id: string
  title: string
  status: string
}

interface Interaction {
  id: string
  prompt: string
  response: string
  createdAt: Date
}

interface AIAssistantPageClientProps {
  resumes: Resume[]
  creditsUsed: number
  creditsLimit: number
  recentInteractions: Interaction[]
}

export function AIAssistantPageClient({
  resumes,
  creditsUsed,
  creditsLimit,
  recentInteractions,
}: AIAssistantPageClientProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m your AI resume assistant. I can help you with:\n\n• Writing compelling resume summaries\n• Crafting impactful job descriptions\n• Optimizing for ATS systems\n• Career advice and tips\n• Resume best practices\n\nHow can I help you today?',
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedResume, setSelectedResume] = useState<string | null>(null)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const creditsRemaining = creditsLimit - creditsUsed
  const creditsPercentage = (creditsUsed / creditsLimit) * 100

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const copyToClipboard = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    if (creditsRemaining <= 0) {
      alert('You\'ve run out of AI credits. Please upgrade to Pro for more!')
      return
    }

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
          resumeId: selectedResume,
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

  const quickPrompts = [
    "Help me write a professional summary",
    "How do I make my resume ATS-friendly?",
    "Suggest strong action verbs for my experience",
    "What skills should I highlight?",
  ]

  return (
    <div className="min-h-screen overflow-hidden bg-linear-to-br from-[#0f1011] via-[#191a1a] to-[#0f1011]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Header */}
        <div className="mb-8 relative">
          <div className="absolute inset-0 bg-linear-to-r from-[#50a3f8]/20 to-[#2fabb8]/20 blur-3xl -z-10" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative group">
                <div className="absolute inset-0 bg-linear-to-br from-[#50a3f8] to-[#2fabb8] rounded-2xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity" />
                <div className="relative p-4 rounded-2xl bg-linear-to-br from-[#50a3f8] to-[#2fabb8]">
                  <Brain className="w-8 h-8 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-linear-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  AI Assistant
                </h1>
                <p className="text-[#9ca3af] mt-1 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Your intelligent resume companion
                </p>
              </div>
            </div>
            
            {/* Stats Badge */}
            <div className="hidden md:flex items-center gap-4 bg-[#242525]/50 backdrop-blur-sm border border-[#2a2b2b] rounded-xl px-6 py-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#10b981]" />
                <div>
                  <p className="text-xs text-[#9ca3af]">Interactions</p>
                  <p className="text-sm font-semibold text-white">{recentInteractions.length}</p>
                </div>
              </div>
              <div className="w-px h-8 bg-[#2a2b2b]" />
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#50a3f8]" />
                <div>
                  <p className="text-xs text-[#9ca3af]">Resumes</p>
                  <p className="text-sm font-semibold text-white">{resumes.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Enhanced Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Credits Card with Animation */}
            <div className="group relative overflow-hidden p-6 rounded-2xl border border-[#2a2b2b] bg-linear-to-br from-[#242525] to-[#1a1b1b] hover:border-[#3a3b3b] transition-all duration-300">
              <div className="absolute inset-0 bg-linear-to-br from-[#50a3f8]/5 to-[#2fabb8]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${
                      creditsPercentage >= 80 
                        ? 'bg-linear-to-br from-[#ef4444]/20 to-[#dc2626]/20' 
                        : 'bg-linear-to-br from-[#f59e0b]/20 to-[#d97706]/20'
                    }`}>
                      <Zap className={`w-5 h-5 ${
                        creditsPercentage >= 80 ? 'text-[#ef4444]' : 'text-[#f59e0b]'
                      }`} />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">AI Credits</h3>
                      <p className="text-xs text-[#9ca3af]">Monthly allowance</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-end justify-between">
                    <span className="text-3xl font-bold text-white">{creditsRemaining}</span>
                    <span className="text-sm text-[#9ca3af]">/ {creditsLimit}</span>
                  </div>

                  <div className="relative h-3 bg-[#1a1b1b] rounded-full overflow-hidden">
                    <div className="absolute inset-0 bg-linear-to-r from-[#2a2b2b] to-[#1a1b1b]" />
                    <div
                      className={`absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out ${
                        creditsPercentage >= 80
                          ? 'bg-linear-to-r from-[#ef4444] via-[#f87171] to-[#dc2626]'
                          : 'bg-linear-to-r from-[#f59e0b] via-[#fbbf24] to-[#d97706]'
                      }`}
                      style={{ width: `${Math.min(creditsPercentage, 100)}%` }}
                    >
                      <div className="absolute inset-0 bg-white/20 animate-pulse" />
                    </div>
                  </div>

                  {creditsPercentage >= 80 && (
                    <Link href="/dashboard/upgrade">
                      <Button
                        size="sm"
                        className="w-full bg-linear-to-r from-[#50a3f8] to-[#2fabb8] hover:from-[#4a98e8] hover:to-[#2a9ba8] text-white shadow-lg shadow-[#50a3f8]/20 transition-all duration-300"
                      >
                        <Crown className="w-4 h-4 mr-2" />
                        Upgrade to Pro
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* Resume Context */}
            {resumes.length > 0 && (
              <div className="group p-6 rounded-2xl border border-[#2a2b2b] bg-linear-to-br from-[#242525] to-[#1a1b1b] hover:border-[#3a3b3b] transition-all duration-300">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 rounded-lg bg-[#50a3f8]/10">
                    <FileText className="w-4 h-4 text-[#50a3f8]" />
                  </div>
                  <h3 className="text-sm font-semibold text-white">Resume Context</h3>
                </div>
                <select
                  value={selectedResume || ''}
                  onChange={(e) => setSelectedResume(e.target.value || null)}
                  className="w-full bg-[#1a1b1b] border border-[#2a2b2b] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#50a3f8] focus:border-transparent transition-all"
                >
                  <option value="">No context selected</option>
                  {resumes.map((resume) => (
                    <option key={resume.id} value={resume.id}>
                      {resume.title}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-[#6b7280] mt-3 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Context-aware AI suggestions
                </p>
              </div>
            )}

            {/* Quick Tips */}
            {/* <div className="group p-6 rounded-2xl border border-[#2a2b2b] bg-linear-to-br from-[#242525] to-[#1a1b1b] hover:border-[#3a3b3b] transition-all duration-300">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-lg bg-[#f59e0b]/10">
                  <Lightbulb className="w-4 h-4 text-[#f59e0b]" />
                </div>
                <h3 className="text-sm font-semibold text-white">Pro Tips</h3>
              </div>
              <ul className="text-xs text-[#9ca3af] space-y-3">
                <li className="flex items-start gap-2">
                  <span className="text-[#50a3f8] mt-0.5">•</span>
                  <span>Be specific about what you need help with</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#50a3f8] mt-0.5">•</span>
                  <span>Provide context for better suggestions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#50a3f8] mt-0.5">•</span>
                  <span>Ask follow-up questions for refinement</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#50a3f8] mt-0.5">•</span>
                  <span>Use quick prompts to get started</span>
                </li>
              </ul>
            </div> */}
          </div>

          {/* Enhanced Chat Area */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-[#2a2b2b] bg-linear-to-br from-[#242525] to-[#1a1b1b] flex flex-col h-[calc(100vh-16rem)] shadow-2xl">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex gap-4 ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    } animate-fade-in`}
                  >
                    {message.role === 'assistant' && (
                      <div className="shrink-0 w-10 h-10 rounded-xl bg-linear-to-br from-[#50a3f8] to-[#2fabb8] flex items-center justify-center shadow-lg">
                        <Brain className="w-5 h-5 text-white" />
                      </div>
                    )}
                    
                    <div
                      className={`max-w-[80%] rounded-2xl px-5 py-4 ${
                        message.role === 'user'
                          ? 'bg-linear-to-br from-[#50a3f8] to-[#2fabb8] text-white shadow-lg shadow-[#50a3f8]/20'
                          : 'bg-[#1a1b1b] text-[#e5e7eb] border border-[#2a2b2b]'
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
                        <p className="text-xs opacity-60 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {message.timestamp.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                        {message.role === 'assistant' && (
                          <button
                            onClick={() => copyToClipboard(message.content, index)}
                            className="text-xs opacity-60 hover:opacity-100 transition-opacity flex items-center gap-1"
                          >
                            {copiedIndex === index ? (
                              <>
                                <Check className="w-3 h-3" />
                                Copied
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                Copy
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    {message.role === 'user' && (
                      <div className="shrink-0 w-10 h-10 rounded-xl bg-linear-to-br from-[#6b7280] to-[#4b5563] flex items-center justify-center text-white font-semibold shadow-lg">
                        U
                      </div>
                    )}
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex gap-4 justify-start">
                    <div className="shrink-0 w-10 h-10 rounded-xl bg-linear-to-br from-[#50a3f8] to-[#2fabb8] flex items-center justify-center shadow-lg">
                      <Brain className="w-5 h-5 text-white" />
                    </div>
                    <div className="bg-[#1a1b1b] border border-[#2a2b2b] rounded-2xl px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#50a3f8] animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 rounded-full bg-[#50a3f8] animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 rounded-full bg-[#50a3f8] animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompts */}
              {messages.length === 1 && (
                <div className="px-6 pb-4">
                  <p className="text-xs text-[#6b7280] mb-3 flex items-center gap-2">
                    <Sparkles className="w-3 h-3" />
                    Quick start prompts:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {quickPrompts.map((prompt, index) => (
                      <button
                        key={index}
                        onClick={() => setInput(prompt)}
                        className="group text-left text-sm p-4 rounded-xl bg-[#1a1b1b] border border-[#2a2b2b] hover:border-[#50a3f8] text-[#9ca3af] hover:text-white transition-all duration-300 hover:shadow-lg hover:shadow-[#50a3f8]/10"
                      >
                        <span className="flex items-center justify-between">
                          {prompt}
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                            →
                          </span>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Enhanced Input */}
              <div className="p-6 border-t border-[#2a2b2b] bg-[#1a1b1b]/50 backdrop-blur-sm">
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <textarea
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask me anything about your resume..."
                      className="w-full bg-[#242525] border border-[#2a2b2b] rounded-xl px-5 py-4 text-sm text-white placeholder:text-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#50a3f8] focus:border-transparent resize-none transition-all"
                      rows={3}
                      disabled={isLoading || creditsRemaining <= 0}
                    />
                    {input && (
                      <div className="absolute bottom-3 right-3 text-xs text-[#6b7280]">
                        {input.length} chars
                      </div>
                    )}
                  </div>
                  <Button
                    onClick={sendMessage}
                    disabled={!input.trim() || isLoading || creditsRemaining <= 0}
                    className="bg-linear-to-r from-[#50a3f8] to-[#2fabb8] hover:from-[#4a98e8] hover:to-[#2a9ba8] text-white self-end h-[84px] px-8 rounded-xl shadow-lg shadow-[#50a3f8]/20 hover:shadow-[#50a3f8]/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <p className="text-xs text-[#6b7280]">
                    Press <kbd className="px-2 py-0.5 rounded bg-[#2a2b2b] text-white">Enter</kbd> to send, <kbd className="px-2 py-0.5 rounded bg-[#2a2b2b] text-white">Shift+Enter</kbd> for new line
                  </p>
                  {creditsRemaining <= 0 && (
                    <p className="text-xs text-[#ef4444]">No credits remaining</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}