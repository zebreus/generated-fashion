import { css } from "@emotion/react"
import { useToggle } from "hooks/useToggle"

export const Demo = () => {
  const [state, toggle] = useToggle()

  return (
    <button
      onClick={toggle}
      css={css`
        background-color: ${state ? "red" : "blue"};
      `}
    >
      Click to toggle color
    </button>
  )
}
