import Head from "next/head"

interface CommonHeadProps {
  title?: string
  description?: string
  url?: string
  hide?: boolean
}

export const CommonHead = ({
  title = "generated.fashion",
  description = "Generate shirts with ai.",
  url,
  hide,
}: CommonHeadProps) => {
  return (
    <Head>
      <meta key="charSet" charSet="utf-8" />

      <title>{title}</title>
      <meta key="og:title" property="og:title" content={title} />

      <meta key="description" name="description" content={description} />
      <meta key="og:description" property="og:description" content={description} />

      {url ? <meta key="og:url" property="og:url" content={url} /> : null}

      {hide ? <meta key="robots" name="robots" content="noindex,follow" /> : null}
    </Head>
  )
}
