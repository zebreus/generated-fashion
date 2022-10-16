import { useEffect, useState } from "react"
import { Shirt } from "react-3d-shirt"

type CoolShirtProps = {
  url: string | undefined
  fallback?: string | undefined
  noMovement?: boolean
  /** Do not load the 3d model */
  onlyImage?: boolean
}

export const CoolShirt = ({ url, fallback, noMovement, onlyImage }: CoolShirtProps) => {
  const [clientside, setClientside] = useState(typeof window !== "undefined")
  useEffect(() => {
    setClientside(true)
  }, [])
  url
  return (
    <>
      {clientside && !onlyImage ? (
        <Shirt
          motif={url}
          color="white"
          coverLoading={!!fallback}
          cover={
            fallback ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={fallback}
                alt="placeholder"
                style={{ objectFit: "contain", height: "100%", width: "auto", margin: "auto" }}
              />
            ) : null
          }
          {...(noMovement ? { wobbleRange: 0, wobbleSpeed: 0 } : {})}
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={fallback}
          alt="placeholder"
          style={{ objectFit: "contain", height: "100%", width: "auto", margin: "auto" }}
        />
      )}
    </>
  )
}
