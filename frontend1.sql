-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: localhost
-- Thời gian đã tạo: Th8 17, 2024 lúc 01:14 PM
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
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `images` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `create_date` datetime DEFAULT NULL,
  `update_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `categories`
--

INSERT INTO `categories` (`id`, `name`, `images`, `description`, `create_date`, `update_date`) VALUES
(72, 'Món ăn vặt', '2024-08-05T15:41:43.861Z.jpg', '', '2024-08-05 23:32:20', NULL),
(75, 'Món rán', '2024-08-05T15:40:53.581Z.jpg', '', '2024-07-01 23:32:28', NULL),
(76, 'Món nướng', '2024-08-05T15:41:08.925Z.jpg', '', '2024-08-21 23:32:38', NULL),
(77, 'Món xào', '2024-08-05T15:38:50.101Z.jpg', '', '2024-08-05 23:32:40', NULL),
(78, 'Món nước', '2024-08-05T15:38:30.036Z.jpg', '', '2024-08-05 23:32:43', NULL),
(82, 'tesstttttt', '2024-08-14T07-23-55-503Z.jpg', '', '2024-08-14 14:23:56', NULL);

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
(14, NULL, 'mon nay ngon', '2024-08-16', 7, 88),
(15, NULL, 'mon nay ngon', '2024-08-16', 7, 88),
(22, 5, 'hayyyyy', '2024-08-14', 82, 89);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `customers`
--

CREATE TABLE `customers` (
  `id` int NOT NULL,
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `full_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `role` enum('admin','user') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `gender` tinyint(1) DEFAULT NULL,
  `images` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `isticket` enum('active','inactive') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `otp` int NOT NULL DEFAULT '0',
  `create_date` datetime DEFAULT NULL,
  `update_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `customers`
--

INSERT INTO `customers` (`id`, `username`, `full_name`, `password`, `email`, `role`, `gender`, `images`, `isticket`, `otp`, `create_date`, `update_date`) VALUES
(7, 'admin1234', 'Admin Nè', '$2b$10$HfdG8WpH0zvlNtgOenLcreoxhFQs7yqbtSxbKbQ2VdBsJY/s1dfL6', 'linhtvcpc06747@fpt.edu.vn', 'admin', 0, '2024-08-05T15-33-10-432Z.png', 'active', 83455, '2024-08-06 21:25:24', NULL),
(66, 'minhminh', 'Nguyễn Phước Minh', '$2b$10$xLlxQhler5kAVWQAyeFznuLEU2Zs1qn/S9.UN7vTaBtahcRORu0Cm', 'minhrip9@gmail.com', 'user', 0, '2024-08-11T13-20-31-959Z.jpg', 'active', 0, '2024-08-11 20:20:33', NULL),
(78, 'dedede123', 'Nguyễn hoàng đệ', '$2b$10$v4v8IvqvP4ouHGo/9QyYqOiPD8ngndMAJlv2qVLumpztFfqTaE/l2', 'nguyenhoangde470@gmail.com', 'user', 0, '2024-08-13T15-17-09-332Z.jpg', 'active', 0, '2024-08-13 22:17:11', NULL),
(79, 'nguyenhoangde', 'nguyễn hoàng đệ', '$2b$10$1kGV6kB1yr64XD05X8frvuk8zq/AZy9Hw4vGLwOlO9gPGa1P.KTQq', 'nguyenhoangdexyz@gmail.com', 'user', 0, '2024-08-13T15-18-19-954Z.jpg', 'active', 0, '2024-08-13 22:18:21', NULL),
(82, 'linhdark', NULL, '$2b$10$tla.bqFEpdFV1F/s2.B.1ORFEBzBQEfiiXl9U8ZbByV7yQsamWkD6', 'chilinh140220@gmail.com', 'user', NULL, 'trần văn chí linh', NULL, 0, '2024-08-14 14:32:05', NULL);

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
(6, '2024-08-14', 82, 89);

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
  `view` int DEFAULT '0',
  `create_date` datetime DEFAULT NULL,
  `update_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `post`
--

INSERT INTO `post` (`id`, `title`, `images`, `audio`, `description`, `categories_id`, `customers_id`, `view`, `create_date`, `update_date`) VALUES
(77, 'Cách làm gà rán đơn giản', '2024-08-05T15:43:41.735Z.jpg', '2024-08-05T15:47:10.700Z.mp3', 'Gà rán là một món ăn phổ biến được yêu thích bởi lớp vỏ ngoài giòn rụm, màu sắc vàng ruộm và hương vị thơm ngon. Với công thức đơn giản này, bạn có thể tự tay chuẩn bị món gà rán ngay tại nhà, đảm bảo rằng món ăn sẽ không chỉ ngon mà còn an toàn và sạch sẽ.', 75, 7, 0, '2024-08-05 23:33:09', NULL),
(78, 'Gà xiên que', '2024-08-05T15:45:30.645Z.jpg', '2024-08-05T15:47:38.076Z.mp3', 'Gà xiên que là một món ăn dễ chế biến, phù hợp cho bữa ăn gia đình hoặc các buổi tiệc ngoài trời. Với những miếng gà thơm lừng, được ướp gia vị đậm đà và nướng trên lửa, gà xiên que mang lại hương vị hấp dẫn và bắt mắt. Hãy cùng khám phá cách làm món gà xiên que đơn giản tại nhà để thưởng thức!', 76, 7, 0, '2024-08-05 23:33:13', NULL),
(79, 'Hamburger ', '2024-08-05T15:49:29.364Z.png', '2024-08-05T15:49:31.519Z.mp3', 'Hamburger là một món ăn phổ biến và dễ làm tại nhà. Với phần thịt bò mềm mại, bánh mì thơm ngon cùng với các loại rau củ tươi mát và sốt đặc biệt, bạn có thể tạo ra những chiếc hamburger hấp dẫn và đúng khẩu vị. Dưới đây là hướng dẫn chi tiết để bạn có thể tự tay chế biến món hamburger ngon miệng ngay tại nhà.', 72, 7, 0, '2024-08-04 23:33:16', NULL),
(80, 'Bún riêu cua', '2024-08-05T15:56:19.884Z.jpg', '2024-08-05T15:56:21.869Z.mp3', 'Bún riêu cua là một món ăn truyền thống nổi tiếng của Việt Nam, đặc biệt với hương vị thơm ngon từ cua đồng, nước dùng thanh nhẹ và sự kết hợp hoàn hảo của các loại rau củ. Món bún này không chỉ ngon miệng mà còn mang lại cảm giác ấm cúng, phù hợp cho những bữa ăn gia đình hoặc những ngày trời se lạnh. Dưới đây là công thức làm bún riêu cua đơn giản mà vẫn giữ được hương vị đặc trưng của món ăn.', 78, 7, 0, '2024-07-15 23:33:20', NULL),
(85, 'Hủ tiếu', '2024-08-05T16:07:19.107Z.jpg', '2024-08-05T16:07:21.866Z.mp3', 'Hủ tiếu là một món ăn truyền thống nổi tiếng của ẩm thực Việt Nam, đặc biệt phổ biến ở miền Nam. Với sợi hủ tiếu mềm mịn, nước dùng trong và thanh, cùng với các thành phần tươi ngon như thịt, tôm, và rau củ, món ăn này chắc chắn sẽ làm hài lòng cả gia đình bạn. Dưới đây là cách làm hủ tiếu đơn giản tại nhà, giúp bạn thưởng thức món ăn đậm đà hương vị ngay tại căn bếp của mình.', 78, 7, 0, '2024-08-05 00:00:00', NULL),
(86, 'Mì xào bò', '2024-08-05T16:10:35.591Z.jpg', '2024-08-05T16:10:37.977Z.mp3', 'Mì xào bò là món ăn nhanh gọn và dễ làm, lý tưởng cho những buổi tối bận rộn hoặc khi bạn muốn thưởng thức một bữa ăn ngon miệng mà không mất quá nhiều thời gian. Với hương vị thơm ngon từ thịt bò xào mềm, mì dai và các loại rau củ tươi ngon, món mì xào bò này chắc chắn sẽ làm hài lòng cả gia đình bạn.', 77, 7, 6, '2024-08-05 00:00:00', NULL),
(87, 'Mì xào hải sản', '2024-08-05T16:11:45.852Z.jpg', '2024-08-05T16:11:48.031Z.mp3', 'Mì xào hải sản là một món ăn hấp dẫn, kết hợp hương vị tươi ngon của hải sản với sợi mì mềm dai và các loại rau củ tươi mát. Với cách làm đơn giản và nhanh chóng, món ăn này phù hợp cho những buổi tối bận rộn hoặc những dịp bạn muốn thưởng thức một bữa ăn phong phú và đầy đủ dinh dưỡng. Hãy cùng khám phá cách làm mì xào hải sản thơm ngon ngay tại nhà!', 77, 7, 1, '2024-08-05 00:00:00', NULL),
(88, 'Cách làm cơm tắm siêu đơn giản', '2024-08-05T16:12:58.556Z.jpg', '2024-08-05T16:13:00.927Z.mp3', '', 76, 7, 0, '2024-08-05 00:00:00', NULL),
(89, 'Cách làm hủ tiếu đơn giản tại nhà', '2024-08-05T16:13:58.123Z.jpg', '2024-08-05T16:14:00.029Z.mp3', 'Hủ tiếu là một món ăn truyền thống của người Việt Nam, nổi tiếng với hương vị đậm đà, hấp dẫn và dễ dàng chinh phục cả những thực khách khó tính nhất. Nếu bạn yêu thích món hủ tiếu nhưng chưa biết làm tại nhà, hãy tham khảo cách làm đơn giản dưới đây để có một tô hủ tiếu thơm ngon, dễ làm mà không cần quá nhiều thời gian và công sức.', 78, 7, 8, '2024-08-05 00:00:00', NULL),
(90, 'Nem rán siêu ngon cực dễ làm', '2024-08-05T16:14:51.083Z.jpg', '2024-08-05T16:14:52.928Z.mp3', '', 75, 7, 0, '2024-08-05 00:00:00', NULL),
(91, 'Món ngon từ gà', '2024-08-06T05:01:55.374Z.jpg', '2024-08-06T05:01:57.431Z.mp3', '', 75, 7, 0, '2024-08-06 12:02:00', NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `repcomments`
--

CREATE TABLE `repcomments` (
  `id` int NOT NULL,
  `contents` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `date` datetime NOT NULL,
  `customers_id` int NOT NULL,
  `original_comment_id` int DEFAULT NULL,
  `parent_reply_id` int DEFAULT NULL,
  `level` int DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `repcomments`
--

INSERT INTO `repcomments` (`id`, `contents`, `date`, `customers_id`, `original_comment_id`, `parent_reply_id`, `level`) VALUES
(133, 'Chắc ko bro', '2024-08-13 21:59:06', 67, 21, NULL, 0),
(134, 'Hmmmm', '2024-08-13 22:07:29', 7, 21, 133, 1),
(135, 'aaaa', '2024-08-14 14:32:34', 82, 22, NULL, 0),
(137, 'aaaa', '2024-08-14 14:32:51', 82, 22, NULL, 0);

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
(12, '2024-08-14', 82, 89);

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
-- Chỉ mục cho bảng `repcomments`
--
ALTER TABLE `repcomments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `customers_id` (`customers_id`),
  ADD KEY `original_comment_id` (`original_comment_id`),
  ADD KEY `parent_reply_id` (`parent_reply_id`);

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
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=83;

--
-- AUTO_INCREMENT cho bảng `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT cho bảng `customers`
--
ALTER TABLE `customers`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=83;

--
-- AUTO_INCREMENT cho bảng `favourite`
--
ALTER TABLE `favourite`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT cho bảng `like`
--
ALTER TABLE `like`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `post`
--
ALTER TABLE `post`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=96;

--
-- AUTO_INCREMENT cho bảng `repcomments`
--
ALTER TABLE `repcomments`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=138;

--
-- AUTO_INCREMENT cho bảng `share`
--
ALTER TABLE `share`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

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
-- Các ràng buộc cho bảng `repcomments`
--
ALTER TABLE `repcomments`
  ADD CONSTRAINT `repcomments_ibfk_2` FOREIGN KEY (`parent_reply_id`) REFERENCES `repcomments` (`id`);

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
