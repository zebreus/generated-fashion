import is from "@sindresorhus/is"
import { setDoc } from "firebase/firestore"
import { getOwnUrl } from "functions/getOwnUrl"
import { getPredictionRef } from "hooks/firestore/getRefs"
import { getPrediction } from "hooks/firestore/simple/usePrediction"
import { initialize } from "hooks/useInitialize"
import { NextRequest } from "next/server"
import { predict } from "replicate-api"

const replicateVersion = "a9758cbfbd5f3c2094457d996681af52552901775aa2d6dd0b17fd15df959bef"

// Next.js API route support: https://nextjs.org/docs/api-routes/introductio
const handler = async (req: NextRequest) => {
  initialize()
  const { prompt, id } = await req.json()
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
  if (!is.string(id)) {
    return new Response(JSON.stringify({ detail: "a id is required" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }
  if (id.length !== 10) {
    return new Response(JSON.stringify({ detail: "the id needs to be 10 characters" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }

  const object = await getPrediction(id)

  if (object) {
    return new Response(JSON.stringify({ detail: "can only generate new documents" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }

  const seed = Math.floor(Math.random() * 100000000)

  const prediction = await predict({
    version: replicateVersion,
    input: { prompt: prompt, num_inference_steps: 100, seed: seed },
    token: process.env["REPLICATE_TOKEN"] || "",
    webhook: getOwnUrl() + "/api/replicateWebhook",
  })

  const newRef = getPredictionRef(id)

  await setDoc(newRef, {
    createdAt: Date.now(),
    replicateId: prediction.id,
    prompt: prompt,
    seed: seed,
    state: "starting",
    version: replicateVersion,
    _ref: newRef,
  })

  return new Response(JSON.stringify({ id: id }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  })
}

export default handler

export const config = {
  runtime: "experimental-edge",
}
