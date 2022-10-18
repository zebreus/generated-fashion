import { limit, orderBy, where } from "firebase/firestore"
import { getQuery, useQuery } from "hooks/firestore/core/useQuery"
import { getPredictionsRef } from "hooks/firestore/getRefs"

// ts-prune-ignore-next
export function usePopularPredictions() {
  const result = useQuery(getPredictionsRef(), where("state", "==", "succeeded"), orderBy("likes", "desc"), limit(10))
  return result.documents
}

// ts-prune-ignore-next
export async function getPopularPredictions() {
  const result = await getQuery(
    getPredictionsRef(),
    where("state", "==", "succeeded"),
    orderBy("likes", "asc"),
    limit(10)
  )
  return result
}
