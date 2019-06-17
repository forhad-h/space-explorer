import { GET_CART_ITEMS } from './pages/cart'

export default {
  Launch: {
    isInCart: (launch, _, { cache }) => {
      const { cartItems } = cache.readQuery({ query: GET_CART_ITEMS })
      return cartItems.includes(launch.id)
    }
  },
  Mutation: {
    addOrRemoveFromCart: (_, { id }, { cache }) => {
      const { cartItems } = cache.readQuery({ query: GET_CART_ITEMS }) // QUERY: more about readQuery

      const data = {
        cartItems: cartItems.includes(id)
          ? cartItems.filter(i => i !== id)
          : [...cartItems, id]
      }
      cache.writeQuery({ query: GET_CART_ITEMS, data }) // QUERY: more about writeQuery
      return data.cartItems
    }
  }
}
