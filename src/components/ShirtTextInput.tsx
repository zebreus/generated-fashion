import { deleteField, updateDoc } from "firebase/firestore"
import { usePrediction } from "hooks/firestore/simple/usePrediction"
import { useState } from "react"

export type ShirtTextInputProps = {
  id: string | undefined
}

export const ShirtTextInput = ({ id }: ShirtTextInputProps) => {
  const prediction = usePrediction(id)
  const [text, setText] = useState<string>()
  return (
    <div className="form-control mb-2">
      <label className="label" htmlFor="shirttextinput">
        <span className="label-text">Adjust text</span>
      </label>
      <div className="input-group">
        <input
          id="shirttextinput"
          type="text"
          placeholder={prediction?.customText ?? prediction?.prompt}
          className="input input-bordered"
          value={text ?? prediction?.customText ?? prediction?.prompt ?? "none"}
          onChange={e => setText(e.target.value ?? undefined)}
        />
        <button
          className="btn btn-square"
          onClick={() => {
            if (text && prediction && text === prediction?.prompt) {
              updateDoc(prediction._ref, { customText: deleteField() })
              return
            }
            if (prediction && prediction.customText !== text) {
              updateDoc(prediction._ref, { customText: text })
              return
            }
          }}
        >
          set
        </button>
      </div>
    </div>
  )
}
