<?php
declare(strict_types=1);
require __DIR__ . "/../../config/app.php";
require __DIR__ . "/../../config/db.php";
require __DIR__ . "/../../config/auth.php";
require_role('pengelola');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  header("Location: " . url("pengelola/dashboard.php"));
  exit;
}

require_csrf();

$user = current_user();

$jenis = trim((string)($_POST['jenis_jamur'] ?? ''));
$batch = trim((string)($_POST['batch'] ?? ''));
$suhu  = (string)($_POST['suhu'] ?? '');
$kelembaban = (string)($_POST['kelembaban'] ?? '');
$tahap = trim((string)($_POST['tahap_perkembangan'] ?? ''));
$catatan = trim((string)($_POST['catatan'] ?? ''));

if ($jenis === '' || $batch === '' || $suhu === '' || $tahap === '') {
  http_response_code(400);
  exit("Data wajib tidak lengkap.");
}

$suhuVal = (float)$suhu;
$humVal = ($kelembaban === '') ? null : (float)$kelembaban;

$stmt = $pdo->prepare("
  INSERT INTO mushroom_records (user_id, jenis_jamur, batch, suhu, kelembaban, tahap_perkembangan, catatan)
  VALUES (?, ?, ?, ?, ?, ?, ?)
");
$stmt->execute([
  (int)$user['id'],
  $jenis,
  $batch,
  $suhuVal,
  $humVal,
  $tahap,
  $catatan === '' ? null : $catatan
]);

log_activity(
  $pdo,
  (int)$user['id'],
  "CREATE_RECORD",
  "Input data: {$jenis} | {$batch} | Suhu {$suhuVal}°C | Tahap {$tahap}"
);

header("Location: " . url("pengelola/dashboard.php"));
exit;
