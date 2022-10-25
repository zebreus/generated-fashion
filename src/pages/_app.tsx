import { CommonHead } from "components/CommonHead"
import { useInitialize } from "hooks/useInitialize"
import { NextPage } from "next"
import { AppProps } from "next/dist/shared/lib/router/router"
// eslint-disable-next-line import/no-named-as-default
import Router from "next/router"
import { ReactElement, ReactNode, useEffect } from "react"
// eslint-disable-next-line import/no-unassigned-import
import "styles/globals.css"

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  useInitialize()

  const getLayout = Component.getLayout ?? (page => page)

  useEffect(() => {
    if (!(document as { createDocumentTransition?: (cb: () => void) => void }).createDocumentTransition) {
      console.error("Document transitions are unavailable")
      return
    }
    let currentUrl: string | undefined
    let currentCallback: (() => void) | undefined
    const startHandler = (url: string, { shallow }: { shallow?: boolean }) => {
      if (!shallow && !currentCallback) {
        if (!(document as { createDocumentTransition?: (cb: () => void) => void }).createDocumentTransition) {
          console.error("Document transitions are unavailable")
          return
        }
        const transition = (
          document as unknown as {
            createDocumentTransition: () => { start: (cb: () => Promise<void> | void) => void }
          }
        ).createDocumentTransition()
        const myPromise = new Promise<void>(resolve => {
          currentUrl = url
          currentCallback = () => {
            resolve()
          }
        })
        transition.start(async () => {
          await myPromise
        })
      }
      // routeChangePromise = new Promise(resolve => {
      //   Router.events.once("routeChangeComplete", resolve)
      // })

      console.log("start", url)
    }
    const completeHandler = (url: string) => {
      if (currentUrl === url && currentCallback) {
        currentCallback()
        currentCallback = undefined
        currentUrl = undefined
      }

      console.log("complete", url)
    }
    const errorHandler = (...evts: unknown[]) => {
      console.log("error", evts)
    }
    Router.events.on("routeChangeStart", startHandler)
    Router.events.on("routeChangeComplete", completeHandler)
    Router.events.on("routeChangeError", errorHandler)
    return () => {
      Router.events.off("routeChangeStart", startHandler)
      Router.events.off("routeChangeComplete", completeHandler)
      Router.events.off("routeChangeError", errorHandler)
    }
  }, [])

  return (
    <>
      <CommonHead />
      {getLayout(<Component {...pageProps} />)}
    </>
  )
}

export default MyApp
