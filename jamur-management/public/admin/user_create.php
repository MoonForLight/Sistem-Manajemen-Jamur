<?php
declare(strict_types=1);
require __DIR__ . "/../../config/app.php";
require __DIR__ . "/../../config/db.php";
require __DIR__ . "/../../config/auth.php";
require_role('admin');

$error = "";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  require_csrf();

  $name = trim((string)($_POST['name'] ?? ''));
  $username = trim((string)($_POST['username'] ?? ''));
  $password = (string)($_POST['password'] ?? '');
  $role = (string)($_POST['role'] ?? 'pengelola');

  if ($name==='' || $username==='' || $password==='') {
    $error = "Nama, username, dan password wajib diisi.";
  } elseif (!in_array($role, ['admin','pengelola'], true)) {
    $error = "Role tidak valid.";
  } else {
    try {
      $hash = password_hash($password, PASSWORD_DEFAULT);
      $stmt = $pdo->prepare("INSERT INTO users (name, username, password_hash, role, status) VALUES (?,?,?,?, 'active')");
      $stmt->execute([$name, $username, $hash, $role]);

      log_activity($pdo, (int)current_user()['id'], "CREATE_USER", "Membuat user {$username} (role: {$role}).");

      header("Location: " . url("admin/user.php"));
      exit;
    } catch (Throwable $e) {
      $error = "Gagal membuat user (mungkin username sudah dipakai).";
    }
  }
}
?>
<!doctype html>
<html lang="id">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Tambah User</title>
  <link rel="stylesheet" href="<?= e(url('assets/style.css')) ?>" />
</head>
<body>
  <div class="nav">
    <div class="brand">➕ Tambah User</div>
    <a class="btn" href="<?= e(url('admin/user.php')) ?>">Kembali</a>
  </div>

  <div class="container" style="max-width:620px;">
    <div class="card">
      <h2 style="margin:0 0 6px;">Buat Akun Pengelola/Admin</h2>
      <?php if ($error): ?>
        <div class="card" style="border-color:rgba(255,90,95,.35); background:rgba(255,90,95,.08);">
          <?= e($error) ?>
        </div>
      <?php endif; ?>

      <form method="post">
        <input type="hidden" name="csrf" value="<?= e(csrf_token()) ?>" />

        <label>Nama</label>
        <input name="name" required />

        <label>Username</label>
        <input name="username" required />

        <label>Password</label>
        <input type="password" name="password" required />

        <label>Role</label>
        <select name="role">
          <option value="pengelola" selected>pengelola</option>
          <option value="admin">admin</option>
        </select>

        <div style="margin-top:14px;">
          <button class="btn accent" type="submit">Simpan</button>
        </div>
      </form>
    </div>
  </div>
</body>
</html>
