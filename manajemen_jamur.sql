-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 13, 2026 at 07:44 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `manajemen_jamur`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `id_user` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`id_user`) VALUES
(2);

-- --------------------------------------------------------

--
-- Table structure for table `budidaya`
--

CREATE TABLE `budidaya` (
  `id_budidaya` int(11) NOT NULL,
  `id_petugas` int(11) NOT NULL,
  `id_lokasi` int(11) NOT NULL,
  `id_jenis` int(11) NOT NULL,
  `id_media` int(11) NOT NULL,
  `tanggal_mulai` date NOT NULL,
  `tanggal_selesai` date DEFAULT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'aktif',
  `jumlah_rak` int(11) NOT NULL DEFAULT 1,
  `target_lingkungan_harian` tinyint unsigned NOT NULL DEFAULT 2,
  `target_pertumbuhan_harian` tinyint unsigned NOT NULL DEFAULT 2,
  `alasan_selesai` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `budidaya`
--

INSERT INTO `budidaya` (`id_budidaya`, `id_petugas`, `id_lokasi`, `id_jenis`, `id_media`, `tanggal_mulai`, `status`, `jumlah_rak`, `alasan_selesai`) VALUES
(1, 3, 1, 1, 1, '2026-01-01', 'aktif', 1, NULL),
(2, 4, 3, 1, 1, '2026-05-01', 'inisiasi', 4, NULL),
(3, 4, 3, 3, 3, '2026-05-01', 'inisiasi', 6, NULL),
(4, 4, 3, 6, 1, '2026-05-01', 'aktif', 4, NULL),
(5, 5, 4, 1, 1, '2026-05-01', 'aktif', 4, NULL),
(6, 3, 1, 5, 5, '2026-04-01', 'aktif', 6, NULL),
(7, 3, 1, 5, 2, '2026-06-13', 'aktif', 5, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `download_logs`
--

CREATE TABLE `download_logs` (
  `id_log` int(11) NOT NULL,
  `nama` varchar(150) NOT NULL,
  `email` varchar(150) NOT NULL,
  `instansi` varchar(150) NOT NULL,
  `tujuan` text NOT NULL,
  `tanggal_download` datetime DEFAULT current_timestamp(),
  `tipe_laporan` varchar(100) NOT NULL,
  `bulan` varchar(7) DEFAULT NULL,
  `id_budidaya` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jenis_jamur`
--

CREATE TABLE `jenis_jamur` (
  `id_jenis` int(11) NOT NULL,
  `nama_jamur` varchar(100) NOT NULL,
  `genus` varchar(100) DEFAULT NULL,
  `suhu_optimal` decimal(5,2) DEFAULT NULL,
  `kelembapan_optimal` decimal(5,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `jenis_jamur`
--

INSERT INTO `jenis_jamur` (`id_jenis`, `nama_jamur`, `genus`, `suhu_optimal`, `kelembapan_optimal`) VALUES
(1, 'Portobello', 'Agaricus', 24.00, 85.00),
(2, 'Jamur Tiram Putih', 'Pleurotus ostreatus', 26.00, 85.00),
(3, 'Jamur Tiram Coklat', 'Pleurotus cystidiosus', 27.00, 85.00),
(4, 'Jamur Merang', 'Volvariella volvacea', 32.00, 90.00),
(5, 'Jamur Kancing', 'Agaricus bisporus', 18.00, 85.00),
(6, 'Jamur Shiitake', 'Lentinula edodes', 20.00, 80.00),
(7, 'Jamur Kuping', 'Auricularia auricula', 28.00, 90.00);

-- --------------------------------------------------------

--
-- Table structure for table `lingkungan_harian`
--

CREATE TABLE `lingkungan_harian` (
  `id_lingkungan` int(11) NOT NULL,
  `id_budidaya` int(11) NOT NULL,
  `id_petugas` int(11) NOT NULL,
  `tanggal_pengukuran` date NOT NULL,
  `suhu` decimal(5,2) DEFAULT NULL,
  `kelembaban` decimal(5,2) DEFAULT NULL,
  `intensitas_cahaya` decimal(10,2) DEFAULT NULL,
  `waktu_pengukuran` varchar(20) DEFAULT 'Pagi',
  `foto` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `lingkungan_harian`
--

INSERT INTO `lingkungan_harian` (`id_lingkungan`, `id_budidaya`, `id_petugas`, `tanggal_pengukuran`, `suhu`, `kelembaban`, `intensitas_cahaya`, `waktu_pengukuran`) VALUES
(1, 1, 3, '2026-03-06', 24.50, 84.00, 120.00, 'Pagi'),
(2, 3, 4, '2026-05-01', 24.00, 80.00, 300.00, 'Pagi'),
(3, 2, 4, '2026-05-01', 26.00, 78.50, 350.00, 'Pagi'),
(4, 4, 4, '2026-05-01', 24.00, 80.00, 300.00, 'Pagi'),
(5, 4, 4, '2026-05-01', 26.00, 80.00, 350.00, 'Pagi'),
(6, 4, 4, '2026-05-01', 24.00, 80.00, 300.00, 'Pagi'),
(7, 4, 4, '2026-05-01', 80.00, 10.00, 10.00, 'Pagi'),
(8, 4, 4, '2026-05-01', 25.00, 9.90, 10.00, 'Pagi'),
(9, 5, 5, '2026-05-01', 25.00, 85.00, 299.90, 'Pagi'),
(10, 6, 3, '2026-04-01', 25.40, 80.00, 150.00, 'Pagi'),
(11, 6, 3, '2026-04-02', 24.50, 82.00, 200.00, 'Pagi'),
(12, 6, 3, '2026-04-03', 24.20, 85.00, 220.00, 'Pagi'),
(13, 6, 3, '2026-04-04', 23.80, 88.00, 250.00, 'Pagi'),
(14, 6, 3, '2026-04-05', 24.50, 84.00, 240.00, 'Pagi'),
(16, 1, 3, '2026-04-06', 25.50, 82.00, 260.00, 'Pagi'),
(17, 1, 3, '2026-04-07', 24.80, 85.00, 280.00, 'Pagi'),
(18, 1, 3, '2026-04-08', 24.20, 86.00, 300.00, 'Pagi'),
(19, 1, 3, '2026-04-09', 26.00, 75.00, 150.00, 'Pagi'),
(20, 1, 3, '2026-04-10', 26.50, 72.00, 120.00, 'Pagi'),
(21, 1, 3, '2026-04-11', 27.00, 68.00, 100.00, 'Pagi'),
(22, 1, 3, '2026-04-12', 26.80, 70.00, 100.00, 'Pagi'),
(23, 1, 3, '2026-04-13', 26.20, 75.00, 120.00, 'Pagi'),
(24, 1, 3, '2026-04-14', 25.80, 78.00, 150.00, 'Pagi'),
(25, 1, 3, '2026-04-15', 25.50, 80.00, 180.00, 'Pagi'),
(26, 1, 3, '2026-04-16', 25.50, 82.00, 200.00, 'Pagi'),
(27, 1, 3, '2026-04-17', 24.80, 82.00, 200.00, 'Pagi'),
(28, 1, 3, '2026-04-18', 25.00, 84.00, 240.00, 'Pagi'),
(29, 1, 3, '2026-04-19', 24.50, 86.00, 250.00, 'Pagi'),
(30, 1, 3, '2026-06-11', 24.00, 88.00, 280.00, 'Pagi'),
(31, 1, 3, '2026-04-21', 23.50, 90.00, 300.00, 'Pagi'),
(32, 1, 3, '2026-04-22', 24.20, 85.00, 290.00, 'Pagi'),
(33, 1, 3, '2026-04-23', 24.50, 84.00, 300.00, 'Pagi'),
(34, 1, 3, '2026-04-24', 23.80, 88.00, 320.00, 'Pagi'),
(35, 1, 3, '2026-04-25', 26.00, 75.00, 150.00, 'Pagi'),
(36, 1, 3, '2026-04-26', 26.50, 70.00, 100.00, 'Pagi'),
(37, 1, 3, '2026-04-27', 26.80, 68.00, 80.00, 'Pagi'),
(38, 1, 3, '2026-04-28', 27.00, 65.00, 80.00, 'Pagi'),
(39, 1, 3, '2026-04-29', 26.50, 68.00, 100.00, 'Pagi'),
(40, 1, 3, '0000-00-00', 25.80, 75.00, 150.00, 'Pagi'),
(41, 1, 3, '2026-04-20', 24.00, 88.00, 320.00, 'Pagi'),
(42, 1, 3, '2026-04-30', 25.80, 75.00, 150.00, 'Pagi');

-- --------------------------------------------------------

--
-- Table structure for table `lokasi`
--

CREATE TABLE `lokasi` (
  `id_lokasi` int(11) NOT NULL,
  `nama_lokasi` varchar(100) NOT NULL,
  `alamat` text DEFAULT NULL,
  `jumlah_rak` int(11) NOT NULL DEFAULT 0,
  `keterangan` text DEFAULT NULL,
  `foto_lokasi` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `lokasi`
--

INSERT INTO `lokasi` (`id_lokasi`, `nama_lokasi`, `alamat`, `jumlah_rak`, `keterangan`, `foto_lokasi`) VALUES
(1, 'Rumah Jamur Sembalun', 'Sembalun Bumbung', 12, 'Lokasi utama', 'image-1779240278018-375220947.jpeg'),
(2, 'Rumah Jamur Sandik', 'Lombok Barat', 6, 'Lokasi kedua', NULL),
(3, 'Percobaan', 'Sembalun Lawang', 12, NULL, NULL),
(4, 'Sembalun 2', 'Sembalun Bumbung', 12, '-', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `media_tanam`
--

CREATE TABLE `media_tanam` (
  `id_media` int(11) NOT NULL,
  `nama_media` varchar(100) NOT NULL,
  `kadar_air_optimal` decimal(5,2) DEFAULT NULL,
  `catatan` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `media_tanam`
--

INSERT INTO `media_tanam` (`id_media`, `nama_media`, `kadar_air_optimal`, `catatan`) VALUES
(1, 'Kompos Jerami', 80.00, 'Fermentasi 17-20 hari, makin lama makin bagus'),
(2, 'Serbuk Gergaji Kayu Albasia', 60.00, 'Sangat baik untuk pertumbuhan miselium jamur tiram'),
(3, 'Jerami Padi', 65.00, 'Bagus untuk jamur merang, perlu fermentasi terlebih dahulu'),
(4, 'Kompos Campuran', 65.00, 'Cocok untuk jamur kancing, butuh pasteurisasi ketat'),
(5, 'Serbuk Gergaji + Bekatul', 62.00, 'Nutrisi tinggi untuk jamur kuping dan shiitake'),
(6, 'Kapas Limbah Tekstil', 65.00, 'Alternatif untuk jamur merang dengan masa panen cepat');

-- --------------------------------------------------------

--
-- Table structure for table `panen`
--

CREATE TABLE `panen` (
  `id_panen` int(11) NOT NULL,
  `id_budidaya` int(11) NOT NULL,
  `id_petugas` int(11) NOT NULL,
  `tanggal_panen` date NOT NULL,
  `jumlah_panen` decimal(10,2) NOT NULL,
  `catatan` text DEFAULT NULL,
  `foto` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `panen`
--

INSERT INTO `panen` (`id_panen`, `id_budidaya`, `id_petugas`, `tanggal_panen`, `jumlah_panen`, `catatan`) VALUES
(1, 1, 3, '2026-03-10', 3.50, 'Panen pertama'),
(2, 4, 4, '2026-05-01', 1.00, NULL),
(3, 4, 4, '2026-05-01', 3.00, NULL),
(4, 1, 3, '2026-04-24', 250.00, 'Kualitas premium, diameter tudung lebar'),
(5, 1, 3, '2026-04-28', 500.00, 'Panen kedua');

-- --------------------------------------------------------

--
-- Table structure for table `pertumbuhan`
--

CREATE TABLE `pertumbuhan` (
  `id_pertumbuhan` int(11) NOT NULL,
  `id_budidaya` int(11) NOT NULL,
  `id_petugas` int(11) NOT NULL,
  `tanggal_pengamatan` date NOT NULL,
  `fase` varchar(100) DEFAULT NULL,
  `catatan` text DEFAULT NULL,
  `detail_fase` text DEFAULT NULL,
  `foto` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pertumbuhan`
--

INSERT INTO `pertumbuhan` (`id_pertumbuhan`, `id_budidaya`, `id_petugas`, `tanggal_pengamatan`, `fase`, `catatan`, `detail_fase`, `foto`) VALUES
(4, 1, 3, '2026-03-06', 'inkubasi', 'Stabil', NULL, NULL),
(5, 2, 4, '2026-05-01', 'Inkubasi', NULL, NULL, NULL),
(6, 3, 4, '2026-05-01', 'Inkubasi', NULL, NULL, NULL),
(7, 2, 4, '2026-05-01', 'Inkubasi', NULL, NULL, NULL),
(8, 4, 4, '2026-05-01', 'Inkubasi', NULL, NULL, NULL),
(9, 4, 4, '2026-05-01', 'Inkubasi', NULL, NULL, NULL),
(10, 4, 4, '2026-05-01', 'Panen', NULL, NULL, NULL),
(11, 5, 5, '2026-05-01', 'Panen', NULL, NULL, NULL),
(12, 1, 3, '2026-05-20', 'Pinhead', NULL, NULL, NULL),
(13, 1, 3, '2026-04-01', 'Inkubasi', 'Baglog Portobello mulai diinkubasi di ruang gelap', NULL, NULL),
(14, 1, 3, '2026-04-05', 'Inkubasi', 'Miselium tumbuh merata menyelimuti media', NULL, NULL),
(15, 1, 3, '2026-04-11', 'Pinhead', 'sudah muncul kepala jamur', NULL, NULL),
(16, 1, 3, '2026-04-11', 'Pinhead', 'Suhu diturunkan ke 18°C', NULL, NULL),
(17, 1, 3, '2026-04-15', 'Pinhead', 'Bakal pinhead kecil mulai muncul di permukaan', NULL, NULL),
(18, 1, 3, '2026-04-18', 'Pembesaran', 'Tudung jamur Portobello mulai terbentuk melebar', NULL, NULL),
(19, 1, 3, '2026-04-25', 'Panen', 'Panen Pertama', NULL, NULL),
(20, 1, 3, '2026-04-24', 'Panen', 'Panen Pertama', NULL, NULL),
(21, 1, 3, '2026-06-11', 'Panen', NULL, NULL, NULL),
(22, 1, 3, '2026-04-25', 'Panen', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `petugas`
--

CREATE TABLE `petugas` (
  `id_user` int(11) NOT NULL,
  `id_lokasi` int(11) DEFAULT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'aktif'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `petugas`
--

INSERT INTO `petugas` (`id_user`, `id_lokasi`, `status`) VALUES
(3, 1, 'aktif'),
(4, 3, 'aktif'),
(5, 4, 'aktif');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id_user` int(11) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `foto_profil` varchar(255) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `no_hp` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id_user`, `nama`, `username`, `password`, `foto_profil`, `email`, `no_hp`) VALUES
(2, 'Admin', 'admin1', '$2b$10$Gnhc8HvjZheFI/4dhLT40u6oLqnHmNUguz8Z.EjD1nJQv8idlatj2', NULL, NULL, NULL),
(3, 'Aldi', 'petugas1', '$2b$10$HMkKQorm5.KPgTflehyvT.wCEsAhS8wfwwg9dMKn6TxA8Vh.H98Da', 'image-1779242023615-8187026.png', 'aldigagahh@gmail.com', '081917718779'),
(4, 'M. Wahyu Hilal Abroor', 'wahyuabrr', '$2b$10$ovRyUrPKr9SwOMd3.YIzrug/TTdj5/MqJGEs0.R769jbah1t8n7FG', NULL, NULL, NULL),
(5, 'wahyu abroor', 'wahyu', '$2b$10$oqpFWZv3sm0XIbHw6DWy6ukPRW7k1EPpnSSw7b5cai8WM0TJlAfQO', NULL, NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id_user`);

--
-- Indexes for table `budidaya`
--
ALTER TABLE `budidaya`
  ADD PRIMARY KEY (`id_budidaya`),
  ADD KEY `id_petugas` (`id_petugas`),
  ADD KEY `id_lokasi` (`id_lokasi`),
  ADD KEY `id_jenis` (`id_jenis`),
  ADD KEY `id_media` (`id_media`);

--
-- Indexes for table `download_logs`
--
ALTER TABLE `download_logs`
  ADD PRIMARY KEY (`id_log`);

--
-- Indexes for table `jenis_jamur`
--
ALTER TABLE `jenis_jamur`
  ADD PRIMARY KEY (`id_jenis`);

--
-- Indexes for table `lingkungan_harian`
--
ALTER TABLE `lingkungan_harian`
  ADD PRIMARY KEY (`id_lingkungan`),
  ADD KEY `fk_lingkungan_budidaya_idx` (`id_budidaya`),
  ADD KEY `fk_lingkungan_petugas_idx` (`id_petugas`);

--
-- Indexes for table `lokasi`
--
ALTER TABLE `lokasi`
  ADD PRIMARY KEY (`id_lokasi`);

--
-- Indexes for table `media_tanam`
--
ALTER TABLE `media_tanam`
  ADD PRIMARY KEY (`id_media`);

--
-- Indexes for table `panen`
--
ALTER TABLE `panen`
  ADD PRIMARY KEY (`id_panen`),
  ADD KEY `id_budidaya` (`id_budidaya`),
  ADD KEY `id_petugas` (`id_petugas`);

--
-- Indexes for table `pertumbuhan`
--
ALTER TABLE `pertumbuhan`
  ADD PRIMARY KEY (`id_pertumbuhan`),
  ADD KEY `id_budidaya` (`id_budidaya`),
  ADD KEY `fk_pertumbuhan_petugas` (`id_petugas`);

--
-- Indexes for table `petugas`
--
ALTER TABLE `petugas`
  ADD PRIMARY KEY (`id_user`),
  ADD KEY `petugas_ibfk_2` (`id_lokasi`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id_user`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `budidaya`
--
ALTER TABLE `budidaya`
  MODIFY `id_budidaya` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `download_logs`
--
ALTER TABLE `download_logs`
  MODIFY `id_log` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jenis_jamur`
--
ALTER TABLE `jenis_jamur`
  MODIFY `id_jenis` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `lingkungan_harian`
--
ALTER TABLE `lingkungan_harian`
  MODIFY `id_lingkungan` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT for table `lokasi`
--
ALTER TABLE `lokasi`
  MODIFY `id_lokasi` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `media_tanam`
--
ALTER TABLE `media_tanam`
  MODIFY `id_media` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `panen`
--
ALTER TABLE `panen`
  MODIFY `id_panen` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `pertumbuhan`
--
ALTER TABLE `pertumbuhan`
  MODIFY `id_pertumbuhan` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `admin`
--
ALTER TABLE `admin`
  ADD CONSTRAINT `admin_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `budidaya`
--
ALTER TABLE `budidaya`
  ADD CONSTRAINT `budidaya_ibfk_1` FOREIGN KEY (`id_petugas`) REFERENCES `petugas` (`id_user`) ON UPDATE CASCADE,
  ADD CONSTRAINT `budidaya_ibfk_2` FOREIGN KEY (`id_lokasi`) REFERENCES `lokasi` (`id_lokasi`) ON UPDATE CASCADE,
  ADD CONSTRAINT `budidaya_ibfk_3` FOREIGN KEY (`id_jenis`) REFERENCES `jenis_jamur` (`id_jenis`) ON UPDATE CASCADE,
  ADD CONSTRAINT `budidaya_ibfk_4` FOREIGN KEY (`id_media`) REFERENCES `media_tanam` (`id_media`) ON UPDATE CASCADE;

--
-- Constraints for table `lingkungan_harian`
--
ALTER TABLE `lingkungan_harian`
  ADD CONSTRAINT `fk_lingkungan_budidaya` FOREIGN KEY (`id_budidaya`) REFERENCES `budidaya` (`id_budidaya`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_lingkungan_petugas` FOREIGN KEY (`id_petugas`) REFERENCES `users` (`id_user`) ON UPDATE CASCADE;

--
-- Constraints for table `panen`
--
ALTER TABLE `panen`
  ADD CONSTRAINT `panen_ibfk_1` FOREIGN KEY (`id_budidaya`) REFERENCES `budidaya` (`id_budidaya`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `panen_ibfk_2` FOREIGN KEY (`id_petugas`) REFERENCES `petugas` (`id_user`) ON UPDATE CASCADE;

--
-- Constraints for table `pertumbuhan`
--
ALTER TABLE `pertumbuhan`
  ADD CONSTRAINT `fk_pertumbuhan_petugas` FOREIGN KEY (`id_petugas`) REFERENCES `petugas` (`id_user`) ON UPDATE CASCADE,
  ADD CONSTRAINT `pertumbuhan_ibfk_1` FOREIGN KEY (`id_budidaya`) REFERENCES `budidaya` (`id_budidaya`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `petugas`
--
ALTER TABLE `petugas`
  ADD CONSTRAINT `petugas_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `petugas_ibfk_2` FOREIGN KEY (`id_lokasi`) REFERENCES `lokasi` (`id_lokasi`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
