<template>
  <div class="edu-page">
    <!-- Hero Section -->
    <div class="container" style="margin-top: 10px;">
      <section class="hero-banner-new">
        <div class="hero-banner-bg" aria-hidden="true"></div>
        <div class="hero-container">
          <div class="hero-text">
            <span class="badge-hero">Pusat Pengetahuan</span>
            <h1 class="hero-title-edu">Ensiklopedia <br>Budidaya Jamur</h1>
            <p class="hero-subtitle">
              Pelajari segala hal tentang budidaya jamur dari tahap persiapan hingga panen. Panduan lengkap dan terstruktur ini dirancang untuk mengubah pemula menjadi ahli dalam manajemen dan operasional budidaya jamur.
            </p>
            <div class="hero-buttons">
              <a href="#syarat-tumbuh" class="btn primary pill edu-btn-override">Mulai Belajar</a>
              <a href="#tahapan" class="btn ghost pill edu-btn-ghost-override">Lihat Tahapan</a>
            </div>
        </div>
        </div>
      </section>
    </div>

    <!-- Sticky Navigation -->
    <nav class="edu-nav">
      <div class="nav-container">
        <a href="#mengapa" class="nav-pill">Kenapa Jamur?</a>
        <a href="#syarat-tumbuh" class="nav-pill">Syarat Tumbuh</a>
        <a href="#jenis-jamur" class="nav-pill">Macam Jenis</a>
        <a href="#tahapan" class="nav-pill">Panduan Tahapan</a>
        <a href="#masalah" class="nav-pill">Troubleshooting</a>
      </div>
    </nav>

    <div class="main-content">
      <!-- Section: Kenapa Jamur -->
      <section id="mengapa" class="edu-section">
        <div class="section-header">
          <h2>🌟 Mengapa Membudidayakan Jamur?</h2>
          <p>Jamur bukan hanya sekadar alternatif protein, tetapi juga komoditas dengan prospek masa depan yang cerah.</p>
        </div>
        <div class="grid-3">
          <div class="feature-card">
            <div class="f-icon">💰</div>
            <h3>Peluang Ekonomi Tinggi</h3>
            <p>Harga jual jamur relatif stabil dan permintaannya terus meningkat, baik untuk konsumsi rumah tangga maupun restoran. Siklus panen yang cepat membuat perputaran modal sangat optimal.</p>
          </div>
          <div class="feature-card">
            <div class="f-icon">♻️</div>
            <h3>Ramah Lingkungan</h3>
            <p>Budidaya jamur sering memanfaatkan limbah pertanian (serbuk gergaji, jerami, bekatul) sebagai media tanam, sehingga membantu mengurangi limbah lingkungan.</p>
          </div>
          <div class="feature-card">
            <div class="f-icon">⚕️</div>
            <h3>Kaya Nutrisi</h3>
            <p>Jamur kaya akan protein, serat, serta aman dikonsumsi penderita kolesterol tinggi. Beberapa jenis bahkan memiliki khasiat obat (anti-oksidan & peningkat imun).</p>
          </div>
        </div>
      </section>

      <!-- Section: Syarat Tumbuh -->
      <section id="syarat-tumbuh" class="edu-section alt-bg">
        <div class="section-header">
          <h2>📊 Syarat Tumbuh Optimal</h2>
          <p>Jamur sangat sensitif terhadap lingkungan. Mengendalikan empat faktor ini adalah kunci keberhasilan Anda.</p>
        </div>
        <div class="grid-2">
          <div class="condition-card temp">
            <div class="c-header">
              <div class="c-icon">🌡️</div>
              <h3>Suhu Udara (Temperature)</h3>
            </div>
            <p>Pertumbuhan miselium membutuhkan suhu yang berbeda dengan pembentukan tubuh buah. Suhu ideal rata-rata berada di kisaran <strong>22°C - 28°C</strong>. Suhu yang terlalu panas akan mematikan miselium, sedangkan suhu terlalu dingin akan menghambat pertumbuhannya.</p>
          </div>
          <div class="condition-card humid">
            <div class="c-header">
              <div class="c-icon">💧</div>
              <h3>Kelembapan (Humidity)</h3>
            </div>
            <p>Jamur membutuhkan tingkat kelembapan udara yang sangat tinggi, yaitu antara <strong>80% hingga 90%</strong>. Kelembapan ini dijaga dengan menyemprotkan air di sekitar kumbung (ruang budidaya) menggunakan sprayer embun pelan, bukan disiram langsung ke arah jamur.</p>
          </div>
          <div class="condition-card air">
            <div class="c-header">
              <div class="c-icon">🌬️</div>
              <h3>Sirkulasi Udara (Ventilasi)</h3>
            </div>
            <p>Jamur menghisap oksigen (O₂) dan mengeluarkan karbon dioksida (CO₂). Jika ventilasi buruk dan CO₂ menumpuk, batang jamur akan tumbuh panjang kurus dan tudungnya kerdil. Sirkulasi udara segar yang konsisten sangat mutlak diperlukan.</p>
          </div>
          <div class="condition-card hygiene">
            <div class="c-header">
              <div class="c-icon">🧼</div>
              <h3>Kebersihan (Higienitas)</h3>
            </div>
            <p>Spora jamur liar dan bakteri adalah musuh utama. Seluruh proses pembuatan media tanam (baglog) harus dilakukan secara higienis melalui sterilisasi uap bertekanan. Petugas juga wajib mencuci tangan dan memastikan kumbung bersih dari serangga.</p>
          </div>
        </div>
      </section>

      <!-- Section: Jenis Jamur -->
      <section id="jenis-jamur" class="edu-section">
        <div class="section-header">
          <h2>🍄 Mengenal Jenis Jamur Komersial</h2>
          <p>Kenali karakteristik setiap spesies sebelum memutuskan mana yang akan dibudidayakan.</p>
        </div>
        <div class="mushroom-list">
          <div class="m-row">
            <div class="m-image" style="background: linear-gradient(135deg, #e0f2fe, #bae6fd); font-size: 50px; display:flex; align-items:center; justify-content:center;">❄️</div>
            <div class="m-details">
              <div class="m-title-row">
                <h3>Jamur Tiram (Pleurotus ostreatus)</h3>
                <span class="m-badge easy">Tingkat: Pemula</span>
              </div>
              <p>Mempunyai tubuh buah berwarna putih hingga krem dengan bentuk menyerupai cangkang tiram. Rasa dagingnya kenyal mirip ayam sehingga sangat disukai masyarakat.</p>
              <ul>
                <li><strong>Media Tanam:</strong> Serbuk gergaji kayu gergaji, bekatul, kapur.</li>
                <li><strong>Masa Panen:</strong> 30–40 hari setelah inokulasi.</li>
              </ul>
            </div>
          </div>

          <div class="m-row">
            <div class="m-image" style="background: linear-gradient(135deg, #ffedd5, #fdba74); font-size: 50px; display:flex; align-items:center; justify-content:center;">☁️</div>
            <div class="m-details">
              <div class="m-title-row">
                <h3>Jamur Kancing (Agaricus bisporus)</h3>
                <span class="m-badge medium">Tingkat: Menengah</span>
              </div>
              <p>Berbentuk bulat menyerupai kancing dan banyak digunakan dalam masakan internasional (pizza, pasta). Membutuhkan ruang budidaya yang sejuk dan terkontrol ketat.</p>
              <ul>
                <li><strong>Media Tanam:</strong> Kompos jerami dan kotoran ayam.</li>
                <li><strong>Masa Panen:</strong> Butuh lapisan tanah penutup (casing) agar berbuah.</li>
              </ul>
            </div>
          </div>

          <div class="m-row">
            <div class="m-image" style="background: linear-gradient(135deg, #dcfce7, #86efac); font-size: 50px; display:flex; align-items:center; justify-content:center;">🌾</div>
            <div class="m-details">
              <div class="m-title-row">
                <h3>Jamur Merang (Volvariella volvacea)</h3>
                <span class="m-badge medium">Tingkat: Menengah</span>
              </div>
              <p>Sangat cocok di negara tropis karena menyukai suhu tinggi (30-35°C). Sangat lezat dalam kondisi tunas/telur (belum mekar).</p>
              <ul>
                <li><strong>Media Tanam:</strong> Limbah jerami padi, ampas aren, kapas.</li>
                <li><strong>Masa Panen:</strong> Sangat cepat, hanya 10-15 hari.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <!-- Section: Tahapan Budidaya (Timeline) -->
      <section id="tahapan" class="edu-section alt-bg">
        <div class="section-header">
          <h2>🛤️ Panduan Tahapan Budidaya (Step by Step)</h2>
          <p>Langkah operasional standar agar baglog menghasilkan panen berkualitas.</p>
        </div>
        <div class="timeline">
          <div class="tl-item">
            <div class="tl-marker">1</div>
            <div class="tl-content">
              <h3>Persiapan Media (Composting)</h3>
              <p>Media tanam dari gergaji kayu diayak, dicampur asupan nutrisi seperti bekatul kering dan kapur kalsium karbohidrat (CaCO₃). Kadar air lalu diatur di angka ideal kisaran 60% dengan disiram lalu diaduk merata (apabila dikepal tidak hancur namun tidak meneteskan air).</p>
            </div>
          </div>
          <div class="tl-item">
            <div class="tl-marker">2</div>
            <div class="tl-content">
              <h3>Pembungkusan & Sterilisasi</h3>
              <p>Media dimasukkan ke dalam plastik polipropilen transparan yang tahan panas (Baglog) lalu dipadatkan. Baglog ini lalu disterilisasi ke dalam drum steamer pada suhu ~100°C pda waktu 8-12 jam guna membunuh bakteri mikroskopis alami.</p>
            </div>
          </div>
          <div class="tl-item">
            <div class="tl-marker">3</div>
            <div class="tl-content">
              <h3>Inokulasi (Pemberian Bibit)</h3>
              <p>Proses sakral yang wajib dilakukan di ruangan steril agar tidak kemasukan partikel lain. Baglog yang sudah didinginkan ditaburi bibit jamur (F2/F3) melewati mulut plastik, lalu ditutup rapat kembali menggunakan cincin selang.</p>
            </div>
          </div>
          <div class="tl-item">
            <div class="tl-marker">4</div>
            <div class="tl-content">
              <h3>Inkubasi (Penumbuhan Miselium)</h3>
              <p>Baglog diletakkan pada rak penyimpanan minim cahaya dengan suhu konstan (24-28°C). Di sini Anda akan melihat jaringan akar putih (miselium) perlahan menjalar mengisi penuh ke dasar baglog dalam 30-40 hari ke depan.</p>
            </div>
          </div>
          <div class="tl-item">
            <div class="tl-marker">5</div>
            <div class="tl-content">
              <h3>Fruiting (Pembuahan)</h3>
              <p>Saat baglog sudah diputihkan miselium 100%, mulut penutup plastik dibuka. Rak kemudian mulai disemprot kabut air untuk meningkatkan kelembapan hingga di atas 85%. Oksigen ditambahkan untuk merangsang keluar bakal tubuh pinhead.</p>
            </div>
          </div>
          <div class="tl-item">
            <div class="tl-marker">6</div>
            <div class="tl-content">
              <h3>Panen & Pasca Panen</h3>
              <p>Panen dilakukan segera sebelum tepi jamur keriting atau pecah (maksimal 3-4 hari setelah pinhead muncul). Usahakan pencabutan hingga akar agar sisa pangkal batang tidak membusuk di dalam cincin log. Kemas jamur segar untuk dijual.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Section: Troubleshooting -->
      <section id="masalah" class="edu-section">
        <div class="section-header">
          <h2>🧩 Troubleshooting & Identifikasi Masalah</h2>
          <p>Memecahkan kendala paling umum di lapangan langsung dari gejalanya.</p>
        </div>
        <div class="accordion-container">
          <details class="acc-item" open>
            <summary>
              <span class="acc-title">🔴 Baglog Berubah Warna Hijau, Hitam, atau Orange?</span>
              <span class="acc-icon">+</span>
            </summary>
            <div class="acc-body">
              <p><strong>Gejala:</strong> Bercak aneh menutupi pertumbuhan miselium putih.<br>
              <strong>Diagnosis:</strong> Terjadi kontaminasi oleh kapang Trichoderma sp. (Hijau/Hitam) atau Neurospora (Jingga/Orange).<br>
              <strong>Penyebab:</strong> Suhu sterilisasi kurang panas, plastik bocor, atau lingkungan inkubasi tidak higienis.<br>
              <strong>Tindakan:</strong> Segera buang/kubur baglog yang terkontaminasi jauh dari kumbung agar spora liarnya tidak menyebar dan menular melalui udara.</p>
            </div>
          </details>
          
          <details class="acc-item">
            <summary>
              <span class="acc-title">🔴 Batang Jamur Panjang Kurus dan Tudungnya Kecil?</span>
              <span class="acc-icon">+</span>
            </summary>
            <div class="acc-body">
              <p><strong>Diagnosis:</strong> Akumulasi gas Karbondioksida (CO₂).<br>
              <strong>Penjelasan:</strong> Jamur memerlukan Oksigen untuk membesarkan tudung. Jika area kumbung terlalu tertutup rapat dan sesak, CO₂ hasil respirasi jamur akan menumpuk di area bawah.<br>
              <strong>Tindakan:</strong> Tingkatkan ventilasi gantung. Buka jendela kumbung bagian bawah secara parsial di pagi/sore hari untuk bertukarnya udara segar.</p>
            </div>
          </details>

          <details class="acc-item">
            <summary>
              <span class="acc-title">🔴 Tepi Jamur Kering, Kuning, Mengkerut?</span>
              <span class="acc-icon">+</span>
            </summary>
            <div class="acc-body">
              <p><strong>Diagnosis:</strong> Dehidrasi (Kekurangan Kelembapan) atau Suhu Ekstrem.<br>
              <strong>Penyebab:</strong> Udara di ruang budidaya terlalu kering (RH di bawah 75%) atau terjadi tiupan angin pasif berlebih ke punggung jamur.<br>
              <strong>Tindakan:</strong> Siram/semprotkan air pada lantai dan atap bangunan secara intensif menggunakan sprayer embun lembut. Minimalisir masuknya semburan angin langsung dari pintu luar.</p>
            </div>
          </details>

          <details class="acc-item">
            <summary>
              <span class="acc-title">🔴 Pinhead (Calon Jamur) Mati Setelah Keluar?</span>
              <span class="acc-icon">+</span>
            </summary>
            <div class="acc-body">
              <p><strong>Diagnosis:</strong> Jamur membusuk di tahap awal.<br>
              <strong>Penyebab:</strong> Terjadi percikan air dalam ukuran tetesan yang terlalu besar langsung pada bakal buah (pinhead), membuatnya tenggelam dan memancing bakteri Pseudomonas merusaknya.<br>
              <strong>Tindakan:</strong> Hentikan penyiraman yang terarah langsung ke mulut baglog. Semprot mengarah ke atas agar mengembun, bukan mengguyur.</p>
            </div>
          </details>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
// Edukasi Page Logic
</script>

<style scoped>
/* Base & Typography */
.edu-page {
  font-family: 'Inter', sans-serif;
  color: #333;
  line-height: 1.6;
}

h1, h2, h3 { color: #111827; margin: 0; }
a { text-decoration: none; }

/* Hero Section */
.hero-banner-new {
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: #0b1210;
  width: 100%;
  padding: 60px 20px;
}

@media (min-width: 768px) {
  .hero-banner-new {
    border-radius: 16px;
    padding: 80px 40px;
  }
}

.hero-banner-new::after {
  content: "";
  position: absolute;
  inset: 0;
  background-image: radial-gradient(closest-side at 70% 30%, rgba(34, 197, 94, .35), transparent 60%);
  z-index: 1;
}

.hero-banner-bg {
  position: absolute;
  inset: 0;
  background: url('/assets/landing.jpg') center/cover no-repeat;
}

.hero-container {
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 40px;
  position: relative;
  z-index: 2;
}

.hero-text { flex: 1; color: white; }

.badge-hero {
  background: rgba(255,255,255,0.2);
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 700;
  display: inline-block;
  margin-bottom: 20px;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.hero-title-edu {
  font-size: 40px;
  font-weight: 900;
  margin-bottom: 20px;
  color: white;
  line-height: 1.2;
}

@media (min-width: 768px) {
  .hero-title-edu {
    font-size: 48px;
  }
}

.hero-subtitle {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.85);
  margin-bottom: 30px;
  max-width: 600px;
}

@media (min-width: 768px) {
  .hero-subtitle {
    font-size: 18px;
  }
}

.hero-buttons { display: flex; gap: 14px; }

.edu-btn-override {
  padding: 12px 28px;
  font-size: 15px;
}

.edu-btn-ghost-override {
  padding: 12px 28px;
  font-size: 15px;
  border: 1px solid rgba(255,255,255,0.4);
  color: white;
}

.edu-btn-ghost-override:hover {
  background: rgba(255,255,255,0.1);
  border-color: white;
}

@media (max-width: 768px) {
  .hero-container { flex-direction: column; text-align: center; }
  .hero-subtitle { margin: 0 auto 30px; }
  .hero-buttons { justify-content: center; }
  .hero-title { font-size: 36px; }
}

/* Sticky Nav */
.edu-nav {
  background: white;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 50;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
}

.nav-container {
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  gap: 12px;
  padding: 16px 20px;
  overflow-x: auto;
  scrollbar-width: none;
}

.nav-container::-webkit-scrollbar { display: none; }

.nav-pill {
  background: #f3f4f6;
  color: #4b5563;
  padding: 8px 18px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
  transition: all 0.2s;
}

.nav-pill:hover { background: #e0e7ff; color: #4f46e5; }

/* Main Content Wrapper */
.main-content {
  max-width: 1000px;
  margin: 0 auto;
}

.edu-section {
  padding: 80px 20px;
}

.alt-bg {
  background: #f8fafc;
  border-top: 1px solid #f1f5f9;
  border-bottom: 1px solid #f1f5f9;
}

.section-header {
  text-align: center;
  margin-bottom: 50px;
}

.section-header h2 {
  font-size: 32px;
  margin-bottom: 16px;
}

.section-header p {
  font-size: 16px;
  color: #6b7280;
  max-width: 600px;
  margin: 0 auto;
}

/* Grid Layouts */
.grid-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.grid-2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

@media(max-width: 800px) {
  .grid-3, .grid-2 { grid-template-columns: 1fr; }
}

/* Feature Cards */
.feature-card {
  background: white;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.04);
  transition: transform 0.3s;
  border: 1px solid #f3f4f6;
}

.feature-card:hover { transform: translateY(-5px); box-shadow: 0 10px 25px rgba(0,0,0,0.08); }
.f-icon { font-size: 40px; margin-bottom: 20px; }
.feature-card h3 { font-size: 20px; margin-bottom: 12px; }
.feature-card p { font-size: 14px; color: #4b5563; margin: 0; }

/* Condition Cards */
.condition-card {
  background: white;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.02);
  border-top: 4px solid #ccc;
}

.condition-card.temp { border-top-color: #ef4444; }
.condition-card.humid { border-top-color: #3b82f6; }
.condition-card.air { border-top-color: #8b5cf6; }
.condition-card.hygiene { border-top-color: var(--green-dark); }

.c-header { display: flex; align-items: center; gap: 16px; margin-bottom: 16px; }
.c-icon { font-size: 30px; }
.condition-card h3 { font-size: 18px; margin: 0; }
.condition-card p { font-size: 14px; color: #4b5563; margin: 0; }

/* Mushroom List */
.mushroom-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.m-row {
  display: flex;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0,0,0,0.03);
  border: 1px solid #f3f4f6;
}

@media(max-width: 600px) {
  .m-row { flex-direction: column; }
}

.m-image {
  width: 200px;
  flex-shrink: 0;
}

@media(max-width: 600px) {
  .m-image { width: 100%; height: 150px; }
}

.m-details {
  padding: 30px;
  flex: 1;
}

.m-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  flex-wrap: wrap;
  gap: 10px;
}

.m-details h3 { font-size: 20px; }

.m-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 700;
}
.m-badge.easy { background: #dcfce7; color: #16a34a; }
.m-badge.medium { background: #fef9c3; color: #ca8a04; }

.m-details p { font-size: 15px; color: #4b5563; margin: 0 0 16px 0; }

.m-details ul {
  margin: 0;
  padding-left: 20px;
  font-size: 14px;
  color: #4b5563;
}

.m-details ul li { margin-bottom: 6px; }

/* Timeline */
.timeline {
  display: flex;
  flex-direction: column;
  gap: 0;
  max-width: 800px;
  margin: 0 auto;
}

.tl-item {
  display: flex;
  gap: 30px;
  position: relative;
  padding-bottom: 40px;
}

.tl-item:last-child { padding-bottom: 0; }

.tl-item::before {
  content: '';
  position: absolute;
  top: 40px;
  left: 23px;
  bottom: 0;
  width: 2px;
  background: #e5e7eb;
}

.tl-item:last-child::before { display: none; }

.tl-marker {
  width: 48px;
  height: 48px;
  background: var(--green-dark);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 900;
  flex-shrink: 0;
  position: relative;
  z-index: 2;
  box-shadow: 0 0 0 6px white, 0 4px 6px rgba(0,0,0,0.1);
}

.tl-content {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03);
  border: 1px solid #f3f4f6;
  flex: 1;
}

.tl-content h3 { font-size: 18px; margin-bottom: 10px; color: var(--green-dark); }
.tl-content p { font-size: 15px; margin: 0; color: #4b5563; }

@media(max-width: 600px) {
  .tl-item { gap: 16px; }
  .tl-marker { width: 36px; height: 36px; font-size: 16px; margin-top: 4px; left: 6px; }
  .tl-item::before { left: 23px; }
}

/* Accordion Troubleshooting */
.accordion-container {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.acc-item {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03);
  border: 1px solid #f3f4f6;
  overflow: hidden;
}

.acc-item summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  cursor: pointer;
  list-style: none; /* Hide default arrow */
}

.acc-item summary::-webkit-details-marker { display: none; }

.acc-title {
  font-size: 16px;
  font-weight: 700;
  color: #1f2937;
}

.acc-icon {
  font-size: 24px;
  color: #9ca3af;
  font-weight: 300;
  transition: transform 0.3s;
}

.acc-item[open] .acc-icon {
  transform: rotate(45deg);
}

.acc-body {
  padding: 0 24px 24px 24px;
  font-size: 15px;
  color: #4b5563;
  line-height: 1.7;
}

.acc-body p strong { color: #111827; }
</style>
