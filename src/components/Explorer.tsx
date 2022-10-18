/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { SmallShirt, SmallShirtLoader } from "components/SmallShirt"
import { arrayUnion, updateDoc } from "firebase/firestore"
import { createPrediction } from "functions/createPrediction"
import { useExploration } from "hooks/firestore/simple/useExploration"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

type ExplorerProps = {
  explorationId: string | undefined
}

function waitForElement(selector: string) {
  return new Promise(resolve => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector))
    }

    const observer = new MutationObserver(() => {
      if (document.querySelector(selector)) {
        resolve(document.querySelector(selector))
        observer.disconnect()
      }
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })
  })
}

export const Explorer = ({ explorationId }: ExplorerProps) => {
  const exploration = useExploration(explorationId)
  const predicitionIds = exploration?.predictions || []

  const [ref, setRef] = useState<HTMLDivElement | null>(null)
  const [nextElement, setNextElement] = useState<string | undefined>(
    predicitionIds?.[0] ? "shirt-" + predicitionIds?.[Math.min(3, predicitionIds.length - 1)] : undefined
  )
  const [prevElement, setPrevElement] = useState<string | undefined>(
    predicitionIds?.[0] ? "shirt-" + predicitionIds?.[0] : undefined
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

  const router = useRouter()

  const addPrediction = async () => {
    if (!exploration || !ref) return
    const prediction = await createPrediction(exploration.prompt)
    await updateDoc(exploration._ref, {
      predictions: arrayUnion(prediction),
    })
    const newShirtId = `#shirt-${prediction}`
    await waitForElement(newShirtId)
    router.push(newShirtId)
  }

  return (
    <>
      <section className="relative w-full">
        <h2 className="divider uppercase text-xl">Recent designs</h2>
        <div ref={setRef} className="carousel carousel-center p-4 gap-4 bg-transparent">
          {exploration?.predictions?.length ? (
            <>
              {exploration?.predictions.map(predictionId => (
                <SmallShirtLoader key={predictionId} predictionId={predictionId} />
              ))}

              <div id="plusButton" className="min-h-full flex">
                <button
                  onClick={addPrediction}
                  className="btn btn-primary carousel-item btn-circle my-auto ml-10 mr-28"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <g
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path d="M12 5v14"></path>
                      <path d="M5 12h14"></path>
                    </g>
                  </svg>
                </button>
              </div>
            </>
          ) : (
            <SmallShirt shirt={undefined} />
          )}
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
