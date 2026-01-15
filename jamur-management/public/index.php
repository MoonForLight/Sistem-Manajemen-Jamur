<?php
declare(strict_types=1);
require __DIR__ . "/../config/app.php";
require __DIR__ . "/../config/auth.php";
?>
<!doctype html>
<html lang="id">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Sistem Manajemen Jamur</title>
  <link rel="stylesheet" href="<?= e(url('assets/style.css')) ?>" />
</head>
<body>
  <div class="nav">
    <div class="brand">🍄 JamurManager</div>
    <div style="display:flex; gap:10px; align-items:center;">
      <a class="btn" href="#edukasi">Edukasi</a>
      <?php if (is_logged_in()): ?>
        <a class="btn accent" href="<?= e(current_user()['role']==='admin' ? url('admin/dashboard.php') : url('pengelola/dashboard.php')) ?>">Dashboard</a>
        <a class="btn" href="<?= e(url('logout.php')) ?>">Logout</a>
      <?php else: ?>
        <a class="btn accent" href="<?= e(url('login.php')) ?>">Login</a>
      <?php endif; ?>
    </div>
  </div>

  <section class="hero">
    <div class="hero-content">
      <div class="kicker">sistem manajemen budidaya</div>
      <div class="h1">Pantau suhu, catat perkembangan, dan kelola aktivitas pengelola jamur.</div>
      <p class="p">
        Website ini membantu pengelola mencatat kondisi lingkungan (suhu/kelembaban) dan tahap perkembangan jamur,
        sementara admin dapat memantau log aktivitas serta mengatur akun pengelola.
      </p>
      <div style="display:flex; gap:10px; margin-top:18px; flex-wrap:wrap;">
        <a class="btn accent" href="<?= e(url('login.php')) ?>">Masuk Sekarang</a>
        <a class="btn" href="#edukasi">Baca Edukasi</a>
      </div>
    </div>
  </section>

  <div class="container" id="edukasi">
    <h2 style="margin:0 0 10px;">Edukasi Singkat Budidaya Jamur</h2>
    <p class="p" style="margin-top:0;">
      Kunci budidaya jamur: kebersihan, sirkulasi udara, suhu yang stabil, kelembaban sesuai, dan pencatatan rutin.
      Dengan log harian, masalah seperti kontaminasi atau suhu tidak ideal bisa cepat dideteksi.
    </p>

    <div class="grid cols-3">
      <div class="card">
        <h3>🌡️ Suhu & Kelembaban</h3>
        <p class="p">Pantau kondisi lingkungan. Jika di luar batas ideal, pertumbuhan bisa melambat atau memicu kontaminasi.</p>
      </div>
      <div class="card">
        <h3>🧫 Tahap Perkembangan</h3>
        <p class="p">Catat tahapan: inkubasi → miselium penuh → pinning → panen. Ini membantu evaluasi pola produksi.</p>
      </div>
      <div class="card">
        <h3>🛡️ Kebersihan</h3>
        <p class="p">Sterilisasi alat dan area kerja. Kontaminasi adalah musuh utama budidaya jamur.</p>
      </div>
    </div>
  </div>

  <div class="footer">
    <div class="container">
      <div>© <?= date('Y') ?> JamurManager — Sistem Manajemen Jamur</div>
      <div style="margin-top:6px;">Kontak/Instansi: isi sesuai kebutuhan tugas</div>
    </div>
  </div>
</body>
</html>
