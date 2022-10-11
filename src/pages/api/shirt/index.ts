import is from "@sindresorhus/is"
import { setDoc, updateDoc } from "firebase/firestore"
import { generateId } from "functions/generateId"
import { getOwnUrl } from "functions/getOwnUrl"
import { getPredictionRef } from "hooks/firestore/getRefs"
import { initialize } from "hooks/useInitialize"
import { NextRequest } from "next/server"
import { predict } from "replicate-api"

const replicateVersion = "a9758cbfbd5f3c2094457d996681af52552901775aa2d6dd0b17fd15df959bef"
const dontGC: unknown[] = []

// Next.js API route support: https://nextjs.org/docs/api-routes/introductio
const handler = async (req: NextRequest) => {
  initialize()
  const { prompt } = await req.json()
  if (!is.string(prompt)) {
    return new Response(JSON.stringify({ detail: "a string prompt is required" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }
  if (prompt.length < 3) {
    return new Response(JSON.stringify({ detail: "prompt is too short" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }
  if (prompt.length > 2000) {
    return new Response(JSON.stringify({ detail: "prompt is too long" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }

  const id = generateId()
  const seed = Math.floor(Math.random() * 100000000)

  const ref = getPredictionRef(id)
  await setDoc(ref, {
    createdAt: Date.now(),
    prompt: prompt,
    seed: seed,
    state: "starting",
    version: replicateVersion,
    _ref: ref,
  })

  const backgroundPromise = backgroundHandler(prompt, id, seed)

  dontGC.push(backgroundPromise)

  return new Response(JSON.stringify({ id: id }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  })
}

const backgroundHandler = async (prompt: string, id: string, seed: number) => {
  const prediction = await predict({
    version: replicateVersion,
    input: { prompt: prompt, steps: 10, seed: seed },
    token: process.env["REPLICATE_TOKEN"] || "",
    webhook: getOwnUrl() + "/api/replicateWebhook",
  })

  const newRef = getPredictionRef(id)

  await updateDoc(newRef, {
    replicateId: prediction.id,
    state: prediction.status,
  })
}

export default handler

export const config = {
  runtime: "experimental-edge",
}
