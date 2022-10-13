import { Gallery } from "components/Gallery"
import { setDoc } from "firebase/firestore"
import { generateId } from "functions/generateId"
import { getPredictionRef } from "hooks/firestore/getRefs"
import Link from "next/link"
import { useMemo, useState } from "react"

export default function ShirtPreview() {
  const newId = useMemo(() => generateId(), [])
  const [value, setValue] = useState("a cool dog")
  return (
    <main className="flex flex-col min-h-screen justify-center items-center">
      <h2 className="text-5xl m-3">generated.fashion</h2>

      <div className="flex flex-col min-h-screen justify-center items-center space-y-3">
        <h1 className="text-3xl font-bold">
          Create shirts with <a href="https://nextjs.org">stable diffusion</a> (AI!!!)
        </h1>
        <input
          type="text"
          placeholder="Type here"
          className="input input-bordered input-primary w-full max-w-xs"
          value={value}
          onChange={v => setValue(v.target.value)}
        />
        <Link href={`/shirt/${newId}`} passHref>
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid,jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions  */}
          <a
            style={{ padding: 3, borderWidth: 2, borderRadius: 0, borderColor: "#000000", borderStyle: "solid" }}
            onClick={async () => {
              const prompt = value
              const ref = getPredictionRef(newId)
              const seed = Math.floor(Math.random() * 100000000)
              await setDoc(getPredictionRef(newId), {
                prompt: prompt,
                seed: seed,
                _ref: ref,
              })
            }}
          >
            GENERATE NOW!!!
          </a>
        </Link>
      </div>
      <Gallery />
    </main>
  )
}
