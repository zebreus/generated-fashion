import { css } from "@emotion/react"
import { CoolShirt } from "components/CoolShirt"
import { useLatestPredictions } from "hooks/firestore/simple/useLatestPredictions"
import Link from "next/link"
import { useEffect, useState } from "react"

export const Gallery = () => {
  const predictions = useLatestPredictions()
  const [ref, setRef] = useState<HTMLDivElement | null>(null)
  const [nextElement, setNextElement] = useState<string | undefined>(
    predictions?.[0] ? "shirt-" + predictions?.[Math.min(3, predictions.length - 1)]._ref.id : undefined
  )
  const [prevElement, setPrevElement] = useState<string | undefined>(
    predictions?.[0] ? "shirt-" + predictions?.[0]._ref.id : undefined
  )

  useEffect(() => {
    if (!ref) {
      setNextElement(undefined)
      setPrevElement(undefined)
      return
    }

    const getElements = () => {
      if (!ref) return undefined
      const children = [...ref.children]
      const rectsWithIds = children.map(child => {
        const rect = child.getBoundingClientRect()
        return { id: child.id, rect }
      })
      const carouselRect = ref.getBoundingClientRect()
      // Find the closest element to the left that is mostly offscreen
      const previous = rectsWithIds.reduce(
        (acc, child) => {
          const currCenter = child.rect.width / 2 + child.rect.left
          const currDiff = carouselRect.left - currCenter
          if (currDiff < 0 || currDiff > acc.diff) {
            return acc
          }
          return { diff: currDiff, id: child.id }
        },
        { id: undefined, diff: Infinity } as { id: string | undefined; diff: number }
      )
      // Find the closest element to the right that is mostly offscreen
      const next = rectsWithIds.reduce(
        (acc, child) => {
          const currCenter = child.rect.width / 2 + child.rect.left
          const currDiff = currCenter - carouselRect.right
          if (currDiff < 0 || currDiff > acc.diff) {
            return acc
          }
          return { diff: currDiff, id: child.id }
        },
        { id: undefined, diff: Infinity } as { id: string | undefined; diff: number }
      )

      return { previous: previous?.id, next: next?.id }
    }

    const interval = setInterval(() => {
      const { previous, next } = getElements() || {}

      setNextElement(next)
      setPrevElement(previous)
    }, 200)
    return () => clearInterval(interval)
  }, [ref])

  return (
    <>
      <section className="relative w-full">
        <h2 className="divider uppercase text-xl">Recent designs</h2>
        <div ref={setRef} className="carousel carousel-center p-4 space-x-4 bg-transparent">
          {predictions?.map(shirt => (
            <Link key={shirt._ref.id} href={`/shirt/${shirt._ref.id}`} passHref>
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a
                className="carousel-item flex flex-col text-center items-center max-w-xs min-w-xs"
                id={"shirt-" + shirt._ref.id}
              >
                <h3 className="items-center text-xl flex h-20 mx-5">
                  {(shirt.prompt.length > 88 ? shirt.prompt.slice(0, 85) + "..." : shirt.prompt).replace(/^./, v =>
                    v.toUpperCase()
                  )}
                </h3>
                <div
                  className="w-72 h-96"
                  css={css`
                    margin-top: -2rem;
                  `}
                >
                  <CoolShirt url={shirt.resultUrl} fallback={shirt?.previewImageUrl} />
                </div>
              </a>
            </Link>
          ))}
        </div>
        <div className="absolute flex justify-between w-full h-full items-center inset-0 pointer-events-none touch-none">
          <a
            href={`#${prevElement ?? ref?.firstElementChild?.id}`}
            className={`btn btn-primary btn-circle m-6 pointer-events-auto touch-auto ${
              !prevElement && "btn-disabled"
            }`}
            aria-disabled={!prevElement}
          >
            ❮
          </a>
          <a
            href={`#${nextElement ?? ref?.lastElementChild?.id}`}
            className={`btn btn-primary btn-circle m-6 pointer-events-auto touch-auto ${
              !nextElement && "btn-disabled"
            }`}
            aria-disabled={!nextElement}
          >
            ❯
          </a>
        </div>
      </section>
    </>
  )
}
