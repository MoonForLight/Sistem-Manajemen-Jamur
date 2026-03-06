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

    <section style="margin-top:18px" class="card">
      <div style="padding:18px 18px 8px">
        <h2 class="section-title" style="text-align:center; margin:0">Kenali Budidaya Jamur Lebih Dekat</h2>
      </div>
      <div style="padding: 0 18px 18px">
        <div class="feature-row">
          <div class="feature">
            <div class="icon">📘</div>
            <h4>Apa itu Jamur?</h4>
            <p>Ringkasan budidaya jamur dan istilah dasar.</p>
          </div>
          <div class="feature">
            <div class="icon">🧪</div>
            <h4>Proses Budidaya</h4>
            <p>Tahap inkubasi, pertumbuhan, hingga panen.</p>
          </div>
          <div class="feature">
            <div class="icon">✅</div>
            <h4>Manfaat</h4>
            <p>Peluang usaha, ramah lingkungan, panen cepat.</p>
          </div>
          <div class="feature">
            <div class="icon">📊</div>
            <h4>MycoFlow</h4>
            <p>Monitoring perkembangan dan ringkasan lokasi.</p>
          </div>
        </div>
      </div>
    </section>

    <section style="margin-top:18px" class="card">
      <div style="padding:18px">
        <h2 class="section-title" style="margin:0">Pantau Perkembangan Jamur Secara Real-Time</h2>
        <p class="small" style="margin:6px 0 0">
          Dengan pencatatan pertumbuhan (suhu, kelembapan, fase) dan panen (jumlah, tanggal),
          data lebih rapi dan mudah dianalisis.
        </p>
      </div>
      <div style="height:240px; border-top:1px solid var(--border); background: url('/assets/hero-mushroom.svg') center/cover no-repeat; border-bottom-left-radius:14px; border-bottom-right-radius:14px;" />
    </section>

    <section style="margin-top:18px" class="card">
      <div class="grid grid-2" style="padding:18px; align-items:center">
        <div>
          <h2 class="section-title" style="margin:0">Transparansi Data</h2>
          <p class="small" style="margin:8px 0 14px">
            Data monitoring budidaya dapat ditampilkan sebagai data publik.
            Cocok untuk edukasi, dokumentasi, atau laporan komunitas/UMKM.
          </p>
          <RouterLink class="btn primary" to="/edukasi">Baca Edukasi</RouterLink>
          <RouterLink class="btn" style="margin-left:10px" to="/data">Lihat Data Publik</RouterLink>
        </div>
        <div style="display:flex; justify-content:flex-end">
          <div style="width:220px; height:180px; border-radius:16px; border:1px solid var(--border); background: url('/assets/card-mushroom.svg') center/cover no-repeat;" />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>
