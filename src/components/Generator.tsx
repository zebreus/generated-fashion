import { css } from "@emotion/react"
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

  const texts = ["", "A cool bird", "Cute fluffy cat, soft light", "A cool bird", "A cool fish", "A red cat"]
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
      <span
        role="textbox"
        contentEditable
        data-placeholder={typedText}
        className={`input input-bordered input-primary mx-4 text-3xl h-auto transition-all resize`}
        css={css`
          min-width: ${focus ? "90%" : "min(90%, 40rem)"};
          max-width: ${focus ? "90%" : "min(90%, 40rem)"};
          min-height: 7.3rem;
          @media (min-width: 400px) {
            min-height: 5.5rem;
          }
          @media (min-width: 640px) {
            min-height: 2.7rem;
          }
          :empty::after {
            content: attr(data-placeholder);
            display: inline-block;
            color: hsla(var(--bc) / 0.5);
          }
        `}
        onInput={v => setValue(v.currentTarget.textContent || "")}
        onFocus={() => setFocus(true)}
      ></span>
      <button
        className="btn btn-primary text-xl font-normal lowercase pb-1"
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
          console.log({ prompt })
          router.push(`/shirt/${newId}`)
        }}
        disabled={!value}
      >
        generate.
      </button>
    </div>
  )
}
