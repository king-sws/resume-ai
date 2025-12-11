/* eslint-disable @typescript-eslint/no-explicit-any */
// components/resume/PDFDownloader.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import { Download, Loader2, FileText, Eye, EyeOff, ArrowLeft, Settings, Check, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ResumePreview } from './ResumePreview'
import { toast } from 'sonner'
import Link from 'next/link'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

interface PDFDownloaderProps {
  resumeId: string
  resumeData: any
  title: string
}

export function PDFDownloader({ resumeId, resumeData, title }: PDFDownloaderProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [showPreview, setShowPreview] = useState(true)
  const [selectedFormat, setSelectedFormat] = useState<'pdf' | 'docx' | 'txt'>('pdf')
  const [isPreviewReady, setIsPreviewReady] = useState(false)
  const previewRef = useRef<HTMLDivElement>(null)
  const [pdfOptions, setPdfOptions] = useState({
    quality: 'high',
    pageSize: 'a4',
    orientation: 'portrait',
    margins: 'normal'
  })

  useEffect(() => {
    if (previewRef.current) {
      setIsPreviewReady(true)
    }
  }, [showPreview])

  const formats = [
    {
      type: 'pdf' as const,
      name: 'PDF Document',
      description: 'Best for applications and printing',
      icon: FileText,
      color: '#50a3f8',
      available: true,
      recommended: true
    },
    {
      type: 'docx' as const,
      name: 'Word Document',
      description: 'Editable format (coming soon)',
      icon: FileText,
      color: '#2fabb8',
      available: false,
      recommended: false
    },
    {
      type: 'txt' as const,
      name: 'Plain Text',
      description: 'ATS-friendly format (coming soon)',
      icon: FileText,
      color: '#7e7e7e',
      available: false,
      recommended: false
    }
  ]

  const generatePDF = async () => {
    if (!isPreviewReady || !previewRef.current) {
      toast.error('Please wait for the preview to load')
      return
    }

    setIsGenerating(true)
    const loadingToast = toast.loading('Generating your resume PDF...')

    try {
      const element = previewRef.current

      // Create isolated iframe for rendering (completely hidden from user)
      const iframe = document.createElement('iframe')
      iframe.style.cssText = `
        position: fixed;
        top: -10000px;
        left: -10000px;
        width: ${element.offsetWidth}px;
        height: ${element.offsetHeight}px;
        border: none;
        visibility: hidden;
        opacity: 0;
        pointer-events: none;
      `
      document.body.appendChild(iframe)

      // Wait for iframe to be ready
      await new Promise(resolve => setTimeout(resolve, 100))

      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document
      if (!iframeDoc) {
        throw new Error('Could not access iframe document')
      }

      // Copy all stylesheets to iframe
      const stylesheets = Array.from(document.styleSheets)
      stylesheets.forEach(sheet => {
        try {
          if (sheet.href) {
            const link = iframeDoc.createElement('link')
            link.rel = 'stylesheet'
            link.href = sheet.href
            iframeDoc.head.appendChild(link)
          } else if (sheet.cssRules) {
            const style = iframeDoc.createElement('style')
            Array.from(sheet.cssRules).forEach(rule => {
              style.appendChild(iframeDoc.createTextNode(rule.cssText))
            })
            iframeDoc.head.appendChild(style)
          }
        } catch (e) {
          // Skip if can't access cross-origin stylesheet
        }
      })

      // Add our safe color override stylesheet to iframe
      const safeStyle = iframeDoc.createElement('style')
      safeStyle.textContent = `
        /* Force safe colors for PDF generation */
        * {
          color: rgb(0, 0, 0) !important;
          border-color: rgb(229, 231, 235) !important;
        }
        
        body, html {
          background-color: rgb(255, 255, 255) !important;
          color: rgb(0, 0, 0) !important;
        }
        
        /* Override backgrounds */
        [class*="bg-"] {
          background-color: rgb(255, 255, 255) !important;
        }
        
        /* Override text colors */
        [class*="text-gray"] {
          color: rgb(107, 114, 128) !important;
        }
      `
      iframeDoc.head.appendChild(safeStyle)

      // Clone content to iframe body
      const clonedElement = element.cloneNode(true) as HTMLElement
      iframeDoc.body.appendChild(clonedElement)
      iframeDoc.body.style.cssText = `
        margin: 0;
        padding: 0;
        background-color: rgb(255, 255, 255);
        color: rgb(0, 0, 0);
      `

      // Wait for styles and images to load
      await new Promise(resolve => setTimeout(resolve, 500))

      // Generate canvas from iframe content
      const canvas = await html2canvas(iframeDoc.body, {
        scale: pdfOptions.quality === 'high' ? 2 : 1.5,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: element.offsetWidth,
        imageTimeout: 0,
      })

      // Remove iframe immediately after canvas generation
      document.body.removeChild(iframe)

      // Calculate PDF dimensions
      const imgWidth = pdfOptions.pageSize === 'a4' ? 210 : 216
      const pageHeight = pdfOptions.pageSize === 'a4' ? 297 : 279
      
      const marginMap = {
        narrow: 10,
        normal: 15,
        wide: 20
      }
      const margin = marginMap[pdfOptions.margins as keyof typeof marginMap]
      const contentWidth = imgWidth - (margin * 2)
      const contentHeight = (canvas.height * contentWidth) / canvas.width

      // Create PDF
      const pdf = new jsPDF({
        orientation: pdfOptions.orientation as 'portrait' | 'landscape',
        unit: 'mm',
        format: pdfOptions.pageSize === 'a4' ? 'a4' : 'letter',
        compress: true,
      })

      let heightLeft = contentHeight
      let position = margin

      // Add first page
      const imgData = canvas.toDataURL('image/jpeg', 0.95)
      pdf.addImage(
        imgData,
        'JPEG',
        margin,
        position,
        contentWidth,
        contentHeight,
        undefined,
        'FAST'
      )
      heightLeft -= (pageHeight - margin * 2)

      // Add additional pages if needed
      while (heightLeft > 0) {
        position = -(pageHeight - margin * 2 - heightLeft)
        pdf.addPage()
        pdf.addImage(
          imgData,
          'JPEG',
          margin,
          position,
          contentWidth,
          contentHeight,
          undefined,
          'FAST'
        )
        heightLeft -= (pageHeight - margin * 2)
      }

      // Generate filename
      const timestamp = new Date().toISOString().split('T')[0]
      const filename = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${timestamp}.pdf`

      // Download PDF
      pdf.save(filename)
      
      // Update download count
      try {
        await fetch('/api/resume/download', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ resumeId })
        })
      } catch (error) {
        console.error('Failed to update download count:', error)
      }

      toast.success('Resume downloaded successfully!', { id: loadingToast })
    } catch (error) {
      console.error('PDF generation error:', error)
      
      // Cleanup on error - remove any leftover iframes
      const iframes = document.querySelectorAll('iframe[style*="-10000px"]')
      iframes.forEach(iframe => {
        try {
          document.body.removeChild(iframe)
        } catch (e) {
          // Already removed
        }
      })
      
      toast.error('Failed to generate PDF. Please try again.', { id: loadingToast })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href={`/dashboard/resumes/${resumeId}`}>
          <Button 
            variant="ghost" 
            size="sm"
            className="text-[#7e7e7e] bg-transparent hover:bg-[#2a2b2b] transition-all"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Editor
          </Button>
        </Link>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowPreview(!showPreview)}
          className="text-[#7e7e7e] bg-transparent hover:bg-[#2a2b2b] transition-all"
        >
          {showPreview ? (
            <>
              <EyeOff className="w-4 h-4 mr-2" />
              Hide Preview
            </>
          ) : (
            <>
              <Eye className="w-4 h-4 mr-2" />
              Show Preview
            </>
          )}
        </Button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Options */}
        <div className="lg:col-span-2 space-y-6">
          {/* Format Selection */}
          <div className="bg-[#242525] border border-[#2a2b2b] rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4 text-white">
              Choose Format
            </h2>
            <div className="space-y-3">
              {formats.map((format) => {
                const Icon = format.icon
                const isSelected = selectedFormat === format.type
                const isAvailable = format.available
                
                return (
                  <button
                    key={format.type}
                    onClick={() => isAvailable && setSelectedFormat(format.type)}
                    disabled={!isAvailable}
                    className={`
                      w-full p-4 rounded-lg border-2 transition-all duration-200
                      ${isSelected ? '' : 'bg-[#2a2b2b] border-transparent'}
                      ${isAvailable ? 'cursor-pointer hover:bg-[#323333]' : 'cursor-not-allowed opacity-50'}
                    `}
                    style={isSelected ? { 
                      backgroundColor: format.color + '15',
                      borderColor: format.color
                    } : undefined}
                  >
                    <div className="flex items-start space-x-4">
                      <div 
                        className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
                        style={{ backgroundColor: format.color + '20' }}
                      >
                        <Icon className="w-6 h-6" style={{ color: format.color }} />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-white">
                            {format.name}
                          </h3>
                          {format.recommended && (
                            <span className="px-2 py-0.5 text-xs rounded bg-[#50a3f820] text-[#50a3f8]">
                              Recommended
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-[#7e7e7e]">
                          {format.description}
                        </p>
                      </div>
                      {isSelected && isAvailable && (
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

          {/* PDF Options */}
          {selectedFormat === 'pdf' && (
            <div className="bg-[#242525] border border-[#2a2b2b] rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Settings className="w-5 h-5 text-[#50a3f8]" />
                <h2 className="text-xl font-bold text-white">
                  PDF Options
                </h2>
              </div>

              <div className="space-y-4">
                {/* Quality */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-white">
                    Quality
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['standard', 'high'].map((quality) => (
                      <button
                        key={quality}
                        onClick={() => setPdfOptions({ ...pdfOptions, quality })}
                        className={`
                          px-4 py-2 rounded-lg text-sm font-medium transition-all border
                          ${pdfOptions.quality === quality 
                            ? 'bg-[#50a3f820] text-[#50a3f8] border-[#50a3f8]' 
                            : 'bg-[#2a2b2b] text-[#7e7e7e] border-transparent hover:bg-[#323333]'
                          }
                        `}
                      >
                        {quality.charAt(0).toUpperCase() + quality.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Page Size */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-white">
                    Page Size
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['a4', 'letter'].map((size) => (
                      <button
                        key={size}
                        onClick={() => setPdfOptions({ ...pdfOptions, pageSize: size })}
                        className={`
                          px-4 py-2 rounded-lg text-sm font-medium transition-all border
                          ${pdfOptions.pageSize === size 
                            ? 'bg-[#2fabb820] text-[#2fabb8] border-[#2fabb8]' 
                            : 'bg-[#2a2b2b] text-[#7e7e7e] border-transparent hover:bg-[#323333]'
                          }
                        `}
                      >
                        {size.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Margins */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-white">
                    Page Margins
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['narrow', 'normal', 'wide'].map((margin) => (
                      <button
                        key={margin}
                        onClick={() => setPdfOptions({ ...pdfOptions, margins: margin })}
                        className={`
                          px-4 py-2 rounded-lg text-sm font-medium transition-all border
                          ${pdfOptions.margins === margin 
                            ? 'bg-[#50a3f820] text-[#50a3f8] border-[#50a3f8]' 
                            : 'bg-[#2a2b2b] text-[#7e7e7e] border-transparent hover:bg-[#323333]'
                          }
                        `}
                      >
                        {margin.charAt(0).toUpperCase() + margin.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tips */}
          <div className="bg-[#50a3f815] border border-[#50a3f830] rounded-xl p-6">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 shrink-0 mt-0.5 text-[#50a3f8]" />
              <div>
                <h3 className="font-semibold mb-2 text-white">
                  💡 Download Tips
                </h3>
                <ul className="space-y-1.5 text-sm text-[#7e7e7e]">
                  <li>• PDF format is ATS-friendly and preserves formatting</li>
                  <li>• High quality is recommended for printing</li>
                  <li>• A4 size is international standard</li>
                  <li>• Keep your resume to 1-2 pages maximum</li>
                  <li>• Test opening the PDF before sending</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Resume Info & Download */}
        <div className="space-y-6">
          {/* Resume Details */}
          <div className="bg-[#242525] border border-[#2a2b2b] rounded-xl p-6">
            <h3 className="font-semibold mb-4 text-white">
              Resume Details
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-start">
                <span className="text-[#7e7e7e]">Title:</span>
                <span className="text-right font-medium text-white">
                  {title}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7e7e7e]">Format:</span>
                <span 
                  className="font-medium"
                  style={{ color: formats.find(f => f.type === selectedFormat)?.color }}
                >
                  {selectedFormat.toUpperCase()}
                </span>
              </div>
              {selectedFormat === 'pdf' && (
                <>
                  <div className="flex justify-between">
                    <span className="text-[#7e7e7e]">Quality:</span>
                    <span className="text-white">
                      {pdfOptions.quality === 'high' ? 'High' : 'Standard'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#7e7e7e]">Page Size:</span>
                    <span className="text-white">
                      {pdfOptions.pageSize.toUpperCase()}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Download Button */}
          <Button
            onClick={generatePDF}
            disabled={isGenerating || selectedFormat !== 'pdf' || !isPreviewReady}
            className={`
              w-full py-6 text-base font-semibold transition-all shadow-lg text-white
              ${isGenerating || selectedFormat !== 'pdf' || !isPreviewReady 
                ? 'bg-[#7e7e7e] opacity-60 cursor-not-allowed' 
                : 'bg-[#50a3f8] hover:bg-[#4090e0]'
              }
            `}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Generating PDF...
              </>
            ) : !isPreviewReady ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Loading Preview...
              </>
            ) : (
              <>
                <Download className="w-5 h-5 mr-2" />
                Download Resume
              </>
            )}
          </Button>

          {/* File Info */}
          <div className="bg-[#2a2b2b] border border-[#323333] rounded-lg p-4 text-xs text-[#7e7e7e]">
            <p className="mb-1">
              File will be saved as: <span className="text-white">
                {title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_resume.pdf
              </span>
            </p>
            <p>Estimated size: ~200-500 KB</p>
          </div>
        </div>
      </div>

      {/* Preview */}
      {showPreview && (
        <div className="bg-[#242525] border border-[#2a2b2b] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">
              Preview
            </h3>
            <span className="text-xs px-2 py-1 rounded-full bg-[#2fabb820] text-[#2fabb8]">
              What you&lsquo;ll download
            </span>
          </div>
          <div 
            ref={previewRef}
            className="bg-white rounded-lg p-8 shadow-lg min-h-[400px]"
          >
            <ResumePreview data={resumeData} />
          </div>
        </div>
      )}
    </div>
  )
}
