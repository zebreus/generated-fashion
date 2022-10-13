import { Gallery } from "components/Gallery"
import { setDoc } from "firebase/firestore"
import { generateId } from "functions/generateId"
import { getPredictionRef } from "hooks/firestore/getRefs"
import { useRouter } from "next/router"
import { useState } from "react"

export default function ShirtPreview() {
  const [value, setValue] = useState("a cool dog")
  const router = useRouter()

  return (
    <main className="flex flex-col min-h-screen items-center justify-between">
      <h2 className="sm:text-5xl text-3xl m-3">generated.fashion</h2>

      <div className="flex flex-col my-20 justify-center items-center space-y-3">
        <h1 className="text-3xl font-bold">Create shirts with stable diffusion (AI!!!)</h1>
        <input
          type="text"
          placeholder="Type here"
          className="input input-bordered input-primary w-full max-w-xs"
          value={value}
          onChange={v => setValue(v.target.value)}
        />
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
      <Gallery />
    </main>
  )
}
