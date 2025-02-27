<template>
  <q-layout view="hHh lpR fFf" class="app-layout">
    <!-- Header / Шапка -->
    <q-header elevated class="app-header bg-primary text-white">
      <q-toolbar>
        <q-btn
          flat
          round
          icon="menu"
          @click="drawer = !drawer"
          class="app-menu-button"
        />
        <q-toolbar-title>Мой проект</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <!-- Боковая панель -->
    <q-drawer v-model="drawer" side="left" bordered class="app-drawer">
      <q-list>
        <q-item clickable tag="router-link" to="/mosaic" v-ripple>
          <q-item-section>Мозаика</q-item-section>
        </q-item>
        <q-item clickable tag="router-link" to="/landing" v-ripple>
          <q-item-section>Лендинг</q-item-section>
        </q-item>
        <q-item clickable tag="router-link" to="/catalog" v-ripple>
          <q-item-section>Каталог</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <!-- Основная область с роутами -->
    <q-page-container class="app-page-container">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'App',
  setup() {
    const drawer = ref(false);
    return { drawer };
  }
});
</script>

<style lang="scss" scoped>
/* Основная обёртка layout */
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.app-drawer {
  width: 250px;
  border-radius: 1rem !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
}

/* Контейнер для основной части */
.app-page-container {
  flex: 1;
  background-color: #f5f5f5; /* например, слегка серый фон */
}

/* Кнопка-«гамбургер» */
.app-menu-button {
  margin-left: 1rem;
  transition: background-color 0.3s ease, transform 0.3s ease;
  border-radius: 1rem;
  width: 3rem; /* Можно уменьшить, чтобы не было слишком широким */
}
</style>
