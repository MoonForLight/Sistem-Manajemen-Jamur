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
import PetugasJamur from '../pages/petugas/PetugasJamur.vue'
import PetugasLaporan from '../pages/petugas/PetugasLaporan.vue'
import PetugasRiwayat from '../pages/petugas/PetugasRiwayat.vue'
import PetugasProfile from '../pages/petugas/PetugasProfile.vue'

// Admin Pages & Layout
import AdminLayout from '../layout/AdminLayout.vue'
import AdminDashboard from '../pages/admin/AdminDashboard.vue'
import AdminLokasi from '../pages/admin/AdminLokasi.vue'
import AdminPetugas from '../pages/admin/AdminPetugas.vue'
import AdminJamur from '../pages/admin/AdminJamur.vue'
import AdminMedia from '../pages/admin/AdminMedia.vue'
import AdminBudidaya from '../pages/admin/AdminBudidaya.vue'

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
        path: '',
        redirect: { name: 'petugas-dashboard' }
      },
      {
        path: 'dashboard',
        name: 'petugas-dashboard',
        component: PetugasDashboard,
        meta: { title: 'Dashboard Petugas' }
      },
      {
        path: 'jamur',
        name: 'petugas-jamur',
        component: PetugasJamur,
        meta: { title: 'Jenis Jamur' }
      },
      {
        path: 'laporan',
        name: 'petugas-laporan',
        component: PetugasLaporan,
        meta: { title: 'Laporan Monitoring' }
      },
      {
        path: 'riwayat',
        name: 'petugas-riwayat',
        component: PetugasRiwayat,
        meta: { title: 'Riwayat Panen' }
      },
      {
        path: 'profile',
        name: 'petugas-profile',
        component: PetugasProfile,
        meta: { title: 'Profil Petugas' }
      },
    ]
  },

  // ============ ADMIN PAGES (Role: admin) ============
  {
    path: '/admin',
    component: AdminLayout,
    beforeEnter: requireRole('admin'),
    meta: { requiresAuth: true, role: 'admin' },
    children: [
      { path: '', redirect: { name: 'admin-dashboard' } },
      { path: 'dashboard', name: 'admin-dashboard', component: AdminDashboard },
      { path: 'lokasi', name: 'admin-lokasi', component: AdminLokasi },
      { path: 'budidaya', name: 'admin-budidaya', component: AdminBudidaya },
      { path: 'jamur', name: 'admin-jamur', component: AdminJamur },
      { path: 'media', name: 'admin-media', component: AdminMedia },
      { path: 'petugas', name: 'admin-petugas', component: AdminPetugas },
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
