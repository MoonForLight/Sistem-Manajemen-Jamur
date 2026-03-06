<template>
  <div class="container">
    <div class="card" style="padding:18px">
      <h1 style="margin:0; font-size:18px; font-weight:950">Edukasi Budidaya Jamur</h1>
      <p class="small" style="margin:6px 0 0">Panduan ringkas tapi lengkap untuk pemula sampai level operasional.</p>

      <div style="margin-top:14px; display:flex; gap:10px; flex-wrap:wrap">
        <a class="btn pill" href="#pengantar">Pengantar</a>
        <a class="btn pill" href="#syarat">Syarat Tumbuh</a>
        <a class="btn pill" href="#jenis">Jenis Jamur</a>
        <a class="btn pill" href="#tahapan">Tahapan</a>
        <a class="btn pill" href="#masalah">Masalah & Solusi</a>
        <a class="btn pill" href="#faq">FAQ</a>
      </div>
    </div>

    <div class="grid" style="margin-top:16px; grid-template-columns: 1.2fr .8fr;" >
      <section class="card" style="padding:18px" id="pengantar">
        <h2 class="section-title">🍄 Apa itu Jamur Budidaya?</h2>
        <p class="small" style="margin-top:6px">
          Jamur budidaya adalah jamur yang ditumbuhkan secara terkontrol agar panen stabil, higienis, dan berulang.
          Kunci keberhasilan: konsistensi suhu–kelembapan, sirkulasi udara, media tanam tepat, serta kebersihan untuk mencegah kontaminasi.
        </p>
        <div style="margin-top:12px; display:flex; gap:10px; flex-wrap:wrap">
          <span class="badge green">Higienis</span>
          <span class="badge blue">Panen berulang</span>
          <span class="badge blue">Skala UMKM</span>
          <span class="badge orange">Rentan kontaminasi</span>
        </div>

        <div class="grid grid-2" style="margin-top:14px" id="syarat">
          <div class="card" style="padding:12px; background: #eef2ff">
            <div style="font-weight:900">🌡️ Suhu</div>
            <div class="small">Stabil lebih penting. Umum 18–30°C (tergantung jenis).</div>
          </div>
          <div class="card" style="padding:12px; background: #e9fbef">
            <div style="font-weight:900">💧 Kelembapan</div>
            <div class="small">80–95% saat fruiting. Terlalu kering = gagal muncul.</div>
          </div>
          <div class="card" style="padding:12px; background: #fffbeb">
            <div style="font-weight:900">🌬️ Sirkulasi</div>
            <div class="small">Butuh udara segar. Ventilasi buruk = batang kurus.</div>
          </div>
          <div class="card" style="padding:12px; background: #eef2ff">
            <div style="font-weight:900">🧼 Kebersihan</div>
            <div class="small">Steril alat & ruang. Kurangi kapang/jamur liar.</div>
          </div>
        </div>

        <div style="margin-top:14px" id="tahapan">
          <h3 style="margin:0 0 10px; font-size:13px; font-weight:950">📈 Tahapan Budidaya (ringkas)</h3>
          <ol class="small" style="margin:0; padding-left:18px">
            <li>Persiapan media → atur kadar air & campuran.</li>
            <li>Fermentasi/pengomposan → matangkan media, aduk berkala.</li>
            <li>Inokulasi bibit → masukkan spawn secara higienis.</li>
            <li>Inkubasi miselium → jaga stabil sampai menyebar merata.</li>
            <li>Fruiting → atur kelembapan + ventilasi untuk memicu tubuh buah.</li>
            <li>Panen & pascapanen → panen ukuran ideal, catat hasil.</li>
          </ol>
        </div>
      </section>

      <aside class="card" style="padding:18px" id="jenis">
        <h2 class="section-title">🌱 Jenis Jamur Populer</h2>
        <div class="small">Ringkasan cepat: tingkat kesulitan & karakter.</div>
        <table class="table" style="margin-top:10px">
          <thead>
            <tr>
              <th>Jenis</th>
              <th>Keterangan</th>
              <th>Level</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><b>Jamur Tiram</b></td>
              <td class="muted">Mudah, panen cepat, cocok lembap</td>
              <td><span class="badge green">Mudah</span></td>
            </tr>
            <tr>
              <td><b>Jamur Kancing</b></td>
              <td class="muted">Butuh kontrol suhu lebih ketat</td>
              <td><span class="badge orange">Sedang</span></td>
            </tr>
            <tr>
              <td><b>Jamur Merang</b></td>
              <td class="muted">Suka hangat, media jerami</td>
              <td><span class="badge orange">Sedang</span></td>
            </tr>
            <tr>
              <td><b>Shiitake</b></td>
              <td class="muted">Lebih lama, nilai jual tinggi</td>
              <td><span class="badge orange">Sulit</span></td>
            </tr>
          </tbody>
        </table>

        <div class="card chart-card" style="margin-top:12px; background: var(--bg)">
          <div class="small" style="font-weight:800">Tahapan (dummy)</div>
          <MiniDotChart />
        </div>

        <div class="card" style="margin-top:12px; padding:14px">
          <h3 style="margin:0 0 10px; font-size:13px; font-weight:950">💡 Manfaat Jamur</h3>
          <div class="small">✔ Sumber protein nabati</div>
          <div class="small">✔ Peluang usaha berkelanjutan</div>
          <div class="small">✔ Ramah lingkungan</div>
          <div class="small">✔ Panen berkala & cepat</div>
        </div>
      </aside>
    </div>

    <section class="card" style="padding:18px; margin-top:16px" id="masalah">
      <h2 class="section-title">🧩 Masalah Umum & Solusi Cepat</h2>
      <div class="grid" style="grid-template-columns: repeat(2, minmax(0,1fr)); gap:12px">
        <div class="card" style="padding:14px">
          <b>Kontaminasi hijau/kapang</b>
          <div class="small">Penyebab: alat tidak steril, media terlalu basah.</div>
          <div class="small">Solusi: pisahkan, bersihkan ruang, perbaiki ventilasi.</div>
        </div>
        <div class="card" style="padding:14px">
          <b>Batang panjang kurus</b>
          <div class="small">Penyebab: CO₂ tinggi (ventilasi kurang).</div>
          <div class="small">Solusi: tambah pertukaran udara, buka ventilasi berkala.</div>
        </div>
        <div class="card" style="padding:14px">
          <b>Jamur kecil-kecil/kering</b>
          <div class="small">Penyebab: kelembapan rendah, angin langsung.</div>
          <div class="small">Solusi: semprot kabut, hindari hembusan langsung.</div>
        </div>
        <div class="card" style="padding:14px">
          <b>Bau menyengat pada media</b>
          <div class="small">Penyebab: fermentasi belum matang.</div>
          <div class="small">Solusi: lanjutkan fermentasi, aduk & aerasi media.</div>
        </div>
      </div>
    </section>

    <section class="card" style="padding:18px; margin-top:16px" id="faq">
      <h2 class="section-title">❓ FAQ</h2>
      <details class="card" style="padding:12px; margin-top:10px">
        <summary style="font-weight:900">Berapa lama sampai panen pertama?</summary>
        <div class="small" style="margin-top:8px">Tergantung jenis jamur dan kondisi lingkungan. Beberapa jenis panen lebih cepat, yang lain lebih lama.</div>
      </details>
      <details class="card" style="padding:12px; margin-top:10px">
        <summary style="font-weight:900">Kenapa harus mencatat pertumbuhan?</summary>
        <div class="small" style="margin-top:8px">Supaya evaluasi kondisi harian (suhu/RH/fase) dan menemukan penyebab jika panen menurun.</div>
      </details>
    </section>
  </div>
</template>

<script setup>
import MiniDotChart from '../components/MiniDotChart.vue'
</script>

<style scoped>
summary{cursor:pointer}
</style>
