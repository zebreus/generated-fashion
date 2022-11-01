import { CommonHead } from "components/CommonHead"
import { useInitialize } from "hooks/useInitialize"
import { getPageTransitionsAvailable } from "hooks/usePageTransitionsAvailable"
import { NextPage } from "next"
import { AppProps } from "next/dist/shared/lib/router/router"
// eslint-disable-next-line import/no-named-as-default
import { ReactElement, ReactNode } from "react"
// eslint-disable-next-line import/no-unassigned-import
import "styles/globals.css"

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

// Install page transitions for back and forward button
// @ts-expect-error: Hacky page transitions
if (typeof window !== "undefined" && getPageTransitionsAvailable() && !window._addEventListener) {
  // @ts-expect-error: Hacky page transitions
  window._addEventListener = window.addEventListener
  // @ts-expect-error: Hacky page transitions
  window.addEventListener = function (a: string, b: (event: PopStateEvent) => void, c: boolean) {
    if (a === "popstate") {
      const myfun = (event: PopStateEvent) => {
        // The popstate event is fired each time when the current history entry changes.

        const transition = (
          document as unknown as {
            createDocumentTransition: () => { start: (cb: () => Promise<void> | void) => void }
          }
        ).createDocumentTransition()

        let confirmReady = () => {}
        const readyPromise = new Promise<void>(resolve => {
          confirmReady()
          confirmReady = resolve
        })

        transition.start(async () => {
          await b(event)
          await readyPromise
        })

        setTimeout(() => {
          confirmReady()
        }, 200)

        event.preventDefault()
        event.stopPropagation()
      }
      // @ts-expect-error: Hacky page transitions
      window._addEventListener(a, myfun, c)

      return false
    }
    // @ts-expect-error: Hacky page transitions
    window._addEventListener(a, b, c)
  }
}

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  useInitialize()

  const getLayout = Component.getLayout ?? (page => page)

  // useEffect(() => {
  //   if (!(document as { createDocumentTransition?: (cb: () => void) => void }).createDocumentTransition) {
  //     console.error("Document transitions are unavailable")
  //     return
  //   }
  //   let currentUrl: string | undefined
  //   let currentCallback: (() => void) | undefined
  //   const startHandler = (url: string, { shallow }: { shallow?: boolean }) => {
  //     if (!shallow && !currentCallback) {
  //       if (!(document as { createDocumentTransition?: (cb: () => void) => void }).createDocumentTransition) {
  //         console.error("Document transitions are unavailable")
  //         return
  //       }
  //       const transition = (
  //         document as unknown as {
  //           createDocumentTransition: () => { start: (cb: () => Promise<void> | void) => void }
  //         }
  //       ).createDocumentTransition()
  //       const myPromise = new Promise<void>(resolve => {
  //         currentUrl = url
  //         currentCallback = () => {
  //           resolve()
  //         }
  //       })
  //       transition.start(async () => {
  //         await myPromise
  //       })
  //     }
  //     // routeChangePromise = new Promise(resolve => {
  //     //   Router.events.once("routeChangeComplete", resolve)
  //     // })

  //     console.log("start", url)
  //   }
  //   const completeHandler = (url: string) => {
  //     if (currentUrl === url && currentCallback) {
  //       currentCallback()
  //       currentCallback = undefined
  //       currentUrl = undefined
  //     }

  //     console.log("complete", url)
  //   }
  //   const errorHandler = (...evts: unknown[]) => {
  //     console.log("error", evts)
  //   }
  //   Router.events.on("routeChangeStart", startHandler)
  //   Router.events.on("routeChangeComplete", completeHandler)
  //   Router.events.on("routeChangeError", errorHandler)
  //   return () => {
  //     Router.events.off("routeChangeStart", startHandler)
  //     Router.events.off("routeChangeComplete", completeHandler)
  //     Router.events.off("routeChangeError", errorHandler)
  //   }
  // }, [])

  // useEffect(() => {
  //   if (!getPageTransitionsAvailable()) {
  //     return
  //   }

  //   const myfun = (event: PopStateEvent) => {
  //     // The popstate event is fired each time when the current history entry changes.

  //     const transition = (
  //       document as unknown as {
  //         createDocumentTransition: () => { start: (cb: () => Promise<void> | void) => void }
  //       }
  //     ).createDocumentTransition()

  //     let confirmReady = () => {}
  //     const readyPromise = new Promise<void>(resolve => {
  //       confirmReady = resolve
  //     })

  //     transition.start(async () => {
  //       await readyPromise
  //     })

  //     setTimeout(() => {
  //       confirmReady()
  //     }, 100)

  //     // event.preventDefault()
  //     // event.stopPropagation()
  //   }
  //   const logPop = () => console.log("pop")
  //   const logHide = () => console.log("pagehide")
  //   const logShow = () => console.log("pageshow")
  //   const hashChange = () => console.log("hashchange")
  //   const rcs = () => console.log("routeChangeStart")
  //   // window.addEventListener("popstate", myfun, false)
  //   window.addEventListener("popstate", logPop, true)
  //   window.addEventListener("pagehide", logHide, true)
  //   window.addEventListener("pageshow", logShow, true)
  //   window.addEventListener("hashchange", hashChange, true)

  //   Router.events.on("routeChangeComplete", resfun)
  //   Router.events.on("routeChangeError", resfun)

  //   return () => {
  //     console.log("unevent")
  //     // window.removeEventListener("popstate", myfun, false)
  //     window.removeEventListener("popstate", logPop, true)
  //     window.removeEventListener("pagehide", logHide, true)
  //     window.removeEventListener("pageshow", logShow, true)
  //     window.removeEventListener("hashchange", hashChange, true)
  //     //Router.events.off("routeChangeStart", myfun)
  //     Router.events.off("routeChangeComplete", resfun)
  //     Router.events.off("routeChangeError", resfun)
  //   }
  // }, [])

  return (
    <>
      <CommonHead />
      {getLayout(<Component {...pageProps} />)}
    </>
  )
}

export default MyApp
