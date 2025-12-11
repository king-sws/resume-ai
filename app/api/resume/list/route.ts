/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/resume/list/route.ts
import { auth } from '@/lib/auth'
import prisma from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Build where clause
    const where: any = { userId: session.user.id }
    if (status && ['DRAFT', 'ACTIVE', 'ARCHIVED'].includes(status)) {
      where.status = status
    }

    // Fetch resumes with pagination
    const [resumes, total] = await Promise.all([
      prisma.resume.findMany({
        where,
        orderBy: { updatedAt: 'desc' },
        take: limit,
        skip: offset,
        select: {
          id: true,
          title: true,
          description: true,
          status: true,
          aiScore: true,
          viewCount: true,
          downloadCount: true,
          createdAt: true,
          updatedAt: true,
          template: {
            select: {
              id: true,
              name: true,
              thumbnail: true,
            },
          },
        },
      }),
      prisma.resume.count({ where }),
    ])

    return NextResponse.json({
      resumes,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    })
  } catch (error) {
    console.error('Error fetching resumes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch resumes' },
      { status: 500 }
    )
  }
}