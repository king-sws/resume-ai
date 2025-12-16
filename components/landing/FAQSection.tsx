/* eslint-disable react/no-unescaped-entities */
'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import Link from 'next/link'

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      question: 'What is the definition of a resume?',
      answer: 'A resume is a concise document that summarizes your work experience, education, skills, qualities, and accomplishments. It\'s used to showcase your qualifications to potential employers and helps you stand out. It tells employers why you deserve a job interview in one or two powerful pages.',
      link: { text: 'Learn more in this article', href: '#' }
    },
    {
      question: 'What is the difference between a CV and a resume?',
      answer: 'A CV (Curriculum Vitae) is typically longer and more detailed than a resume, often used in academic or research positions. A resume is usually 1-2 pages and focuses on relevant work experience for a specific job application.',
    },
    {
      question: 'How do I choose the right resume template?',
      answer: 'Choose a template based on your industry, experience level, and the job you\'re applying for. Creative fields may allow more design freedom, while corporate roles typically require conservative layouts. Always prioritize readability and ATS compatibility.',
    },
    {
      question: 'How far back should a resume go?',
      answer: 'Generally, include the last 10-15 years of work experience. Recent graduates can include relevant internships and education. Focus on the most relevant and recent positions that demonstrate your qualifications for the role you\'re seeking.',
    },
    {
      question: 'What does an ATS-friendly resume mean?',
      answer: 'An ATS-friendly resume is formatted to be easily read by Applicant Tracking Systems. This means using standard fonts, clear section headings, avoiding tables and graphics, and including relevant keywords from the job description.',
    },
    {
      question: 'What resume file format can I download in?',
      answer: 'You can download your resume in multiple formats including PDF, DOCX (Microsoft Word), and plain text. PDF is recommended for submissions as it preserves formatting across all devices and systems.',
    },
    {
      question: 'Is it worth paying for a resume builder?',
      answer: 'A quality resume builder saves time, ensures professional formatting, provides ATS optimization, and often includes AI-powered content suggestions. It\'s an investment in your career that can help you land interviews faster.',
    },
    {
      question: 'Should I make a different resume for every job application?',
      answer: 'Yes, tailoring your resume for each application significantly increases your chances. Customize your skills, experience descriptions, and keywords to match the specific job requirements. Many resume builders make this process quick and easy.',
    },
    {
      question: 'What makes resume.io the best resume builder?',
      answer: 'Our platform combines professional templates, AI-powered content generation, ATS optimization, and an intuitive interface. We help job seekers create standout resumes quickly with guidance from career experts.',
    },
  ]

  return (
    <section id="faq" className="py-20 md:py-32 relative">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-linear(ellipse_80%_50%_at_50%_-20%,rgba(80,163,248,0.05),rgba(0,0,0,0))]" />
        <div className="absolute inset-0 bg-[radial-linear(ellipse_60%_50%_at_50%_60%,rgba(47,171,184,0.03),rgba(0,0,0,0))]" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-normal text-white mb-6 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
            Everything you need to know about building your perfect resume
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-0 border-t border-white/10">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border-b border-white/10"
            >
              <button
  onClick={() => setOpenIndex(openIndex === index ? null : index)}
  className="
    w-full px-0 py-8 flex items-center justify-between text-left
    rounded-lg transition-all duration-300 group
    hover:text-transparent
    hover:bg-linear-to-r hover:from-[#50a3f8] hover:to-[#2fabb8]
    hover:bg-clip-text
  "
>
  <span
    className={`text-lg md:text-xl pr-8 transition-all duration-300 ${
      openIndex === index
        ? "font-semibold text-transparent bg-linear-to-r from-[#50a3f8] to-[#2fabb8] bg-clip-text"
        : "font-normal text-white group-hover:text-transparent group-hover:bg-linear-to-r group-hover:from-[#50a3f8] group-hover:to-[#2fabb8] group-hover:bg-clip-text"
    }`}
  >
    {faq.question}
  </span>

                <div className="shrink-0 transition-transform duration-500 ease-out">
                  {openIndex === index ? (
                    <div className="w-8 h-8 rounded-full bg-linear-to-r from-[#50a3f8] to-[#2fabb8] flex items-center justify-center">
                      <ChevronUp className="w-5 h-5 text-white" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 transition-all duration-500 ease-out rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 group-hover:border-white/20 ">
                      <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                    </div>
                  )}
                </div>
              </button>
              
              {openIndex === index && (
                <div className="px-0 pb-8 pt-0 animate-in slide-in-from-top-2 duration-300">
                  <p className="text-gray-300 leading-relaxed text-base md:text-lg mb-4">
                    {faq.answer}
                  </p>
                  {faq.link && (
                    <Link 
                      href={faq.link.href}
                      className="text-[#50a3f8] hover:text-[#2fabb8] text-sm md:text-base font-medium inline-flex items-center gap-1 hover:gap-2 transition-all"
                    >
                      {faq.link.text}
                      <span className="text-lg">→</span>
                    </Link>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom Links */}
        <div className="mt-20 text-center space-y-4">
          <div className="inline-flex flex-col sm:flex-row items-center gap-2 sm:gap-1 text-base md:text-lg">
            <span className="text-gray-400">Can't find what you need yet? —</span>
            <Link 
              href="#" 
              className="text-transparent bg-linear-to-r from-[#50a3f8] to-[#2fabb8] bg-clip-text font-semibold hover:opacity-80 transition-opacity inline-flex items-center gap-1"
            >
              View our customer support articles
              <span className="text-[#50a3f8]">→</span>
            </Link>
          </div>
          <div className="inline-flex flex-col sm:flex-row items-center gap-2 sm:gap-1 text-base md:text-lg">
            <span className="text-gray-400">Need more career advice? —</span>
            <Link 
              href="#" 
              className="text-transparent bg-linear-to-r from-[#50a3f8] to-[#2fabb8] bg-clip-text font-semibold hover:opacity-80 transition-opacity inline-flex items-center gap-1"
            >
              View our career resources
              <span className="text-[#50a3f8]">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}