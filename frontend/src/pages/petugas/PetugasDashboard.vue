<template>
  <div class="dashboard-content">
    <!-- Top Stats -->
    <div class="stats-grid">
      <div class="stat-card">
        <span class="stat-label">Jumlah Rak</span>
        <span class="stat-value">3</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">Jenis Jamur</span>
        <span class="stat-value">4</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">Hari ini</span>
        <span class="stat-value">2 input</span>
      </div>
    </div>

    <!-- Dashboard Grid Layout -->
    <div class="dashboard-grid">
      <!-- Left Column (Charts) -->
      <div class="left-col">
        <div class="chart-panel">
          <h3 class="panel-title">Grafik Perkembangan</h3>
          <div class="chart-placeholder">
            <!-- Using a simple SVG to mock the line chart -->
            <svg viewBox="0 0 500 200" class="mock-chart">
              <path d="M0,150 L100,80 L200,130 L350,50 L420,90 L500,20" fill="none" stroke="#22c55e" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
              <line x1="0" y1="180" x2="500" y2="180" stroke="#f3f4f6" stroke-width="2"/>
            </svg>
          </div>
        </div>
        
        <div class="chart-panel">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <h3 class="panel-title">Hasil Panen</h3>
            <span class="dropdown-filter">Weekly ⌄</span>
          </div>
          <div class="chart-placeholder">
            <svg viewBox="0 0 500 200" class="mock-chart">
              <path d="M0,180 L100,180 L180,60 L200,180 L250,180 L350,140 L380,180 L450,160 L500,180" fill="#eff6ff" stroke="#3b82f6" stroke-width="3" stroke-linejoin="round"/>
              <line x1="0" y1="180" x2="500" y2="180" stroke="#e5e7eb" stroke-width="1"/>
              <line x1="0" y1="120" x2="500" y2="120" stroke="#f3f4f6" stroke-width="1"/>
              <line x1="0" y1="60" x2="500" y2="60" stroke="#f3f4f6" stroke-width="1"/>
            </svg>
          </div>
        </div>
      </div>

      <!-- Right Column (Notifications & Logs) -->
      <div class="right-col">
        <!-- Notifications -->
        <div class="side-panel">
          <h3 class="panel-title">Notifikasi</h3>
          <p class="panel-subtitle">Update & tugas hari ini</p>
          
          <div class="list-container">
            <div class="notif-item">
              <div class="badge badge-warning">WARNING</div>
              <div class="notif-text">
                <strong>Pengamatan terlambat</strong> <span class="time">08:10</span>
                <p>BDY-101 belum dicatat 3 hari.</p>
              </div>
            </div>
            
            <div class="notif-item">
              <div class="badge badge-info">INFO</div>
              <div class="notif-text">
                <strong>Jadwal pengamatan</strong> <span class="time">07:30</span>
                <p>Ada 2 budidaya perlu dicek.</p>
              </div>
            </div>
            
            <div class="notif-item">
              <div class="badge badge-success">SUCCESS</div>
              <div class="notif-text">
                <strong>Data tersimpan</strong> <span class="time">kemarin</span>
                <p>Pertumbuhan tersimpan BDY-102.</p>
              </div>
            </div>
          </div>
          <a href="#" class="link-all">Lihat semua →</a>
        </div>

        <!-- Activity Logs -->
        <div class="side-panel">
          <h3 class="panel-title">Riwayat Aktivitas</h3>
          <p class="panel-subtitle">Aktivitas terakhir petugas</p>
          
          <div class="list-container">
            <div class="activity-item">
              <span class="act-icon">✅</span>
              <div class="act-details">
                <span>Budidaya dibuat — <strong>BDY-101</strong></span>
                <span class="time">09:15</span>
              </div>
            </div>
            
            <div class="activity-item">
              <span class="act-icon">📝</span>
              <div class="act-details">
                <span>Pertumbuhan dicatat — <strong>PRT-011</strong></span>
                <span class="time">11:40</span>
              </div>
            </div>
            
            <div class="activity-item">
              <span class="act-icon">📦</span>
              <div class="act-details">
                <span>Panen dicatat — <strong>PN-005</strong></span>
                <span class="time">kemarin 07:20</span>
              </div>
            </div>
            
            <div class="activity-item">
              <span class="act-icon">✏️</span>
              <div class="act-details">
                <span>Budidaya diubah — <strong>BDY-087</strong></span>
                <span class="time">kemarin 16:35</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
/* Stats Row */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 24px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  border: 1px solid #f3f4f6;
}

.stat-label {
  display: block;
  font-size: 12px;
  color: #6b7280;
  font-weight: 600;
  margin-bottom: 8px;
}

.stat-value {
  display: block;
  font-size: 28px;
  font-weight: 800;
  color: #111827;
}

/* Dashboard Grid */
.dashboard-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
}

@media(max-width: 1024px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}

.left-col {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.right-col {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.chart-panel, .side-panel {
  background: white;
  border-radius: 12px;
  padding: 20px 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  border: 1px solid #f3f4f6;
}

.panel-title {
  margin: 0 0 4px 0;
  font-size: 15px;
  font-weight: 700;
  color: #111827;
}

.panel-subtitle {
  margin: 0 0 16px 0;
  font-size: 12px;
  color: #6b7280;
}

.dropdown-filter {
  font-size: 12px;
  color: #6b7280;
  border: 1px solid #e5e7eb;
  padding: 4px 10px;
  border-radius: 6px;
  cursor: pointer;
}

.chart-placeholder {
  width: 100%;
  height: 250px;
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed #e5e7eb;
  border-radius: 8px;
}

.mock-chart {
  width: 100%;
  height: 100%;
}

/* Notification List */
.list-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 12px;
}

.notif-item {
  display: flex;
  gap: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f3f4f6;
}

.notif-item:last-child { border-bottom: none; }

.badge {
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 12px;
  font-weight: 700;
  height: max-content;
}

.badge-warning { background: #fffbeb; color: #b45309; border: 1px solid #fef3c7; }
.badge-info { background: #eff6ff; color: #1d4ed8; border: 1px solid #dbeafe; }
.badge-success { background: #f0fdf4; color: #15803d; border: 1px solid #dcfce7; }

.notif-text {
  flex: 1;
  font-size: 12px;
}

.notif-text strong { color: #111827; }
.notif-text .time { float: right; color: #9ca3af; font-size: 11px; }
.notif-text p { margin: 4px 0 0 0; color: #6b7280; }

.link-all {
  display: inline-block;
  font-size: 12px;
  color: #3b82f6;
  text-decoration: none;
  font-weight: 600;
  margin-top: 10px;
}

/* Activities */
.activity-item {
  display: flex;
  gap: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f3f4f6;
  align-items: center;
}

.activity-item:last-child { border-bottom: none; }

.act-icon {
  font-size: 16px;
}

.act-details {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #4b5563;
}

.act-details .time { color: #9ca3af; font-size: 11px; }
</style>