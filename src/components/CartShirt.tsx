import { css } from "@emotion/react"
import { CoolShirt } from "components/CoolShirt"
import { usePrediction } from "hooks/firestore/simple/usePrediction"
import { useMotifUrl } from "hooks/useMotifUrl"

export const CartShirt = ({ id }: { id: string }) => {
  const shirt = usePrediction(id)
  const motifUrl = useMotifUrl(id, { small: true })
  return (
    <div
      className="w-36 h-48"
      css={css`
        // Error when two elements with the same page transition tag are on the page. Not really avoidable with two galleries on the same page.
        page-transition-tag: ${"shirt-" + shirt?._ref.id};
        contain: paint;
      `}
    >
      <CoolShirt url={motifUrl} fallback={shirt?.previewImageUrl} onlyImage={true} color={shirt?.shirtColor} />
    </div>
  )
}
