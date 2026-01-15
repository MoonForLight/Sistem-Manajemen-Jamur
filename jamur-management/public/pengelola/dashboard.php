<?php
declare(strict_types=1);
require __DIR__ . "/../../config/app.php";
require __DIR__ . "/../../config/db.php";
require __DIR__ . "/../../config/auth.php";
require_role('pengelola');

$user = current_user();

$stmt = $pdo->prepare("SELECT * FROM mushroom_records WHERE user_id = ? ORDER BY created_at DESC LIMIT 50");
$stmt->execute([(int)$user['id']]);
$rows = $stmt->fetchAll();

function suhu_badge(float $s): string {
  // aturan sederhana (bisa kamu ubah sesuai kebutuhan)
  // misal ideal 22-28
  if ($s < 22 || $s > 28) return 'off';
  return 'ok';
}
?>
<!doctype html>
<html lang="id">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Dashboard Pengelola</title>
  <link rel="stylesheet" href="<?= e(url('assets/style.css')) ?>" />
</head>
<body>
  <div class="nav">
    <div class="brand">🍄 Pengelola - JamurManager</div>
    <div style="display:flex; gap:10px; align-items:center;">
      <span style="color:var(--muted)">Halo, <b><?= e($user['name']) ?></b></span>
      <a class="btn" href="<?= e(url('index.php')) ?>">Landing</a>
      <a class="btn" href="<?= e(url('logout.php')) ?>">Logout</a>
    </div>
  </div>

  <div class="container">
    <div class="grid" style="grid-template-columns: 1.1fr .9fr; gap:16px;">
      <div class="card">
        <h2 style="margin:0 0 6px;">Input Monitoring Jamur</h2>
        <p class="p" style="margin-top:0;">Isi suhu, jenis jamur, batch, dan tahap perkembangan.</p>

        <form method="post" action="<?= e(url('pengelola/add_record.php')) ?>">
          <input type="hidden" name="csrf" value="<?= e(csrf_token()) ?>" />

          <label>Jenis Jamur</label>
          <select name="jenis_jamur" required>
            <option value="Jamur Tiram">Jamur Tiram</option>
            <option value="Jamur Kuping">Jamur Kuping</option>
            <option value="Jamur Shiitake">Jamur Shiitake</option>
            <option value="Lainnya">Lainnya</option>
          </select>

          <label>Batch / Lokasi</label>
          <input name="batch" placeholder="Contoh: Rak A - Batch B12" required />

          <label>Suhu (°C)</label>
          <input name="suhu" type="number" step="0.01" placeholder="Contoh: 26.5" required />

          <label>Kelembaban (%) (opsional)</label>
          <input name="kelembaban" type="number" step="0.01" placeholder="Contoh: 85" />

          <label>Tahap Perkembangan</label>
          <select name="tahap_perkembangan" required>
            <option value="Inkubasi">Inkubasi</option>
            <option value="Miselium Penuh">Miselium Penuh</option>
            <option value="Pinning">Pinning</option>
            <option value="Panen">Panen</option>
            <option value="Kontaminasi">Kontaminasi</option>
          </select>

          <label>Catatan (opsional)</label>
          <textarea name="catatan" rows="3" placeholder="Contoh: ada bercak hijau di sebagian baglog..."></textarea>

          <div style="margin-top:14px;">
            <button class="btn accent" type="submit">Simpan Data</button>
          </div>
        </form>
      </div>

      <div class="card">
        <h3 style="margin:0 0 6px;">Aturan Cepat</h3>
        <p class="p" style="margin-top:0;">
          Sistem memberi tanda “Tidak Ideal” bila suhu <b>&lt; 22</b> atau <b>&gt; 28</b> (aturan sederhana, bisa kamu ubah).
        </p>
        <div class="card" style="background:rgba(67,209,122,.06)">
          <b>Tips</b>
          <div class="p" style="margin-top:6px;">Input rutin minimal 1× sehari supaya log admin rapi dan mudah dianalisis.</div>
        </div>
      </div>
    </div>

    <div class="card" style="margin-top:16px;">
      <h2 style="margin:0 0 6px;">Riwayat Input Terbaru</h2>
      <p class="p" style="margin-top:0;">Maksimal 50 data terakhir.</p>

      <table class="table">
        <thead>
          <tr>
            <th>Waktu</th>
            <th>Jenis</th>
            <th>Batch</th>
            <th>Suhu</th>
            <th>Kelembaban</th>
            <th>Tahap</th>
            <th>Catatan</th>
          </tr>
        </thead>
        <tbody>
          <?php if (!$rows): ?>
            <tr><td colspan="7" style="color:var(--muted)">Belum ada data.</td></tr>
          <?php else: ?>
            <?php foreach ($rows as $r): ?>
              <?php $badge = suhu_badge((float)$r['suhu']); ?>
              <tr>
                <td><?= e($r['created_at']) ?></td>
                <td><?= e($r['jenis_jamur']) ?></td>
                <td><?= e($r['batch']) ?></td>
                <td>
                  <span class="badge <?= $badge ?>">
                    <?= e((string)$r['suhu']) ?>°C <?= $badge === 'off' ? '• Tidak Ideal' : '• Ideal' ?>
                  </span>
                </td>
                <td><?= $r['kelembaban'] === null ? '-' : e((string)$r['kelembaban']).'%' ?></td>
                <td><?= e($r['tahap_perkembangan']) ?></td>
                <td><?= $r['catatan'] ? e($r['catatan']) : '-' ?></td>
              </tr>
            <?php endforeach; ?>
          <?php endif; ?>
        </tbody>
      </table>
    </div>
  </div>
</body>
</html>
