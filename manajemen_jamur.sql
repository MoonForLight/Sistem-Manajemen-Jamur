-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 05, 2026 at 07:53 PM
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
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id_user` int(11) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id_user`, `nama`, `username`, `password`) VALUES
(2, 'Admin', 'admin1', '$2b$10$Gnhc8HvjZheFI/4dhLT40u6oLqnHmNUguz8Z.EjD1nJQv8idlatj2'),
(3, 'Aldi', 'petugas1', '$2b$10$7.T07LB0h1/lLFNrE7EaueBMtcNEkIQ1TShXzVvlkURfcij3qfRvW');

--
-- Indexes for dumped tables
--

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
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `id_admin` int(11) NOT NULL AUTO_INCREMENT,
  `id_user` int(11) NOT NULL,
  PRIMARY KEY (`id_admin`),
  UNIQUE KEY `idx_admin_user` (`id_user`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Table structure for table `petugas`
--

CREATE TABLE `petugas` (
  `id_petugas` int(11) NOT NULL AUTO_INCREMENT,
  `id_user` int(11) NOT NULL,
  `id_lokasi` int(11) DEFAULT NULL,
  `status` varchar(50) NOT NULL,
  PRIMARY KEY (`id_petugas`),
  UNIQUE KEY `idx_petugas_user` (`id_user`),
  KEY `fk_petugas_lokasi_idx` (`id_lokasi`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Table structure for table `lokasi`
--

CREATE TABLE `lokasi` (
  `id_lokasi` int(11) NOT NULL AUTO_INCREMENT,
  `nama_lokasi` varchar(150) NOT NULL,
  `alamat` varchar(255) DEFAULT NULL,
  `jumlah_rak` int(11) NOT NULL DEFAULT 0,
  `keterangan` text DEFAULT NULL,
  PRIMARY KEY (`id_lokasi`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Table structure for table `jenis_jamur`
--

CREATE TABLE `jenis_jamur` (
  `id_jenis` int(11) NOT NULL AUTO_INCREMENT,
  `nama_jamur` varchar(100) NOT NULL,
  `genus` varchar(100) DEFAULT NULL,
  `suhu_optimal` decimal(5,2) DEFAULT NULL,
  `kelembapan_optimal` decimal(5,2) DEFAULT NULL,
  PRIMARY KEY (`id_jenis`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Table structure for table `media_tanam`
--

CREATE TABLE `media_tanam` (
  `id_media` int(11) NOT NULL AUTO_INCREMENT,
  `nama_media` varchar(150) NOT NULL,
  `kadar_air_optimal` decimal(5,2) DEFAULT NULL,
  `catatan` text DEFAULT NULL,
  PRIMARY KEY (`id_media`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Table structure for table `budidaya`
--

CREATE TABLE `budidaya` (
  `id_budidaya` int(11) NOT NULL AUTO_INCREMENT,
  `id_lokasi` int(11) NOT NULL,
  `id_jenis` int(11) NOT NULL,
  `id_media` int(11) NOT NULL,
  `id_petugas` int(11) NOT NULL,
  `tanggal_mulai` date DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id_budidaya`),
  KEY `fk_budidaya_lokasi_idx` (`id_lokasi`),
  KEY `fk_budidaya_jenis_idx` (`id_jenis`),
  KEY `fk_budidaya_media_idx` (`id_media`),
  KEY `fk_budidaya_petugas_idx` (`id_petugas`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Table structure for table `pertumbuhan`
--

CREATE TABLE `pertumbuhan` (
  `id_pertumbuhan` int(11) NOT NULL AUTO_INCREMENT,
  `id_budidaya` int(11) NOT NULL,
  `id_petugas` int(11) NOT NULL,
  `tanggal_pengamatan` date DEFAULT NULL,
  `fase` varchar(100) DEFAULT NULL,
  `suhu` decimal(5,2) DEFAULT NULL,
  `kelembaban` decimal(5,2) DEFAULT NULL,
  `intensitas_cahaya` decimal(5,2) DEFAULT NULL,
  `catatan` text DEFAULT NULL,
  PRIMARY KEY (`id_pertumbuhan`),
  KEY `fk_pertumbuhan_budidaya_idx` (`id_budidaya`),
  KEY `fk_pertumbuhan_petugas_idx` (`id_petugas`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Table structure for table `panen`
--

CREATE TABLE `panen` (
  `id_panen` int(11) NOT NULL AUTO_INCREMENT,
  `id_budidaya` int(11) NOT NULL,
  `id_petugas` int(11) NOT NULL,
  `tanggal_panen` date DEFAULT NULL,
  `jumlah_panen` int(11) DEFAULT NULL,
  `catatan` text DEFAULT NULL,
  PRIMARY KEY (`id_panen`),
  KEY `fk_panen_budidaya_idx` (`id_budidaya`),
  KEY `fk_panen_petugas_idx` (`id_petugas`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`id_user`) VALUES
(2);

--
-- Dumping data for table `petugas`
--

INSERT INTO `petugas` (`id_user`, `id_lokasi`, `status`) VALUES
(3, 1, 'aktif');

--
-- Dumping data for table `lokasi`
--

INSERT INTO `lokasi` (`nama_lokasi`, `alamat`, `jumlah_rak`, `keterangan`) VALUES
('Sembalun', 'Lombok, NTB', 12, 'Lokasi budidaya utama yang digunakan untuk demo.');

--
-- Dumping data for table `jenis_jamur`
--

INSERT INTO `jenis_jamur` (`nama_jamur`, `genus`, `suhu_optimal`, `kelembapan_optimal`) VALUES
('Tiram', 'Pleurotus ostreatus', 25.00, 85.00);

--
-- Dumping data for table `media_tanam`
--

INSERT INTO `media_tanam` (`nama_media`, `kadar_air_optimal`, `catatan`) VALUES
('Serbuk Kayu', 65.00, 'Media tanam standar untuk budidaya tiram.');

--
-- Dumping data for table `budidaya`
--

INSERT INTO `budidaya` (`id_lokasi`, `id_jenis`, `id_media`, `id_petugas`, `tanggal_mulai`, `status`) VALUES
(1, 1, 1, 3, '2026-04-15', 'aktif');

--
-- Foreign keys
--

ALTER TABLE `admin`
  ADD CONSTRAINT `fk_admin_user` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `petugas`
  ADD CONSTRAINT `fk_petugas_user` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_petugas_lokasi` FOREIGN KEY (`id_lokasi`) REFERENCES `lokasi` (`id_lokasi`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `budidaya`
  ADD CONSTRAINT `fk_budidaya_lokasi` FOREIGN KEY (`id_lokasi`) REFERENCES `lokasi` (`id_lokasi`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_budidaya_jenis` FOREIGN KEY (`id_jenis`) REFERENCES `jenis_jamur` (`id_jenis`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_budidaya_media` FOREIGN KEY (`id_media`) REFERENCES `media_tanam` (`id_media`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_budidaya_petugas` FOREIGN KEY (`id_petugas`) REFERENCES `users` (`id_user`) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `pertumbuhan`
  ADD CONSTRAINT `fk_pertumbuhan_budidaya` FOREIGN KEY (`id_budidaya`) REFERENCES `budidaya` (`id_budidaya`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_pertumbuhan_petugas` FOREIGN KEY (`id_petugas`) REFERENCES `users` (`id_user`) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `panen`
  ADD CONSTRAINT `fk_panen_budidaya` FOREIGN KEY (`id_budidaya`) REFERENCES `budidaya` (`id_budidaya`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_panen_petugas` FOREIGN KEY (`id_petugas`) REFERENCES `users` (`id_user`) ON DELETE RESTRICT ON UPDATE CASCADE;

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
