import { createRouter, createWebHistory } from 'vue-router'

import LandingPage from '../pages/LandingPage.vue'
import EdukasiPage from '../pages/EdukasiPage.vue'
import DataPublikPage from '../pages/DataPublikPage.vue'
import DataLokasiDetailPage from '../pages/DataLokasiDetailPage.vue'
import LoginStubPage from '../pages/LoginStubPage.vue'
import PetugasDashboard from '../pages/PetugasDashboard.vue'

const routes = [
  { path: '/', name: 'landing', component: LandingPage },
  { path: '/edukasi', name: 'edukasi', component: EdukasiPage },
  { path: '/data', name: 'data', component: DataPublikPage },
  { path: '/data/:lokasiId', name: 'data-detail', component: DataLokasiDetailPage, props: true },
  { path: '/login', name: 'login', component: LoginStubPage },
  { path: '/petugas/dashboard', name: 'petugas-dashboard', component: PetugasDashboard }
]

export default createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0 }
  }
})
