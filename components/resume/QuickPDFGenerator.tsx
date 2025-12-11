/* eslint-disable @typescript-eslint/no-explicit-any */
// components/resume/QuickPDFGenerator.tsx
'use client'

import { useState } from 'react'
import { Download, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import jsPDF from 'jspdf'

interface QuickPDFGeneratorProps {
  resumeId: string
  title: string
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
  className?: string
}

export function QuickPDFGenerator({ 
  resumeId, 
  title,
  variant = 'outline',
  size = 'sm',
  className = ''
}: QuickPDFGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const generatePDF = async () => {
    setIsGenerating(true)
    try {
      // Fetch resume data
      const response = await fetch('/api/resume/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeId }),
      })

      if (!response.ok) throw new Error('Failed to fetch resume')

      const { resume } = await response.json()
      const data = resume.data

      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      })

      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const margin = 15
      const contentWidth = pageWidth - 2 * margin
      let yPos = margin

      // Helper function to add text with wrapping
      const addText = (text: string, fontSize: number, fontStyle: string = 'normal', align: 'left' | 'center' = 'left') => {
        pdf.setFontSize(fontSize)
        pdf.setFont('helvetica', fontStyle)
        
        if (align === 'center') {
          const textWidth = pdf.getTextWidth(text)
          pdf.text(text, (pageWidth - textWidth) / 2, yPos)
        } else {
          const lines = pdf.splitTextToSize(text, contentWidth)
          pdf.text(lines, margin, yPos)
          yPos += (lines.length * fontSize * 0.35)
        }
      }

      const addSpace = (space: number) => {
        yPos += space
      }

      const checkPageBreak = (requiredSpace: number) => {
        if (yPos + requiredSpace > pageHeight - margin) {
          pdf.addPage()
          yPos = margin
        }
      }

      // Header - Name
      pdf.setFontSize(24)
      pdf.setFont('helvetica', 'bold')
      const nameWidth = pdf.getTextWidth(data.personalInfo.fullName || 'Your Name')
      pdf.text(data.personalInfo.fullName || 'Your Name', (pageWidth - nameWidth) / 2, yPos)
      yPos += 8

      // Contact Info
      pdf.setFontSize(9)
      pdf.setFont('helvetica', 'normal')
      const contactInfo = [
        data.personalInfo.email,
        data.personalInfo.phone,
        data.personalInfo.location,
      ].filter(Boolean).join(' | ')
      
      if (contactInfo) {
        const contactWidth = pdf.getTextWidth(contactInfo)
        pdf.text(contactInfo, (pageWidth - contactWidth) / 2, yPos)
        yPos += 4
      }

      // Links
      const links = [
        data.personalInfo.linkedin,
        data.personalInfo.website,
      ].filter(Boolean).join(' | ')
      
      if (links) {
        pdf.setTextColor(0, 0, 255)
        const linksWidth = pdf.getTextWidth(links)
        pdf.text(links, (pageWidth - linksWidth) / 2, yPos)
        pdf.setTextColor(0, 0, 0)
        yPos += 6
      }

      // Line separator
      pdf.setLineWidth(0.5)
      pdf.line(margin, yPos, pageWidth - margin, yPos)
      yPos += 6

      // Professional Summary
      if (data.summary) {
        checkPageBreak(20)
        pdf.setFontSize(12)
        pdf.setFont('helvetica', 'bold')
        pdf.text('PROFESSIONAL SUMMARY', margin, yPos)
        yPos += 5
        
        pdf.setFontSize(10)
        pdf.setFont('helvetica', 'normal')
        const summaryLines = pdf.splitTextToSize(data.summary, contentWidth)
        pdf.text(summaryLines, margin, yPos)
        yPos += summaryLines.length * 4 + 6
      }

      // Work Experience
      if (data.experience && data.experience.length > 0) {
        checkPageBreak(20)
        pdf.setFontSize(12)
        pdf.setFont('helvetica', 'bold')
        pdf.text('WORK EXPERIENCE', margin, yPos)
        yPos += 6

        data.experience.forEach((exp: any) => {
          checkPageBreak(25)
          
          // Position & Company
          pdf.setFontSize(11)
          pdf.setFont('helvetica', 'bold')
          pdf.text(exp.position || 'Position', margin, yPos)
          yPos += 5

          pdf.setFontSize(10)
          pdf.setFont('helvetica', 'normal')
          const companyLine = `${exp.company || 'Company'}${exp.location ? ' • ' + exp.location : ''}`
          pdf.text(companyLine, margin, yPos)
          
          // Dates on the right
          if (exp.startDate) {
            const dateText = `${exp.startDate} - ${exp.current ? 'Present' : exp.endDate || 'End'}`
            const dateWidth = pdf.getTextWidth(dateText)
            pdf.text(dateText, pageWidth - margin - dateWidth, yPos)
          }
          yPos += 5

          // Description
          if (exp.description) {
            pdf.setFontSize(9)
            const descLines = pdf.splitTextToSize(exp.description, contentWidth)
            pdf.text(descLines, margin, yPos)
            yPos += descLines.length * 3.5 + 4
          }
        })
      }

      // Education
      if (data.education && data.education.length > 0) {
        checkPageBreak(20)
        pdf.setFontSize(12)
        pdf.setFont('helvetica', 'bold')
        pdf.text('EDUCATION', margin, yPos)
        yPos += 6

        data.education.forEach((edu: any) => {
          checkPageBreak(15)
          
          pdf.setFontSize(11)
          pdf.setFont('helvetica', 'bold')
          pdf.text(edu.school || 'School', margin, yPos)
          yPos += 5

          pdf.setFontSize(10)
          pdf.setFont('helvetica', 'normal')
          const degreeLine = `${edu.degree || ''}${edu.field ? ' in ' + edu.field : ''}${edu.location ? ' • ' + edu.location : ''}`
          pdf.text(degreeLine, margin, yPos)
          
          if (edu.graduationDate) {
            const dateWidth = pdf.getTextWidth(edu.graduationDate)
            pdf.text(edu.graduationDate, pageWidth - margin - dateWidth, yPos)
          }
          yPos += 4

          if (edu.gpa) {
            pdf.setFontSize(9)
            pdf.text(`GPA: ${edu.gpa}`, margin, yPos)
            yPos += 5
          }
        })
      }

      // Skills
      if (data.skills && data.skills.length > 0) {
        checkPageBreak(20)
        pdf.setFontSize(12)
        pdf.setFont('helvetica', 'bold')
        pdf.text('SKILLS', margin, yPos)
        yPos += 6

        data.skills.forEach((skill: any) => {
          checkPageBreak(10)
          
          pdf.setFontSize(10)
          pdf.setFont('helvetica', 'bold')
          pdf.text(`${skill.category}:`, margin, yPos)
          yPos += 4

          pdf.setFont('helvetica', 'normal')
          pdf.setFontSize(9)
          const skillsText = skill.items.join(' • ')
          const skillLines = pdf.splitTextToSize(skillsText, contentWidth)
          pdf.text(skillLines, margin, yPos)
          yPos += skillLines.length * 3.5 + 3
        })
      }

      // Generate filename and download
      const filename = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_resume.pdf`
      pdf.save(filename)
      
      toast.success('Resume downloaded successfully!')
    } catch (error) {
      console.error('PDF generation error:', error)
      toast.error('Failed to generate PDF')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Button
      onClick={generatePDF}
      disabled={isGenerating}
      variant={variant}
      size={size}
      className={className}
    >
      {isGenerating ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Download className="w-4 h-4 mr-2" />
          Download PDF
        </>
      )}
    </Button>
  )
}