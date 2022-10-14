import { css } from "@emotion/react"
import { FunctionComponent, useState } from "react"

interface PatternBackgroundProps {
  light?: boolean
  children: React.ReactNode
}

export const PatternBackground: FunctionComponent<PatternBackgroundProps> = ({ light, children }) => {
  const [mousePos, setMousePos] = useState([-500, -500])
  return (
    <div
      css={css`
        position: absolute;
        height: 100vh;
        width: 100vw;
        overflow-x: hidden;

        background-repeat: no-repeat, repeat, repeat;
        background-size: 100% 100%, 30px 30px, 30px 30px;
        background-position: 0 0, 0 0, 15px 15px;
        ${!light
          ? css`
              background-image: radial-gradient(
                  circle 30vh at ${mousePos[0]}px ${mousePos[1]}px,
                  rgba(63, 94, 251, 0) 0%,
                  rgba(0, 0, 0, 0.8) 100%
                ),
                radial-gradient(#888888 1px, transparent 1px), radial-gradient(#888888 1px, #0d0d0d 1px);
            `
          : css`
              background-image: radial-gradient(
                  circle 30vh at ${mousePos[0]}px ${mousePos[1]}px,
                  rgba(255, 255, 255, 0.7) 0%,
                  rgba(255, 255, 255, 0.91) 100%
                ),
                radial-gradient(#000000 1px, transparent 1px), radial-gradient(#000000 1px, #ffffff 1px);
              background-blend-mode: lighten, normal;
              @media (prefers-color-scheme: dark) {
                background-image: radial-gradient(
                    circle 30vh at ${mousePos[0]}px ${mousePos[1]}px,
                    rgba(63, 94, 251, 0) 0%,
                    rgba(0, 0, 0, 0.8) 100%
                  ),
                  radial-gradient(#888888 1px, transparent 1px), radial-gradient(#888888 1px, #0d0d0d 1px);
                background-blend-mode: normal;
              }
            `}
      `}
      onTouchMove={e =>
        e.targetTouches[0]?.clientX &&
        e.targetTouches[0]?.clientY &&
        setMousePos([e.targetTouches[0]?.clientX, e.targetTouches[0]?.clientY])
      }
      onMouseMove={e => setMousePos([e.clientX, e.clientY])}
    >
      {children}
    </div>
  )
}
