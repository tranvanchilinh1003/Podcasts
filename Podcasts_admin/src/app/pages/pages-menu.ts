import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Trang chủ',
    group: true,
  },
  {
    title: 'Trang chủ',
    icon: 'home-outline',
    link: '/pages',
   
  },
  {
    title: 'Quản Lý',
    group: true,
  },
  {
    title: 'Loại',
    icon: 'bookmark-outline',
    children: [
      {
        title: 'Thêm mới',
        icon: 'plus-circle',
        link: '/pages/categories/create',
      },
      {
        title: 'Danh sách',
        icon: 'grid',
        link: '/pages/categories/list',
      },
    ],
  },
  {
    title: 'Khách hàng',
    icon: 'person-outline',
    children: [
      {
        title: 'Thêm',
        icon: 'plus-circle',
        link: '/pages/customers/create',
      },
      {
        title: 'Danh sách',
        icon: 'grid',
        link: '/pages/customers/list',
        
      },
    ],
    
  },
  {
    title: 'Bài đăng',
    icon: 'book-outline',
    children: [
      {
        title: 'Thêm',
        icon: 'plus-circle',
        link: '/pages/post/create',
      },
      {
        title: 'Danh sách',
        icon: 'grid',
        link: '/pages/post/list',
      },
    ],
  },
  {
    title: 'Thống Kê',
    group: true,
  },
  {
    title: 'Bình luận',
    icon: 'message-circle-outline',
    link: '/pages/comment/list',
  },
  {
    title: 'Chia sẻ',
    icon: 'share',
    link: '/pages/shares/list',
  },
  {
    title: 'Yêu thích',
    icon: 'heart-outline',
    link: '/pages/favourite/list',
  },

  
];
