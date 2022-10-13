import { setDoc } from "firebase/firestore"
import { generateId } from "functions/generateId"
import { getPredictionRef } from "hooks/firestore/getRefs"
import { useTypedText } from "hooks/useTypedText"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

const useTextAnimation = () => {
  const [state, setState] = useState(0)
  useEffect(() => {
    const interval = setInterval(() => {
      setState(state => (state + 1) % 5)
    }, 3000)
    return () => clearInterval(interval)
  })

  const texts = [
    "",
    "terror scarecrow, donato giancola style",
    "Cute fluffy cat, soft light",
    "A cool bird",
    "A cool fish",
    "A red cat",
  ]
  const text = texts[state]
  return text
}

export const Generator = () => {
  const [value, setValue] = useState("")
  const router = useRouter()
  const text = useTextAnimation()
  const typedText = useTypedText(text, 50)
  const [focus, setFocus] = useState(false)

  return (
    <div className="flex flex-col my-20 justify-center items-center space-y-3 w-full">
      <h1 className="text-3xl font-bold">describe your shirt.</h1>
      <textarea
        cols={4}
        placeholder={typedText}
        className={`input input-bordered input-primary mx-4  text-3xl min-h-8 transition-all ${
          focus ? "min-h-[8rem] min-w-[90%]" : "min-w-[40rem]"
        }`}
        onChange={v => setValue(v.target.value)}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
      >
        {value}
      </textarea>
      <button
        className="btn btn-primary"
        onClick={async () => {
          const newId = generateId()
          const prompt = value
          const ref = getPredictionRef(newId)
          const seed = Math.floor(Math.random() * 100000000)
          await setDoc(getPredictionRef(newId), {
            prompt: prompt,
            seed: seed,
            _ref: ref,
          })
          router.push(`/shirt/${newId}`)
        }}
      >
        GENERATE NOW!!!
      </button>
    </div>
  )
}
