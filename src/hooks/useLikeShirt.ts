import { increment, updateDoc } from "firebase/firestore"
import { getPredictionRef } from "hooks/firestore/getRefs"
import { useLikedShirts } from "hooks/useLikedShirts"
import { useCallback } from "react"

export const useLikeShirt = (shirtId = "") => {
  const [likedShirts, setLikedShirts] = useLikedShirts()
  const like = likedShirts.includes(shirtId)
  const setLike = useCallback(
    async (like?: boolean) => {
      if (like) {
        setLikedShirts(previousLikedShirts =>
          previousLikedShirts.includes(shirtId) ? previousLikedShirts : [...previousLikedShirts, shirtId]
        )
        await updateDoc(getPredictionRef(shirtId), {
          likes: increment(1),
        })
        return
      }
      setLikedShirts(previousLikedShirts => previousLikedShirts.filter(previousShirtId => previousShirtId !== shirtId))
      await updateDoc(getPredictionRef(shirtId), {
        likes: increment(-1),
      })
    },
    [setLikedShirts, shirtId]
  )
  return [like, setLike] as const
}
