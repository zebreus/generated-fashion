import { documentId, where } from "firebase/firestore"
import { useQuery } from "hooks/firestore/core/useQuery"
import { getPredictionsRef } from "hooks/firestore/getRefs"
import { useExploration } from "hooks/firestore/simple/useExploration"

// ts-prune-ignore-next
export function useExplorationPredictions(explorationId: string | undefined) {
  const exploration = useExploration(explorationId)
  const result = useQuery(
    exploration?.predictions ? getPredictionsRef() : undefined,
    where(documentId(), "in", exploration?.predictions)
  )
  return result?.documents
}

// // ts-prune-ignore-next
// export async function getExplorationPredictions() {
//   const result = await getQuery(
//     getPredictionsRef(),
//     where("state", "==", "succeeded"),
//     orderBy("createdAt", "desc"),
//     limit(10)
//   )
//   return result
// }
