import { generateId } from "functions/generateId"
import { useGlobalValue } from "hooks/localstate/globalVars/useGlobalValue"
import { useEffect, useMemo } from "react"

// export const usePageTransitionTag = (wanted: string) => {
//   const id = useId()
//   const prevId = getGlobalValue("pageTransitionTags", wanted)
//   if (!prevId) {
//     setGlobalValue("pageTransitionTags", wanted, id)
//   }
//   const activeId = getGlobalValue("pageTransitionTags", wanted)
//   // console.log(wanted, activeId, id)
//   // const [, setActiveId] = useGlobalValue<string>("pageTransitionTags", wanted, "")
//   const [ignored, forceUpdate] = useReducer(x => x + 1, 0)

//   // useEffect(() => {
//   //   setActiveId(currentId => {
//   //     if (!currentId) {
//   //       // if (wanted === "shirt--Dixfs6cX3") {
//   //       //   console.log("Setting shirt--Dixfs6cX3 for ", id)
//   //       // }
//   //       return id
//   //     }
//   //     return currentId
//   //   })
//   // }, [activeId, setActiveId, id])

//   useEffect(() => {
//     const prevId = getGlobalValue("pageTransitionTags", wanted)
//     if (!prevId) {
//       setGlobalValue("pageTransitionTags", wanted, id)
//       forceUpdate()
//     }

//     return () => {
//       console.log("freeName", wanted, id)
//       const activeId = getGlobalValue("pageTransitionTags", wanted)
//       if (activeId === id) {
//         setGlobalValue("pageTransitionTags", wanted, "")
//         forceUpdate()
//       }
//     }
//   }, [id])

//   const active = activeId === id
//   const tag = active ? wanted : "none"
//   console.log("Returning " + tag + " for " + id + ". (wants " + wanted + ")")
//   return tag
// }

export const usePageTransitionTag = (wanted: string) => {
  const id = useMemo(() => generateId(), [])
  const [activeId, setActiveId] = useGlobalValue("pageTransitionTags", wanted, "")

  useEffect(() => {
    setActiveId(currentId => {
      if (!currentId) {
        // if (wanted === "shirt--Dixfs6cX3") {
        //   console.log("Setting shirt--Dixfs6cX3 for ", id)
        // }
        return id
      }
      return currentId
    })
  }, [activeId, setActiveId, id])

  useEffect(() => {
    return () => {
      setActiveId(currentId => {
        if (currentId === id) {
          // if (wanted === "shirt--Dixfs6cX3") {
          //   console.log("Freeing shirt--Dixfs6cX3 for ", id)
          // }
          return ""
        }
        return currentId
      })
    }
  }, [id, setActiveId])

  const active = activeId === id
  return active ? wanted : "none"
}
