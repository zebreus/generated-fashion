import { generateId } from "functions/generateId"

test("Ids are different every time", () => {
  const a = generateId()
  const b = generateId()
  expect(a).not.toEqual(b)
})

test("Ids have correct length", () => {
  const id = generateId(34)
  expect(id.length).toBe(34)
})

test("Ids are equally distributed", () => {
  const ids = new Array(1000).fill(0).map(() => generateId())
  const distribution = ids.reduce((acc, id) => {
    id.split("").forEach(char => {
      acc[char] = (acc[char] ?? 0) + 1
    })
    return acc
  }, {} as Record<string, number>)

  const rarestCharacter = Object.entries(distribution).reduce(
    (acc, [char, count]) => {
      if (count < acc.count) {
        return { char, count }
      }
      return acc
    },
    { char: "", count: 9999999 }
  )
  expect(rarestCharacter.count).not.toBe(9999999)

  const mostCommonCharacter = Object.entries(distribution).reduce(
    (acc, [char, count]) => {
      if (count > acc.count) {
        return { char, count }
      }
      return acc
    },
    { char: "", count: 0 }
  )
  expect(mostCommonCharacter.count).not.toBe(0)

  expect(rarestCharacter.count * 1.5).toBeGreaterThan(mostCommonCharacter.count)
})
