import useSWR from "swr"

// @ts-expect-error: Ignore for now
const fetcher = (...args: unknown[]) => fetch(...args).then(res => res.json())

export const useImage = (id: string | undefined) => {
  const { data } = useSWR(`/api/shirt/${id}`, fetcher, { refreshInterval: 1000 })
  const url = data?.url
  return url
}
