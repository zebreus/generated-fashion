import { SetStateAction, useCallback, useEffect, useRef, useState } from "react"

// ts-prune-ignore-next
export function useLocalStorage(
  key: string,
  defaultValue?: string
): [string | undefined, (newValue: SetStateAction<string>) => void] {
  const [, setUpdateValue] = useState<string | undefined>()

  const realValue = getLocalStorage(key, defaultValue)
  const lastValue = useRef<string | undefined>(realValue)

  useEffect(() => {
    const changeListener = () => {
      const newValue = getLocalStorage(key, defaultValue)
      if (lastValue.current !== newValue) {
        lastValue.current = newValue
        setUpdateValue(newValue)
      }
    }
    window.addEventListener("storage", changeListener)
    return () => {
      window.removeEventListener("storage", changeListener)
    }
  }, [key])

  const setValue = useCallback(
    (newValue: SetStateAction<string>) => {
      if (typeof newValue === "function") {
        const oldValue = getLocalStorage(key, defaultValue)
        oldValue && setLocalStorage(key, newValue(oldValue))
        return
      }
      setLocalStorage(key, newValue)
    },
    [key]
  )

  return [realValue ?? undefined, setValue]
}

// ts-prune-ignore-next
export function getLocalStorage(key: string, defaultValue?: string) {
  if (typeof window !== "undefined") {
    return window?.localStorage.getItem(key) ?? defaultValue
  }
  return defaultValue
}

// ts-prune-ignore-next
export function setLocalStorage(key: string, newValue: string) {
  if (typeof window !== "undefined") {
    const oldValue = window.localStorage.getItem(key)
    if (oldValue === newValue) {
      return
    }
    window.localStorage.setItem(key, newValue)
    window.dispatchEvent(new Event("storage"))
  }
}
