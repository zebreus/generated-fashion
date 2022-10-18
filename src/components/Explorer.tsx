/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { css } from "@emotion/react"
import { CoolShirt } from "components/CoolShirt"
import { ShirtTransitionStyles } from "components/ShirtTransitionStyles"
import { useExplorationPredictions } from "hooks/firestore/advanced/useExplorationPredictions"
import { createLinkClickHandler } from "hooks/useLinkClickHandler"
import Link from "next/link"
import { useRouter } from "next/router"
import { Fragment } from "react"

type ExplorerProps = {
  exploration: string | undefined
}

export const Explorer = ({ exploration }: ExplorerProps) => {
  const predictions = useExplorationPredictions(exploration)

  const router = useRouter()

  return (
    <>
      <section className="carousel carousel-center p-4 space-x-4 bg-transparent w-full flex justify-around">
        {predictions?.length ? (
          predictions.map(shirt => (
            <Fragment key={shirt._ref.id}>
              <ShirtTransitionStyles id={shirt._ref.id} />
              <Link href={`/shirt/${shirt._ref.id}`} passHref>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid,jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
                <a
                  className="carousel-item flex flex-col text-center items-center max-w-xs min-w-xs"
                  id={"shirt-" + shirt._ref.id}
                  onClick={createLinkClickHandler(`/shirt/${shirt._ref.id}`, router)}
                >
                  <div
                    className="w-72 h-96"
                    css={css`
                      page-transition-tag: ${"shirt-" + shirt._ref.id};
                      contain: paint;
                    `}
                  >
                    <CoolShirt url={shirt.resultUrl} fallback={shirt?.previewImageUrl} />
                  </div>
                </a>
              </Link>
            </Fragment>
          ))
        ) : (
          <div className="mx-auto">
            <h3 className="items-center text-xl flex h-20 mx-5">
              <progress className="progress">loading...</progress>
            </h3>
            <div className="w-72 h-96" />
          </div>
        )}
      </section>
    </>
  )
}
