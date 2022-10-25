import { css } from "@emotion/react"
import { CoolShirt } from "components/CoolShirt"
import { PromptDisplay } from "components/PromptDisplay"
import { ShirtTransitionStyles } from "components/ShirtTransitionStyles"
import { usePageTransitionTag } from "functions/usePageTransitionTag"
import { WithRef } from "hooks/firestore/FirestoreDocument"
import { usePrediction } from "hooks/firestore/simple/usePrediction"
import { createLinkClickHandler } from "hooks/useLinkClickHandler"
import Link from "next/link"
import { useRouter } from "next/router"
import { Prediction } from "types/firestore/prediction"

type SmallShirtProps = {
  shirt?: WithRef<Prediction> | undefined
  /** Never display the 3d model */
  onlyImage?: boolean
  id?: string
}

type SmallShirtLoaderProps = {
  predictionId?: string | undefined
  /** Never display the 3d model */
  onlyImage?: boolean
  id?: string
}

export const SmallShirtLoader = ({ predictionId, onlyImage, id }: SmallShirtLoaderProps) => {
  const shirt = usePrediction(predictionId)
  return <SmallShirt shirt={shirt} onlyImage={onlyImage} id={id} />
}

export const SmallShirt = ({ shirt, onlyImage, id }: SmallShirtProps) => {
  const router = useRouter()
  const tag = usePageTransitionTag(`shirt-${shirt?._ref.id}`)
  return shirt ? (
    <>
      <ShirtTransitionStyles id={shirt._ref.id} />
      <Link href={`/shirt/${shirt._ref.id}`} passHref>
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid,jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
        <a
          className="carousel-item flex flex-col text-center items-center max-w-xs min-w-xs"
          id={id ?? "shirt-" + shirt._ref.id}
          onClick={createLinkClickHandler(`/shirt/${shirt._ref.id}`, router)}
        >
          <h3 className="">
            <PromptDisplay prompt={shirt.prompt} />
          </h3>
          <div
            className="w-72 h-96"
            css={css`
              // Error when two elements with the same page transition tag are on the page. Not really avoidable with two galleries on the same page.
              page-transition-tag: ${tag};
              contain: paint;
            `}
          >
            <CoolShirt url={shirt.resultUrl} fallback={shirt?.previewImageUrl} onlyImage={onlyImage} />
          </div>
        </a>
      </Link>
    </>
  ) : (
    <div className="mx-auto">
      <h3 className="items-center text-xl flex h-20 mx-5">
        <progress className="progress">loading...</progress>
      </h3>
      <div className="w-72 h-96" />
    </div>
  )
}
