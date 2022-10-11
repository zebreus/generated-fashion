import { css } from "@emotion/react"
import { Gallery } from "components/Gallery"
import { generateId } from "functions/generateId"
import Link from "next/link"
import { useMemo } from "react"

export default function ShirtPreview() {
  const newId = useMemo(() => generateId(), [])
  return (
    <div
      css={css`
        padding: 0 2rem;
      `}
    >
      <main
        css={css`
          min-height: 100vh;
          padding: 4rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        `}
      >
        <h1
          css={css`
            a {
              color: #0070f3;
              text-decoration: none;
            }

            a:hover,
            a:focus,
            a:active {
              text-decoration: underline;
            }

            margin: 0;
            line-height: 1.15;
            font-size: 4rem;
            text-align: center;
          `}
        >
          Create shirts with <a href="https://nextjs.org">stable diffusion</a> (AI!!!)
        </h1>
        <textarea
          id="textareaJOOO"
          css={css`
            margin: 4rem 0;
            line-height: 1.5;
            font-size: 1.5rem;
            text-align: center;
            width: 600px;
            max-width: 100%;
            height: 300px;
          `}
          defaultValue="ruiner, cyber future, hello darkness, drawn, her head break, red and black color scheme, blade runner, Benedykt Szneider, modular synth, red on black"
        />
        <Link href={`/shirt/${newId}`} passHref>
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid,jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions  */}
          <a
            style={{ padding: 3, borderWidth: 2, borderRadius: 0, borderColor: "#000000", borderStyle: "solid" }}
            onClick={async () => {
              const textarea = document.getElementById("textareaJOOO") as HTMLTextAreaElement
              const content = textarea.value
              await fetch("/api/shirt", {
                body: JSON.stringify({ prompt: content, id: newId }),
                method: "POST",
                headers: { "Content-Type": "application/json" },
              })
            }}
          >
            GENERATE NOW!!!
          </a>
        </Link>
        <Gallery />
      </main>
    </div>
  )
}
