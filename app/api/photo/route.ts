import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import cloudinary from '@/lib/cloudinary'
import { getContent, saveContent } from '@/lib/content-data'

export async function POST(request: Request) {
  try {
    await requireAdmin()

    const formData = await request.formData()
    const file = formData.get('photo')

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'Photo file is required' }, { status: 400 })
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Please upload an image file' }, { status: 400 })
    }

    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return NextResponse.json({ error: 'Cloudinary credentials are missing. Add them to environment variables.' }, { status: 500 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const uploaded = await new Promise<{ secure_url?: string }>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'pritam-portfolio/profile',
          resource_type: 'image',
          transformation: [{ quality: 'auto', fetch_format: 'auto' }],
        },
        (error, result) => {
          if (error || !result) {
            reject(error || new Error('Upload failed'))
            return
          }
          resolve(result)
        }
      )
      uploadStream.end(buffer)
    })

    if (!uploaded.secure_url) {
      return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
    }

    const current = await getContent()
    const merged = await saveContent({ ...current, hero: { ...current.hero, photoUrl: uploaded.secure_url } })

    return NextResponse.json({ photoUrl: merged.hero.photoUrl }, { status: 201 })
  } catch (error) {
    console.error('Upload photo error:', error)
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Photo upload failed' }, { status: 500 })
  }
}