<?php
declare(strict_types=1);
require __DIR__ . "/../../config/app.php";
require __DIR__ . "/../../config/db.php";
require __DIR__ . "/../../config/auth.php";
require_role('admin');

$user = current_user();

$stmt = $pdo->query("
  SELECT l.*, u.name AS actor_name, u.role AS actor_role
  FROM activity_logs l
  JOIN users u ON u.id = l.actor_user_id
  ORDER BY l.created_at DESC
  LIMIT 100
");
$logs = $stmt->fetchAll();

$countUsers = (int)$pdo->query("SELECT COUNT(*) AS c FROM users")->fetch()['c'];
$countPengelola = (int)$pdo->query("SELECT COUNT(*) AS c FROM users WHERE role='pengelola'")->fetch()['c'];
$countRecords = (int)$pdo->query("SELECT COUNT(*) AS c FROM mushroom_records")->fetch()['c'];
?>
<!doctype html>
<html lang="id">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Admin Dashboard</title>
  <link rel="stylesheet" href="<?= e(url('assets/style.css')) ?>" />
</head>
<body>
  <div class="nav">
    <div class="brand">🛡️ Admin - JamurManager</div>
    <div style="display:flex; gap:10px; align-items:center;">
      <span style="color:var(--muted)">Halo, <b><?= e($user['name']) ?></b></span>
      <a class="btn" href="<?= e(url('admin/user.php')) ?>">Kelola Pengelola</a>
      <a class="btn" href="<?= e(url('index.php')) ?>">Landing</a>
      <a class="btn" href="<?= e(url('logout.php')) ?>">Logout</a>
    </div>
  </div>

  <div class="container">
    <div class="grid cols-3">
      <div class="card"><h3 style="margin:0 0 6px;">Total User</h3><div style="font-size:28px; font-weight:800;"><?= $countUsers ?></div></div>
      <div class="card"><h3 style="margin:0 0 6px;">Total Pengelola</h3><div style="font-size:28px; font-weight:800;"><?= $countPengelola ?></div></div>
      <div class="card"><h3 style="margin:0 0 6px;">Total Catatan</h3><div style="font-size:28px; font-weight:800;"><?= $countRecords ?></div></div>
    </div>

    <div class="card" style="margin-top:16px;">
      <h2 style="margin:0 0 6px;">Log Aktivitas (100 terbaru)</h2>
      <p class="p" style="margin-top:0;">Semua aktivitas login, input data, dan perubahan user dicatat di sini.</p>

      <table class="table">
        <thead>
          <tr>
            <th>Waktu</th>
            <th>Aktor</th>
            <th>Role</th>
            <th>Aksi</th>
            <th>Deskripsi</th>
          </tr>
        </thead>
        <tbody>
          <?php if (!$logs): ?>
            <tr><td colspan="5" style="color:var(--muted)">Belum ada log.</td></tr>
          <?php else: ?>
            <?php foreach ($logs as $l): ?>
              <tr>
                <td><?= e($l['created_at']) ?></td>
                <td><?= e($l['actor_name']) ?></td>
                <td><?= e($l['actor_role']) ?></td>
                <td><?= e($l['action']) ?></td>
                <td><?= e($l['description']) ?></td>
              </tr>
            <?php endforeach; ?>
          <?php endif; ?>
        </tbody>
      </table>
    </div>
  </div>
</body>
</html>
