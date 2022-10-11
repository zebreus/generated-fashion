import { getAuth, onAuthStateChanged, User } from "firebase/auth"
import { useEffect, useState } from "react"

export function useCurrentUser() {
  const [currentUser, setCurrentUser] = useState<undefined | User>(getAuth()?.currentUser || undefined)

  useEffect(() => {
    return onAuthStateChanged(getAuth(), user => {
      setCurrentUser(user || undefined)
    })
  }, [])

  return currentUser
}

// ts-prune-ignore-next
export function getCurrentUser() {
  const currentUser = getAuth()?.currentUser || undefined

  return currentUser
}
