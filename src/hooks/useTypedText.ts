import { useEffect, useState } from "react"

export const useTypedText = (text: string, speed: number) => {
  const [typedText, setTypedText] = useState("")

  useEffect(() => {
    const timeout = setInterval(() => {
      setTypedText(typedText => {
        const longestText = Math.max(typedText.length, text.length)
        const nextChar = new Array(longestText).fill(0).reduce((acc, _, i) => {
          if (acc) return acc
          const typedChar = typedText[i]
          const char = text[i]
          if (typedChar === char) {
            return undefined
          }
          if (!typedChar) {
            return char
          }
          return "delete"
        }, undefined as string | undefined)
        const nextText = nextChar === "delete" ? typedText.slice(0, -1) : typedText + (nextChar ?? "")
        return nextText
      })
    }, speed)

    return () => clearTimeout(timeout)
  }, [text, speed])

  return typedText
}
