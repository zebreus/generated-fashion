import { css } from "@emotion/react"
import { CoolShirt } from "components/CoolShirt"
import { useLatestPredictions } from "hooks/firestore/simple/useLatestPredictions"

export const Gallery = () => {
  const predictions = useLatestPredictions()
  return (
    <div
      css={css`
        display: flex;
        flex-direction: row;
        left: 0;
        width: 100%;
        overflow-x: auto;
      `}
      onWheel={e => {
        if (e.deltaY == 0) return
        e.preventDefault()
        const thisDiv = e.currentTarget as HTMLDivElement
        thisDiv.scrollTo({
          left: thisDiv.scrollLeft + e.deltaY,
        })
      }}
    >
      {predictions?.map(shirt => (
        <article
          key={shirt._ref.id}
          css={css`
            display: flex;
            flex-direction: column;
            align-items: center;
          `}
        >
          <CoolShirt url={shirt.resultUrl} />
          <h3
            css={css`
              text-align: center;
            `}
          >
            {shirt.prompt}
          </h3>
        </article>
      ))}
    </div>
  )
}
