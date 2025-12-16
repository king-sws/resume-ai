// app/api/upload-profile/route.ts
import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import sharp from 'sharp'

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Only image files are allowed' },
        { status: 400 }
      )
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 5MB' },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Process and optimize image with sharp
    // Resize to max 400x400 and convert to JPEG for smaller size
    const processedImage = await sharp(buffer)
      .resize(400, 400, {
        fit: 'cover',
        position: 'center',
      })
      .jpeg({ quality: 85 }) // Good quality with reasonable size
      .toBuffer()

    // Convert to base64
    const base64Image = processedImage.toString('base64')
    const dataUrl = `data:image/jpeg;base64,${base64Image}`

    // Check final size (should be under 1MB after processing)
    const finalSize = Buffer.byteLength(base64Image, 'base64')
    if (finalSize > 1024 * 1024) {
      return NextResponse.json(
        { error: 'Processed image is too large. Please use a smaller image.' },
        { status: 400 }
      )
    }

    // Import prisma
    const { default: prisma } = await import('@/lib/db')

    // Store in database
    await prisma.user.update({
      where: { id: session.user.id },
      data: { image: dataUrl },
    })

    // Return the data URL
    return NextResponse.json({ url: dataUrl })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}