import { css } from "@emotion/react"
import { CoolShirt } from "components/CoolShirt"
import { useLatestPredictions } from "hooks/firestore/simple/useLatestPredictions"
import Link from "next/link"

export const Gallery = () => {
  const predictions = useLatestPredictions()
  return (
    <div className="carousel carousel-center w-full p-4 space-x-4 bg-transparent">
      {predictions?.map(shirt => (
        <Link key={shirt._ref.id} href={`/shirt/${shirt._ref.id}`} passHref>
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a className="carousel-item card-body max-w-xs">
            <h2 className="card-title">
              {shirt.prompt.length > 123 ? shirt.prompt.slice(0, 120) + "..." : shirt.prompt}
            </h2>
            <div
              css={css`
                width: 100%;
                height: 25rem;
                margin-top: auto;
              `}
            >
              <CoolShirt url={shirt.resultUrl} />
            </div>
          </a>
        </Link>
      ))}
      <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
        <a href="#slide4" className="btn btn-circle">
          ❮
        </a>
        <a href="#slide2" className="btn btn-circle">
          ❯
        </a>
      </div>
    </div>
  )
}
