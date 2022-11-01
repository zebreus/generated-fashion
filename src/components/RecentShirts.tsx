import { HeartButton } from "components/HeartButton"
import { ReusableGallery } from "components/ReusableGallery"
import { SmallShirt } from "components/SmallShirt"
import { useLatestPredictions } from "hooks/firestore/simple/useLatestPredictions"

export const RecentShirts = () => {
  const predictions = useLatestPredictions()

  const elementIds = predictions?.map(prediction => "recent-shirt-" + prediction._ref.id)

  return (
    <>
      <section className="relative w-full">
        <h2 className="divider uppercase text-xl">Recent designs</h2>
        <ReusableGallery elementIds={elementIds}>
          {predictions?.length ? (
            predictions.map(shirt => (
              <div key={shirt._ref.id} className="flex flex-col items-center" id={"recent-shirt-" + shirt._ref.id}>
                <SmallShirt shirt={shirt} onlyImage id={"shirt-" + shirt._ref.id} />
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
