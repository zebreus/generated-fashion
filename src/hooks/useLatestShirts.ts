import useSWR from "swr"

// @ts-expect-error: Ignore for now
const fetcher = (...args: unknown[]) => fetch(...args).then(res => res.json())

const checkShirts = (maybeShirts: unknown): maybeShirts is Array<{ id: string; prompt: string }> => {
  if (!maybeShirts) {
    return false
  }
  if (!Array.isArray(maybeShirts)) {
    return false
  }
  const valid = maybeShirts.every(shirt => {
    if (typeof shirt !== "object") {
      return false
    }
    if (!shirt) {
      return false
    }
    if (typeof shirt.id !== "string") {
      return false
    }
    if (typeof shirt.prompt !== "string") {
      return false
    }
    return true
  })

  return valid
}

export const useLatestShirts = () => {
  const { data } = useSWR(`/api/latestShirts`, fetcher, { refreshInterval: 10000 })
  const shirts = data?.latest
  if (!checkShirts(shirts)) {
    console.log("check failed")
    return undefined
  }

  return shirts
}
