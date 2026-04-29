<template>
  <div class="petugas-notifikasi">
    <div class="page-header-modern">
      <div class="header-text">
        <button class="back-btn" @click="$router.go(-1)" title="Kembali ke halaman sebelumnya">
          <svg viewBox="0 0 24 24" class="icon-back"><path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
        </button>
        <h1>Notifikasi</h1>
      </div>
    </div>

    <div class="card mt-16">
      <div class="widget-body">
        <div class="notif-item">
           <span class="badge badge-warning">WARNING</span>
           <div class="notif-text">
             <strong>Pengamatan terlambat</strong>
             <span>BDY-101 belum dicatat 3 hari.</span>
           </div>
           <span class="notif-time">08:10</span>
        </div>
        <div class="notif-item mt-16">
           <span class="badge badge-info">INFO</span>
           <div class="notif-text">
             <strong>Jadwal pengamatan</strong>
             <span>Ada 2 budidaya perlu dicek hari ini.</span>
           </div>
           <span class="notif-time">07:30</span>
        </div>
        <div class="notif-item mt-16">
           <span class="badge badge-success">SUCCESS</span>
           <div class="notif-text">
             <strong>Data tersimpan</strong>
             <span>Pertumbuhan tersimpan untuk BDY-102.</span>
           </div>
           <span class="notif-time">kemarin</span>
        </div>
        <div class="notif-item mt-16">
           <span class="badge badge-success">SUCCESS</span>
           <div class="notif-text">
             <strong>Panen berhasil dicatat</strong>
             <span>Panen sebesar 12kg pada BDY-098 telah dimasukkan.</span>
           </div>
           <span class="notif-time">2 hari lalu</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.petugas-notifikasi {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.page-header-modern {
  display: flex;
  align-items: center;
}

.header-text {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-text h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 800;
  color: #111827;
}

.back-btn {
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #4b5563;
  transition: all 0.2s ease;
}

.back-btn:hover {
  background: #f3f4f6;
  color: #111827;
}

.icon-back {
  width: 24px;
  height: 24px;
}

.card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  border: 1px solid #f3f4f6;
}

.mt-16 {
  margin-top: 16px;
}

.widget-body {
  display: flex;
  flex-direction: column;
}

.notif-item {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  padding-bottom: 16px;
  border-bottom: 1px solid #f3f4f6;
}

.notif-item:last-child {
  padding-bottom: 0;
  border-bottom: none;
}

.badge {
  font-size: 11px;
  font-weight: 800;
  padding: 4px 10px;
  border-radius: 999px;
  border: 1px solid;
}

.badge-warning {
  background: #fffbeb;
  color: #d97706;
  border-color: #fde68a;
}

.badge-info {
  background: #eff6ff;
  color: #2563eb;
  border-color: #bfdbfe;
}

.badge-success {
  background: #f0fdf4;
  color: #16a34a;
  border-color: #bbf7d0;
}

.notif-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.notif-text strong {
  font-size: 15px;
  color: #111827;
}

.notif-text span {
  font-size: 14px;
  color: #6b7280;
}

.notif-time {
  font-size: 13px;
  color: #9ca3af;
  white-space: nowrap;
}
</style>
