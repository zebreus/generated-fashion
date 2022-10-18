import { getDocument, useDocument } from "hooks/firestore/core/useDocument"
import { getExplorationRef } from "hooks/firestore/getRefs"

// ts-prune-ignore-next
export function useExploration(explorationId: string | undefined) {
  const { document } = useDocument(getExplorationRef(explorationId))
  return document
}

// ts-prune-ignore-next
export async function getExploration(explorationId: string) {
  return await getDocument(getExplorationRef(explorationId))
}
