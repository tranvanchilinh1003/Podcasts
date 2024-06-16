-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: localhost
-- Thời gian đã tạo: Th6 11, 2024 lúc 01:48 PM
-- Phiên bản máy phục vụ: 8.0.31
-- Phiên bản PHP: 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `frontend1`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `categories`
--

CREATE TABLE `categories` (
  `id` int NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `categories`
--

INSERT INTO `categories` (`id`, `name`) VALUES
(2, 'Món xào '),
(31, 'Món nướng'),
(32, 'Món Chiên'),
(33, 'Món rán');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `comments`
--

CREATE TABLE `comments` (
  `id` int NOT NULL,
  `rating` int DEFAULT NULL,
  `contents` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `date` date NOT NULL,
  `customers_id` int NOT NULL,
  `post_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `comments`
--

INSERT INTO `comments` (`id`, `rating`, `contents`, `date`, `customers_id`, `post_id`) VALUES
(5, 5, 'aaaaaaaa', '2024-06-06', 9, 68),
(7, 2, 'hihihihhihihhiihi', '2024-06-06', 9, 66),
(8, 5, 'quá hay adddd ơiii', '2024-06-11', 11, 66),
(9, 5, 'Quá hayy', '2024-06-11', 11, 68),
(10, 4, 'tessttt', '2024-06-11', 11, 72);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `customers`
--

CREATE TABLE `customers` (
  `id` int NOT NULL,
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `full_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `role` enum('admin','user') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `gender` tinyint(1) NOT NULL,
  `images` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `isticket` enum('active','inactive') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `otp` int NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `customers`
--

INSERT INTO `customers` (`id`, `username`, `full_name`, `password`, `email`, `role`, `gender`, `images`, `isticket`, `otp`) VALUES
(7, 'admin1234', 'Admin Nè', '$2b$10$G/CY0sJXcuhIEwdJgK7JhuZcuBQ2Rfh0ZuoMYWFOk5wQ8CFtJkEOi', 'linhtvcpc06747@fpt.edu.vn', 'admin', 0, '2024-06-10T14:32:40.898Z.jpg', 'active', 23908),
(9, 'minhminh', 'minh nguyễn', '$2b$10$tvThV2xSte/r/nL19hDyUuhOnSFbaum3UP5GjC9MTMPdnJutpwZqC', 'minhrip9@gmail.com', 'user', 0, '2024-06-06T11:12:14.031Z.jpg', 'active', 97854),
(11, 'linhdark', 'Linh Trần', '$2b$10$a5UR1oMV7DC3GZgVHWI.t.XN4gExzjeGfpNsHtmU6t..TKMqzmqiK', 'chilinh140220@gmail.com', 'user', 0, '2024-06-10T19:21:13.683Z.jpg', 'active', 0),
(12, 'detapgym', 'Đệ Nè', '$2b$10$c6f.BW4QMc1Qm0R5xDGZ6emUHXHQMubPBR0cYOkwsK8tR2n1sosUe', 'denhpc06669@fpt.edu.vn', 'user', 0, '2024-06-10T19:24:42.157Z.jpg', 'active', 0),
(13, 'hieu5tr', 'Hiếu Jack Lỏ', '$2b$10$YSQCyQsnHtLtjypWhcVB9e0io4n2X1lucjwHOLDDN4mRyIlDHUZ.O', 'hieunbpc05555@fpt.edu.vn', 'user', 0, '2024-06-10T19:25:36.819Z.jpg', 'active', 0),
(14, 'admin123', 'dsdasdsas', '$2b$10$pKjuZNTcPODLsy30Qa1FP.vcIKz5r3rbBDVdGCHjqXYGdQHSE0DGy', 'sfsdfd@gmail.com', 'user', 0, '1711556637138-anh_dai_dien.jpg', 'inactive', 0),
(15, 'adasdadas5', 'adasdadas', '$2b$10$c/qz383mnPRwBhLimLbktuAGhsjRjVE55Tb84j5/g3JLwfxwL47eK', 'linh@gmail.com', 'user', 0, '2024-06-11T08:41:46.873Z.jpg', 'active', 0);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `favourite`
--

CREATE TABLE `favourite` (
  `id` int NOT NULL,
  `date` date NOT NULL,
  `customers_id` int NOT NULL,
  `post_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `favourite`
--

INSERT INTO `favourite` (`id`, `date`, `customers_id`, `post_id`) VALUES
(1, '2024-06-11', 12, 73),
(2, '2024-06-11', 13, 66);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `like`
--

CREATE TABLE `like` (
  `id` int NOT NULL,
  `customers_id` int NOT NULL,
  `post_id` int NOT NULL,
  `like` enum('active','inactive') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `post`
--

CREATE TABLE `post` (
  `id` int NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `images` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `audio` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `categories_id` int NOT NULL,
  `customers_id` int NOT NULL,
  `view` int DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `post`
--

INSERT INTO `post` (`id`, `title`, `images`, `audio`, `description`, `categories_id`, `customers_id`, `view`) VALUES
(66, 'Cách làm gà rán đơn giản nhất', '2024-06-10T19:06:00.515Z.jpg', '2024-06-10T19:06:00.515Z.mp3', 'dssdsddsdsds', 33, 9, 0),
(68, 'Gà rán jolybe dai dòn', '2024-06-10T14:38:06.280Z.jpg', '2024-06-10T14:38:06.280Z.mp3', 'aaaaaaaaaaaa', 33, 7, 0),
(71, 'món ngon hôm nay', '2024-06-07T14:37:35.941Z.jpg', '2024-06-07T14:37:35.941Z.mp3', '', 32, 7, 0),
(72, 'Món ngon á ăn nhanh lúc đói', '2024-06-10T16:39:43.258Z.jpg', '2024-06-10T16:39:43.258Z.mp3', 'thức ăn nhanh', 2, 7, 0),
(73, 'Cà chua ráng', '2024-06-10T16:41:32.293Z.jpg', '2024-06-10T16:41:32.293Z.mp3', 'Ăn nhanh kẻo đói à ngen', 33, 7, 0),
(74, 'món món ngon', '2024-06-10T18:51:32.455Z.jpg', '2024-06-10T18:51:32.455Z.mp3', 'không có gì để bình luận cả', 2, 9, 0),
(75, 'Nghe gì để ăn ngon', '2024-06-10T19:51:07.633Z.jpg', '2024-06-10T19:51:07.633Z.mp3', 'Làm kimchi hàn quốc chúng ta cần phải nghe nhạc của sếp thật nhiều để có được món ngon :)))', 32, 7, 0),
(76, 'hiếu thứ hai', '2024-06-11T08:42:34.186Z.jpg', '2024-06-11T08:42:34.186Z.mp3', 'ádasasasaasas', 2, 7, 0);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `share`
--

CREATE TABLE `share` (
  `id` int NOT NULL,
  `date` date NOT NULL,
  `customers_id` int NOT NULL,
  `post_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `share`
--

INSERT INTO `share` (`id`, `date`, `customers_id`, `post_id`) VALUES
(6, '2024-06-11', 12, 66),
(7, '2024-06-12', 11, 73);

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_comments_Customers1_idx` (`customers_id`),
  ADD KEY `fk_comments_Post1_idx` (`post_id`);

--
-- Chỉ mục cho bảng `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `favourite`
--
ALTER TABLE `favourite`
  ADD PRIMARY KEY (`id`),
  ADD KEY `customers_id` (`customers_id`),
  ADD KEY `post_id` (`post_id`);

--
-- Chỉ mục cho bảng `like`
--
ALTER TABLE `like`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_like_Customers1_idx` (`customers_id`),
  ADD KEY `fk_like_Post1_idx` (`post_id`);

--
-- Chỉ mục cho bảng `post`
--
ALTER TABLE `post`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_Post_categories_idx` (`categories_id`),
  ADD KEY `fk_Post_Customers1_idx` (`customers_id`),
  ADD KEY `customers_id` (`customers_id`);

--
-- Chỉ mục cho bảng `share`
--
ALTER TABLE `share`
  ADD PRIMARY KEY (`id`),
  ADD KEY `customers_id` (`customers_id`),
  ADD KEY `post_id` (`post_id`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT cho bảng `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT cho bảng `customers`
--
ALTER TABLE `customers`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT cho bảng `favourite`
--
ALTER TABLE `favourite`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `like`
--
ALTER TABLE `like`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `post`
--
ALTER TABLE `post`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=77;

--
-- AUTO_INCREMENT cho bảng `share`
--
ALTER TABLE `share`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `fk_comments_Customers1` FOREIGN KEY (`customers_id`) REFERENCES `customers` (`id`),
  ADD CONSTRAINT `fk_comments_Post1` FOREIGN KEY (`post_id`) REFERENCES `post` (`id`);

--
-- Các ràng buộc cho bảng `favourite`
--
ALTER TABLE `favourite`
  ADD CONSTRAINT `fk_favourite_Customers1` FOREIGN KEY (`customers_id`) REFERENCES `customers` (`id`),
  ADD CONSTRAINT `fk_favourite_Post1` FOREIGN KEY (`post_id`) REFERENCES `post` (`id`);

--
-- Các ràng buộc cho bảng `like`
--
ALTER TABLE `like`
  ADD CONSTRAINT `fk_like_Customers1` FOREIGN KEY (`customers_id`) REFERENCES `customers` (`id`),
  ADD CONSTRAINT `fk_like_Post1` FOREIGN KEY (`post_id`) REFERENCES `post` (`id`);

--
-- Các ràng buộc cho bảng `post`
--
ALTER TABLE `post`
  ADD CONSTRAINT `fk_Post_categories` FOREIGN KEY (`categories_id`) REFERENCES `categories` (`id`),
  ADD CONSTRAINT `fk_Post_Customers1` FOREIGN KEY (`customers_id`) REFERENCES `customers` (`id`);

--
-- Các ràng buộc cho bảng `share`
--
ALTER TABLE `share`
  ADD CONSTRAINT `share_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `post` (`id`),
  ADD CONSTRAINT `share_ibfk_2` FOREIGN KEY (`customers_id`) REFERENCES `customers` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
