import { ReactNode, useEffect, useState } from "react"
import satori from "satori"

export type UseSatoriOptions = {
  width: number
  height: number
  scale?: number
}

export const useSatori = (element: ReactNode | undefined, options: UseSatoriOptions) => {
  const [svg, setSvg] = useState<string>()

  useEffect(() => {
    if (!element) {
      setSvg(undefined)
      return
    }
    let currentlyActive = true
    const f = async () => {
      const generatedSvg = await getSatori(element, options)
      if (!currentlyActive) {
        return
      }
      setSvg(generatedSvg)
    }
    f()
    return () => {
      currentlyActive = false
    }
  }, [element, options])
  return svg
}

export const getSatori = async (element: ReactNode, options: UseSatoriOptions) => {
  const robotoRequest = await fetch("/roboto.woff")
  const robotoArrayBuffer = await robotoRequest.arrayBuffer()
  const svg = await satori(element, {
    width: options.width,
    height: options.height,
    fonts: [
      {
        name: "Roboto",
        data: robotoArrayBuffer,
        weight: 400,
        style: "normal",
      },
    ],
  })

  const scale = options.scale || 1
  const scaledSvg = svg
    .replace(`width="${options.width}"`, `width="${options.width * scale}"`)
    .replace(`height="${options.height}"`, `height="${options.height * scale}"`)

  const blob = new Blob([scaledSvg], { type: "image/svg+xml" })
  const url = URL.createObjectURL(blob)
  return url
}
