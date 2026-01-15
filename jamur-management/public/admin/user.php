<?php
declare(strict_types=1);
require __DIR__ . "/../../config/app.php";
require __DIR__ . "/../../config/db.php";
require __DIR__ . "/../../config/auth.php";
require_role('admin');

$users = $pdo->query("SELECT id,name,username,role,status,created_at FROM users ORDER BY created_at DESC")->fetchAll();
?>
<!doctype html>
<html lang="id">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Kelola Pengelola</title>
  <link rel="stylesheet" href="<?= e(url('assets/style.css')) ?>" />
</head>
<body>
  <div class="nav">
    <div class="brand">👤 Kelola User</div>
    <div style="display:flex; gap:10px;">
      <a class="btn accent" href="<?= e(url('admin/user_create.php')) ?>">+ Tambah Pengelola</a>
      <a class="btn" href="<?= e(url('admin/dashboard.php')) ?>">Kembali</a>
    </div>
  </div>

  <div class="container">
    <div class="card">
      <h2 style="margin:0 0 6px;">Daftar User</h2>
      <p class="p" style="margin-top:0;">Admin bisa menambah, edit, nonaktifkan, atau hapus pengelola.</p>

      <table class="table">
        <thead>
          <tr>
            <th>Nama</th>
            <th>Username</th>
            <th>Role</th>
            <th>Status</th>
            <th>Dibuat</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          <?php foreach($users as $u): ?>
            <tr>
              <td><?= e($u['name']) ?></td>
              <td><?= e($u['username']) ?></td>
              <td><?= e($u['role']) ?></td>
              <td>
                <span class="badge <?= $u['status']==='active' ? 'ok':'off' ?>">
                  <?= e($u['status']) ?>
                </span>
              </td>
              <td><?= e($u['created_at']) ?></td>
              <td style="display:flex; gap:8px; align-items:center;">
                <a class="btn" href="<?= e(url('admin/user_edit.php?id=' . (int)$u['id'])) ?>">Edit</a>
                <a class="btn" href="<?= e(url('admin/user_toggle.php?id=' . (int)$u['id'])) ?>">
                  <?= $u['status']==='active' ? 'Nonaktifkan' : 'Aktifkan' ?>
                </a>
                <a class="btn danger" href="<?= e(url('admin/user_delete.php?id=' . (int)$u['id'])) ?>" onclick="return confirm('Yakin hapus user ini?')">Hapus</a>
              </td>
            </tr>
          <?php endforeach; ?>
        </tbody>
      </table>
    </div>
  </div>
</body>
</html>
