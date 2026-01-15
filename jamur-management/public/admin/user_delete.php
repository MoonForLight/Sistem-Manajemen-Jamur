<?php
declare(strict_types=1);
require __DIR__ . "/../../config/app.php";
require __DIR__ . "/../../config/db.php";
require __DIR__ . "/../../config/auth.php";
require_role('admin');

$id = (int)($_GET['id'] ?? 0);
$stmt = $pdo->prepare("SELECT id, username, role FROM users WHERE id=?");
$stmt->execute([$id]);
$u = $stmt->fetch();
if (!$u) { http_response_code(404); exit("User tidak ditemukan."); }

if ($u['role'] === 'admin') {
  exit("Tidak disarankan menghapus admin lewat menu ini.");
}

$stmt = $pdo->prepare("DELETE FROM users WHERE id=?");
$stmt->execute([$id]);

log_activity($pdo, (int)current_user()['id'], "DELETE_USER", "Menghapus user {$u['username']} (id: {$id}).");

header("Location: " . url("admin/user.php"));
exit;
