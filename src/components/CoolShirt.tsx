import { usePageTransitionsAvailable } from "hooks/usePageTransitionsAvailable"
import dynamic from "next/dynamic"
import { useEffect, useState } from "react"

let globalLoaded = false
const informLoaded: Array<(state: boolean) => void> = []
const Shirt = dynamic(
  () =>
    import("react-3d-shirt").then(i => {
      globalLoaded = true
      informLoaded.forEach(cb => cb(true))
      return i.Shirt
    }),
  {
    suspense: false,
  }
)

type CoolShirtProps = {
  url: string | undefined
  fallback?: string | undefined
  noMovement?: boolean
  /** Do not load the 3d model */
  onlyImage?: boolean
}

export const CoolShirt = ({ url, fallback, noMovement, onlyImage }: CoolShirtProps) => {
  const [clientside, setClientside] = useState(typeof window !== "undefined")
  const [loaded, setLoaded] = useState(globalLoaded)
  useEffect(() => {
    informLoaded.push(setLoaded)
    return () => {
      informLoaded.splice(informLoaded.indexOf(setLoaded), 1)
    }
  }, [])
  useEffect(() => {
    setClientside(true)
  }, [])
  const fallbackElement = fallback ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={fallback}
      alt="placeholder"
      style={{ objectFit: "contain", height: "100%", width: "auto", margin: "auto" }}
    />
  ) : (
    <div style={{ height: "100%", width: "100%" }}></div>
  )

  const pageTransitionsAvailable = usePageTransitionsAvailable()

  return (
    <>
      {clientside && !onlyImage ? (
        <>
          {loaded ? null : fallbackElement}
          <Shirt
            motif={url}
            color="white"
            coverLoading={!!fallback}
            cover={fallback ? fallbackElement : null}
            {...(noMovement ? { wobbleRange: 0, wobbleSpeed: 0 } : {})}
            renderDelay={pageTransitionsAvailable ? 400 : 0}
          />
        </>
      ) : (
        fallbackElement
      )}
    </>
  )
}
