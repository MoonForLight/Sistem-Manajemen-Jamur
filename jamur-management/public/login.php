<?php
declare(strict_types=1);
require __DIR__ . "/../config/app.php";
require __DIR__ . "/../config/db.php";
require __DIR__ . "/../config/auth.php";

$error = "";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  require_csrf();

  $username = trim((string)($_POST['username'] ?? ''));
  $password = (string)($_POST['password'] ?? '');

  if ($username === '' || $password === '') {
    $error = "Username dan password wajib diisi.";
  } else {
    $stmt = $pdo->prepare("SELECT id, name, username, password_hash, role, status FROM users WHERE username = ? LIMIT 1");
    $stmt->execute([$username]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user['password_hash'])) {
      $error = "Username atau password salah.";
    } elseif ($user['status'] !== 'active') {
      $error = "Akun kamu nonaktif. Hubungi admin.";
    } else {
      $_SESSION['user'] = [
        'id' => (int)$user['id'],
        'name' => $user['name'],
        'username' => $user['username'],
        'role' => $user['role'],
      ];

      log_activity($pdo, (int)$user['id'], "LOGIN", "User login sebagai {$user['role']}.");

      if ($user['role'] === 'admin') {
        header("Location: " . url("admin/dashboard.php"));
      } else {
        header("Location: " . url("pengelola/dashboard.php"));
      }
      exit;
    }
  }
}
?>
<!doctype html>
<html lang="id">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Login - JamurManager</title>
  <link rel="stylesheet" href="<?= e(url('assets/style.css')) ?>" />
</head>
<body>
  <div class="nav">
    <div class="brand">🍄 JamurManager</div>
    <a class="btn" href="<?= e(url('index.php')) ?>">Kembali</a>
  </div>

  <div class="container" style="max-width:520px;">
    <div class="card">
      <h2 style="margin:0 0 6px;">Login</h2>
      <p class="p" style="margin-top:0;">Masuk sebagai admin atau pengelola jamur.</p>

      <?php if ($error): ?>
        <div class="card" style="border-color:rgba(255,90,95,.35); background:rgba(255,90,95,.08);">
          <?= e($error) ?>
        </div>
      <?php endif; ?>

      <form method="post" style="margin-top:10px;">
        <input type="hidden" name="csrf" value="<?= e(csrf_token()) ?>" />

        <label>Username</label>
        <input name="username" autocomplete="username" />

        <label>Password</label>
        <input type="password" name="password" autocomplete="current-password" />

        <div style="display:flex; gap:10px; margin-top:14px;">
          <button class="btn accent" type="submit">Masuk</button>
          <a class="btn" href="<?= e(url('index.php#edukasi')) ?>">Baca edukasi</a>
        </div>

        <p class="p" style="margin-top:14px;">
          Default admin (kalau sudah dibuat): <b>admin</b> / <b>admin123</b>
        </p>
      </form>
    </div>
  </div>
</body>
</html>
