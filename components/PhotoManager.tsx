'use client'

import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from 'react'
import { Camera, ImageUp, RotateCcw } from 'lucide-react'
import { useSiteContent } from '@/lib/content-api'

const PREVIEW = 224
const OUT_SIZE = 512

export default function PhotoManager() {
  const content = useSiteContent()
  const [file, setFile] = useState<File | null>(null)
  const [sourceUrl, setSourceUrl] = useState('')
  const [imgSize, setImgSize] = useState({ w: 0, h: 0 })
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState('')

  const imgRef = useRef<HTMLImageElement | null>(null)
  const dragState = useRef<{ startX: number; startY: number; panX: number; panY: number } | null>(null)

  const currentPhoto = content.hero.photoUrl || ''

  useEffect(() => {
    return () => {
      if (sourceUrl) URL.revokeObjectURL(sourceUrl)
    }
  }, [sourceUrl])

  const baseScale = useMemo(() => {
    if (!imgSize.w || !imgSize.h) return 1
    return Math.max(PREVIEW / imgSize.w, PREVIEW / imgSize.h)
  }, [imgSize.w, imgSize.h])

  const effectiveScale = baseScale * zoom

  const maxPan = useMemo(() => {
    if (!imgSize.w || !imgSize.h) return { x: 0, y: 0 }
    return {
      x: Math.max(0, (imgSize.w * effectiveScale - PREVIEW) / 2),
      y: Math.max(0, (imgSize.h * effectiveScale - PREVIEW) / 2),
    }
  }, [imgSize.w, imgSize.h, effectiveScale])

  const clampPan = (value: { x: number; y: number }) => ({
    x: Math.max(-maxPan.x, Math.min(maxPan.x, value.x)),
    y: Math.max(-maxPan.y, Math.min(maxPan.y, value.y)),
  })

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0] || null
    setFile(selected)
    setStatus('')
    setZoom(1)
    setPan({ x: 0, y: 0 })
    setImgSize({ w: 0, h: 0 })
    if (sourceUrl) URL.revokeObjectURL(sourceUrl)
    if (selected) {
      const next = URL.createObjectURL(selected)
      setSourceUrl(next)
    } else {
      setSourceUrl('')
    }
  }

  const handleImageLoad = () => {
    const el = imgRef.current
    if (!el) return
    setImgSize({ w: el.naturalWidth, h: el.naturalHeight })
  }

  const handlePointerDown = (event: React.PointerEvent<HTMLImageElement>) => {
    dragState.current = { startX: event.clientX, startY: event.clientY, panX: pan.x, panY: pan.y }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handlePointerMove = (event: React.PointerEvent<HTMLImageElement>) => {
    if (!dragState.current) return
    const dx = event.clientX - dragState.current.startX
    const dy = event.clientY - dragState.current.startY
    setPan(clampPan({ x: dragState.current.panX + dx, y: dragState.current.panY + dy }))
  }

  const handlePointerUp = () => {
    dragState.current = null
  }

  const reset = () => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
    setStatus('')
  }

  const exportCropped = async (): Promise<File | null> => {
    const el = imgRef.current
    if (!el || !imgSize.w || !imgSize.h) return null

    const center = PREVIEW / 2
    const displayedW = imgSize.w * effectiveScale
    const displayedH = imgSize.h * effectiveScale
    const imgLeft = center - displayedW / 2 + pan.x
    const imgTop = center - displayedH / 2 + pan.y

    const leftVisible = Math.max(0, imgLeft)
    const topVisible = Math.max(0, imgTop)
    const rightVisible = Math.min(PREVIEW, imgLeft + displayedW)
    const bottomVisible = Math.min(PREVIEW, imgTop + displayedH)

    const srcX = (leftVisible - imgLeft) / effectiveScale
    const srcY = (topVisible - imgTop) / effectiveScale
    const srcW = (rightVisible - leftVisible) / effectiveScale
    const srcH = (bottomVisible - topVisible) / effectiveScale

    const canvas = document.createElement('canvas')
    canvas.width = OUT_SIZE
    canvas.height = OUT_SIZE
    const ctx = canvas.getContext('2d')
    if (!ctx) return null

    ctx.imageSmoothingQuality = 'high'
    ctx.drawImage(el, srcX, srcY, srcW, srcH, 0, 0, OUT_SIZE, OUT_SIZE)

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          resolve(blob ? new File([blob], 'profile-photo.png', { type: blob.type }) : null)
        },
        'image/png',
        0.95
      )
    })
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    let uploadFile = file
    if (file) uploadFile = (await exportCropped()) || file
    if (!uploadFile) {
      setStatus('Please choose a photo first')
      return
    }

    setBusy(true)
    setStatus('Uploading cropped photo...')
    try {
      const formData = new FormData()
      formData.append('photo', uploadFile)

      const response = await fetch('/api/photo', { method: 'POST', body: formData })
      const result = (await response.json()) as { error?: string; photoUrl?: string }
      if (!response.ok) {
        setStatus(result.error || 'Photo upload failed')
        return
      }
      setFile(null)
      setSourceUrl('')
      setZoom(1)
      setPan({ x: 0, y: 0 })
      setImgSize({ w: 0, h: 0 })
      setStatus('Profile photo updated')
    } catch {
      setStatus('Upload failed. Check your Cloudinary setup.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="rounded-lg border border-white/10 bg-slate-950/80 p-5">
      <div className="mb-4 flex items-center gap-2 text-cyan-300">
        <Camera className="h-4 w-4" />
        <span className="text-sm font-semibold uppercase tracking-[0.2em]">Profile Photo</span>
      </div>

      <div className="mb-5 flex flex-col gap-5 sm:flex-row sm:items-center">
        <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full border-2 border-cyan-400/40 bg-black sm:h-24 sm:w-24 lg:h-28 lg:w-28">
          {file ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={sourceUrl} alt="New profile preview" className="h-full w-full object-cover" />
          ) : currentPhoto ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={currentPhoto} alt="Current profile" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-white">PP</div>
          )}
        </div>

        {file ? (
          <div className="min-w-0 flex-1">
            <p className="mb-2 text-sm font-medium text-slate-200">Crop & resize</p>
            <div className="mb-3 grid grid-cols-[auto_1fr] items-center gap-3">
              <span className="text-xs text-slate-400">Zoom</span>
              <input
                type="range"
                min={1}
                max={2.5}
                step={0.01}
                value={zoom}
                onChange={(event) => {
                  const next = Number(event.target.value)
                  setZoom(next)
                  setPan((current) => clampPan(current))
                }}
                className="w-full accent-cyan-400"
              />
            </div>
            <div className="flex items-center gap-3">
              <button type="button" onClick={reset} className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-xs text-slate-300 transition hover:border-cyan-300 hover:text-white">
                <RotateCcw className="h-3.5 w-3.5" />
                Reset crop
              </button>
              <p className="text-xs text-slate-400">Drag the preview to reposition. Output: {OUT_SIZE}&times;{OUT_SIZE}px</p>
            </div>
            <div className="relative mx-auto mt-4 h-56 w-56 cursor-grab overflow-hidden rounded-full border-2 border-cyan-400/40 bg-black shadow-[0_0_35px_rgba(34,211,238,0.2)] active:cursor-grabbing">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                ref={imgRef}
                src={sourceUrl}
                alt="Drag and zoom preview"
                onLoad={handleImageLoad}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                draggable={false}
                className="absolute left-1/2 top-1/2 max-w-none select-none"
                style={{
                  width: `${imgSize.w * effectiveScale}px`,
                  height: `${imgSize.h * effectiveScale}px`,
                  transform: `translate(-50%, -50%) translate(${pan.x}px, ${pan.y}px)`,
                  touchAction: 'none',
                }}
              />
              <div className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-cyan-300/30" />
            </div>
          </div>
        ) : (
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-slate-200">Current profile photo</p>
            <p className="mt-1 text-xs text-slate-400">Choose a new photo to crop, resize, and upload. It instantly replaces the photo on your landing page.</p>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4">
        <label className="flex min-h-28 cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-cyan-400/35 bg-cyan-400/5 p-5 text-center text-sm text-slate-300 transition hover:bg-cyan-400/10">
          <ImageUp className="h-7 w-7 text-cyan-300" />
          <span>{file ? `Selected: ${file.name}` : 'Choose a profile photo (JPG, PNG, WebP)'}</span>
          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        </label>

        <button
          type="submit"
          disabled={busy || !file}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-cyan-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
        >
          <ImageUp className="h-5 w-5" />
          {busy ? 'Uploading...' : 'Upload Cropped Photo'}
        </button>

        {status ? <p className="text-sm text-cyan-200">{status}</p> : null}
      </form>
    </div>
  )
}