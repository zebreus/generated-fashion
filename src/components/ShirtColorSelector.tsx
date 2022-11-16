import { css } from "@emotion/react"
import { updateDoc } from "firebase/firestore"
import { getColors } from "functions/getColors"
import { usePrediction } from "hooks/firestore/simple/usePrediction"

export type ShirtColorSelectorProps = {
  id: string | undefined
}

export const ShirtColorSelector = ({ id }: ShirtColorSelectorProps) => {
  const prediction = usePrediction(id)
  const colors = getColors()

  const selectedColor = prediction?.shirtColor ?? "#ffffff"
  // const prefersDarkness = useClientsideValue(
  //   () => window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
  // )
  // TODO: radiobuttons are better

  return (
    <div className="mb-2 gap-2">
      <div className="btn-group">
        {colors.map((color, index) => (
          <input
            type="radio"
            name="colors"
            data-title={color.name}
            key={color.color}
            className="btn w-fit"
            css={css`
              border: none;
              background-color: ${color.color};
              color: ${color.dark ? "white" : "black"};
              :hover {
                background-color: ${color.color};
              }
              border: 2px solid ${color.color === selectedColor ? "transparent" : "black"};
              border-left: ${index === 0 ? undefined : "none"};
              border-right: ${index === colors.length - 1 ? undefined : "none"};
            `}
            checked={color.color === selectedColor}
            onChange={() => {
              prediction &&
                updateDoc(prediction._ref, {
                  shirtColor: color.color,
                })
            }}
          />

          // <label key={color.color} className="label cursor-pointer">
          //   <span className="label-text">{color.name}</span>
          //   <input
          //     type="radio"
          //     name="radio-10"
          //     className="radio"
          //     checked
          //     css={css`
          //       border-color: ${color.color};
          //       border-width: 2px;
          //       /* background-: ${color.dark ? "white" : "black"}; */
          //       backdrop-filter: ${color.dark
          //         ? prefersDarkness
          //           ? "brightness(120%)"
          //           : "none"
          //         : prefersDarkness
          //         ? "none"
          //         : "brightness(93%)"};
          //     `}
          //   />
          // </label>
        ))}
      </div>
    </div>
  )
}
