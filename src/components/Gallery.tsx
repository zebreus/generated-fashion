import { css } from "@emotion/react"
import { CoolShirt } from "components/CoolShirt"
import { useLatestShirts } from "hooks/useLatestShirts"

export const Gallery = () => {
  const shirts = useLatestShirts()
  const shirtsWithUrl = shirts?.map(shirt => ({ ...shirt, url: `/api/shirt/${shirt.id}/image` }))
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
      {shirtsWithUrl?.map(shirt => (
        <article
          key={shirt.id}
          css={css`
            display: flex;
            flex-direction: column;
            align-items: center;
          `}
        >
          <CoolShirt url={shirt.url} />
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
