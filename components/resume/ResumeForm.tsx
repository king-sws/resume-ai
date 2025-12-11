/* eslint-disable @typescript-eslint/no-explicit-any */
// components/resume/ResumeForm.tsx
'use client'

import { useState, useCallback, memo } from 'react'
import { Plus, Trash2, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { AIEnhanceButton } from './AIEnhanceButton'
import type { ResumeData } from './ResumeBuilder'

interface ResumeFormProps {
  data: ResumeData
  onChange: (data: ResumeData) => void
}

// Section component outside of ResumeForm
const Section = memo(({ 
  title, 
  id, 
  children,
  isExpanded,
  onToggle
}: { 
  title: string
  id: string
  children: React.ReactNode
  isExpanded: boolean
  onToggle: () => void
}) => {
  return (
    <div className="bg-[#242525] border border-[#2a2b2b] rounded-xl overflow-hidden shadow-sm">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between bg-[#2a2b2b]/50 hover:bg-[#323333] transition-all"
      >
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <ChevronDown
          className={`w-5 h-5 text-[#7e7e7e] transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
        />
      </button>
      {isExpanded && <div className="p-6 space-y-4">{children}</div>}
    </div>
  )
})

Section.displayName = 'Section'

export function ResumeForm({ data, onChange }: ResumeFormProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['personalInfo', 'summary'])
  )

  const toggleSection = useCallback((section: string) => {
    setExpandedSections(prev => {
      const newExpanded = new Set(prev)
      if (newExpanded.has(section)) {
        newExpanded.delete(section)
      } else {
        newExpanded.add(section)
      }
      return newExpanded
    })
  }, [])

  const updatePersonalInfo = useCallback((field: string, value: string) => {
    onChange({
      ...data,
      personalInfo: { ...data.personalInfo, [field]: value },
    })
  }, [data, onChange])

  const addExperience = useCallback(() => {
    onChange({
      ...data,
      experience: [
        ...data.experience,
        {
          id: Date.now().toString(),
          company: '',
          position: '',
          location: '',
          startDate: '',
          endDate: '',
          current: false,
          description: '',
        },
      ],
    })
    setExpandedSections(prev => new Set(prev).add('experience'))
  }, [data, onChange])

  const updateExperience = useCallback((id: string, field: string, value: any) => {
    onChange({
      ...data,
      experience: data.experience.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    })
  }, [data, onChange])

  const removeExperience = useCallback((id: string) => {
    onChange({
      ...data,
      experience: data.experience.filter((exp) => exp.id !== id),
    })
  }, [data, onChange])

  const addEducation = useCallback(() => {
    onChange({
      ...data,
      education: [
        ...data.education,
        {
          id: Date.now().toString(),
          school: '',
          degree: '',
          field: '',
          location: '',
          graduationDate: '',
          gpa: '',
        },
      ],
    })
    setExpandedSections(prev => new Set(prev).add('education'))
  }, [data, onChange])

  const updateEducation = useCallback((id: string, field: string, value: string) => {
    onChange({
      ...data,
      education: data.education.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    })
  }, [data, onChange])

  const removeEducation = useCallback((id: string) => {
    onChange({
      ...data,
      education: data.education.filter((edu) => edu.id !== id),
    })
  }, [data, onChange])

  const addSkillCategory = useCallback(() => {
    onChange({
      ...data,
      skills: [
        ...data.skills,
        {
          id: Date.now().toString(),
          category: '',
          items: [],
        },
      ],
    })
    setExpandedSections(prev => new Set(prev).add('skills'))
  }, [data, onChange])

  const updateSkillCategory = useCallback((id: string, category: string, items: string) => {
    onChange({
      ...data,
      skills: data.skills.map((skill) =>
        skill.id === id
          ? { ...skill, category, items: items.split(',').map(s => s.trim()).filter(Boolean) }
          : skill
      ),
    })
  }, [data, onChange])

  const removeSkillCategory = useCallback((id: string) => {
    onChange({
      ...data,
      skills: data.skills.filter((skill) => skill.id !== id),
    })
  }, [data, onChange])

  return (
    <div className="space-y-4">
      {/* Resume Title */}
      <div className="bg-[#242525] border border-[#2a2b2b] rounded-xl p-6 shadow-sm">
        <Label htmlFor="title" className="text-sm font-medium text-white mb-2 block">Resume Title</Label>
        <Input
          id="title"
          value={data.title}
          onChange={(e) => onChange({ ...data, title: e.target.value })}
          placeholder="e.g., Software Engineer Resume"
          className="bg-[#1a1b1b] border-[#2a2b2b] text-white placeholder:text-[#5e5e5e] focus-visible:border-[#50a3f8] focus-visible:ring-1 focus-visible:ring-[#50a3f8] h-11"
        />
      </div>

      {/* Personal Information */}
      <Section 
        title="Personal Information" 
        id="personalInfo"
        isExpanded={expandedSections.has('personalInfo')}
        onToggle={() => toggleSection('personalInfo')}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fullName" className="text-sm font-medium text-white mb-2 block">
              Full Name <span className="text-red-400">*</span>
            </Label>
            <Input
              id="fullName"
              value={data.personalInfo.fullName}
              onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
              placeholder="John Doe"
              className="bg-[#1a1b1b] border-[#2a2b2b] text-white placeholder:text-[#5e5e5e] focus-visible:border-[#50a3f8] focus-visible:ring-1 focus-visible:ring-[#50a3f8] h-11"
            />
          </div>
          <div>
            <Label htmlFor="email" className="text-sm font-medium text-white mb-2 block">
              Email <span className="text-red-400">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={data.personalInfo.email}
              onChange={(e) => updatePersonalInfo('email', e.target.value)}
              placeholder="john@example.com"
              className="bg-[#1a1b1b] border-[#2a2b2b] text-white placeholder:text-[#5e5e5e] focus-visible:border-[#50a3f8] focus-visible:ring-1 focus-visible:ring-[#50a3f8] h-11"
            />
          </div>
          <div>
            <Label htmlFor="phone" className="text-sm font-medium text-white mb-2 block">Phone</Label>
            <Input
              id="phone"
              value={data.personalInfo.phone}
              onChange={(e) => updatePersonalInfo('phone', e.target.value)}
              placeholder="+1 (555) 123-4567"
              className="bg-[#1a1b1b] border-[#2a2b2b] text-white placeholder:text-[#5e5e5e] focus-visible:border-[#50a3f8] focus-visible:ring-1 focus-visible:ring-[#50a3f8] h-11"
            />
          </div>
          <div>
            <Label htmlFor="location" className="text-sm font-medium text-white mb-2 block">Location</Label>
            <Input
              id="location"
              value={data.personalInfo.location}
              onChange={(e) => updatePersonalInfo('location', e.target.value)}
              placeholder="San Francisco, CA"
              className="bg-[#1a1b1b] border-[#2a2b2b] text-white placeholder:text-[#5e5e5e] focus-visible:border-[#50a3f8] focus-visible:ring-1 focus-visible:ring-[#50a3f8] h-11"
            />
          </div>
          <div>
            <Label htmlFor="linkedin" className="text-sm font-medium text-white mb-2 block">LinkedIn</Label>
            <Input
              id="linkedin"
              value={data.personalInfo.linkedin}
              onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
              placeholder="linkedin.com/in/johndoe"
              className="bg-[#1a1b1b] border-[#2a2b2b] text-white placeholder:text-[#5e5e5e] focus-visible:border-[#50a3f8] focus-visible:ring-1 focus-visible:ring-[#50a3f8] h-11"
            />
          </div>
          <div>
            <Label htmlFor="website" className="text-sm font-medium text-white mb-2 block">Website/Portfolio</Label>
            <Input
              id="website"
              value={data.personalInfo.website}
              onChange={(e) => updatePersonalInfo('website', e.target.value)}
              placeholder="johndoe.com"
              className="bg-[#1a1b1b] border-[#2a2b2b] text-white placeholder:text-[#5e5e5e] focus-visible:border-[#50a3f8] focus-visible:ring-1 focus-visible:ring-[#50a3f8] h-11"
            />
          </div>
        </div>
      </Section>

      {/* Professional Summary */}
      <Section 
        title="Professional Summary" 
        id="summary"
        isExpanded={expandedSections.has('summary')}
        onToggle={() => toggleSection('summary')}
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="summary" className="text-sm font-medium text-white">Summary</Label>
            <AIEnhanceButton
              text={data.summary}
              type="summary"
              onEnhanced={(enhanced) => onChange({ ...data, summary: enhanced })}
            />
          </div>
          <Textarea
            id="summary"
            value={data.summary}
            onChange={(e) => onChange({ ...data, summary: e.target.value })}
            placeholder="Write a brief professional summary highlighting your key skills and experience..."
            rows={5}
            className="bg-[#1a1b1b] border-[#2a2b2b] text-white placeholder:text-[#5e5e5e] focus-visible:border-[#50a3f8] focus-visible:ring-1 focus-visible:ring-[#50a3f8] resize-none"
          />
        </div>
      </Section>

      {/* Experience */}
      <Section 
        title="Work Experience" 
        id="experience"
        isExpanded={expandedSections.has('experience')}
        onToggle={() => toggleSection('experience')}
      >
        <div className="space-y-4">
          {data.experience.map((exp, index) => (
            <div key={exp.id} className="border border-[#2a2b2b] rounded-lg p-5 space-y-4 bg-[#1e1f1f]">
              <div className="flex items-center justify-between pb-3 border-b border-[#2a2b2b]">
                <span className="text-sm font-semibold text-[#50a3f8]">Experience #{index + 1}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeExperience(exp.id)}
                  className="text-red-400 hover:text-red-300 hover:bg-red-950/30 h-8 px-3"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-white mb-2 block">Company</Label>
                  <Input
                    value={exp.company}
                    onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                    placeholder="Google"
                    className="bg-[#141515] border-[#2a2b2b] text-white placeholder:text-[#5e5e5e] focus-visible:border-[#50a3f8] focus-visible:ring-1 focus-visible:ring-[#50a3f8] h-11"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-white mb-2 block">Position</Label>
                  <Input
                    value={exp.position}
                    onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                    placeholder="Software Engineer"
                    className="bg-[#141515] border-[#2a2b2b] text-white placeholder:text-[#5e5e5e] focus-visible:border-[#50a3f8] focus-visible:ring-1 focus-visible:ring-[#50a3f8] h-11"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-white mb-2 block">Location</Label>
                  <Input
                    value={exp.location}
                    onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                    placeholder="Mountain View, CA"
                    className="bg-[#141515] border-[#2a2b2b] text-white placeholder:text-[#5e5e5e] focus-visible:border-[#50a3f8] focus-visible:ring-1 focus-visible:ring-[#50a3f8] h-11"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-sm font-medium text-white mb-2 block">Start Date</Label>
                    <Input
                      type="month"
                      value={exp.startDate}
                      onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                      className="bg-[#141515] border-[#2a2b2b] text-white focus-visible:border-[#50a3f8] focus-visible:ring-1 focus-visible:ring-[#50a3f8] h-11"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-white mb-2 block">End Date</Label>
                    <Input
                      type="month"
                      value={exp.endDate}
                      onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                      disabled={exp.current}
                      className="bg-[#141515] border-[#2a2b2b] text-white focus-visible:border-[#50a3f8] focus-visible:ring-1 focus-visible:ring-[#50a3f8] h-11 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 py-2">
                <input
                  type="checkbox"
                  id={`current-${exp.id}`}
                  checked={exp.current}
                  onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                  className="w-4 h-4 rounded border-[#2a2b2b] bg-[#141515] text-[#50a3f8] focus:ring-2 focus:ring-[#50a3f8] focus:ring-offset-0 cursor-pointer"
                />
                <Label htmlFor={`current-${exp.id}`} className="text-sm cursor-pointer text-white">
                  I currently work here
                </Label>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium text-white">Description</Label>
                  <AIEnhanceButton
                    text={exp.description}
                    type="experience"
                    onEnhanced={(enhanced) => updateExperience(exp.id, 'description', enhanced)}
                  />
                </div>
                <Textarea
                  value={exp.description}
                  onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                  placeholder="• Led development of...&#10;• Improved performance by...&#10;• Collaborated with..."
                  rows={4}
                  className="bg-[#141515] border-[#2a2b2b] text-white placeholder:text-[#5e5e5e] focus-visible:border-[#50a3f8] focus-visible:ring-1 focus-visible:ring-[#50a3f8] resize-none"
                />
              </div>
            </div>
          ))}
        </div>

        <Button 
          onClick={addExperience} 
          variant="outline" 
          className="w-full mt-4 bg-transparent border-[#50a3f8] text-[#50a3f8] hover:bg-[#50a3f8]/10 h-11"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Experience
        </Button>
      </Section>

      {/* Education */}
      <Section 
        title="Education" 
        id="education"
        isExpanded={expandedSections.has('education')}
        onToggle={() => toggleSection('education')}
      >
        <div className="space-y-4">
          {data.education.map((edu, index) => (
            <div key={edu.id} className="border border-[#2a2b2b] rounded-lg p-5 space-y-4 bg-[#1e1f1f]">
              <div className="flex items-center justify-between pb-3 border-b border-[#2a2b2b]">
                <span className="text-sm font-semibold text-[#2fabb8]">Education #{index + 1}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeEducation(edu.id)}
                  className="text-red-400 hover:text-red-300 hover:bg-red-950/30 h-8 px-3"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-white mb-2 block">School</Label>
                  <Input
                    value={edu.school}
                    onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                    placeholder="Stanford University"
                    className="bg-[#141515] border-[#2a2b2b] text-white placeholder:text-[#5e5e5e] focus-visible:border-[#2fabb8] focus-visible:ring-1 focus-visible:ring-[#2fabb8] h-11"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-white mb-2 block">Degree</Label>
                  <Input
                    value={edu.degree}
                    onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                    placeholder="Bachelor of Science"
                    className="bg-[#141515] border-[#2a2b2b] text-white placeholder:text-[#5e5e5e] focus-visible:border-[#2fabb8] focus-visible:ring-1 focus-visible:ring-[#2fabb8] h-11"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-white mb-2 block">Field of Study</Label>
                  <Input
                    value={edu.field}
                    onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                    placeholder="Computer Science"
                    className="bg-[#141515] border-[#2a2b2b] text-white placeholder:text-[#5e5e5e] focus-visible:border-[#2fabb8] focus-visible:ring-1 focus-visible:ring-[#2fabb8] h-11"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-white mb-2 block">Location</Label>
                  <Input
                    value={edu.location}
                    onChange={(e) => updateEducation(edu.id, 'location', e.target.value)}
                    placeholder="Palo Alto, CA"
                    className="bg-[#141515] border-[#2a2b2b] text-white placeholder:text-[#5e5e5e] focus-visible:border-[#2fabb8] focus-visible:ring-1 focus-visible:ring-[#2fabb8] h-11"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-white mb-2 block">Graduation Date</Label>
                  <Input
                    type="month"
                    value={edu.graduationDate}
                    onChange={(e) => updateEducation(edu.id, 'graduationDate', e.target.value)}
                    className="bg-[#141515] border-[#2a2b2b] text-white focus-visible:border-[#2fabb8] focus-visible:ring-1 focus-visible:ring-[#2fabb8] h-11"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-white mb-2 block">GPA (optional)</Label>
                  <Input
                    value={edu.gpa}
                    onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                    placeholder="3.8/4.0"
                    className="bg-[#141515] border-[#2a2b2b] text-white placeholder:text-[#5e5e5e] focus-visible:border-[#2fabb8] focus-visible:ring-1 focus-visible:ring-[#2fabb8] h-11"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <Button 
          onClick={addEducation} 
          variant="outline" 
          className="w-full mt-4 bg-transparent border-[#2fabb8] text-[#2fabb8] hover:bg-[#2fabb8]/10 h-11"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Education
        </Button>
      </Section>

      {/* Skills */}
      <Section 
        title="Skills" 
        id="skills"
        isExpanded={expandedSections.has('skills')}
        onToggle={() => toggleSection('skills')}
      >
        <div className="space-y-4">
          {data.skills.map((skill, index) => (
            <div key={skill.id} className="border border-[#2a2b2b] rounded-lg p-5 space-y-4 bg-[#1e1f1f]">
              <div className="flex items-center justify-between pb-3 border-b border-[#2a2b2b]">
                <span className="text-sm font-semibold text-[#50a3f8]">Skill Category #{index + 1}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSkillCategory(skill.id)}
                  className="text-red-400 hover:text-red-300 hover:bg-red-950/30 h-8 px-3"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div>
                <Label className="text-sm font-medium text-white mb-2 block">Category</Label>
                <Input
                  value={skill.category}
                  onChange={(e) =>
                    updateSkillCategory(skill.id, e.target.value, skill.items.join(', '))
                  }
                  placeholder="e.g., Programming Languages"
                  className="bg-[#141515] border-[#2a2b2b] text-white placeholder:text-[#5e5e5e] focus-visible:border-[#50a3f8] focus-visible:ring-1 focus-visible:ring-[#50a3f8] h-11"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-white mb-2 block">Skills (comma-separated)</Label>
                <Input
                  value={skill.items.join(', ')}
                  onChange={(e) =>
                    updateSkillCategory(skill.id, skill.category, e.target.value)
                  }
                  placeholder="JavaScript, Python, React, Node.js"
                  className="bg-[#141515] border-[#2a2b2b] text-white placeholder:text-[#5e5e5e] focus-visible:border-[#50a3f8] focus-visible:ring-1 focus-visible:ring-[#50a3f8] h-11"
                />
              </div>
            </div>
          ))}
        </div>

        <Button 
          onClick={addSkillCategory} 
          variant="outline" 
          className="w-full mt-4 bg-transparent border-[#50a3f8] text-[#50a3f8] hover:bg-[#50a3f8]/10 h-11"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Skill Category
        </Button>
      </Section>
    </div>
  )
}