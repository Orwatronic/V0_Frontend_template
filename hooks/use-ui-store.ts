"use client"

import { useSyncExternalStore, useCallback } from "react"

type UIState = {
  sidebarCollapsed: boolean
}

const STORAGE_KEY = "feebee-ui:sidebar-collapsed"

let state: UIState = {
  sidebarCollapsed:
    typeof window !== "undefined"
      ? (localStorage.getItem(STORAGE_KEY) === "true" ? true : false)
      : false,
}

const listeners = new Set<() => void>()

function setState(partial: Partial<UIState>) {
  state = { ...state, ...partial }
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, String(state.sidebarCollapsed))
    }
  } catch {
    // ignore storage failures
  }
  listeners.forEach((l) => l())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getSnapshot() {
  return state
}

export function useUIStore() {
  const snap = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)

  const toggleSidebar = useCallback(() => {
    setState({ sidebarCollapsed: !snap.sidebarCollapsed })
  }, [snap.sidebarCollapsed])

  const setCollapsed = useCallback((collapsed: boolean) => {
    setState({ sidebarCollapsed: collapsed })
  }, [])

  return {
    sidebarCollapsed: snap.sidebarCollapsed,
    toggleSidebar,
    setCollapsed,
  }
}
