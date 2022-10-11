import { useCurrentUser } from "hooks/localstate/auth/useCurrentUser"

export function useUserId() {
  const currentUser = useCurrentUser()

  return currentUser?.uid
}
