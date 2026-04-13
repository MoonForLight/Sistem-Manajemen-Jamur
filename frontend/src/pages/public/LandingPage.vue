<template>
  <div class="container">
    <section class="hero">
      <div class="hero-media" aria-hidden="true" />
      <div class="hero-content">
        <h1 class="hero-title">Presisi dalam Tiap Tumbuh,<br/>Optimal dalam Tiap Panen</h1>
        <p class="hero-sub">
          MycoFlow membantu pencatatan budidaya jamur dari inkubasi sampai panen.
          Fokus pada monitoring pertumbuhan, riwayat aktivitas, dan laporan produksi.
        </p>
        <RouterLink class="btn primary pill" to="/data">Lihat Data</RouterLink>
      </div>
    </section>

    <section class="featured-section">
      <h2 class="featured-title">Kenali Budidaya Jamur Lebih Dekat</h2>
      
      <div class="feature-card-grid">
        <div class="f-card">
          <div class="f-icon">
            <svg viewBox="0 0 24 24" fill="var(--green-dark)" width="48" height="48"><path d="M12,2C6.5,2,2,6.5,2,12 c0,3.3,1.6,6.3,4,8.1V22h12v-1.9c2.4-1.8,4-4.8,4-8.1C22,6.5,17.5,2,12,2z M12,4c4.4,0,8,3.6,8,8h-3c0-2.8-2.2-5-5-5S7,9.2,7,12H4 C4,7.6,7.6,4,12,4z M10,14h4v6h-4V14z"/></svg>
          </div>
          <h4>Apa itu Jamur?</h4>
          <p>Organisme eukariotik yang tumbuh melalui spora. Jamur memegang peran penting dalam dekomposisi alam dan sumber nutrisi tinggi.</p>
        </div>
        
        <div class="f-card">
          <div class="f-icon">
             <svg viewBox="0 0 24 24" fill="var(--green-dark)" width="48" height="48"><path d="M12,3L4,9v12h16V9L12,3z M12,5.2l6,4.5v10.8H6V9.7L12,5.2z M11,11h2v4h-2V11z M11,16h2v2h-2V16z"/></svg>
          </div>
          <h4>Proses Budidaya</h4>
          <p>Mulai dari persiapan media tanam, inokulasi bibit, hingga fase monitoring lingkungan yang ketat untuk merangsang pertumbuhan pinhead.</p>
        </div>

        <div class="f-card">
          <div class="f-icon">
             <svg viewBox="0 0 24 24" fill="var(--green-dark)" width="48" height="48"><path d="M12,21.4L10.6,20C5.4,15.4,2,12.3,2,8.5C2,5.4,4.4,3,7.5,3c1.7,0,3.4,0.8,4.5,2.1C13.1,3.8,14.8,3,16.5,3 C19.6,3,22,5.4,22,8.5c0,3.8-3.4,6.9-8.6,11.5L12,21.4z"/></svg>
          </div>
          <h4>Manfaat</h4>
          <p>Selain menjadi komoditas ekonomi yang menjanjikan, jamur memiliki khasiat medis dan kandungan protein nabati yang sangat baik.</p>
        </div>

        <div class="f-card">
          <div class="f-icon">
             <svg viewBox="0 0 24 24" fill="var(--green-dark)" width="48" height="48"><path d="M19,3H5C3.9,3,3,3.9,3,5v14c0,1.1,0.9,2,2,2h14c1.1,0,2-0.9,2-2V5C21,3.9,20.1,3,19,3z M19,19H5V5h14V19z M17,17H7v-2h10V17z M17,13H7v-2h10V13z M17,9H7V7h10V9z"/></svg>
          </div>
          <h4>MycoFlow?</h4>
          <p>Sistem monitoring cerdas yang mengintegrasikan data lingkungan dengan teknologi IoT untuk memaksimalkan produktivitas budidaya jamur.</p>
        </div>
      </div>
    </section>

    <!-- iot hero section -->
    <section class="iot-hero">
      <div class="iot-overlay">
        <h2>Pantau Perkembangan Jamur Secara Real-Time Dengan Perangkat IoT</h2>
      </div>
    </section>

    <!-- Transparansi Data -->
    <section class="data-transparency">
      <div class="dt-text">
        <h2 class="dt-title">Transparansi Data<br/>Untuk Kemajuan Bersama</h2>
        <p class="dt-desc">
          Kami percaya bahwa data adalah kunci kemajuan. Selain membantu petugas di lapangan, MycoFlow juga menyajikan statistik publik yang dapat diakses sebagai bahan edukasi dan penelitian. Mari bersama-sama menciptakan standar baru dalam budidaya jamur yang berbasis data dan berkelanjutan.
        </p>
        <RouterLink class="btn primary dt-btn" to="/data">Lihat Detail Data</RouterLink>
      </div>
      <div class="dt-image"></div>
    </section>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.featured-section {
  margin-top: 60px;
  margin-bottom: 60px;
}

.featured-title {
  text-align: center;
  color: #5eb562;
  font-size: 28px;
  font-weight: 800;
  margin-bottom: 40px;
  text-shadow: 0 4px 6px rgba(94, 181, 98, 0.2);
}

.feature-card-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}

@media(min-width: 640px) {
  .feature-card-grid { grid-template-columns: repeat(2, 1fr); }
  .featured-title { font-size: 32px; }
}

@media(min-width: 1024px) {
  .feature-card-grid { grid-template-columns: repeat(4, 1fr); }
  .featured-title { font-size: 42px; }
}

.f-card {
  background: white;
  border-radius: 20px;
  padding: 30px 20px;
  text-align: center;
  box-shadow: 0 10px 40px rgba(0,0,0,0.08);
  transition: transform 0.3s ease;
  height: 100%;
}

.f-card:hover {
  transform: translateY(-5px);
}

.f-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.f-icon svg {
  filter: drop-shadow(0 4px 4px rgba(22, 163, 74, 0.2));
  fill: #5eb562;
}

.f-card h4 {
  color: #5eb562;
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 12px;
}

.f-card p {
  color: var(--muted);
  font-size: 13px;
  line-height: 1.6;
}

.iot-hero {
  margin-top: 40px;
  width: 100%;
  height: 400px;
  border-radius: 24px;
  background: url('/assets/hero_mushroom_lab.png') center/cover no-repeat;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 30px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
}

@media(min-width: 768px) {
  .iot-hero { height: 500px; }
}

.iot-overlay {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  padding: 24px 30px;
  border-radius: 30px;
  text-align: center;
  max-width: 800px;
  width: 100%;
  border: 1px solid rgba(255,255,255,0.4);
}

.iot-overlay h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  color: #333;
}

@media(min-width: 640px) {
  .iot-overlay h2 { font-size: 24px; }
}

@media(min-width: 1024px) {
  .iot-overlay h2 { font-size: 32px; }
}

.data-transparency {
  margin-top: 80px;
  margin-bottom: 60px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;
  align-items: center;
}

@media(min-width: 1024px) {
  .data-transparency {
    grid-template-columns: 1fr 1fr;
    gap: 60px;
  }
}

.dt-title {
  color: #5eb562;
  font-size: 28px;
  font-weight: 800;
  line-height: 1.3;
  margin-bottom: 20px;
}

@media(min-width: 1024px) {
  .dt-title { font-size: 36px; }
}

.dt-desc {
  color: var(--text);
  font-weight: 500;
  font-size: 15px;
  line-height: 1.8;
  margin-bottom: 30px;
  max-width: 500px;
}

.dt-btn {
  padding: 14px 28px;
  font-size: 15px;
  border-radius: 999px;
  background: #5eb562;
  border-color: #5eb562;
  box-shadow: 0 4px 10px rgba(94, 181, 98, 0.4);
}

.dt-btn:hover {
  background: var(--green-dark);
}

.dt-image {
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 30px;
  background: url('/assets/hand_holding_mushrooms.png') center/cover no-repeat;
  box-shadow: 0 20px 40px rgba(0,0,0,0.15);
}
</style>
