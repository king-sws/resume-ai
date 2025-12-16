// components/settings/APIKeySettings.tsx
'use client'

import { useState, useEffect } from 'react'
import { Key, Eye, EyeOff, Save, ExternalLink, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function APIKeySettings() {
  const [provider, setProvider] = useState<'openai' | 'deepseek'>('openai')
  const [apiKey, setApiKey] = useState('')
  const [showKey, setShowKey] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  // Load saved API key on mount
  useEffect(() => {
    const savedKey = localStorage.getItem(`${provider}_api_key`)
    if (savedKey) {
      setApiKey(savedKey)
      setIsSaved(true)
    } else {
      setApiKey('')
      setIsSaved(false)
    }
  }, [provider])

  const handleSave = () => {
    if (!apiKey.trim()) {
      toast.error('Please enter an API key')
      return
    }

    setIsLoading(true)
    try {
      // Save to localStorage (in production, consider encrypting or storing server-side)
      localStorage.setItem(`${provider}_api_key`, apiKey)
      localStorage.setItem('ai_provider', provider)
      
      setIsSaved(true)
      toast.success('API key saved successfully')
    } catch (error) {
      toast.error('Failed to save API key')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClear = () => {
    localStorage.removeItem(`${provider}_api_key`)
    setApiKey('')
    setIsSaved(false)
    toast.success('API key removed')
  }

  const providers = [
    {
      value: 'openai',
      label: 'OpenAI',
      getKeyUrl: 'https://platform.openai.com/api-keys',
      description: 'GPT-4 and GPT-3.5 models',
      pricing: 'More expensive, best quality',
    },
    {
      value: 'deepseek',
      label: 'DeepSeek',
      getKeyUrl: 'https://platform.deepseek.com/api_keys',
      description: 'DeepSeek Chat models',
      pricing: 'Much cheaper, good quality',
    },
  ]

  const currentProvider = providers.find(p => p.value === provider)

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl  p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Key className="w-5 h-5 text-slate-600" />
        <h2 className="text-xl font-semibold text-white/90">AI API Configuration</h2>
      </div>

      <div className="space-y-6">
        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900">
              <p className="font-medium mb-1">Bring your own API key</p>
              <p className="text-blue-700">
                Use your own OpenAI or DeepSeek API key to power AI features. 
                Your key is stored locally and never sent to our servers.
              </p>
            </div>
          </div>
        </div>

        {/* Provider Selection */}
        <div className="space-y-2">
          <Label>AI Provider</Label>
          <Select value={provider} onValueChange={(v: string) => setProvider(v as 'openai' | 'deepseek')}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {providers.map((p) => (
                <SelectItem key={p.value} value={p.value}>
                  <div>
                    <div className="font-medium">{p.label}</div>
                    <div className="text-xs text-slate-500">{p.pricing}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-slate-500">{currentProvider?.description}</p>
        </div>

        {/* API Key Input */}
        <div className="space-y-2">
          <Label htmlFor="apiKey">API Key</Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                id="apiKey"
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={`sk-${provider === 'openai' ? 'proj-' : ''}...`}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">
              {isSaved && <span className="text-green-600">✓ API key saved</span>}
            </p>
            <a
              href={currentProvider?.getKeyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:text-blue-500 flex items-center space-x-1"
            >
              <span>Get API Key</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={handleSave}
            disabled={isLoading || !apiKey.trim()}
            className="flex-1"
          >
            <Save className="w-4 h-4 mr-2" />
            Save API Key
          </Button>
          {isSaved && (
            <Button
              variant="outline"
              onClick={handleClear}
              disabled={isLoading}
            >
              Clear
            </Button>
          )}
        </div>

        {/* Pricing Info */}
        <div className="bg-slate-50 rounded-lg p-4 text-xs text-slate-600">
          <p className="font-medium mb-2">Pricing Comparison:</p>
          <ul className="space-y-1">
            <li>• <strong>OpenAI:</strong> $0.03/1K tokens (input), $0.06/1K tokens (output)</li>
            <li>• <strong>DeepSeek:</strong> $0.0014/1K tokens (input), $0.0028/1K tokens (output)</li>
          </ul>
          <p className="mt-2 text-slate-500">
            Typical resume enhancement uses ~500-1000 tokens per request
          </p>
        </div>
      </div>
    </div>
  )
}