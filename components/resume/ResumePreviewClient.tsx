/* eslint-disable @typescript-eslint/no-explicit-any */
// components/resume/ResumePreviewClient.tsx
'use client'

import { Mail, Phone, MapPin, Linkedin, Globe, Calendar } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface ResumePreviewClientProps {
  data: any
  templateStructure?: any
}

// Simple date formatter
const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  try {
    const [year, month] = dateStr.split('-')
    const date = new Date(parseInt(year), parseInt(month) - 1)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return `${months[date.getMonth()]} ${date.getFullYear()}`
  } catch {
    return dateStr
  }
}

export function ResumePreviewClient({ data, templateStructure }: ResumePreviewClientProps) {
  const [zoom, setZoom] = useState(100)

  // Extract template colors or use defaults
  const colors = templateStructure?.colors || {
    primary: '#3B82F6',
    secondary: '#10B981',
    text: '#1F2937',
    background: '#FFFFFF'
  }

  const fonts = templateStructure?.fonts || {
    heading: 'system-ui',
    body: 'system-ui',
    sizes: { name: 32, heading: 18, body: 14 }
  }

  const layout = templateStructure?.layout || 'single-column'

  // Modern layout (two-column with colored sidebar)
  const renderModernLayout = () => (
    <div className="flex" style={{ fontFamily: fonts.body }}>
      {/* Left Sidebar */}
      <div 
        className="w-1/3 p-6 text-white print:text-white"
        style={{ backgroundColor: colors.primary }}
      >
        {/* Contact Info */}
        <div className="mb-6">
          <h3 className="text-sm font-bold mb-3 pb-2 border-b border-white/30">
            CONTACT
          </h3>
          <div className="space-y-2 text-xs">
            {data.personalInfo.email && (
              <div className="flex items-start space-x-2">
                <Mail className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <span className="break-all">{data.personalInfo.email}</span>
              </div>
            )}
            {data.personalInfo.phone && (
              <div className="flex items-start space-x-2">
                <Phone className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <span>{data.personalInfo.phone}</span>
              </div>
            )}
            {data.personalInfo.location && (
              <div className="flex items-start space-x-2">
                <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <span>{data.personalInfo.location}</span>
              </div>
            )}
            {data.personalInfo.linkedin && (
              <div className="flex items-start space-x-2">
                <Linkedin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <span className="break-all">{data.personalInfo.linkedin}</span>
              </div>
            )}
            {data.personalInfo.website && (
              <div className="flex items-start space-x-2">
                <Globe className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <span className="break-all">{data.personalInfo.website}</span>
              </div>
            )}
          </div>
        </div>

        {/* Skills in Sidebar */}
        {data.skills && data.skills.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-bold mb-3 pb-2 border-b border-white/30">
              SKILLS
            </h3>
            <div className="space-y-3">
              {data.skills.map((skill: any) => (
                <div key={skill.id} className="text-xs">
                  {skill.category && (
                    <div className="font-semibold mb-1">{skill.category}</div>
                  )}
                  <div className="space-y-1">
                    {skill.items.map((item: string, idx: number) => (
                      <div key={idx}>
                        <div className="mb-1">{item}</div>
                        <div className="h-1.5 rounded-full bg-white/20 overflow-hidden">
                          <div 
                            className="h-full bg-white/60 rounded-full"
                            style={{ width: `${85 + (idx * 5)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education in Sidebar */}
        {data.education && data.education.length > 0 && (
          <div>
            <h3 className="text-sm font-bold mb-3 pb-2 border-b border-white/30">
              EDUCATION
            </h3>
            <div className="space-y-3">
              {data.education.map((edu: any) => (
                <div key={edu.id} className="text-xs">
                  <div className="font-semibold">{edu.degree}</div>
                  <div className="opacity-90">{edu.school}</div>
                  {edu.graduationDate && (
                    <div className="opacity-75 text-[10px] mt-1">
                      {formatDate(edu.graduationDate)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Content */}
      <div className="flex-1 p-6" style={{ color: colors.text }}>
        {/* Header */}
        <div className="mb-6">
          <h1 
            className="font-bold mb-1"
            style={{ 
              fontSize: `${fonts.sizes.name}px`,
              fontFamily: fonts.heading,
              color: colors.primary
            }}
          >
            {data.personalInfo.fullName || 'Your Name'}
          </h1>
        </div>

        {/* Professional Summary */}
        {data.summary && (
          <div className="mb-6">
            <h2 
              className="font-bold uppercase border-b pb-2 mb-3"
              style={{ 
                fontSize: `${fonts.sizes.heading}px`,
                borderColor: colors.primary,
                color: colors.primary
              }}
            >
              Professional Summary
            </h2>
            <p 
              className="leading-relaxed whitespace-pre-wrap"
              style={{ fontSize: `${fonts.sizes.body}px` }}
            >
              {data.summary}
            </p>
          </div>
        )}

        {/* Work Experience */}
        {data.experience && data.experience.length > 0 && (
          <div className="mb-6">
            <h2 
              className="font-bold uppercase border-b pb-2 mb-3"
              style={{ 
                fontSize: `${fonts.sizes.heading}px`,
                borderColor: colors.primary,
                color: colors.primary
              }}
            >
              Work Experience
            </h2>
            <div className="space-y-4">
              {data.experience.map((exp: any) => (
                <div key={exp.id}>
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <h3 
                        className="font-bold"
                        style={{ fontSize: `${fonts.sizes.body + 2}px` }}
                      >
                        {exp.position || 'Position'}
                      </h3>
                      <p 
                        className="font-semibold"
                        style={{ 
                          fontSize: `${fonts.sizes.body}px`,
                          color: colors.secondary
                        }}
                      >
                        {exp.company || 'Company'}
                        {exp.location && ` • ${exp.location}`}
                      </p>
                    </div>
                    <div 
                      className="flex items-center space-x-1 text-gray-600"
                      style={{ fontSize: `${fonts.sizes.body - 2}px` }}
                    >
                      <Calendar className="w-3 h-3" />
                      <span className="whitespace-nowrap">
                        {exp.startDate ? formatDate(exp.startDate) : 'Start'} -{' '}
                        {exp.current ? 'Present' : exp.endDate ? formatDate(exp.endDate) : 'End'}
                      </span>
                    </div>
                  </div>
                  {exp.description && (
                    <div 
                      className="leading-relaxed whitespace-pre-wrap mt-2"
                      style={{ fontSize: `${fonts.sizes.body}px` }}
                    >
                      {exp.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {data.projects && data.projects.length > 0 && (
          <div className="mb-6">
            <h2 
              className="font-bold uppercase border-b pb-2 mb-3"
              style={{ 
                fontSize: `${fonts.sizes.heading}px`,
                borderColor: colors.primary,
                color: colors.primary
              }}
            >
              Projects
            </h2>
            <div className="space-y-3">
              {data.projects.map((project: any) => (
                <div key={project.id}>
                  <h3 
                    className="font-bold"
                    style={{ fontSize: `${fonts.sizes.body + 2}px` }}
                  >
                    {project.name || 'Project'}
                  </h3>
                  {project.description && (
                    <p 
                      className="leading-relaxed mt-1"
                      style={{ fontSize: `${fonts.sizes.body}px` }}
                    >
                      {project.description}
                    </p>
                  )}
                  {project.technologies && (
                    <p 
                      className="mt-1"
                      style={{ 
                        fontSize: `${fonts.sizes.body - 1}px`,
                        color: colors.secondary
                      }}
                    >
                      <span className="font-semibold">Technologies:</span> {project.technologies}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {data.certifications && data.certifications.length > 0 && (
          <div>
            <h2 
              className="font-bold uppercase border-b pb-2 mb-3"
              style={{ 
                fontSize: `${fonts.sizes.heading}px`,
                borderColor: colors.primary,
                color: colors.primary
              }}
            >
              Certifications
            </h2>
            <div className="space-y-2">
              {data.certifications.map((cert: any) => (
                <div key={cert.id}>
                  <h3 
                    className="font-bold"
                    style={{ fontSize: `${fonts.sizes.body + 1}px` }}
                  >
                    {cert.name || 'Certification'}
                  </h3>
                  <p style={{ fontSize: `${fonts.sizes.body}px` }}>
                    {cert.issuer || 'Issuer'}
                    {cert.date && ` • ${formatDate(cert.date)}`}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )

  // Classic single-column layout
  const renderClassicLayout = () => (
    <div className="p-8 space-y-6" style={{ fontFamily: fonts.body, color: colors.text }}>
      {/* Header */}
      <div className="text-center border-b-2 pb-4" style={{ borderColor: colors.primary }}>
        <h1 
          className="font-bold mb-2"
          style={{ 
            fontSize: `${fonts.sizes.name}px`,
            fontFamily: fonts.heading,
            color: colors.text
          }}
        >
          {data.personalInfo.fullName || 'Your Name'}
        </h1>
        
        <div 
          className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-gray-600"
          style={{ fontSize: `${fonts.sizes.body}px` }}
        >
          {data.personalInfo.email && (
            <div className="flex items-center space-x-1">
              <Mail className="w-3 h-3" />
              <span>{data.personalInfo.email}</span>
            </div>
          )}
          {data.personalInfo.phone && (
            <div className="flex items-center space-x-1">
              <Phone className="w-3 h-3" />
              <span>{data.personalInfo.phone}</span>
            </div>
          )}
          {data.personalInfo.location && (
            <div className="flex items-center space-x-1">
              <MapPin className="w-3 h-3" />
              <span>{data.personalInfo.location}</span>
            </div>
          )}
          {data.personalInfo.linkedin && (
            <div className="flex items-center space-x-1">
              <Linkedin className="w-3 h-3" />
              <span>{data.personalInfo.linkedin}</span>
            </div>
          )}
          {data.personalInfo.website && (
            <div className="flex items-center space-x-1">
              <Globe className="w-3 h-3" />
              <span>{data.personalInfo.website}</span>
            </div>
          )}
        </div>
      </div>

      {/* Professional Summary */}
      {data.summary && (
        <div>
          <h2 
            className="font-bold uppercase border-b pb-1 mb-2"
            style={{ 
              fontSize: `${fonts.sizes.heading}px`,
              borderColor: colors.primary,
              color: colors.primary
            }}
          >
            Professional Summary
          </h2>
          <p 
            className="leading-relaxed whitespace-pre-wrap"
            style={{ fontSize: `${fonts.sizes.body}px` }}
          >
            {data.summary}
          </p>
        </div>
      )}

      {/* Work Experience */}
      {data.experience && data.experience.length > 0 && (
        <div>
          <h2 
            className="font-bold uppercase border-b pb-1 mb-3"
            style={{ 
              fontSize: `${fonts.sizes.heading}px`,
              borderColor: colors.primary,
              color: colors.primary
            }}
          >
            Work Experience
          </h2>
          <div className="space-y-4">
            {data.experience.map((exp: any) => (
              <div key={exp.id}>
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <h3 
                      className="font-bold"
                      style={{ fontSize: `${fonts.sizes.body + 2}px` }}
                    >
                      {exp.position || 'Position'}
                    </h3>
                    <p 
                      className="font-semibold"
                      style={{ 
                        fontSize: `${fonts.sizes.body}px`,
                        color: colors.secondary
                      }}
                    >
                      {exp.company || 'Company'}
                      {exp.location && ` • ${exp.location}`}
                    </p>
                  </div>
                  <div 
                    className="flex items-center space-x-1 text-gray-600"
                    style={{ fontSize: `${fonts.sizes.body - 2}px` }}
                  >
                    <Calendar className="w-3 h-3" />
                    <span className="whitespace-nowrap">
                      {exp.startDate ? formatDate(exp.startDate) : 'Start'} -{' '}
                      {exp.current ? 'Present' : exp.endDate ? formatDate(exp.endDate) : 'End'}
                    </span>
                  </div>
                </div>
                {exp.description && (
                  <div 
                    className="leading-relaxed whitespace-pre-wrap mt-2"
                    style={{ fontSize: `${fonts.sizes.body}px` }}
                  >
                    {exp.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <div>
          <h2 
            className="font-bold uppercase border-b pb-1 mb-3"
            style={{ 
              fontSize: `${fonts.sizes.heading}px`,
              borderColor: colors.primary,
              color: colors.primary
            }}
          >
            Education
          </h2>
          <div className="space-y-3">
            {data.education.map((edu: any) => (
              <div key={edu.id}>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 
                      className="font-bold"
                      style={{ fontSize: `${fonts.sizes.body + 2}px` }}
                    >
                      {edu.school || 'School'}
                    </h3>
                    <p style={{ fontSize: `${fonts.sizes.body}px` }}>
                      {edu.degree && edu.field 
                        ? `${edu.degree} in ${edu.field}` 
                        : edu.degree || edu.field || 'Degree'}
                      {edu.location && ` • ${edu.location}`}
                    </p>
                    {edu.gpa && (
                      <p 
                        className="text-gray-600"
                        style={{ fontSize: `${fonts.sizes.body - 1}px` }}
                      >
                        GPA: {edu.gpa}
                      </p>
                    )}
                  </div>
                  {edu.graduationDate && (
                    <div 
                      className="flex items-center space-x-1 text-gray-600"
                      style={{ fontSize: `${fonts.sizes.body - 2}px` }}
                    >
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(edu.graduationDate)}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {data.skills && data.skills.length > 0 && (
        <div>
          <h2 
            className="font-bold uppercase border-b pb-1 mb-3"
            style={{ 
              fontSize: `${fonts.sizes.heading}px`,
              borderColor: colors.primary,
              color: colors.primary
            }}
          >
            Skills
          </h2>
          <div className="space-y-2">
            {data.skills.map((skill: any) => (
              <div key={skill.id}>
                {skill.category && (
                  <span 
                    className="font-semibold"
                    style={{ fontSize: `${fonts.sizes.body}px` }}
                  >
                    {skill.category}:{' '}
                  </span>
                )}
                <span style={{ fontSize: `${fonts.sizes.body}px` }}>
                  {skill.items.join(' • ')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {data.projects && data.projects.length > 0 && (
        <div>
          <h2 
            className="font-bold uppercase border-b pb-1 mb-3"
            style={{ 
              fontSize: `${fonts.sizes.heading}px`,
              borderColor: colors.primary,
              color: colors.primary
            }}
          >
            Projects
          </h2>
          <div className="space-y-3">
            {data.projects.map((project: any) => (
              <div key={project.id}>
                <h3 
                  className="font-bold"
                  style={{ fontSize: `${fonts.sizes.body + 2}px` }}
                >
                  {project.name || 'Project'}
                </h3>
                {project.description && (
                  <p 
                    className="leading-relaxed mt-1"
                    style={{ fontSize: `${fonts.sizes.body}px` }}
                  >
                    {project.description}
                  </p>
                )}
                {project.technologies && (
                  <p 
                    className="mt-1"
                    style={{ 
                      fontSize: `${fonts.sizes.body - 1}px`,
                      color: colors.secondary
                    }}
                  >
                    <span className="font-semibold">Technologies:</span> {project.technologies}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {data.certifications && data.certifications.length > 0 && (
        <div>
          <h2 
            className="font-bold uppercase border-b pb-1 mb-3"
            style={{ 
              fontSize: `${fonts.sizes.heading}px`,
              borderColor: colors.primary,
              color: colors.primary
            }}
          >
            Certifications
          </h2>
          <div className="space-y-2">
            {data.certifications.map((cert: any) => (
              <div key={cert.id}>
                <h3 
                  className="font-bold"
                  style={{ fontSize: `${fonts.sizes.body + 1}px` }}
                >
                  {cert.name || 'Certification'}
                </h3>
                <p style={{ fontSize: `${fonts.sizes.body}px` }}>
                  {cert.issuer || 'Issuer'}
                  {cert.date && ` • ${formatDate(cert.date)}`}
                </p>
                {cert.credentialId && (
                  <p 
                    className="text-gray-600"
                    style={{ fontSize: `${fonts.sizes.body - 2}px` }}
                  >
                    Credential ID: {cert.credentialId}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div className="space-y-4 min-h-screen]">
      {/* Zoom Controls - Hidden on Print */}
      <div className="flex items-center justify-center space-x-2 print:hidden">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setZoom(Math.max(50, zoom - 10))}
          disabled={zoom <= 50}
          className="border-[#2a2b2b] text-[#7e7e7e] bg-transparent hover:bg-[#2a2b2b]"
        >
          -
        </Button>
        <span className="text-sm text-[#7e7e7e] min-w-[60px] text-center">
          {zoom}%
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setZoom(Math.min(150, zoom + 10))}
          disabled={zoom >= 150}
          className="border-[#2a2b2b] text-[#7e7e7e] bg-transparent hover:bg-[#2a2b2b]"
        >
          +
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setZoom(100)}
          className="border-[#2a2b2b] text-[#7e7e7e] bg-transparent hover:bg-[#2a2b2b]"
        >
          Reset
        </Button>
      </div>

      {/* Resume Container */}
      <div className="flex justify-center print:block">
        <div 
          className="bg-white shadow-2xl print:shadow-none transition-all duration-200"
          style={{
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top center',
            width: '210mm', // A4 width
            minHeight: '297mm', // A4 height
          }}
        >
          {layout === 'two-column' || templateStructure?.category === 'MODERN'
            ? renderModernLayout()
            : renderClassicLayout()
          }
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
          }
          @page {
            size: A4;
            margin: 0;
          }
        }
      `}</style>
    </div>
  )
}