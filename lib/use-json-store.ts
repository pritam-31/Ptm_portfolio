'use client'

import { useSyncExternalStore } from 'react'

export function createJsonStore<T>(fetcher: () => Promise<T>, fallback: T) {
  let snapshot: T = fallback
  let inFlight: Promise<T> | null = null
  const listeners = new Set<() => void>()

  const emit = () => listeners.forEach((listener) => listener())

  const subscribe = (callback: () => void) => {
    listeners.add(callback)
    return () => {
      listeners.delete(callback)
    }
  }

  const getSnapshot = () => snapshot
  const getServerSnapshot = () => fallback

  const load = (): Promise<T> => {
    if (!inFlight) {
      inFlight = fetcher()
        .then((data) => {
          snapshot = data
        })
        .catch(() => {
          snapshot = fallback
        })
        .finally(() => {
          emit()
          inFlight = null
        })
        .then(() => snapshot)
    }
    return inFlight
  }

  if (typeof window !== 'undefined') {
    void load()
  }

  const useValue = (): T => useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const setSnapshot = (next: T) => {
    snapshot = next
    emit()
  }

  const refresh = () => {
    inFlight = null
    return load()
  }

  return { useValue, setSnapshot, refresh }
}