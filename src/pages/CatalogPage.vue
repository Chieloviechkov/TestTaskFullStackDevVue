<template>
  <div class="page-catalog q-pa-md">
    <!-- Шапка каталога: логотип, поиск, кнопка корзины -->
    <div class="catalog-header row items-center justify-between q-mb-md">
      <!-- Логотип -->
      <div class="catalog-header__logo text-h5">
        <img src="/src/assets/images.jpg" alt="Logo" style="height: 40px;" />
        MyShop
      </div>

      <!-- Поиск -->
      <q-input
        filled
        placeholder="Поиск товаров..."
        v-model="searchTerm"
        class="catalog-header__search"
        round
        dense
        clearable
        @keyup.enter="onSearch"
      >
        <template v-slot:append>
          <q-icon name="search" @click="onSearch" />
        </template>
      </q-input>

      <!-- Кнопка "Корзина" -->
      <q-btn
        outline
        color="primary"
        label="Корзина"
        :badge="cartCount > 0 ? cartCount : null"
        class="catalog-header__cart-btn"
        @click="showCart = true"
      >
        <template v-slot:icon>
          <q-icon name="shopping_cart" />
        </template>
      </q-btn>
    </div>

    <!-- Сетка товаров -->
    <div class="catalog-content row wrap justify-start">
      <q-card
        v-for="product in filteredProducts"
        :key="product.id"
        class="catalog-card col-xs-12 col-sm-6 col-md-4 col-lg-3 q-mb-md"
      >
        <!-- Изображение товара -->
        <q-img
          :src="product.imageUrl"
          ratio="1"
          class="catalog-card__image"
        />

        <q-card-section>
          <div class="text-h6">{{ product.name }}</div>
          <div class="text-subtitle1 text-bold text-primary q-my-xs">
            {{ product.price }} грн
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            label="Добавить в корзину"
            color="primary"
            @click="addToCart(product)"
          />
        </q-card-actions>
      </q-card>
    </div>

    <!-- Диалоговое окно (попап) с корзиной -->
    <q-dialog v-model="showCart">
      <q-card style="min-width: 400px;">
        <q-card-section>
          <div class="text-h6">Ваша корзина</div>
        </q-card-section>
        <q-separator inset />

        <q-card-section>
          <!-- Если корзина пуста -->
          <div v-if="cartItems.length === 0">
            Ваша корзина пуста
          </div>

          <!-- Если в корзине есть товары -->
          <div v-else>
            <div
              v-for="item in cartItems"
              :key="item.id"
              class="cart-item row items-center justify-between q-my-sm"
            >
              <div>
                <div class="text-subtitle2">{{ item.name }}</div>
                <div class="text-caption text-grey">
                  {{ item.price }} грн × {{ item.quantity }} шт
                </div>
              </div>
              <div class="row items-center q-gutter-sm">
                <q-btn
                  dense
                  flat
                  round
                  icon="remove"
                  @click="updateQuantity(item.id, 'dec')"
                />
                <q-btn
                  dense
                  flat
                  round
                  icon="add"
                  @click="updateQuantity(item.id, 'inc')"
                />
                <q-btn
                  color="negative"
                  flat
                  round
                  icon="delete"
                  @click="removeItem(item.id)"
                />
              </div>
            </div>
          </div>
        </q-card-section>

        <q-separator inset />

        <!-- Итоговая сумма -->
        <q-card-section>
          <div class="row items-center justify-between">
            <div class="text-subtitle1">Итого</div>
            <div class="text-h6 text-bold">{{ cartTotal }} грн</div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Закрыть" color="primary" v-close-popup />
          <q-btn color="accent" label="Оформить заказ" :disable="cartItems.length === 0" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import { useCartStore } from '@/stores/cart'
import productImage from '@/assets/images.jpg'

export default defineComponent({
  name: 'CatalogPage',
  setup() {
    const cartStore = useCartStore()

    // Локальное состояние
    const showCart = ref(false)
    const searchTerm = ref('')

    // Пример списка товаров
    const products = ref([
      {
        id: 1,
        name: 'Товар 1',
        price: 100,
        imageUrl: productImage
      },
      {
        id: 2,
        name: 'Товар 2',
        price: 200,
        imageUrl: productImage
      },
      {
        id: 3,
        name: 'Товар 3',
        price: 300,
        imageUrl: productImage
      },
      {
        id: 4,
        name: 'Товар 4',
        price: 400,
        imageUrl: productImage
      },
      {
        id: 5,
        name: 'Товар 5',
        price: 400,
        imageUrl: productImage
      },
      {
        id: 6,
        name: 'Товар 6',
        price: 400,
        imageUrl: productImage
      }
    ])

    const addToCart = (product: { id: number; name: string; price: number }) => {
      cartStore.addItem(product)
    }

    const updateQuantity = (id: number, action: 'inc' | 'dec') => {
      if (action === 'inc') {
        cartStore.increaseQuantity(id)
      } else if (action === 'dec') {
        cartStore.decreaseQuantity(id)
      }
    }

    const removeItem = (id: number) => {
      cartStore.removeItem(id)
    }

    const onSearch = () => {
      console.log('Поиск:', searchTerm.value)
    }

    const cartItems = computed(() => cartStore.items)
    const cartCount = computed(() => {
      return cartStore.items.reduce((sum, item) => sum + item.quantity, 0)
    })
    const cartTotal = computed(() => {
      return cartStore.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      )
    })

    const filteredProducts = computed(() => {
      if (!searchTerm.value) {
        return products.value
      }
      const term = searchTerm.value.toLowerCase()
      return products.value.filter((p) =>
        p.name.toLowerCase().includes(term)
      )
    })

    return {
      products,
      filteredProducts,
      searchTerm,
      showCart,
      addToCart,
      cartItems,
      cartCount,
      cartTotal,
      updateQuantity,
      removeItem,
      onSearch
    }
  }
})
</script>

<style scoped lang="scss">
.page-catalog {
  padding: 1rem;

  .catalog-header {
    &__logo {
      display: flex;
      align-items: center;
      img {
        margin-right: 8px;
      }
    }

    &__search {
      width: 300px;
      max-width: 50vw;
    }

    &__cart-btn {
      margin-left: 16px;
    }
  }

  .catalog-content {
    margin-left: 5rem;
    margin-top: 20px;
  }

  /* Карточка товара */
  .catalog-card {
    max-width: 250px;
    margin-right: 16px; /* При желании можно управлять отступами через q-gutter */

    &__image {
      object-fit: cover;
    }
  }

  /* Элемент в корзине */
  .cart-item {
    border-bottom: 1px solid #e0e0e0;
    padding-bottom: 8px;
  }
}
</style>
