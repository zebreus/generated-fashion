import { NextRouter, useRouter } from "next/router"
import { SyntheticEvent, useMemo } from "react"

export const useLinkClickHandler = (url?: string) => {
  const router = useRouter()
  const handler = useMemo(() => {
    if (!url) {
      return () => {}
    }
    return createLinkClickHandler(url, router)
  }, [url, router])

  return handler
}

export const createLinkClickHandler = (url: string, router: NextRouter) => {
  if (
    typeof window === "undefined" ||
    !(document as { createDocumentTransition?: (cb: () => void) => void }).createDocumentTransition
  ) {
    console.error("Document transitions are unavailable")
    return () => {}
  }
  return (e: SyntheticEvent) => {
    e.preventDefault()
    const transition = (
      document as unknown as {
        createDocumentTransition: () => { start: (cb: () => Promise<void> | void) => void }
      }
    ).createDocumentTransition()
    transition.start(async () => {
      await router.push(url)
    })
  }
}
