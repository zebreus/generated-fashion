import { useEffect, useState } from "react"

const getPageTransitionsAvailable = () => {
  if (typeof window === "undefined") {
    return false
  }
  if ((document as { createDocumentTransition?: (cb: () => void) => void }).createDocumentTransition) {
    return true
  }
  return false
}

export const usePageTransitionsAvailable = () => {
  const [available, setAvailable] = useState(getPageTransitionsAvailable())
  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }
    if ((document as { createDocumentTransition?: (cb: () => void) => void }).createDocumentTransition) {
      setAvailable(true)
    }
  }, [])

  return available
}
