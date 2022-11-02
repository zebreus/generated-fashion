/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { HeartButton } from "components/HeartButton"
import { ReusableGallery } from "components/ReusableGallery"
import { SmallShirt, SmallShirtLoader } from "components/SmallShirt"
import { arrayUnion, updateDoc } from "firebase/firestore"
import { createPrediction } from "functions/createPrediction"
import { useExploration } from "hooks/firestore/simple/useExploration"
import { useRouter } from "next/router"
import { useState } from "react"

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
  const [locked, setLocked] = useState(false)

  const router = useRouter()

  const addPrediction = async () => {
    if (!exploration) return
    setLocked(true)
    setTimeout(() => setLocked(false), 4000)
    const prediction = await createPrediction(exploration.prompt)
    await updateDoc(exploration._ref, {
      predictions: arrayUnion(prediction),
    })
    const newShirtId = `#shirt-${prediction}`
    await waitForElement(newShirtId)
    router.push(newShirtId)
  }

  const elementIds = [...predicitionIds.map(id => `shirt-${id}`), "plusButton"]

  return (
    <>
      <section className="relative w-full">
        <h2 className="divider uppercase text-xl">Recent designs</h2>
        <ReusableGallery elementIds={elementIds}>
          {exploration?.predictions?.length ? (
            <>
              {exploration?.predictions.map(predictionId => (
                <div key={predictionId} className="flex flex-col items-center" id={"shirt-" + predictionId}>
                  <SmallShirtLoader predictionId={predictionId} id={"shirt-" + predictionId} />
                  <HeartButton id={predictionId} />
                </div>
              ))}

              <div id="plusButton" className="min-h-full flex flex-column">
                <button
                  onClick={addPrediction}
                  className="btn btn-primary carousel-item btn-circle my-auto ml-10 mr-28"
                  disabled={locked}
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
        </ReusableGallery>
      </section>
    </>
  )
}
