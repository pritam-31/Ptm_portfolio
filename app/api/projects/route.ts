import { NextResponse } from 'next/server'
import { getProjects, saveProjects } from '@/lib/project-data'
import { requireAdmin } from '@/lib/admin-auth'
import cloudinary from '@/lib/cloudinary'
import { Project } from '@/types'

export async function GET() {
  try {
    const projects = await getProjects()
    return NextResponse.json(projects)
  } catch (error) {
    console.error('Get projects error:', error)
    return NextResponse.json([], { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin()

    const formData = await request.formData()
    const title = String(formData.get('title') ?? '').trim()
    const description = String(formData.get('description') ?? '').trim()
    const technologiesRaw = String(formData.get('technologies') ?? '')
    const githubUrl = String(formData.get('githubUrl') ?? '').trim()
    const liveUrl = String(formData.get('liveUrl') ?? '').trim()
    const mediaFile = formData.get('media')

    if (!title || !description) {
      return NextResponse.json({ error: 'Title and description are required' }, { status: 400 })
    }

    const existingProjects = await getProjects()

    let mediaUrl = String(formData.get('mediaUrl') ?? '').trim()
    let mediaType: Project['mediaType'] = (String(formData.get('mediaType') ?? 'image').trim() as Project['mediaType']) || 'image'

    if (mediaFile && mediaFile instanceof File) {
      const isVideo = mediaFile.type.startsWith('video/')
      const preset = isVideo ? 'video' : 'image'

      if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
        return NextResponse.json({ error: 'Cloudinary credentials are missing. Add them to environment variables.' }, { status: 500 })
      }

      const arrayBuffer = await mediaFile.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      const uploaded = await new Promise<{ secure_url?: string }>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'pritam-portfolio', resource_type: preset, transformation: [{ quality: 'auto', fetch_format: 'auto' }] },
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

      mediaUrl = uploaded.secure_url || ''
      mediaType = isVideo ? 'video' : 'image'
    }

    const nextProject: Project = {
      id: crypto.randomUUID(),
      title,
      description,
      technologies: technologiesRaw
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
      image: mediaType === 'image' ? mediaUrl : '',
      mediaUrl,
      mediaType,
      githubUrl: githubUrl || undefined,
      liveUrl: liveUrl || undefined,
    }

    const nextProjects = [nextProject, ...existingProjects]
    await saveProjects(nextProjects)

    return NextResponse.json(nextProject, { status: 201 })
  } catch (error) {
    console.error('Create project error:', error)
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    await requireAdmin()

    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('id')

    if (!projectId) {
      return NextResponse.json({ error: 'Project id is required' }, { status: 400 })
    }

    const projects = await getProjects()
    const filtered = projects.filter((project) => project.id !== projectId)
    await saveProjects(filtered)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete project error:', error)
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 })
  }
}
