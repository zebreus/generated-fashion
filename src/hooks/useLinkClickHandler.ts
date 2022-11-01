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
  // url
  // router
  // return () => undefined
  if (
    typeof window === "undefined" ||
    !(document as { createDocumentTransition?: (cb: () => void) => void }).createDocumentTransition
  ) {
    console.error("Document transitions are unavailable")
    return () => {}
  }
  return async (e: SyntheticEvent) => {
    e.preventDefault?.()
    const transition = (
      document as unknown as {
        createDocumentTransition: () => { start: (cb: () => Promise<void> | void) => void }
      }
    ).createDocumentTransition()
    // await new Promise<void>(r => setTimeout(() => r(), 2000))

    transition.start(async () => {
      await router.push(url)
      // Page is weirdly shifted for this duration
      await new Promise<void>(r => setTimeout(() => r(), 10))
    })
  }
}
