import { increment, updateDoc } from "firebase/firestore"
import { getPredictionRef } from "hooks/firestore/getRefs"
import { useLocalStorage } from "hooks/localstate/localstorage/useLocalStorage"
import { useCallback } from "react"

export const useLikeShirt = (shirtId = "") => {
  const [storedLike, setStoredLike] = useLocalStorage(`like-${shirtId}`, "false")
  const like = storedLike === "true"
  const setLike = useCallback(
    async (like?: boolean) => {
      if (like) {
        setStoredLike("true")
        await updateDoc(getPredictionRef(shirtId), {
          likes: increment(1),
        })
        return
      }
      setStoredLike("false")
      await updateDoc(getPredictionRef(shirtId), {
        likes: increment(-1),
      })
    },
    [setStoredLike, shirtId]
  )
  return [like, setLike] as const
}
