-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: localhost
-- Thời gian đã tạo: Th10 08, 2024 lúc 06:03 AM
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
(72, 'Món ăn vặt', '2024-10-18T03:27:47.591Z.jpg', 'Đồ ăn vặt tuy nhỏ nhưng lại là niềm vui cho những lúc thèm thuồng!', '2024-08-05 23:32:20', '2024-10-18 10:47:32'),
(75, 'Món rán', '2024-10-18T03:27:54.154Z.jpg', 'Những món rán mang đến hương vị giòn rụm, đậm đà!', '2024-07-01 23:32:28', '2024-10-18 10:45:18'),
(76, 'Món nướng', '2024-10-18T03:18:31.369Z.jpg', 'Món nướng thơm phức, vàng ươm, mang đến hương vị khó cưỡng!', '2024-08-21 23:32:38', '2024-10-18 10:49:33'),
(77, 'Món xào', '2024-10-18T03:29:58.954Z.jpg', 'Món xào đậm đà, kết hợp hoàn hảo giữa hương vị và màu sắc!', '2024-08-05 23:32:40', '2024-10-18 10:48:39'),
(78, 'Món nước', '2024-10-18T03:42:52.218Z.jpg', 'Món nước mát lành, mang lại sự sảng khoái cho mọi giác quan!', '2024-08-05 23:32:43', '2024-10-18 10:47:46');

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
(26, 5, 'hayyyy', '2024-09-10', 94, 87),
(31, 1, 'hmmmmmmmmmmmmm', '2024-09-24', 94, 87),
(33, 4, '55', '2024-09-25', 7, 85),
(34, 5, 'hayyyy', '2024-10-17', 94, 87);

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
  `update_date` datetime DEFAULT NULL,
  `otp_expires_at` datetime DEFAULT NULL,
  `background` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `customers`
--

INSERT INTO `customers` (`id`, `username`, `full_name`, `password`, `email`, `role`, `gender`, `images`, `isticket`, `otp`, `create_date`, `update_date`, `otp_expires_at`, `background`) VALUES
(7, 'admin1234', 'Admin Nè', '$2b$10$YSQwNFv/yRKBF4XetQaOMO.OHdPr1A.SikV7e2J8DOlkAMSn2JrBu', 'linhtvcpc06747@fpt.edu.vn', 'admin', 0, '2024-08-05T15-33-10-432Z.png', 'active', 54877, '2024-08-06 21:25:24', NULL, '2024-09-24 13:46:56', '2024-11-08T05:23:24.258Z.jpg'),
(66, 'minhminh', 'Nguyễn Phước Minh', '$2b$10$xLlxQhler5kAVWQAyeFznuLEU2Zs1qn/S9.UN7vTaBtahcRORu0Cm', 'minhrip9@gmail.com', 'user', 0, '2024-08-11T13-20-31-959Z.jpg', 'inactive', 0, '2024-08-11 20:20:33', NULL, NULL, NULL),
(78, 'dedede123', 'Nguyễn hoàng đệ', '$2b$10$v4v8IvqvP4ouHGo/9QyYqOiPD8ngndMAJlv2qVLumpztFfqTaE/l2', 'nguyenhoangde470@gmail.com', 'user', 0, '2024-08-13T15-17-09-332Z.jpg', 'inactive', 0, '2024-08-13 22:17:11', NULL, NULL, NULL),
(79, 'nguyenhoangde', 'nguyễn hoàng đệ', '$2b$10$1kGV6kB1yr64XD05X8frvuk8zq/AZy9Hw4vGLwOlO9gPGa1P.KTQq', 'nguyenhoangdexyz@gmail.com', 'user', 0, '2024-08-13T15-18-19-954Z.jpg', 'inactive', 0, '2024-08-13 22:18:21', NULL, NULL, NULL),
(94, 'tranvanchilinh', 'Linhhhhh', '$2b$10$zZVybG08ZkAbQEr1Hreckeef1o4/b59qj5DI/eZ1TQp8C6keYxKli', 'chilinh140220@gmail.com', 'user', 0, '2024-11-08T04-25-44-034Z.jpg', 'active', 92337, '2024-09-10 20:20:47', NULL, '2024-09-24 13:40:24', '2024-11-05T05-07-37-505Z.jpg'),
(95, 'linhzl', 'Trần Văn Chí Linh1', '$2b$10$H83LJsmeoz91TFmyarjXnO2Yes0aBvCh/QFBNnUoU7.4zwCrvGr/m', 'linh123@gmail.com', 'user', 0, 'anh_dai_dien.jpg', 'inactive', 0, '2024-09-24 10:01:15', NULL, NULL, NULL),
(96, 'linhk4', 'linhtran', '$2b$10$kbcVbIzdLnHWg5RJrmtDvO75lRNCZKlLE53JtE6Aog1c6.QRpa2R6', 'linh1234@gmail.com', 'user', 0, 'anh_dai_dien.jpg', 'inactive', 0, '2024-09-24 10:03:20', NULL, NULL, NULL),
(97, 'foodcast', NULL, '$2b$10$7GM9R6r90bUzuR2vOVaOIut5hJR9v0.EsEJGiyDkCBe9gajqVks1e', 'foodcast440@gmail.com', 'user', 0, 'foodcast', 'inactive', 0, '2024-09-30 14:02:38', NULL, NULL, NULL),
(98, '卍ろ玄師', 'hihi', '$2b$10$vaj7N5Th3f5HWY/eByCQLelPv4NsSyBlDxaZ9QWbIZtkIHGS8j9py', 'concubietnoi98@gmail.com', 'user', 0, '2024-10-18T05-31-52-555Z.jpg', 'inactive', 0, '2024-10-18 12:28:18', NULL, NULL, NULL),
(99, 'quyhoathanlong', 'Natsu', '$2b$10$rmeEfrxk/DdA9o7/CfDOLuOQf9DLzKi0u.nQLE9IZfgs9z6NiCl6S', 'manjirokenshi2004@gmail.com', 'user', 0, '2024-10-18T05-31-07-434Z.jpg', 'inactive', 0, '2024-10-18 12:28:45', NULL, NULL, NULL),
(100, 'madragess123', 'Ngô Bảo Hiếu', '$2b$10$8LDdokmWC2Qp2wKoSZheqO7SfzcXZI7JoQXU4KQbLQltdtW6jD9Fu', 'madragess123@gmail.com', 'user', 0, '2024-10-19T02-42-27-669Z.jpg', 'inactive', 0, '2024-10-18 12:33:15', NULL, NULL, NULL),
(101, 'baohieu', 'Ngô Bảo Hiếu', '$2b$10$tHH2P13HkoZdAzaIRVu4QeyDijHB.2PZtfE6eqcf5NQRYhigqJOfS', 'dragoncandyx004@gmail.com', 'user', 0, '18-10-2024.jpg', 'inactive', 0, '2024-10-18 12:35:33', NULL, NULL, '2024-11-08T05:16:36.877Z.jpg'),
(104, 'eastticket', 'EastTicket', '$2b$10$I6uzicleZzAvrr9eihaAIeedpCebSRivN8F74mdBlbefXrpqHYpbO', 'easyticket113@gmail.com', 'user', 0, '05-11-2024_10-00-44.jpg', 'inactive', 0, '2024-11-05 10:00:45', NULL, NULL, 'bg1.jpg');

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
-- Cấu trúc bảng cho bảng `follow`
--

CREATE TABLE `follow` (
  `id` int NOT NULL,
  `follower_id` int NOT NULL,
  `followed_id` int NOT NULL,
  `follow_date` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `follow`
--

INSERT INTO `follow` (`id`, `follower_id`, `followed_id`, `follow_date`) VALUES
(65, 97, 7, '2024-10-02 13:00:15'),
(67, 97, 94, '2024-10-02 13:11:32'),
(69, 96, 7, '2024-10-05 12:36:55'),
(145, 79, 78, '2024-10-18 13:20:42'),
(146, 78, 79, '2024-10-18 13:21:33'),
(147, 78, 66, '2024-10-18 13:22:02'),
(148, 78, 100, '2024-10-18 13:22:18'),
(149, 94, 7, '2024-10-19 11:47:26'),
(150, 94, 97, '2024-10-19 11:47:42'),
(151, 94, 96, '2024-10-19 11:48:14');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `like`
--

CREATE TABLE `like` (
  `id` int NOT NULL,
  `customers_id` int NOT NULL,
  `post_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `like`
--

INSERT INTO `like` (`id`, `customers_id`, `post_id`) VALUES
(128, 7, 85),
(137, 97, 85),
(141, 97, 99),
(145, 96, 97),
(146, 96, 96),
(147, 96, 87),
(148, 96, 85),
(151, 7, 96),
(153, 7, 91),
(154, 7, 99),
(163, 7, 97),
(165, 7, 110),
(166, 7, 110),
(177, 7, 87),
(270, 94, 96),
(301, 94, 97),
(302, 94, 91),
(304, 94, 77),
(307, 94, 88),
(308, 97, 97),
(326, 94, 209),
(335, 94, 85),
(336, 94, 210),
(337, 94, 99),
(339, 94, 87);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `notifications`
--

CREATE TABLE `notifications` (
  `id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `sender_id` int DEFAULT NULL,
  `type` enum('like','follow') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `post_id` int DEFAULT NULL,
  `isread` enum('active','inactive') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `notifications`
--

INSERT INTO `notifications` (`id`, `user_id`, `sender_id`, `type`, `created_at`, `post_id`, `isread`) VALUES
(252, 7, 94, 'like', '2024-10-11 20:26:52', 77, 'active'),
(253, 7, 94, 'like', '2024-10-16 23:08:42', 87, 'active'),
(255, 7, 94, 'follow', '2024-10-16 23:10:46', NULL, 'active'),
(257, 7, 94, 'like', '2024-10-16 23:11:43', 88, 'active'),
(258, 7, 102, 'follow', '2024-10-17 23:18:16', NULL, 'active'),
(261, 97, 94, 'follow', '2024-10-18 21:47:42', NULL, 'active'),
(262, 96, 94, 'follow', '2024-10-18 21:48:14', NULL, 'active'),
(269, 7, 94, 'like', '2024-10-20 22:40:24', 86, 'active'),
(270, 7, 94, 'like', '2024-10-20 22:42:20', 86, 'active'),
(272, 7, 94, 'like', '2024-10-20 23:02:18', 85, 'active'),
(273, 7, 94, 'like', '2024-10-20 23:03:39', 85, 'active'),
(274, 7, 94, 'like', '2024-10-20 23:05:50', 85, 'active'),
(275, 7, 94, 'like', '2024-10-20 23:06:52', 85, 'active'),
(276, 7, 94, 'like', '2024-10-20 23:07:36', 85, 'active'),
(277, 7, 94, 'like', '2024-10-20 23:09:21', 85, 'active'),
(278, 7, 94, 'like', '2024-10-20 23:10:35', 85, 'active'),
(279, 7, 94, 'like', '2024-10-20 23:13:04', 85, 'active'),
(280, 7, 94, 'like', '2024-11-04 19:34:32', 99, 'active'),
(281, 7, 94, 'like', '2024-11-04 22:07:15', 87, 'active');

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
(77, 'Cách làm gà rán đơn giản', '2024-08-05T15:43:41.735Z.jpg', '2024-08-05T15:47:10.700Z.mp3', 'Gà rán là một món ăn phổ biến được yêu thích bởi lớp vỏ ngoài giòn rụm, màu sắc vàng ruộm và hương vị thơm ngon. Với công thức đơn giản này, bạn có thể tự tay chuẩn bị món gà rán ngay tại nhà, đảm bảo rằng món ăn sẽ không chỉ ngon mà còn an toàn và sạch sẽ.', 75, 7, 2, '2024-08-05 23:33:09', NULL),
(78, 'Gà xiên que', '2024-08-05T15:45:30.645Z.jpg', '2024-08-05T15:47:38.076Z.mp3', 'Gà xiên que là một món ăn dễ chế biến, phù hợp cho bữa ăn gia đình hoặc các buổi tiệc ngoài trời. Với những miếng gà thơm lừng, được ướp gia vị đậm đà và nướng trên lửa, gà xiên que mang lại hương vị hấp dẫn và bắt mắt. Hãy cùng khám phá cách làm món gà xiên que đơn giản tại nhà để thưởng thức!', 76, 7, 7, '2024-08-05 23:33:13', NULL),
(79, 'Hamburger ', '2024-08-05T15:49:29.364Z.png', '2024-08-05T15:49:31.519Z.mp3', 'Hamburger là một món ăn phổ biến và dễ làm tại nhà. Với phần thịt bò mềm mại, bánh mì thơm ngon cùng với các loại rau củ tươi mát và sốt đặc biệt, bạn có thể tạo ra những chiếc hamburger hấp dẫn và đúng khẩu vị. Dưới đây là hướng dẫn chi tiết để bạn có thể tự tay chế biến món hamburger ngon miệng ngay tại nhà.', 72, 7, 2, '2024-08-04 23:33:16', NULL),
(80, 'Bún riêu cua', '2024-08-05T15:56:19.884Z.jpg', '2024-08-05T15:56:21.869Z.mp3', 'Bún riêu cua là một món ăn truyền thống nổi tiếng của Việt Nam, đặc biệt với hương vị thơm ngon từ cua đồng, nước dùng thanh nhẹ và sự kết hợp hoàn hảo của các loại rau củ. Món bún này không chỉ ngon miệng mà còn mang lại cảm giác ấm cúng, phù hợp cho những bữa ăn gia đình hoặc những ngày trời se lạnh. Dưới đây là công thức làm bún riêu cua đơn giản mà vẫn giữ được hương vị đặc trưng của món ăn.', 78, 7, 2, '2024-07-15 23:33:20', NULL),
(85, 'Hủ tiếu gõ', '2024-10-18T05:26:43.544Z.jpg', '2024-08-05T16:07:21.866Z.mp3', 'Hủ tiếu là một món ăn truyền thống nổi tiếng của ẩm thực Việt Nam, đặc biệt phổ biến ở miền Nam. Với sợi hủ tiếu mềm mịn, nước dùng trong và thanh, cùng với các thành phần tươi ngon như thịt, tôm, và rau củ, món ăn này chắc chắn sẽ làm hài lòng cả gia đình bạn. Dưới đây là cách làm hủ tiếu đơn giản tại nhà, giúp bạn thưởng thức món ăn đậm đà hương vị ngay tại căn bếp của mình.', 78, 7, 1, '2024-08-05 00:00:00', '2024-10-18 12:26:44'),
(86, 'Mì xào bò', '2024-10-18T04:47:15.179Z.jpg', '2024-10-18T04:47:15.179Z.mp3', 'Mì xào bò là món ăn nhanh gọn và dễ làm, lý tưởng cho những buổi tối bận rộn hoặc khi bạn muốn thưởng thức một bữa ăn ngon miệng mà không mất quá nhiều thời gian. Với hương vị thơm ngon từ thịt bò xào mềm, mì dai và các loại rau củ tươi ngon, món mì xào bò này chắc chắn sẽ làm hài lòng cả gia đình bạn.', 77, 7, 6, '2024-08-05 00:00:00', '2024-10-18 11:47:21'),
(87, 'Mì xào hải sản', '2024-10-18T04:32:46.222Z.jpg', '2024-10-18T04:32:46.222Z.mp3', 'Mì xào hải sản là một món ăn hấp dẫn, kết hợp hương vị tươi ngon của hải sản với sợi mì mềm dai và các loại rau củ tươi mát. Với cách làm đơn giản và nhanh chóng, món ăn này phù hợp cho những buổi tối bận rộn hoặc những dịp bạn muốn thưởng thức một bữa ăn phong phú và đầy đủ dinh dưỡng. Hãy cùng khám phá cách làm mì xào hải sản thơm ngon ngay tại nhà!', 77, 7, 28, '2024-08-05 00:00:00', '2024-10-18 11:32:52'),
(88, 'Cách làm cơm tấm siêu đơn giản', '2024-08-05T16:12:58.556Z.jpg', '2024-08-05T16:13:00.927Z.mp3', 'Cơm tấm, món ăn đậm chất miền Nam, có hương vị độc đáo từ hạt gạo tấm thơm mềm. Để làm món này, cơm tấm được nấu chín, ăn kèm sườn nướng vàng ươm, bì giòn, và chả trứng đậm đà. Thêm chút mỡ hành, đồ chua và nước mắm pha chuẩn vị là bạn đã có ngay một dĩa cơm tấm ngon lành!', 76, 7, 1, '2024-08-05 00:00:00', '2024-10-18 12:54:56'),
(89, 'Cách làm hủ tiếu đơn giản tại nhà', '2024-08-05T16:13:58.123Z.jpg', '2024-08-05T16:14:00.029Z.mp3', 'Hủ tiếu là một món ăn truyền thống của người Việt Nam, nổi tiếng với hương vị đậm đà, hấp dẫn và dễ dàng chinh phục cả những thực khách khó tính nhất. Nếu bạn yêu thích món hủ tiếu nhưng chưa biết làm tại nhà, hãy tham khảo cách làm đơn giản dưới đây để có một tô hủ tiếu thơm ngon, dễ làm mà không cần quá nhiều thời gian và công sức.', 78, 7, 9, '2024-08-05 00:00:00', NULL),
(90, 'Nem rán siêu ngon cực dễ làm', '2024-08-05T16:14:51.083Z.jpg', '2024-08-05T16:14:52.928Z.mp3', 'Nem rán, món ăn truyền thống của Việt Nam, chinh phục thực khách với lớp vỏ giòn rụm và nhân bên trong thơm lừng, đậm đà. Nhân nem được làm từ thịt, mộc nhĩ, miến, và rau củ thái nhỏ, trộn đều rồi cuốn trong bánh đa nem mỏng. Khi chiên lên, nem tỏa mùi hấp dẫn, kết hợp với nước chấm chua ngọt và rau sống, tạo nên hương vị khó quên!', 75, 7, 0, '2024-08-05 00:00:00', '2024-10-18 12:55:19'),
(91, 'Món ngon từ gà', '2024-08-06T05:01:55.374Z.jpg', '2024-08-06T05:01:57.431Z.mp3', 'Gà là nguyên liệu quen thuộc nhưng lại có thể biến tấu thành vô vàn món ngon đầy hấp dẫn. Từ gà chiên giòn rụm, gà nướng đậm đà, đến gà xào ngọt thơm, mỗi món đều mang đến trải nghiệm ẩm thực đa dạng. Hãy cùng khám phá những công thức sáng tạo từ gà để bữa ăn thêm phần phong phú!', 75, 7, 2, '2024-08-06 12:02:00', '2024-10-18 12:54:27'),
(96, 'Món lẩu gà lá é', '2024-09-23T02:34:13.173Z.jpg', '2024-09-23T02:34:13.173Z.mp3', 'Lẩu gà lá é là món ăn đặc sản của miền Trung, nổi bật với hương vị thơm ngon, đậm đà. Nước lẩu thường được ninh từ gà tươi, cùng với các gia vị như hành, tỏi, gừng và đặc biệt là lá é, tạo nên hương vị đặc trưng.  Khi ăn, bạn có thể nhúng các loại rau sống, nấm và bún vào nồi lẩu, khiến món ăn trở nên phong phú và hấp dẫn hơn. Không chỉ ngon miệng, lẩu gà lá é còn có tác dụng thanh mát, rất thích hợp cho những buổi tụ họp cùng bạn bè và gia đình. Nếu bạn yêu thích ẩm thực miền Trung, nhất định không nên bỏ qua món này!', 78, 7, 1, '2024-09-23 09:34:13', NULL),
(97, 'Hột Vịt Lộn', '2024-10-18T05:23:07.115Z.jpg', '2024-09-23T02:37:37.374Z.mp3', ' Hột vịt lộn là món ăn vặt phổ biến ở Việt Nam, đặc biệt là trong các khu chợ hoặc quán vỉa hè. Món này được chế biến từ trứng vịt đã ấp, bên trong chứa phôi vịt đã phát triển, mang lại hương vị độc đáo.  Khi ăn, bạn thường luộc trứng cho đến khi chín vừa tới, rồi bóc vỏ và chấm với muối tiêu chanh hoặc mắm ớt. Hột vịt lộn có vị béo ngậy, kèm theo hương thơm của các gia vị, rất kích thích vị giác. Ngoài ra, món này còn được cho là bổ dưỡng, giúp tăng cường sức khỏe. Nếu bạn muốn thử một món ăn khác lạ, hãy trải nghiệm hột vịt lộn nhé!', 72, 7, 2, '2024-09-23 09:37:37', '2024-10-18 12:23:08'),
(99, 'Cơm Gà Ngon', '2024-10-18T04:46:22.427Z.jpg', '2024-10-18T04:46:22.427Z.mp3', '<p>Cơm g&agrave; l&agrave; m&oacute;n ăn nổi tiếng của Việt Nam, đặc biệt l&agrave; ở miền Trung. M&oacute;n n&agrave;y thường được chế biến từ g&agrave; luộc hoặc g&agrave; x&eacute;, kết hợp với cơm được nấu c&ugrave;ng nước luộc g&agrave; để tạo vị thơm ngon v&agrave; b&eacute;o ngậy.</p>\n<p>Cơm c&oacute; m&agrave;u v&agrave;ng ươm, hạt cơm tơi, mềm, thường được phục vụ c&ugrave;ng với đĩa g&agrave; x&eacute; hoặc nguy&ecirc;n miếng, k&egrave;m theo rau sống v&agrave; dưa leo. Nước chấm đặc biệt thường l&agrave; nước mắm pha chua ngọt, gi&uacute;p tăng th&ecirc;m hương vị cho m&oacute;n ăn.</p>\n<p>Để ho&agrave;n thiện, m&oacute;n cơm g&agrave; c&ograve;n c&oacute; thể k&egrave;m theo c&aacute;c loại gia vị như h&agrave;nh phi, ng&ograve; r&iacute; v&agrave; một ch&uacute;t ớt tươi, mang lại sự h&agrave;i h&ograve;a v&agrave; hấp dẫn. Cảm gi&aacute;c khi thưởng thức cơm g&agrave; l&agrave; sự kết hợp giữa vị ngọt tự nhi&ecirc;n của g&agrave;, độ b&eacute;o của cơm v&agrave; sự tươi m&aacute;t của rau sống, khiến ai cũng kh&oacute; l&ograve;ng qu&ecirc;n!</p>', 75, 7, 1, '2024-09-27 10:16:39', '2024-10-18 11:46:30'),
(202, 'Bánh mì trứng nướng', '2024-10-18T05:57:46.137Z. ', '2024-10-18T05:57:46.137Z.', '<p>Bánh mì trứng, món ăn sáng nhanh gọn nhưng vẫn đầy đủ dinh dưỡng, là lựa chọn yêu thích của nhiều người. Trứng chiên vàng ươm, kẹp trong ổ bánh mì giòn rụm, kết hợp thêm chút rau sống, dưa leo và nước tương hoặc tương ớt. Hương vị đơn giản mà hấp dẫn này mang lại năng lượng cho một ngày mới!</p>', 76, 7, 0, '2024-10-18 12:57:46', NULL),
(203, 'Bò bít tết', '2024-10-18T05:59:17.970Z. ', '2024-10-18T05:59:17.970Z.', '<p>Bò bít tết, món ăn hấp dẫn từ thịt bò thượng hạng, được chế biến một cách tỉ mỉ để giữ nguyên hương vị và độ mềm của thịt. Thịt bò được nướng hoặc chiên tới mức chín vừa, ăn kèm với khoai tây chiên giòn và sốt tiêu đen thơm lừng. Món này không chỉ mang đến sự thỏa mãn cho vị giác mà còn là một bữa ăn sang trọng, phù hợp cho những dịp đặc biệt!</p>', 76, 7, 0, '2024-10-18 12:59:17', NULL),
(204, 'Bạch tuột xào hải sản', '2024-10-18T06:00:32.395Z. ', '2024-10-18T06:00:32.395Z.', '<p>Bạch tuột xào hải sản là món ăn thơm ngon, kết hợp giữa hương vị tươi ngon của bạch tuột và sự phong phú của các loại hải sản khác. Bạch tuột được xào nhanh tay cùng tôm, mực, và rau củ, tạo nên một món ăn hấp dẫn, đậm đà với màu sắc bắt mắt. Món này thường được ăn kèm với cơm trắng hoặc bánh mì, mang lại trải nghiệm ẩm thực thú vị cho người thưởng thức!</p>', 77, 7, 0, '2024-10-18 13:00:32', NULL),
(205, 'Tôm nướng lửa ngọn', '2024-10-18T06:01:53.686Z. ', '2024-10-18T06:01:53.686Z.', '<p>Tôm nướng lửa ngọn là món ăn đơn giản nhưng mang lại hương vị tuyệt vời với tôm tươi ngon, được nướng trên lửa than cho đến khi vỏ ngoài trở nên vàng giòn và thơm phức. Khi nướng, tôm được ướp gia vị vừa miệng, giúp tăng thêm độ đậm đà cho món ăn. Chấm tôm nướng với nước mắm chua ngọt hoặc muối tiêu chanh sẽ khiến bạn không thể cưỡng lại!</p>', 76, 7, 0, '2024-10-18 13:01:53', '2024-10-18 13:11:34'),
(206, 'Bạch tuột nướng sa tế', '2024-10-18T06:02:44.892Z. ', '2024-10-18T06:02:44.892Z.', '<p>Bạch tuột nướng sa tế là món ăn hấp dẫn, kết hợp giữa độ tươi ngon của bạch tuột và hương vị cay nồng đặc trưng của sa tế. Bạch tuột được ướp gia vị với sa tế và các loại gia vị khác trước khi nướng trên lửa than, tạo nên lớp vỏ bên ngoài giòn thơm và bên trong vẫn giữ được độ mềm mại. Món này thường được thưởng thức kèm với rau sống và nước chấm chua ngọt, mang đến trải nghiệm ẩm thực đầy thú vị!</p>', 76, 7, 0, '2024-10-18 13:02:44', NULL),
(207, 'Thịt ba chỉ nướng', '2024-10-18T06:10:26.200Z. ', '2024-10-18T06:10:26.200Z.', '<p>Thịt ba chỉ nướng là món ăn hấp dẫn với lớp mỡ và thịt xen kẽ, mang lại hương vị thơm ngon, béo ngậy. Thịt được ướp gia vị vừa miệng, nướng trên lửa than cho đến khi lớp da bên ngoài giòn rụm và thịt bên trong mềm mại. Món này thường được ăn kèm với rau sống và nước chấm chua ngọt, tạo nên sự cân bằng hoàn hảo giữa vị béo và vị chua, ngọt, làm hài lòng cả những thực khách khó tính nhất!</p>', 76, 7, 0, '2024-10-18 13:10:26', NULL),
(208, 'Món ngon dành cho trẻ em', '1729306285434.jpg', '1729306287166.mp3', '<div class=\"flex-shrink-0 flex flex-col relative items-end\">\n<div>\n<div class=\"pt-0\">\n<div class=\"gizmo-bot-avatar flex h-8 w-8 items-center justify-center overflow-hidden rounded-full\">&nbsp;</div>\n</div>\n</div>\n</div>\n<div class=\"group/conversation-turn relative flex w-full min-w-0 flex-col agent-turn\">\n<div class=\"flex-col gap-1 md:gap-3\">\n<div class=\"flex max-w-full flex-col flex-grow\">\n<div class=\"min-h-8 text-message flex w-full flex-col items-end gap-2 whitespace-normal break-words [.text-message+&amp;]:mt-5\" dir=\"auto\" data-message-author-role=\"assistant\" data-message-id=\"c286d055-a68f-4fd5-a502-d81327d52e0b\" data-message-model-slug=\"gpt-4o-mini\">\n<div class=\"flex w-full flex-col gap-1 empty:hidden first:pt-[3px]\">\n<div class=\"markdown prose w-full break-words dark:prose-invert dark\">\n<p>G&agrave; r&aacute;n gi&ograve;n rụm, thơm phức, được tẩm ướp với gia vị đặc trưng, mang đến hương vị đậm đ&agrave; kh&oacute; qu&ecirc;n. Mỗi miếng g&agrave; đều v&agrave;ng ươm, lớp vỏ ngo&agrave;i gi&ograve;n tan, trong vẫn giữ được độ ẩm v&agrave; mềm mại. Thưởng thức c&ugrave;ng sốt chấm hoặc rau sống, đ&acirc;y chắc chắn l&agrave; m&oacute;n ăn khiến bạn m&ecirc; mẩn ngay từ miếng đầu ti&ecirc;n!</p>\n</div>\n</div>\n</div>\n</div>\n</div>\n</div>', 76, 94, 1, '2024-11-06 09:51:36', NULL);

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

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `share`
--

CREATE TABLE `share` (
  `id` int NOT NULL,
  `date` date NOT NULL,
  `customers_id` int NOT NULL,
  `post_id` int NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `share`
--

INSERT INTO `share` (`id`, `date`, `customers_id`, `post_id`, `title`) VALUES
(28, '2024-09-27', 94, 87, ''),
(29, '2024-09-30', 94, 97, ''),
(31, '2024-09-30', 94, 99, ''),
(34, '2024-09-30', 7, 97, ''),
(35, '2024-09-30', 7, 97, ''),
(36, '2024-10-12', 94, 86, ''),
(37, '2024-10-19', 94, 87, ''),
(38, '2024-11-13', 78, 204, '');

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
-- Chỉ mục cho bảng `follow`
--
ALTER TABLE `follow`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_follow` (`follower_id`,`followed_id`),
  ADD KEY `followed_id` (`followed_id`);

--
-- Chỉ mục cho bảng `like`
--
ALTER TABLE `like`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_like_Customers1_idx` (`customers_id`),
  ADD KEY `fk_like_Post1_idx` (`post_id`);

--
-- Chỉ mục cho bảng `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`);

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
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=88;

--
-- AUTO_INCREMENT cho bảng `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT cho bảng `customers`
--
ALTER TABLE `customers`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=105;

--
-- AUTO_INCREMENT cho bảng `favourite`
--
ALTER TABLE `favourite`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT cho bảng `follow`
--
ALTER TABLE `follow`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=152;

--
-- AUTO_INCREMENT cho bảng `like`
--
ALTER TABLE `like`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=340;

--
-- AUTO_INCREMENT cho bảng `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=282;

--
-- AUTO_INCREMENT cho bảng `post`
--
ALTER TABLE `post`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=218;

--
-- AUTO_INCREMENT cho bảng `repcomments`
--
ALTER TABLE `repcomments`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=139;

--
-- AUTO_INCREMENT cho bảng `share`
--
ALTER TABLE `share`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

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
-- Các ràng buộc cho bảng `follow`
--
ALTER TABLE `follow`
  ADD CONSTRAINT `follow_ibfk_1` FOREIGN KEY (`follower_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `follow_ibfk_2` FOREIGN KEY (`followed_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `like`
--
ALTER TABLE `like`
  ADD CONSTRAINT `fk_like_Customers1` FOREIGN KEY (`customers_id`) REFERENCES `customers` (`id`);

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
