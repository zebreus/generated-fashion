import { Explorer } from "components/Explorer"
import { ShirtTransitionStyles } from "components/ShirtTransitionStyles"
import { useExploration } from "hooks/firestore/simple/useExploration"
import { getMainLayout } from "layouts/MainLayout"
import { useRouter } from "next/router"

const ExplorePage = () => {
  const router = useRouter()
  const id = typeof router.query["id"] === "string" ? router.query["id"] : router.query["id"]?.[0]

  const exploration = useExploration(id)
  return (
    <>
      <ShirtTransitionStyles id={id} />
      <section className="flex-grow flex flex-col items-center justify-between w-full">
        <div className="relative w-full min-h-[80vh] flex-grow max-h-full" /* + " -mt-4"*/>
          <Explorer explorationId={exploration?._ref.id} />
        </div>
        <h3 className="divider">{exploration?.prompt}</h3>
      </section>
    </>
  )
}

ExplorePage.getLayout = getMainLayout

export default ExplorePage
