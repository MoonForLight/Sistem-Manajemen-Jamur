# Implementasi API & Role-Based Routing - MycoFlow

## 📋 Ringkasan Solusi yang Telah Diimplementasi

### 1. ✅ API Service Architecture (Best Practice)

**Struktur File:**
```
src/services/
├── api.js                (Base API Client - centralized)
├── authService.js        (Authentication logic)
└── dataService.js        (All data operations)
```

**Keuntungan:**
- ✅ Centralized API management
- ✅ Error handling terpadu
- ✅ Token management otomatis
- ✅ Easy to test & maintain
- ✅ Reusable di semua component

**Cara Menggunakan di Component:**
```javascript
<script setup>
import { ref, onMounted } from 'vue'
import { lokasiService } from '@/services/dataService.js'
import { authService } from '@/services/authService.js'

const locations = ref([])

// Get data dari backend
onMounted(async () => {
  try {
    locations.value = await lokasiService.getAll()
  } catch (error) {
    console.error('Error:', error)
  }
})

// Login
const handleLogin = async (email, password) => {
  try {
    const result = await authService.login(email, password)
    // Token otomatis disimpan di localStorage
  } catch (error) {
    console.error('Login gagal:', error)
  }
}
</script>
```

---

### 2. ✅ Folder Structure (Public, Petugas, Admin)

**Struktur Baru:**
```
src/pages/
├── public/                          (Accessible untuk semua)
│   ├── LandingPage.vue
│   ├── EdukasiPage.vue
│   ├── DataPublikPage.vue
│   └── DataLokasiDetailPage.vue
├── petugas/                         (Login required, role: petugas)
│   └── PetugasDashboard.vue
├── admin/                           (Login required, role: admin)
│   ├── AdminDashboard.vue
│   ├── ManajemenUser.vue
│   └── ManajemenLokasi.vue
└── auth/
    └── LoginStubPage.vue

src/layout/
├── PublicLayout.vue                (Header + Footer)
├── PetugasLayout.vue               (Navbar Petugas + Logout)
└── AdminLayout.vue                 (Navbar Admin + Logout)
```

---

### 3. ✅ Role-Based Routing (Guards)

**File:** `src/middleware/guards.js`

**Yang Sudah Ada:**
- `requireAuth` - Cek apakah user sudah login
- `requireRole(role)` - Cek apakah user punya role tertentu
- `requireRoles(roles)` - Cek apakah user punya salah satu dari multiple roles
- `requireGuest` - Cek apakah user belum login (untuk login page)

**Cara Kerja:**
```javascript
// Route config dengan guards
{
  path: '/petugas',
  component: PetugasLayout,
  beforeEnter: requireRole('petugas'),  // ← Guard di sini
  children: [...]
}
```

---

### 4. ✅ Router Configuration

**File:** `src/router/index.js`

**Struktur Route:**
```
/ (Public Layout)
├── / (Landing Page)
├── /edukasi (Education Page)
├── /data (Public Data)
└── /data/:id (Detail Data)

/login (Auth - Guest Only)

/petugas (Petugas Layout - requireRole('petugas'))
├── /petugas/dashboard
└── ...

/admin (Admin Layout - requireRole('admin'))
├── /admin/dashboard
└── ...

/unauthorized (403 Error)
/:path (404 Error)
```

---

## 🚀 Cara Implementasi Step by Step

### Step 1: Update `.env` File

**Frontend `.env`:**
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Atau langsung set di `api.js` jika tidak pake `.env`

### Step 2: Setup Backend API

**Pastikan Backend running di port 5000 dengan endpoints:**
```
POST   /api/auth/login              (Email + Password)
POST   /api/auth/register           (Register user)
GET    /api/auth/verify             (Verify token)
GET    /api/lokasi                  (Get all locations)
GET    /api/lokasi/:id              (Get location by ID)
POST   /api/lokasi                  (Create location - Petugas)
... dan lainnya sesuai controller backend
```

### Step 3: Gunakan Service di Component

**Contoh di Component:**

```vue
<template>
  <div class="container">
    <h1>Data Lokasi</h1>
    <button @click="fetchData" class="btn primary">Refresh</button>
    
    <div v-if="loading">Loading...</div>
    <div v-else>
      <div v-for="item in locations" :key="item.id">
        {{ item.nama_lokasi }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { lokasiService } from '@/services/dataService.js'

const locations = ref([])
const loading = ref(false)

const fetchData = async () => {
  loading.value = true
  try {
    locations.value = await lokasiService.getAll()
  } catch (error) {
    console.error('Error:', error)
  } finally {
    loading.value = false
  }
}

onMounted(fetchData)
</script>
```

### Step 4: Implement Login Page

**Sudah dibuat di:** `src/pages/auth/LoginStubPage.vue`

**Demo Accounts (ganti sesuai backend Anda):**
- Admin: admin@mycoflow.local / admin123
- Petugas: petugas@mycoflow.local / petugas123

---

## 🔑 Key Points

### Bagaimana Token Tersimpan?
```javascript
// Otomatis disimpan di localStorage oleh authService
localStorage.getItem('authToken')      // Token JWT
localStorage.getItem('user')           // User data (JSON)
```

### Bagaimana Token Dikirim ke Backend?
```javascript
// Otomatis ditambahkan di setiap request
headers['Authorization'] = `Bearer ${token}`
```

### Bagaimana Logout?
```javascript
import { authService } from '@/services/authService.js'

// Panggil ini untuk logout
authService.logout()  // Clear localStorage + redirect ke login
```

### Bagaimana Redirect ke Dashboard Yang Tepat?
```javascript
// Di LoginStubPage.vue sudah implemented
const role = result.user.role
if (role === 'admin') router.push('/admin/dashboard')
if (role === 'petugas') router.push('/petugas/dashboard')
```

---

## 📝 Testing Checklist

- [ ] Backend running dan API endpoints accessible
- [ ] Frontend bisa hit API (test di browser console)
- [ ] Login page berfungsi
- [ ] Token tersimpan di localStorage setelah login
- [ ] Redirect ke dashboard sesuai role
- [ ] Protected routes tidak bisa diakses tanpa login
- [ ] Logout bekerja dan clear token

---

## 🛠️ Next Steps (Apa Yang Harus Dikerjakan)

1. **Update Backend `/api/auth/login` endpoint** agar return:
   ```json
   {
     "token": "jwt_token_here",
     "user": {
       "id": 1,
       "email": "admin@mycoflow.local",
       "role": "admin"  // Penting: 'admin' atau 'petugas'
     }
   }
   ```

2. **Setup Environment Variable** di frontend `.env` atau `vite.config.js`

3. **Create Admin/Petugas Dashboard Pages** di:
   - `src/pages/admin/AdminDashboard.vue`
   - `src/pages/petugas/PetugasDashboard.vue`

4. **Test setiap halaman** dari public → login → dashboard

---

## 💡 Tips & Best Practices

✅ **DO:**
- Gunakan service untuk semua API calls
- Keep token di localStorage (sudah auto handled)
- Use guards di router untuk protected routes
- Handle loading state di setiap API call
- Show error message ke user yang friendly

❌ **DON'T:**
- Jangan langsung fetch di component (gunakan service)
- Jangan store password di localStorage
- Jangan hard-code API URL (gunakan .env)
- Jangan forget to check role sebelum render sensitive data

