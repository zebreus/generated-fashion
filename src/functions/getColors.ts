export type Color = {
  /** Hex string in format #xxxxxx */
  color: string
  /** Display name */
  name: string
  /** Whether its a dark or a light color */
  dark: boolean
}

export const getColors = (): Color[] => {
  return [
    { color: "#000000", name: "Black", dark: true },
    { color: "#ffffff", name: "White", dark: false },
    { color: "#777777", name: "Grey", dark: true },
    { color: "#ff0000", name: "Red", dark: false },
  ]
}
