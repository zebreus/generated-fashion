export type PredictionState = "starting" | "processing" | "succeeded" | "failed" | "canceled"

type PredictionRequest = {
  replicateId?: undefined
  version?: undefined
  state?: undefined
  prompt: string
  /** This wll be used as prompt, if set */
  actualPrompt?: string
  seed: number
  resultUrl?: undefined
  smallPrintUrl?: undefined
  printUrl?: undefined
  createdAt?: undefined
  previewImageUrl?: undefined
  likes?: undefined
  shirtColor?: undefined
}

export type Prediction =
  | {
      replicateId?: string
      version: string
      state: PredictionState
      prompt: string
      /** This wll be used as prompt, if set */
      actualPrompt?: string
      seed: number
      resultUrl?: string
      smallPrintUrl?: string
      printUrl?: string
      createdAt: number
      previewImageUrl?: string
      likes: number
      shirtColor?: string
    }
  | PredictionRequest
