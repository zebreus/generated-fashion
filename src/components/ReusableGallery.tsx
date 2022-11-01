/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { ReactNode, useEffect, useState } from "react"

type ReusableGalleryProps = {
  elementIds?: string[]
  children: ReactNode
}

export const ReusableGallery = ({ elementIds, children }: ReusableGalleryProps) => {
  const [ref, setRef] = useState<HTMLDivElement | null>(null)
  const [nextElement, setNextElement] = useState<string | undefined>(
    elementIds?.[0] ? elementIds?.[Math.min(3, elementIds.length - 1)] : undefined
  )
  const [prevElement, setPrevElement] = useState<string | undefined>(elementIds?.[0] ? elementIds[0] : undefined)

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
          const currCenter: number = child.rect.width / 2 + child.rect.left
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
          const currCenter: number = child.rect.width / 2 + child.rect.left
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
      <div ref={setRef} className="carousel p-4 space-x-4 bg-transparent">
        {children}
      </div>
      <div className="absolute flex justify-between w-full h-full items-center inset-0 pointer-events-none touch-none">
        <a
          href={`#${prevElement ?? ref?.firstElementChild?.id}`}
          className={`btn btn-primary btn-circle m-6 pointer-events-auto touch-auto ${!prevElement && "btn-disabled"}`}
          aria-disabled={!prevElement}
        >
          ❮
        </a>
        <a
          href={`#${nextElement ?? ref?.lastElementChild?.id}`}
          className={`btn btn-primary btn-circle m-6 pointer-events-auto touch-auto ${!nextElement && "btn-disabled"}`}
          aria-disabled={!nextElement}
        >
          ❯
        </a>
      </div>
    </>
  )
}
