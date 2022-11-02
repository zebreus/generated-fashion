import { HeartButton } from "components/HeartButton"
import { ReusableGallery } from "components/ReusableGallery"
import { SmallShirtLoader } from "components/SmallShirt"
import { useLikedShirts } from "hooks/useLikedShirts"

export const MyLikedShirts = () => {
  const [shirtIds] = useLikedShirts()

  const elementIds = shirtIds?.map(shirtId => "liked-shirt-" + shirtId)

  return (
    <>
      <section className="relative w-full">
        <h2 className="divider uppercase text-xl">My favorites</h2>
        <ReusableGallery elementIds={elementIds}>
          {shirtIds.map(shirtId => (
            <div key={shirtId} className="flex flex-col items-center" id={"liked-shirt-" + shirtId}>
              <SmallShirtLoader predictionId={shirtId} onlyImage id={"liked-shirt-" + shirtId} />
              <HeartButton id={shirtId} />
            </div>
          ))}
        </ReusableGallery>
      </section>
    </>
  )
}
