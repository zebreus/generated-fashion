import { useEffect, useState } from "react"
import { Shirt } from "react-3d-shirt"

type CoolShirtProps = {
  url: string | undefined
}

export const CoolShirt = ({ url }: CoolShirtProps) => {
  const [clientside, setClientside] = useState(typeof window !== "undefined")
  useEffect(() => {
    setClientside(true)
  }, [])
  url
  return <>{clientside ? <Shirt motif={url} color="white" /> : null}</>
}
