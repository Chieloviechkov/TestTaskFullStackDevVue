import { defineStore } from 'pinia'

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[]
  }),
  actions: {
    addItem(product: { id: number; name: string; price: number }) {
      const item = this.items.find(i => i.id === product.id)
      if (item) {
        item.quantity++
      } else {
        this.items.push({ ...product, quantity: 1 })
      }
    },
    increaseQuantity(id: number) {
      const item = this.items.find(i => i.id === id)
      if (item) {
        item.quantity++
      }
    },
    decreaseQuantity(id: number) {
      const item = this.items.find(i => i.id === id)
      if (item && item.quantity > 1) {
        item.quantity--
      }
    },
    removeItem(id: number) {
      this.items = this.items.filter(i => i.id !== id)
    }
  },
  persist: true
})
