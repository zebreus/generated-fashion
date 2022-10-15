import { getApp } from "firebase/app"
import { getFunctions, httpsCallable } from "firebase/functions"
import { initialize } from "hooks/useInitialize"

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

  const result = await func({
    widthQuery: "288",
    heightQuery: "384",
    pathQuery: `shirt/${predictionId}/image`,
    shirtIdQuery: predictionId,
    token: process.env["FIRESTORE_RELAY_SHARED_SECRET"] || "",
  })

  console.log("result:", result)
}
