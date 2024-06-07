-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: localhost
-- Thời gian đã tạo: Th5 27, 2024 lúc 02:08 PM
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
(1, 'Đồ nướng'),
(2, 'Món xào '),
(5, 'Món kho');

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
(1, 5, 'Chia sẽ cho thầy', '2024-05-27', 5, 1),
(2, 5, 'Chia sẽ cho thầy 1', '2024-05-27', 5, 1);

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
  `isticket` enum('active','inactive') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `customers`
--

INSERT INTO `customers` (`id`, `username`, `full_name`, `password`, `email`, `role`, `gender`, `images`, `isticket`) VALUES
(1, 'john_doe', 'John Doe', 'securepassword123', 'john.doe@example.com', 'admin', 1, 'https://example.com/image2.jpg', 'inactive'),
(5, 'Hoangde', 'Nguyễn Đệ', 'aaa', 'denhpc066669@fpt.edu.vn', 'admin', 1, 'upload_2024-05-26T08:37:27.719Z.jpg', 'active');

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
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `categories_id` int NOT NULL,
  `customers_id` int NOT NULL,
  `view` int DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `post`
--

INSERT INTO `post` (`id`, `title`, `images`, `audio`, `description`, `categories_id`, `customers_id`, `view`) VALUES
(1, 'Món ăn mỗi ngày', 'âsdasdasdasd', 'sadsdadsd', 'Món ăn ngon ', 5, 5, 0),
(4, 'Món ăn mỗi ngày', 'âsdasdasdasd', 'sadsdadsd', 'Món ăn ngon ', 5, 5, 0),
(5, 'Món ăn mỗi ngày', 'âsdasdasdasd', 'sadsdadsd', 'Món ăn ngon ', 5, 5, 0);

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
  ADD KEY `fk_favourite_Customers1_idx` (`customers_id`),
  ADD KEY `fk_favourite_Post1_idx` (`post_id`);

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
  ADD UNIQUE KEY `post_id` (`post_id`),
  ADD KEY `fk_share_Customers1_idx` (`customers_id`),
  ADD KEY `fk_share_Post1_idx` (`post_id`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT cho bảng `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `customers`
--
ALTER TABLE `customers`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT cho bảng `favourite`
--
ALTER TABLE `favourite`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `like`
--
ALTER TABLE `like`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `post`
--
ALTER TABLE `post`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT cho bảng `share`
--
ALTER TABLE `share`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

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
  ADD CONSTRAINT `fk_share_Customers1` FOREIGN KEY (`customers_id`) REFERENCES `customers` (`id`),
  ADD CONSTRAINT `fk_share_Post1` FOREIGN KEY (`post_id`) REFERENCES `post` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
