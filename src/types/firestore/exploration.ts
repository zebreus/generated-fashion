/** Initial exploration based on a prompt */
type InitialExploration = {
  type: "initial"
  prompt: string
  predictions: string[]
}

/** Refining exploration, based on another prediction */
type RefiningExploration = {
  type: "refining"
  basePrediction: string
  initialPrompt: string
  prompt: string
  predictions: string[]
}

export type Exploration = InitialExploration | RefiningExploration
