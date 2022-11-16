import { css } from "@emotion/react"
import { CartButton } from "components/CartButton"
import { CoolShirt } from "components/CoolShirt"
import { HeartButton } from "components/HeartButton"
import { ShirtColorSelector } from "components/ShirtColorSelector"
import { ShirtTransitionStyles } from "components/ShirtTransitionStyles"
import { usePrediction } from "hooks/firestore/simple/usePrediction"
import { getMotifUrl } from "hooks/useMotifUrl"
import { getMainLayout } from "layouts/MainLayout"
import { useRouter } from "next/router"

const ShirtPage = () => {
  const router = useRouter()
  const id = typeof router.query["id"] === "string" ? router.query["id"] : router.query["id"]?.[0]

  const prediction = usePrediction(id)

  const motifUrl = getMotifUrl(prediction)
  return (
    <>
      <ShirtTransitionStyles id={id} />
      <section className="flex-grow flex flex-col items-center justify-between w-full">
        <div className="relative w-full min-h-[80vh] flex-grow max-h-full" /* + " -mt-4"*/>
          <div
            css={css`
              position: absolute;
              left: 0;
              right: 0;
              bottom: 0;
              top: 0;
              page-transition-tag: ${"shirt-" + id};
              contain: paint;
            `}
          >
            <CoolShirt url={motifUrl} fallback={prediction?.previewImageUrl} />
          </div>
        </div>
        {/* <h3 className="divider">prompt</h3> */}
        <h3 className="text-xl m-4 text-center z-10">{prediction?.prompt}</h3>
        <HeartButton id={id} />
        <CartButton id={id} />
        <ShirtColorSelector id={id} />
        <button
          onClick={async () => {
            const shareData = {
              title: "generated shirt ",
              text: `Look at my shirt with a picture of ${prediction?.prompt}`,
              url: window.location.href,
            }

            try {
              await navigator.share(shareData)
            } catch (err) {
              alert(`Error: ${err}`)
            }
          }}
          className="btn btn-primary"
        >
          SHARE?
        </button>
      </section>
    </>
  )
}

ShirtPage.getLayout = getMainLayout

export default ShirtPage
