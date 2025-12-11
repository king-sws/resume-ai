// app/api/ai/enhance/route.ts
import { auth } from '@/lib/auth'
import prisma from '@/lib/db'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const enhanceSchema = z.object({
  text: z.string().min(1),
  type: z.enum(['summary', 'experience', 'skills']),
})

const prompts = {
  summary: `Rewrite this professional summary to be more impactful, concise, and ATS-friendly. Focus on key achievements and skills. Keep it under 4 sentences. Return ONLY the enhanced text, no explanations.`,
  experience: `Enhance this job description using strong action verbs and quantifiable achievements. Format as bullet points starting with action verbs (•). Make it ATS-friendly and impactful. Return ONLY the enhanced bullet points, no explanations.`,
  skills: `Organize and enhance this skills list. Group related skills together and ensure they're relevant and professional. Return ONLY the enhanced skills list, no explanations.`,
}

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
    const { text, type } = enhanceSchema.parse(body)

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

    // Get API key from environment
    const apiKey = process.env.DEEPSEEK_API_KEY

    if (!apiKey) {
      console.error('DEEPSEEK_API_KEY not configured')
      return NextResponse.json(
        { error: 'AI service not configured' },
        { status: 500 }
      )
    }

    // Call DeepSeek API
    const endpoint = 'https://api.deepseek.com/v1/chat/completions'

    const aiResponse = await fetch(endpoint, {
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
            content: 'You are a professional resume writer and career coach. Provide concise, impactful improvements that are ATS-friendly. Return ONLY the enhanced text with no additional commentary or explanations.',
          },
          {
            role: 'user',
            content: `${prompts[type]}\n\nOriginal text:\n${text}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
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
    const enhanced = aiData.choices[0]?.message?.content?.trim()

    if (!enhanced) {
      return NextResponse.json(
        { error: 'No enhancement generated' },
        { status: 500 }
      )
    }

    // Update AI credits usage
    await prisma.usageStats.update({
      where: { userId: session.user.id },
      data: {
        aiCreditsUsed: { increment: 1 },
      },
    })

    // Log AI interaction
    await prisma.aIInteraction.create({
      data: {
        userId: session.user.id,
        type: type === 'summary' ? 'IMPROVE' : type === 'experience' ? 'IMPROVE' : 'SUGGEST',
        prompt: text.substring(0, 500), // Limit stored prompt length
        response: enhanced.substring(0, 1000), // Limit stored response length
        model: 'deepseek-chat',
        tokensUsed: aiData.usage?.total_tokens || 0,
        wasSuccessful: true,
      },
    })

    return NextResponse.json({
      enhanced,
      creditsRemaining: creditsLimit - creditsUsed - 1,
    })
  } catch (error) {
    console.error('Error enhancing text:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to enhance text' },
      { status: 500 }
    )
  }
}