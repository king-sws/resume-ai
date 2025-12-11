// app/api/ai/analyze/route.ts
import { auth } from '@/lib/auth'
import prisma from '@/lib/db'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const analyzeSchema = z.object({
  resumeId: z.string(),
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
    const { resumeId } = analyzeSchema.parse(body)

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

    // Get resume
    const resume = await prisma.resume.findFirst({
      where: {
        id: resumeId,
        userId: session.user.id,
      },
    })

    if (!resume) {
      return NextResponse.json(
        { error: 'Resume not found' },
        { status: 404 }
      )
    }

    const apiKey = process.env.DEEPSEEK_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: 'AI service not configured' },
        { status: 500 }
      )
    }

    const systemPrompt = `You are an expert resume analyst and ATS (Applicant Tracking System) specialist.

Analyze the provided resume and return a JSON response with this EXACT structure:

{
  "score": <number 0-100>,
  "strengths": [<array of 3-5 specific strengths>],
  "improvements": [<array of 3-5 specific improvement suggestions>],
  "atsCompatibility": {
    "score": <number 0-100>,
    "issues": [<array of ATS-specific issues>],
    "suggestions": [<array of ATS optimization tips>]
  },
  "sections": {
    "summary": {"score": <0-100>, "feedback": "<string>"},
    "experience": {"score": <0-100>, "feedback": "<string>"},
    "education": {"score": <0-100>, "feedback": "<string>"},
    "skills": {"score": <0-100>, "feedback": "<string>"}
  },
  "keywords": {
    "present": [<array of important keywords found>],
    "missing": [<array of recommended keywords to add>]
  }
}

Return ONLY valid JSON, no additional text.`

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
            content: `Analyze this resume:\n\n${JSON.stringify(resume.data, null, 2)}`,
          },
        ],
        temperature: 0.3,
        max_tokens: 2000,
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
    let analysisText = aiData.choices[0]?.message?.content?.trim()

    if (!analysisText) {
      return NextResponse.json(
        { error: 'No analysis generated' },
        { status: 500 }
      )
    }

    // Clean and parse JSON response
    analysisText = analysisText.replace(/```json\n?|\n?```/g, '').trim()
    const analysis = JSON.parse(analysisText)

    // Update resume with AI analysis
    const updatedResume = await prisma.resume.update({
      where: { id: resumeId },
      data: {
        aiScore: analysis.score,
        aiSuggestions: analysis,
        lastAIReview: new Date(),
      },
    })

    // Update credits and log
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
          type: 'ANALYZE',
          prompt: 'Full resume analysis',
          response: JSON.stringify(analysis).substring(0, 1000),
          model: 'deepseek-chat',
          tokensUsed: aiData.usage?.total_tokens || 0,
          wasSuccessful: true,
        },
      }),
    ])

    return NextResponse.json({
      analysis,
      score: analysis.score,
      creditsRemaining: creditsLimit - creditsUsed - 1,
      resume: updatedResume,
    })
  } catch (error) {
    console.error('Error analyzing resume:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to analyze resume' },
      { status: 500 }
    )
  }
}