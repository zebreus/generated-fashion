export const generateId = (length = 10) => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"
  const indexArray = new Array(length).fill(0).map(() => Math.floor(Math.random() * characters.length))
  const id = indexArray.map(index => characters[index]).join("")
  return id
}
