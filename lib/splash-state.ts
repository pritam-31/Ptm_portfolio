'use client'

type Listener = () => void

let splashDone = false
const listeners = new Set<Listener>()

export function setSplashDone() {
  if (splashDone) return
  splashDone = true
  listeners.forEach((listener) => listener())
  listeners.clear()
}

export function whenSplashDone(listener: Listener): () => void {
  if (splashDone) {
    listener()
    return () => {}
  }
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}