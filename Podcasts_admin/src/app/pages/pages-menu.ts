import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Giới Thiệu',
    group: true,
  },
  {
    title: 'Giới Thiệu',
    icon: 'home-outline',
    link: '/pages/dashboard',
   
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
    title: 'Thống Kê',
    group: true,
  },
  {
    title: 'Bình luận',
    icon: 'message-circle-outline',
    children: [
      {
        title: 'Danh sách',
        icon: 'grid',
        link: '/pages/comment/list',
      },
    ],
  },
  {
    title: 'Khách Hàng',
    icon: 'person-outline',
    children: [
      {
        title: 'Thêm khách hàng',
        link: '/pages/customers/create',
      },
      {
        title: 'Danh sách',
        link: '/pages/customers/list',
      },
    ],
  },
  
];
