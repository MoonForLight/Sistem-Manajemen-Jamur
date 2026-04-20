<template>
  <div class="container">
    <section class="hero">
      <!-- You can put a different background image, or just use the same as landing -->
      <div class="hero-media" aria-hidden="true" style="background-image: url('/assets/edukasi_landing.jpg');"></div>
      <div class="hero-content">
        <h1 class="hero-title">Ensiklopedia<br/>Budidaya Jamur</h1>
        <p class="hero-sub">
          Pelajari segala hal tentang budidaya jamur dari tahap persiapan hingga panen. Panduan lengkap dan terstruktur ini dirancang untuk mengubah pemula menjadi ahli dalam manajemen dan operasional budidaya jamur.
        </p>
      </div>
    </section>

    <div class="edu-layout">
      <!-- Sticky Sidebar Nav -->
      <aside class="edu-sidebar">
        <nav class="sticky-nav">
          <a href="#mengapa" class="nav-link">Kenapa Jamur?</a>
          <a href="#syarat-tumbuh" class="nav-link">Syarat Tumbuh</a>
          <a href="#jenis-jamur" class="nav-link">Macam Jenis</a>
          <a href="#tahapan" class="nav-link">Panduan Tahapan</a>
          <a href="#masalah" class="nav-link">Troubleshooting</a>
        </nav>
      </aside>

      <div class="edu-content">
        <!-- Section: Mengapa Jamur -->
        <section id="mengapa" class="featured-section first">
          <h2 class="featured-title">Mengapa Membudidayakan Jamur?</h2>
          <div class="feature-card-grid">
            <div class="f-card">
              <div class="f-icon">
                <!-- Icon Profit/Trending Up -->
                <svg viewBox="0 0 24 24"><path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/></svg>
              </div>
              <h4>Peluang Ekonomi</h4>
              <p>Harga jual yang stabil dan permintaan terus meningkat. Siklus panen cepat membuat perputaran modal optimal.</p>
            </div>
            <div class="f-card">
              <div class="f-icon">
                <!-- Icon Earth/Eco -->
                 <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
              </div>
              <h4>Ramah Lingkungan</h4>
              <p>Memanfaatkan limbah pertanian seperti serbuk gergaji dan jerami sebagai media tanam, membantu mengurangi limbah.</p>
            </div>
            <div class="f-card">
              <div class="f-icon">
                <!-- Icon Health/Heart -->
                <svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
              </div>
              <h4>Kaya Nutrisi</h4>
              <p>Sumber protein, serat, dan kaya anti-oksidan. Mudah dicerna dan aman bagi penderita kolesterol.</p>
            </div>
          </div>
        </section>

        <!-- Section: Syarat Tumbuh -->
        <section id="syarat-tumbuh" class="featured-section">
          <h2 class="featured-title">Syarat Tumbuh Optimal</h2>
          <div class="feature-card-grid">
            <div class="f-card">
              <div class="f-icon"><svg viewBox="0 0 24 24"><path d="M15 13V5c0-1.66-1.34-3-3-3S9 3.34 9 5v8c-1.21.91-2 2.37-2 4 0 2.76 2.24 5 5 5s5-2.24 5-5c0-1.63-.79-3.09-2-4zm-4-8c0-.55.45-1 1-1s1 .45 1 1v3h-2V5z"/></svg></div>
              <h4>Suhu (22°C - 28°C)</h4>
              <p>Suhu sangat dingin menghambat pertumbuhan, terlalu panas mematikan jaringan miselium secara perlahan.</p>
            </div>
            <div class="f-card">
              <div class="f-icon"><svg viewBox="0 0 24 24"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.36 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/></svg></div>
              <h4>Kelembapan (80% - 90%)</h4>
              <p>Dijaga dengan pengabutan ruang kumbung, bukan penyiraman ke arah jamur secara langsung.</p>
            </div>
            <div class="f-card">
              <div class="f-icon"><svg viewBox="0 0 24 24"><path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/></svg></div>
              <h4>Sirkulasi Udara</h4>
              <p>Oksigen mutlak perlu. Penumpukan CO2 membuat batang jamur tumbuh panjang dan tudungnya kerdil.</p>
            </div>
            <div class="f-card">
              <div class="f-icon"><svg viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg></div>
              <h4>Higienitas</h4>
              <p>Mencegah bakteri & kontaminasi liar. Sterilisasi sarana serta uap panas bertekanan untuk media tanam.</p>
            </div>
          </div>
        </section>

        <!-- Section: Jenis Jamur -->
        <section id="jenis-jamur" class="featured-section">
          <h2 class="featured-title">Jenis Jamur Komersial</h2>
          <div class="grid-2">
            <div class="info-card">
               <div class="info-header">
                 <h4>Jamur Tiram <span class="muted2 small" style="font-weight:400;margin-left:4px;">(Pleurotus ostreatus)</span></h4>
                 <span class="badge green">Pemula</span>
               </div>
               <p>Tubuh buah putih krem, bentuk menyerupai cangkang tiram. Rasa daging kenyal disukai masyarakat luas karena teksturnya yang mirip ayam.</p>
               <ul>
                 <li><strong>Masa Panen:</strong> 30-40 hari</li>
                 <li><strong>Media:</strong> Serbuk gergaji kayu</li>
               </ul>
            </div>
            <div class="info-card">
               <div class="info-header">
                 <h4>Jamur Merang <span class="muted2 small" style="font-weight:400;margin-left:4px;">(Volvariella volvacea)</span></h4>
                 <span class="badge orange">Menengah</span>
               </div>
               <p>Cocok di suhu iklim tropis (30-35°C). Sangat lezat dalam kondisi tunas sebelum mekar menyerupai telur.</p>
               <ul>
                 <li><strong>Masa Panen:</strong> 10-15 hari</li>
                 <li><strong>Media:</strong> Jerami padi, ampas aren</li>
               </ul>
            </div>
          </div>
        </section>

        <!-- Section: Panduan Tahapan -->
        <section id="tahapan" class="featured-section timeline-section">
          <h2 class="featured-title">Tahapan & Proses</h2>
          <div class="timeline">
            <div class="tl-item">
              <div class="tl-num">1</div>
              <div class="tl-content">
                <h4>Persiapan Media (Composting)</h4>
                <p>Pencampuran serbuk gergaji, unsur bekatul kering, dan kapur pertanian. Kadar air diatur kisaran 60% dengan disiram lalu diaduk merata.</p>
              </div>
            </div>
            <div class="tl-item">
              <div class="tl-num">2</div>
              <div class="tl-content">
                <h4>Pembungkusan & Sterilisasi</h4>
                <p>Media dimasukkan ke dalam plastik polipropilen transparan (Baglog) dan dipadatkan. Lalu dipanaskan dalam steamer suhu ~100°C selama 8-12 jam guna membunuh bakteri.</p>
              </div>
            </div>
            <div class="tl-item">
              <div class="tl-num">3</div>
              <div class="tl-content">
                <h4>Inokulasi</h4>
                <p>Baglog ditaburi bibit jamur di ruangan steril agar tidak terkontaminasi debu. Mulut baglog ditutup kembali menggunakan cincin selang.</p>
              </div>
            </div>
            <div class="tl-item">
              <div class="tl-num">4</div>
              <div class="tl-content">
                <h4>Inkubasi</h4>
                <p>Penumbuhan miselium. Baglog diletakkan di rak area minim cahaya (24-28°C). Di fase ini jaringan akar perlahan mengisi penuh sampai dasar baglog dalam estimasi 30-40 hari.</p>
              </div>
            </div>
            <div class="tl-item">
              <div class="tl-num">5</div>
              <div class="tl-content">
                <h4>Fruiting & Panen</h4>
                <p>Saat baglog sudah diputihkan miselium 100%, plastik depan dibuka, kelembapan dinaikkan (85%+), dan pinhead dipanen dalam waktu cepat 3-4 hari tumbuh.</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Section: Troubleshooting -->
        <section id="masalah" class="featured-section">
          <h2 class="featured-title">Identifikasi Masalah</h2>
          <div class="troubleshoot-grid">
            <div class="ts-card">
              <h4>Baglog Berwarna Hijau / Orange</h4>
              <p><strong>Diagnosis:</strong> Kontaminasi jamur liar seperti spesies Trichoderma atau Neurospora.<br/>
              <strong>Solusi:</strong> Buang dan pisahkan log sejauh mungkin dari kumbung agar spora tidak menyebar ke media yang masih sehat.</p>
            </div>
            <div class="ts-card">
              <h4>Batang Kurus, Tudung Kecil</h4>
              <p><strong>Diagnosis:</strong> Terjadi akumulasi penumpukan emisi CO2, sirkulasi udara buruk.<br/>
              <strong>Solusi:</strong> Buka ventilasi atau jendela bawah kumbung untuk bertukarnya oksigen segar di dalam area budidaya.</p>
            </div>
            <div class="ts-card">
              <h4>Tepi Jamur Kuning Mengkerut</h4>
              <p><strong>Diagnosis:</strong> Terjadinya dehidrasi akibat tingkat persentase kelembapan udara yang terlalu rendah.<br/>
              <strong>Solusi:</strong> Tingkatkan pengabutan di area lantai dan dinding bangunan kumbung secara konstan.</p>
            </div>
             <div class="ts-card">
              <h4>Pinhead Membusuk Setelah Keluar</h4>
              <p><strong>Diagnosis:</strong> Tetesan embun air yang terlalu besar mengenai bakal buah.<br/>
              <strong>Solusi:</strong> Hentikan penyiraman yang terarah langsung ke mulut baglog. Semprot mengarah ke atas (mengembun lembut).</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.edu-layout {
  display: flex;
  flex-direction: column;
  gap: 30px;
  margin-top: 40px;
}

@media(min-width: 1024px) {
  .edu-layout {
    flex-direction: row;
    gap: 50px;
  }
}

.edu-sidebar {
  width: 100%;
}

@media(min-width: 1024px) {
  .edu-sidebar {
    width: 250px;
    flex-shrink: 0;
  }
}

.sticky-nav {
  position: sticky;
  top: 100px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: white;
  padding: 20px;
  border-radius: 16px;
  border: 1px solid var(--border);
}

.nav-link {
  padding: 10px 14px;
  border-radius: 8px;
  color: var(--muted);
  font-weight: 600;
  font-size: 14px;
  text-decoration: none;
  transition: all 0.2s;
}

.nav-link:hover {
  background: var(--bg);
  color: var(--green-dark);
}

.edu-content {
  flex: 1;
}

/* Common Section */
.featured-section {
  margin-bottom: 80px;
}
.featured-section.first {
  margin-top: 0;
}

.featured-title {
  color: var(--green-dark);
  font-size: 24px;
  font-weight: 800;
  margin-bottom: 30px;
}

@media(min-width: 768px) {
  .featured-title { font-size: 32px; }
}

/* Feature Cards */
.feature-card-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

@media(min-width: 640px) {
  .feature-card-grid { grid-template-columns: repeat(2, 1fr); gap: 24px; }
}

.f-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.04);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid var(--border);
  height: 100%;
}

.f-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
}

.f-icon {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 16px;
}

.f-icon svg {
  width: 32px;
  height: 32px;
  fill: var(--green-dark);
}

.f-card h4 {
  color: var(--text);
  font-size: 16px;
  font-weight: 800;
  margin-bottom: 10px;
}

.f-card p {
  color: var(--muted);
  font-size: 13px;
  line-height: 1.6;
  margin: 0;
}

/* Info Cards & Troubleshoot */
.info-card, .ts-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid var(--border);
  transition: transform 0.3s ease;
}

.info-card:hover, .ts-card:hover {
  border-color: #d1d5db;
}

.info-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.info-card h4, .ts-card h4 {
  font-size: 16px;
  font-weight: 800;
  margin: 0;
  margin-bottom: 0px;
  color: var(--text);
}

.ts-card h4 {
  margin-bottom: 10px;
  color: #ef4444; /* Give a subtle alert tone to troubleshoot titles */
}

.info-card p, .ts-card p {
  font-size: 13px;
  color: var(--muted);
  line-height: 1.6;
  margin: 0;
}

.info-card ul {
  padding-left: 18px;
  margin-top: 10px;
  margin-bottom: 0;
  font-size: 13px;
  color: var(--muted);
}

.info-card ul li { margin-bottom: 6px; }

.troubleshoot-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

@media(min-width: 640px) {
  .troubleshoot-grid { grid-template-columns: repeat(2, 1fr); gap: 20px; }
}

/* Special Timeline */
.timeline {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.tl-item {
  display: flex;
  gap: 16px;
  background: white;
  padding: 20px;
  border-radius: 16px;
  border: 1px solid var(--border);
  transition: transform 0.3s;
}

.tl-item:hover {
  border-color: var(--green-dark);
}

.tl-num {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: #e9fbef;
  color: var(--green-dark);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 16px;
  flex-shrink: 0;
}

.tl-content h4 {
  font-size: 15px;
  font-weight: 800;
  margin-top: 0;
  margin-bottom: 6px;
  color: var(--text);
}

.tl-content p {
  font-size: 13px;
  color: var(--muted);
  line-height: 1.6;
  margin: 0;
}

html {
  scroll-behavior: smooth;
}
</style>
