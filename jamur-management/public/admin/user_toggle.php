<?php
declare(strict_types=1);
require __DIR__ . "/../../config/app.php";
require __DIR__ . "/../../config/db.php";
require __DIR__ . "/../../config/auth.php";
require_role('admin');

$id = (int)($_GET['id'] ?? 0);
$stmt = $pdo->prepare("SELECT id, username, status FROM users WHERE id=?");
$stmt->execute([$id]);
$u = $stmt->fetch();
if (!$u) { http_response_code(404); exit("User tidak ditemukan."); }

$newStatus = $u['status'] === 'active' ? 'inactive' : 'active';
$stmt = $pdo->prepare("UPDATE users SET status=? WHERE id=?");
$stmt->execute([$newStatus, $id]);

log_activity($pdo, (int)current_user()['id'], "TOGGLE_USER", "Ubah status {$u['username']} menjadi {$newStatus}.");

header("Location: " . url("admin/user.php"));
exit;
