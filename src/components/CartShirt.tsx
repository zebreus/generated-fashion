import { css } from "@emotion/react"
import { CoolShirt } from "components/CoolShirt"
import { usePrediction } from "hooks/firestore/simple/usePrediction"

export const CartShirt = ({ id }: { id: string }) => {
  const shirt = usePrediction(id)

  return (
    <div
      className="w-36 h-48"
      css={css`
        // Error when two elements with the same page transition tag are on the page. Not really avoidable with two galleries on the same page.
        page-transition-tag: ${"shirt-" + shirt?._ref.id};
        contain: paint;
      `}
    >
      <CoolShirt url={`/api/${shirt?._ref.id}/print`} fallback={shirt?.previewImageUrl} onlyImage={true} />
    </div>
  )
}
