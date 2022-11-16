import { getApp } from "firebase/app"
import { getFunctions, httpsCallable } from "firebase/functions"
import { WithRef } from "hooks/firestore/FirestoreDocument"
import { initialize } from "hooks/useInitialize"
import { Prediction } from "types/firestore/prediction"

export const updateScreenshot = async (predictionId: string) => {
  initialize()
  const functions = getFunctions(getApp(), "europe-west3")
  const func = httpsCallable<
    {
      widthQuery: string
      heightQuery: string
      pathQuery: string
      shirtIdQuery: string
      token: string
    },
    { status: "OK" }
  >(functions, "createShirtScreenshot")

  await func({
    widthQuery: "288",
    heightQuery: "384",
    pathQuery: `shirt/${predictionId}/image`,
    shirtIdQuery: predictionId,
    token: process.env["FIRESTORE_RELAY_SHARED_SECRET"] || "",
  })
}

export const updateScreenshotIfRequired = async (
  oldPrediction: WithRef<Prediction> | undefined,
  newPrediction: WithRef<Prediction> | undefined
) => {
  const ready = newPrediction && oldPrediction && newPrediction.state === "succeeded" && newPrediction.resultUrl
  if (!ready) {
    return
  }

  const motifChanged = oldPrediction.resultUrl !== newPrediction.resultUrl
  const textChanged =
    (oldPrediction.customText || oldPrediction.prompt) !== (newPrediction.customText || newPrediction.prompt)
  const colorChanged = oldPrediction.shirtColor !== newPrediction.shirtColor
  if (!motifChanged && !textChanged && !colorChanged) {
    return
  }

  updateScreenshot(newPrediction._ref.id)
  // Ensure screenshots are triggered
  await new Promise(r => setTimeout(r, 500))
}
