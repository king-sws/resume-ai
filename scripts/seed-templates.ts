// scripts/seed-templates.ts
// Run this with: npx tsx scripts/seed-templates.ts

import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient, TemplateCategory } from '@/lib/generated/prisma/client'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
})

const prisma = new PrismaClient({ adapter })

const templates = [
  // Free Templates
  {
    name: 'Modern Professional',
    description: 'Clean and modern design perfect for any industry. Features a bold header and clear section divisions.',
    category: TemplateCategory.MODERN,
    isPremium: false,
    isActive: true,
    structure: {
      layout: 'single-column',
      colors: {
        primary: '#3B82F6',
        secondary: '#8B5CF6',
        text: '#1F2937',
        background: '#FFFFFF',
      },
      fonts: {
        heading: 'Inter',
        body: 'Inter',
        sizes: { name: 32, heading: 16, body: 11 },
      },
      sections: {
        order: ['header', 'summary', 'experience', 'education', 'skills'],
        spacing: { section: 20, item: 12 },
      },
      margins: { top: 40, right: 40, bottom: 40, left: 40 },
    },
  },
  {
    name: 'Classic Traditional',
    description: 'Timeless design with a traditional layout. Perfect for conservative industries like finance and law.',
    category: TemplateCategory.CLASSIC,
    isPremium: false,
    isActive: true,
    structure: {
      layout: 'single-column',
      colors: {
        primary: '#1F2937',
        secondary: '#4B5563',
        text: '#1F2937',
        background: '#FFFFFF',
      },
      fonts: {
        heading: 'Georgia',
        body: 'Georgia',
        sizes: { name: 28, heading: 14, body: 10 },
      },
      sections: {
        order: ['header', 'summary', 'experience', 'education', 'skills'],
        spacing: { section: 18, item: 10 },
      },
      margins: { top: 50, right: 50, bottom: 50, left: 50 },
    },
  },
  {
    name: 'Minimalist',
    description: 'Simple and elegant with plenty of white space. Lets your content speak for itself.',
    category: TemplateCategory.MINIMALIST,
    isPremium: false,
    isActive: true,
    structure: {
      layout: 'single-column',
      colors: {
        primary: '#374151',
        secondary: '#6B7280',
        text: '#1F2937',
        background: '#FFFFFF',
      },
      fonts: {
        heading: 'Helvetica',
        body: 'Helvetica',
        sizes: { name: 30, heading: 14, body: 10 },
      },
      sections: {
        order: ['header', 'summary', 'experience', 'skills', 'education'],
        spacing: { section: 24, item: 14 },
      },
      margins: { top: 50, right: 50, bottom: 50, left: 50 },
    },
  },

  // Premium Templates
  {
    name: 'Executive Pro',
    description: 'Premium design for senior professionals. Features a sophisticated two-column layout with accent colors.',
    category: TemplateCategory.PROFESSIONAL,
    isPremium: true,
    isActive: true,
    structure: {
      layout: 'two-column',
      colors: {
        primary: '#1E40AF',
        secondary: '#3B82F6',
        text: '#1F2937',
        background: '#FFFFFF',
      },
      fonts: {
        heading: 'Montserrat',
        body: 'Open Sans',
        sizes: { name: 36, heading: 18, body: 11 },
      },
      sections: {
        order: ['header', 'summary', 'experience', 'education', 'skills', 'projects'],
        spacing: { section: 22, item: 14 },
      },
      margins: { top: 40, right: 40, bottom: 40, left: 40 },
    },
  },
  {
    name: 'Creative Edge',
    description: 'Bold and creative design for designers, artists, and creative professionals. Stand out from the crowd.',
    category: TemplateCategory.CREATIVE,
    isPremium: true,
    isActive: true,
    structure: {
      layout: 'two-column',
      colors: {
        primary: '#EC4899',
        secondary: '#F97316',
        text: '#1F2937',
        background: '#FFFFFF',
      },
      fonts: {
        heading: 'Poppins',
        body: 'Lato',
        sizes: { name: 34, heading: 16, body: 10 },
      },
      sections: {
        order: ['header', 'summary', 'projects', 'experience', 'skills', 'education'],
        spacing: { section: 20, item: 12 },
      },
      margins: { top: 40, right: 40, bottom: 40, left: 40 },
    },
  },
  {
    name: 'Tech Innovator',
    description: 'Modern tech-focused design perfect for developers, engineers, and IT professionals.',
    category: TemplateCategory.TECHNICAL,
    isPremium: true,
    isActive: true,
    structure: {
      layout: 'two-column',
      colors: {
        primary: '#059669',
        secondary: '#10B981',
        text: '#1F2937',
        background: '#FFFFFF',
      },
      fonts: {
        heading: 'Roboto',
        body: 'Source Sans Pro',
        sizes: { name: 32, heading: 16, body: 10 },
      },
      sections: {
        order: ['header', 'summary', 'skills', 'experience', 'projects', 'education'],
        spacing: { section: 20, item: 12 },
      },
      margins: { top: 40, right: 40, bottom: 40, left: 40 },
    },
  },
]

async function main() {
  console.log('🌱 Seeding templates...')
  
  // Verify database connection
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set')
  }

  for (const template of templates) {
    try {
      // Check if template exists by name
      const existing = await prisma.template.findFirst({
        where: { name: template.name }
      })

      if (existing) {
        // Update existing template
        const updated = await prisma.template.update({
          where: { id: existing.id },
          data: template,
        })
        console.log(`✅ Updated: ${updated.name}`)
      } else {
        // Create new template
        const created = await prisma.template.create({
          data: template,
        })
        console.log(`✅ Created: ${created.name}`)
      }
    } catch (error) {
      console.error(`❌ Error processing template "${template.name}":`, error)
      throw error
    }
  }

  console.log('✨ Seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding templates:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })