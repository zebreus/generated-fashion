import { useLocalStorage } from "hooks/localstate/localstorage/useLocalStorage"
import { SetStateAction, useCallback } from "react"

export type CartItem = { id: string; quantity: number }
type Cart = Array<CartItem>

export const useCart = () => {
  const [cartString, setCartString] = useLocalStorage("cart", "[]")
  const cart = JSON.parse(cartString ?? "[]") as Cart
  const setCart = useCallback(
    (cart: SetStateAction<Cart>) => {
      setCartString(
        typeof cart === "function"
          ? oldCart => JSON.stringify(cart(JSON.parse(oldCart ?? "[]") as Cart))
          : JSON.stringify(cart)
      )
    },
    [setCartString]
  )
  return { cart, setCart }
}
