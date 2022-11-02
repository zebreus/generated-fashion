import { useLocalStorage } from "hooks/localstate/localstorage/useLocalStorage"
import { SetStateAction, useCallback, useMemo } from "react"

export const useLikedShirts = () => {
  const [likedShirtsString, setLikedShirtsString] = useLocalStorage(`liked-shirts`, "[]")
  const likedShirts = useMemo(() => JSON.parse(likedShirtsString || "[]") as string[], [likedShirtsString])

  const setLikedShirts = useCallback(
    (likedShirts: SetStateAction<string[]>) => {
      setLikedShirtsString(previousLikedShirts =>
        JSON.stringify(
          typeof likedShirts === "function" ? likedShirts(JSON.parse(previousLikedShirts || "[]")) : likedShirts
        )
      )
    },
    [setLikedShirtsString]
  )
  return [likedShirts, setLikedShirts] as const
}
