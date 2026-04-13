# Quick Start Guide - MycoFlow API & Role-Based Routing

## 🎯 Apa Yang Sudah Saya Implementasikan

### 1. API Service Layer ✅
```
✓ src/services/api.js           (Base API client)
✓ src/services/authService.js   (Authentication)
✓ src/services/dataService.js   (All CRUD operations)
```

### 2. Role-Based Access Control ✅
```
✓ src/middleware/guards.js      (Route guards)
✓ Role validation               (admin, petugas)
✓ Token management              (localStorage)
```

### 3. Folder Structure (Public/Petugas/Admin) ✅
```
✓ src/pages/public/             (Landing, Edukasi, Data)
✓ src/pages/petugas/            (Petugas Dashboard)
✓ src/pages/admin/              (Admin area - kosong siap dikembangkan)
✓ src/pages/auth/               (Login Page)
✓ src/layout/                   (3 layout: Public, Petugas, Admin)
```

### 4. Router Configuration ✅
```
✓ src/router/index.js           (Updated dengan role-based routing)
✓ Automatic redirects           (Login → Dashboard sesuai role)
✓ Protected routes              (Guards on all private routes)
```

---

## 📝 Setup Instructions (3 Langkah Mudah)

### Langkah 1: Buat .env File di Frontend

**File:** `frontend/.env`

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

> Atau copy dari `.env.example` dan sesuaikan URL backend Anda

### Langkah 2: Pastikan Backend Running

**Backend harus accessible di:** `http://localhost:5000/api`

**Minimal endpoints yang harus ada:**
```
POST   /api/auth/login
GET    /api/auth/verify
```

### Langkah 3: Jalankan Frontend

```bash
cd frontend
npm install              # Jika belum
npm run dev
```

---

## 🔐 Login Flow (Gimana Cara Kerja)

```
1. User ke /login
   ↓
2. Input email & password
   ↓
3. authService.login() hit backend
   ↓
4. Backend return: { token, user: {id, email, role} }
   ↓
5. Frontend simpan token ke localStorage
   ↓
6. Router check role → redirect ke:
   - /admin/dashboard (jika role: admin)
   - /petugas/dashboard (jika role: petugas)
   - / (jika role lain)
```

---

## 📋 Testing Accounts

**Gunakan di Login Page:**
- **Admin**: admin@mycoflow.local / admin123
- **Petugas**: petugas@mycoflow.local / petugas123

> ⚠️ HARUS disesuaikan dengan data di backend Anda!

---

## 💻 Contoh Penggunaan di Component

### Contoh 1: Fetch Data Dari Backend

```vue
<template>
  <div class="container">
    <h1>Data Lokasi</h1>
    <div v-if="loading" class="spinner">Loading...</div>
    <div v-else class="grid">
      <div v-for="lokasi in locations" :key="lokasi.id" class="card">
        <h3>{{ lokasi.nama_lokasi }}</h3>
        <p>Rak: {{ lokasi.jumlah_rak }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { lokasiService } from '@/services/dataService.js'

const locations = ref([])
const loading = ref(false)

// Fetch data saat component mount
onMounted(async () => {
  loading.value = true
  try {
    locations.value = await lokasiService.getAll()
  } catch (error) {
    alert('Gagal mengambil data: ' + error.message)
  } finally {
    loading.value = false
  }
})
</script>
```

### Contoh 2: Login Page (Sudah Ada)

**File:** `src/pages/auth/LoginStubPage.vue`

Sudah siap digunakan! Hanya perlu backend `/api/auth/login` endpoint.

### Contoh 3: Protected Page (Petugas)

```vue
<template>
  <div class="container">
    <h1>Petugas Dashboard</h1>
    <p>Welcome {{ currentUser?.email }}</p>
    
    <!-- Page content untuk petugas -->
  </div>
</template>

<script setup>
import { authService } from '@/services/authService.js'

// GetCurrent user
const currentUser = authService.getCurrentUser()
const currentRole = authService.getCurrentRole()  // 'petugas'
</script>
```

---

## 🚨 Troubleshooting

### Error: "Unauthorized" di Login
**Solusi:** 
- Cek backend `/api/auth/login` endpoint working
- Cek CORS setting di backend
- Network tab di DevTools lihat response

### Error: "Network Error"
**Solusi:**
- Pastikan backend running
- Cek URL di `.env` file correct
- Backend bisa diakses dari browser (test dengan Postman)

### Token Tidak Tersimpan
**Solusi:**
- Check localStorage di DevTools
- Backend harus return token & user data
- Check backend response format

### Route Protected Tidak Work
**Solusi:**
- Pastikan browser menyimpan token
- Check role di localStorage item 'user'
- Role harus exact match: 'admin' atau 'petugas'

---

## 📌 Important Notes

1. **Token Expiry (Future Enhancement)**
   - Sekarang token tidak expire otomatis
   - Backend implement token refresh logic
   - Frontend panggil `/api/auth/verify` secara berkala

2. **CORS Issues**
   - Backend harus allow origin frontend
   - Example: `http://localhost:5173` (Vite dev server)

3. **API Base URL**
   - Development: `http://localhost:5000/api`
   - Production: Update ke production API URL

4. **SecurityNote**
   - NEVER store password di localStorage
   - Token sudah auto-handled di Authorization header
   - Sensitive data jangan log di console

---

## 🎓 Learning Path (Selanjutnya Dikerjakan)

**Level 1 - Setup (✅ Done)**
- ✅ API service layer
- ✅ Role-based routing
- ✅ Login page

**Level 2 - Create Pages (TODO)**
- [ ] Admin Dashboard
- [ ] Admin Users Management
- [ ] Petugas Monitoring Page
- [ ] Petugas Report Page

**Level 3 - Advanced (TODO)**
- [ ] Form validation
- [ ] Error handling improvements
- [ ] Loading states
- [ ] Pagination
- [ ] Search/Filter

**Level 4 - Deployment (TODO)**
- [ ] Environment config
- [ ] Build optimization
- [ ] CI/CD pipeline

---

## ❓ Questions?

Refer ke dokumentasi lengkap di: `IMPLEMENTASI_API_DAN_ROUTING.md`

Atau check backend documentation untuk API endpoints detail.

Happy Coding! 🚀
