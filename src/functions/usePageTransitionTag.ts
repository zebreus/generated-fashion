import { generateId } from "functions/generateId"
import { useGlobalValue } from "hooks/localstate/globalVars/useGlobalValue"
import { useEffect, useMemo } from "react"

export const usePageTransitionTag = (wanted: string) => {
  const id = useMemo(() => generateId(), [])
  const [activeId, setActiveId] = useGlobalValue("pageTransitionTags", wanted, id)

  useEffect(() => {
    setActiveId(currentId => (!currentId ? id : currentId))
  }, [activeId, setActiveId, id])

  useEffect(() => {
    return () => {
      setActiveId(currentId => (currentId === id ? "" : currentId))
    }
  }, [id, setActiveId])

  const active = activeId === id
  return active ? wanted : "none"
}
