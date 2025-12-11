// app/api/ai/chat/route.ts
import { auth } from '@/lib/auth'
import prisma from '@/lib/db'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const chatSchema = z.object({
  message: z.string().min(1),
  resumeId: z.string().optional(),
  context: z.object({
    section: z.string().optional(),
    data: z.any().optional(),
  }).optional(),
})

export async function POST(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { message, resumeId, context } = chatSchema.parse(body)

    // Check AI credits
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { usageStats: true },
    })

    const creditsUsed = user?.usageStats?.aiCreditsUsed || 0
    const creditsLimit = user?.usageStats?.aiCreditsLimit || 10

    if (creditsUsed >= creditsLimit) {
      return NextResponse.json(
        { 
          error: 'AI credits limit reached',
          message: 'Upgrade to Pro for more AI credits'
        },
        { status: 403 }
      )
    }

    // Get resume data if resumeId provided
    let resumeData = null
    if (resumeId) {
      const resume = await prisma.resume.findFirst({
        where: {
          id: resumeId,
          userId: session.user.id,
        },
      })
      resumeData = resume?.data
    }

    const apiKey = process.env.DEEPSEEK_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: 'AI service not configured' },
        { status: 500 }
      )
    }

    // Build context-aware system prompt
    let systemPrompt = `You are an expert resume writing assistant and career coach. You help users create compelling, ATS-friendly resumes.

Your capabilities:
- Provide specific, actionable advice
- Suggest strong action verbs and quantifiable achievements
- Optimize content for Applicant Tracking Systems (ATS)
- Help with formatting and structure
- Answer career-related questions

Always be concise, professional, and helpful.`

    if (resumeData) {
      systemPrompt += `\n\nCurrent resume context: ${JSON.stringify(resumeData)}`
    }

    if (context?.section) {
      systemPrompt += `\n\nUser is working on: ${context.section} section`
    }

    // Call DeepSeek API
    const aiResponse = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: message,
          },
        ],
        temperature: 0.7,
        max_tokens: 800,
        stream: false,
      }),
    })

    if (!aiResponse.ok) {
      const error = await aiResponse.json()
      console.error('DeepSeek API error:', error)
      return NextResponse.json(
        { error: error.error?.message || 'AI service error' },
        { status: aiResponse.status }
      )
    }

    const aiData = await aiResponse.json()
    const response = aiData.choices[0]?.message?.content?.trim()

    if (!response) {
      return NextResponse.json(
        { error: 'No response generated' },
        { status: 500 }
      )
    }

    // Update AI credits and log interaction
    await prisma.$transaction([
      prisma.usageStats.update({
        where: { userId: session.user.id },
        data: {
          aiCreditsUsed: { increment: 1 },
        },
      }),
      prisma.aIInteraction.create({
        data: {
          userId: session.user.id,
          resumeId,
          type: 'SUGGEST',
          prompt: message.substring(0, 500),
          response: response.substring(0, 1000),
          model: 'deepseek-chat',
          tokensUsed: aiData.usage?.total_tokens || 0,
          wasSuccessful: true,
          context: context || {},
        },
      }),
    ])

    return NextResponse.json({
      response,
      creditsRemaining: creditsLimit - creditsUsed - 1,
    })
  } catch (error) {
    console.error('Error in AI chat:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to process chat' },
      { status: 500 }
    )
  }
}