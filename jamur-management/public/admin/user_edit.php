<?php
declare(strict_types=1);
require __DIR__ . "/../../config/app.php";
require __DIR__ . "/../../config/db.php";
require __DIR__ . "/../../config/auth.php";
require_role('admin');

$id = (int)($_GET['id'] ?? 0);
$stmt = $pdo->prepare("SELECT id,name,username,role,status FROM users WHERE id=?");
$stmt->execute([$id]);
$u = $stmt->fetch();
if (!$u) { http_response_code(404); exit("User tidak ditemukan."); }

$error = "";
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  require_csrf();

  $name = trim((string)($_POST['name'] ?? ''));
  $role = (string)($_POST['role'] ?? $u['role']);
  $password = (string)($_POST['password'] ?? '');

  if ($name==='') {
    $error = "Nama wajib diisi.";
  } elseif (!in_array($role, ['admin','pengelola'], true)) {
    $error = "Role tidak valid.";
  } else {
    $pdo->beginTransaction();
    try {
      $stmt = $pdo->prepare("UPDATE users SET name=?, role=? WHERE id=?");
      $stmt->execute([$name, $role, $id]);

      if ($password !== '') {
        $hash = password_hash($password, PASSWORD_DEFAULT);
        $stmt = $pdo->prepare("UPDATE users SET password_hash=? WHERE id=?");
        $stmt->execute([$hash, $id]);
      }

      $pdo->commit();
      log_activity($pdo, (int)current_user()['id'], "UPDATE_USER", "Update user {$u['username']} (id: {$id}).");

      header("Location: " . url("admin/user.php"));
      exit;
    } catch (Throwable $e) {
      $pdo->rollBack();
      $error = "Gagal update user.";
    }
  }
}
?>
<!doctype html>
<html lang="id">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Edit User</title>
  <link rel="stylesheet" href="<?= e(url('assets/style.css')) ?>" />
</head>
<body>
  <div class="nav">
    <div class="brand">✏️ Edit User</div>
    <a class="btn" href="<?= e(url('admin/user.php')) ?>">Kembali</a>
  </div>

  <div class="container" style="max-width:620px;">
    <div class="card">
      <h2 style="margin:0 0 6px;">Edit: <?= e($u['username']) ?></h2>
      <?php if ($error): ?>
        <div class="card" style="border-color:rgba(255,90,95,.35); background:rgba(255,90,95,.08);">
          <?= e($error) ?>
        </div>
      <?php endif; ?>

      <form method="post">
        <input type="hidden" name="csrf" value="<?= e(csrf_token()) ?>" />

        <label>Nama</label>
        <input name="name" value="<?= e($u['name']) ?>" required />

        <label>Role</label>
        <select name="role">
          <option value="pengelola" <?= $u['role']==='pengelola'?'selected':'' ?>>pengelola</option>
          <option value="admin" <?= $u['role']==='admin'?'selected':'' ?>>admin</option>
        </select>

        <label>Password Baru (opsional)</label>
        <input type="password" name="password" placeholder="Isi jika ingin reset password" />

        <div style="margin-top:14px;">
          <button class="btn accent" type="submit">Simpan Perubahan</button>
        </div>
      </form>
    </div>
  </div>
</body>
</html>
