import { css, Global } from "@emotion/react"

type ShirtTransitionStylesProps = {
  id?: string
}

export const ShirtTransitionStyles = ({ id }: ShirtTransitionStylesProps) => {
  return id ? (
    <Global
      styles={css`
        ::page-transition-incoming-image(${"shirt-" + id}),
        ::page-transition-outgoing-image(${"shirt-" + id}) {
          height: 100%;
          width: auto;
          left: 50%;
          transform: translateX(-50%);
        }
      `}
    />
  ) : null
}
