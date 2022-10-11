import { CommonHead } from "components/CommonHead"
import { useInitialize } from "hooks/useInitialize"
import { NextPage } from "next"
import { AppProps } from "next/dist/shared/lib/router/router"
import { ReactElement, ReactNode } from "react"
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

  return (
    <>
      <CommonHead />
      {getLayout(<Component {...pageProps} />)}
    </>
  )
}

export default MyApp
