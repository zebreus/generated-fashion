import { HeartButton } from "components/HeartButton"
import { ReusableGallery } from "components/ReusableGallery"
import { SmallShirt } from "components/SmallShirt"
import { usePopularPredictions } from "hooks/firestore/simple/usePopularPredictions"

export const PopularShirts = () => {
  const predictions = usePopularPredictions()

  const elementIds = predictions?.map(prediction => "popular-shirt-" + prediction._ref.id)

  return (
    <>
      <section className="relative w-full">
        <h2 className="divider uppercase text-xl">Popular designs</h2>
        <ReusableGallery elementIds={elementIds}>
          {predictions?.length ? (
            predictions.map(shirt => (
              <div key={shirt._ref.id} className="flex flex-col items-center" id={"popular-shirt-" + shirt._ref.id}>
                <SmallShirt shirt={shirt} onlyImage id={"pshirt-" + shirt._ref.id} />
                <HeartButton id={shirt._ref.id} />
              </div>
            ))
          ) : (
            <SmallShirt shirt={undefined} />
          )}
        </ReusableGallery>
      </section>
    </>
  )
}
