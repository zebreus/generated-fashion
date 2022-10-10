export const generateId = (length = 20) => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  const indexArray = new Array(length).fill(0).map(() => Math.floor(Math.random() * characters.length))
  const id = indexArray.map(index => characters[index]).join("")
  return id
}
