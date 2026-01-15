<?php
// config/app.php
// Ubah BASE_URL jika folder project kamu berbeda.
// Contoh dari screenshot kamu: http://localhost/jamur-management/public/
// maka BASE_URL = "/jamur-management/public"

declare(strict_types=1);

$BASE_URL = "/jamur-management/public";

/**
 * Membuat URL absolut berdasarkan BASE_URL.
 * Contoh: url('login.php') -> /jamur-management/public/login.php
 */
function url(string $path = ""): string {
  global $BASE_URL;
  $base = rtrim($BASE_URL, "/");
  $path = ltrim($path, "/");
  return $path === "" ? $base : $base . "/" . $path;
}
