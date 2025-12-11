/* eslint-disable @typescript-eslint/no-explicit-any */
// components/dashboard/DownloadInterface.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Download, 
  FileText, 
  File,
  Share2,
  Settings,
  Eye,
  Check,
  Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface DownloadInterfaceProps {
  resumeId: string
  resumeData: any
  resumeTitle: string
  template: any
}

export function DownloadInterface({ 
  resumeId, 
  resumeData, 
  resumeTitle,
  template 
}: DownloadInterfaceProps) {
  const [selectedFormat, setSelectedFormat] = useState<'pdf' | 'docx' | 'txt'>('pdf')
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadOptions, setDownloadOptions] = useState({
    includePhoto: true,
    colorScheme: 'color',
    fontSize: 'medium',
    pageMargins: 'normal',
    lineSpacing: 'normal'
  })

  const formats = [
    {
      type: 'pdf' as const,
      name: 'PDF Document',
      description: 'Best for applications and printing',
      icon: FileText,
      color: '#50a3f8',
      recommended: true
    },
    {
      type: 'docx' as const,
      name: 'Word Document',
      description: 'Editable format for further customization',
      icon: File,
      color: '#2fabb8',
      recommended: false
    },
    {
      type: 'txt' as const,
      name: 'Plain Text',
      description: 'ATS-friendly text format',
      icon: FileText,
      color: '#7e7e7e',
      recommended: false
    }
  ]

  const handleDownload = async () => {
    setIsDownloading(true)
    try {
      const response = await fetch('/api/resume/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeId,
          format: selectedFormat,
          options: downloadOptions
        })
      })

      if (!response.ok) throw new Error('Download failed')

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${resumeTitle.replace(/\s+/g, '_')}.${selectedFormat}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast.success('Resume downloaded successfully!')
    } catch (error) {
      toast.error('Failed to download resume')
      console.error(error)
    } finally {
      setIsDownloading(false)
    }
  }

  const handleShare = async () => {
    try {
      const shareUrl = `${window.location.origin}/resume/${resumeId}`
      await navigator.clipboard.writeText(shareUrl)
      toast.success('Share link copied to clipboard!')
    } catch (error) {
      toast.error('Failed to copy link')
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href={`/dashboard/resumes/${resumeId}`}>
          <Button 
            variant="ghost" 
            size="sm"
            style={{ color: '#7e7e7e' }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Editor
          </Button>
        </Link>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleShare}
            style={{ 
              borderColor: '#2a2b2b',
              color: '#7e7e7e'
            }}
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Link href={`/dashboard/resumes/${resumeId}/preview`}>
            <Button
              variant="outline"
              style={{ 
                borderColor: '#2a2b2b',
                color: '#7e7e7e'
              }}
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Options */}
        <div className="lg:col-span-2 space-y-6">
          {/* Format Selection */}
          <div 
            className="rounded-xl border p-6"
            style={{ 
              backgroundColor: '#242525',
              borderColor: '#2a2b2b'
            }}
          >
            <h2 className="text-xl font-bold mb-4" style={{ color: '#ffffff' }}>
              Choose Format
            </h2>
            <div className="space-y-3">
              {formats.map((format) => {
                const Icon = format.icon
                const isSelected = selectedFormat === format.type
                return (
                  <button
                    key={format.type}
                    onClick={() => setSelectedFormat(format.type)}
                    className="w-full p-4 rounded-lg border transition-all duration-200 hover:scale-[1.02]"
                    style={{ 
                      backgroundColor: isSelected ? format.color + '15' : '#2a2b2b',
                      borderColor: isSelected ? format.color : 'transparent',
                      borderWidth: '2px'
                    }}
                  >
                    <div className="flex items-start space-x-4">
                      <div 
                        className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
                        style={{ 
                          backgroundColor: format.color + '20'
                        }}
                      >
                        <Icon className="w-6 h-6" style={{ color: format.color }} />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold" style={{ color: '#ffffff' }}>
                            {format.name}
                          </h3>
                          {format.recommended && (
                            <span 
                              className="px-2 py-0.5 text-xs rounded"
                              style={{ 
                                backgroundColor: '#50a3f820',
                                color: '#50a3f8'
                              }}
                            >
                              Recommended
                            </span>
                          )}
                        </div>
                        <p className="text-sm" style={{ color: '#7e7e7e' }}>
                          {format.description}
                        </p>
                      </div>
                      {isSelected && (
                        <div 
                          className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                          style={{ backgroundColor: format.color }}
                        >
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Download Options */}
          <div 
            className="rounded-xl border p-6"
            style={{ 
              backgroundColor: '#242525',
              borderColor: '#2a2b2b'
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Settings className="w-5 h-5" style={{ color: '#50a3f8' }} />
              <h2 className="text-xl font-bold" style={{ color: '#ffffff' }}>
                Download Options
              </h2>
            </div>

            <div className="space-y-4">
              {/* Color Scheme */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#ffffff' }}>
                  Color Scheme
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['color', 'grayscale', 'blackwhite'].map((scheme) => (
                    <button
                      key={scheme}
                      onClick={() => setDownloadOptions({ ...downloadOptions, colorScheme: scheme })}
                      className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                      style={{
                        backgroundColor: downloadOptions.colorScheme === scheme ? '#50a3f820' : '#2a2b2b',
                        color: downloadOptions.colorScheme === scheme ? '#50a3f8' : '#7e7e7e',
                        borderWidth: '1px',
                        borderStyle: 'solid',
                        borderColor: downloadOptions.colorScheme === scheme ? '#50a3f8' : 'transparent'
                      }}
                    >
                      {scheme.charAt(0).toUpperCase() + scheme.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Size */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#ffffff' }}>
                  Font Size
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['small', 'medium', 'large'].map((size) => (
                    <button
                      key={size}
                      onClick={() => setDownloadOptions({ ...downloadOptions, fontSize: size })}
                      className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                      style={{
                        backgroundColor: downloadOptions.fontSize === size ? '#2fabb820' : '#2a2b2b',
                        color: downloadOptions.fontSize === size ? '#2fabb8' : '#7e7e7e',
                        borderWidth: '1px',
                        borderStyle: 'solid',
                        borderColor: downloadOptions.fontSize === size ? '#2fabb8' : 'transparent'
                      }}
                    >
                      {size.charAt(0).toUpperCase() + size.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Page Margins */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#ffffff' }}>
                  Page Margins
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['narrow', 'normal', 'wide'].map((margin) => (
                    <button
                      key={margin}
                      onClick={() => setDownloadOptions({ ...downloadOptions, pageMargins: margin })}
                      className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                      style={{
                        backgroundColor: downloadOptions.pageMargins === margin ? '#50a3f820' : '#2a2b2b',
                        color: downloadOptions.pageMargins === margin ? '#50a3f8' : '#7e7e7e',
                        borderWidth: '1px',
                        borderStyle: 'solid',
                        borderColor: downloadOptions.pageMargins === margin ? '#50a3f8' : 'transparent'
                      }}
                    >
                      {margin.charAt(0).toUpperCase() + margin.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Line Spacing */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#ffffff' }}>
                  Line Spacing
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['compact', 'normal', 'relaxed'].map((spacing) => (
                    <button
                      key={spacing}
                      onClick={() => setDownloadOptions({ ...downloadOptions, lineSpacing: spacing })}
                      className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                      style={{
                        backgroundColor: downloadOptions.lineSpacing === spacing ? '#2fabb820' : '#2a2b2b',
                        color: downloadOptions.lineSpacing === spacing ? '#2fabb8' : '#7e7e7e',
                        borderWidth: '1px',
                        borderStyle: 'solid',
                        borderColor: downloadOptions.lineSpacing === spacing ? '#2fabb8' : 'transparent'
                      }}
                    >
                      {spacing.charAt(0).toUpperCase() + spacing.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Preview & Download */}
        <div className="space-y-6">
          {/* Resume Info */}
          <div 
            className="rounded-xl border p-6"
            style={{ 
              backgroundColor: '#242525',
              borderColor: '#2a2b2b'
            }}
          >
            <h3 className="font-semibold mb-4" style={{ color: '#ffffff' }}>
              Resume Details
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span style={{ color: '#7e7e7e' }}>Title:</span>
                <span style={{ color: '#ffffff' }}>{resumeTitle}</span>
              </div>
              {template && (
                <div className="flex justify-between">
                  <span style={{ color: '#7e7e7e' }}>Template:</span>
                  <span style={{ color: '#ffffff' }}>{template.name}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span style={{ color: '#7e7e7e' }}>Format:</span>
                <span 
                  style={{ 
                    color: formats.find(f => f.type === selectedFormat)?.color 
                  }}
                >
                  {selectedFormat.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Download Button */}
          <Button
            onClick={handleDownload}
            disabled={isDownloading}
            className="w-full py-6 text-base font-semibold transition-all hover:scale-105 shadow-lg"
            style={{ 
              backgroundColor: '#50a3f8',
              color: '#ffffff'
            }}
          >
            {isDownloading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Preparing Download...
              </>
            ) : (
              <>
                <Download className="w-5 h-5 mr-2" />
                Download Resume
              </>
            )}
          </Button>

          {/* Tips */}
          <div 
            className="rounded-xl border p-6"
            style={{ 
              backgroundColor: '#50a3f815',
              borderColor: '#50a3f840'
            }}
          >
            <h4 className="font-semibold mb-3 text-sm" style={{ color: '#ffffff' }}>
              💡 Download Tips
            </h4>
            <ul className="space-y-2 text-xs" style={{ color: '#7e7e7e' }}>
              <li>• PDF format is best for online applications</li>
              <li>• DOCX allows further editing if needed</li>
              <li>• Use plain text for ATS systems</li>
              <li>• Keep file size under 1MB</li>
              <li>• Test your resume before sending</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}