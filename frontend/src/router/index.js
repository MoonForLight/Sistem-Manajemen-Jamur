import { createRouter, createWebHistory } from 'vue-router'
import { requireAuth, requireRole, requireGuest } from '../middleware/guards.js'

// Public Pages
import LandingPage from '../pages/public/LandingPage.vue'
import EdukasiPage from '../pages/public/EdukasiPage.vue'
import DataPublikPage from '../pages/public/DataPublikPage.vue'
import DataLokasiDetailPage from '../pages/public/DataLokasiDetailPage.vue'

// Public Layout
import PublicLayout from '../layout/PublicLayout.vue'

// Petugas Pages & Layout
import PetugasLayout from '../layout/PetugasLayout.vue'
import PetugasDashboard from '../pages/petugas/PetugasDashboard.vue'

// Admin Pages & Layout
import AdminLayout from '../layout/AdminLayout.vue'
import AdminDashboard from '../pages/admin/AdminDashboard.vue'

// 404 & Unauthorized
const NotFound = { template: '<div class="container" style="padding:40px; text-align:center"><h1>404 - Page Not Found</h1></div>' }
const Unauthorized = { template: '<div class="container" style="padding:40px; text-align:center"><h1>403 - Unauthorized Access</h1></div>' }

const routes = [
  // ============ PUBLIC PAGES ============
  {
    path: '/',
    component: PublicLayout,
    children: [
      { path: '', name: 'landing', component: LandingPage },
      { path: 'edukasi', name: 'edukasi', component: EdukasiPage },
      { path: 'data', name: 'data-publik', component: DataPublikPage },
      { path: 'data/:lokasiId', name: 'data-detail', component: DataLokasiDetailPage, props: true },
    ]
  },

  // ============ PETUGAS PAGES (Role: petugas) ============
  {
    path: '/petugas',
    component: PetugasLayout,
    beforeEnter: requireRole('petugas'),
    meta: { requiresAuth: true, role: 'petugas' },
    children: [
      {
        path: 'dashboard',
        name: 'petugas-dashboard',
        component: PetugasDashboard,
        meta: { title: 'Dashboard Petugas' }
      },
      // Add more petugas pages here
      // { path: 'monitoring', name: 'petugas-monitoring', component: PetugasMonitoring },
      // { path: 'lokasi', name: 'petugas-lokasi', component: PetugasDataLokasi },
    ]
  },

  // ============ ADMIN PAGES (Role: admin) ============
  {
    path: '/admin',
    component: AdminLayout,
    beforeEnter: requireRole('admin'),
    meta: { requiresAuth: true, role: 'admin' },
    children: [
      { path: 'dashboard', name: 'admin-dashboard', component: AdminDashboard },
      // { path: 'users', name: 'admin-users', component: AdminUsers },
      // { path: 'locations', name: 'admin-locations', component: AdminLocations },
    ]
  },

  // ============ ERROR PAGES ============
  { path: '/unauthorized', component: Unauthorized },
  { path: '/:pathMatch(.*)*', component: NotFound }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0 }
  }
})

export default router
