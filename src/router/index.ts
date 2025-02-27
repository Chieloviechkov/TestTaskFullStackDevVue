import { createRouter, createWebHistory } from 'vue-router';
import MosaicSwitcher from '../components/MosaicSwitcher.vue';
import LandingPage from '../pages/LandingPage.vue';
import CatalogPage from '../pages/CatalogPage.vue';

const routes = [
  { path: '/mosaic', component: MosaicSwitcher },
  { path: '/landing', component: LandingPage },
  { path: '/catalog', component: CatalogPage },
  { path: '/', redirect: '/mosaic' }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
