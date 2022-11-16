import { useEffect, useState } from "react"

export const useClientside = () => {
  const [clientside, setClientside] = useState(false)
  useEffect(() => {
    setClientside(typeof window !== undefined)
  }, [setClientside])

  return clientside
}

export const useClientsideValue = <T>(fun: () => T) => {
  const clientside = useClientside()
  return clientside ? fun() : undefined
}
