import type { ShopCategory, ShopInfoCard } from './shop.models';

export const SHOP_ALL_CATEGORY: ShopCategory = {
  id: 'all',
  label: 'All products',
};

export const SHOP_INFO_CARDS: ShopInfoCard[] = [
  {
    title: 'Shipping',
    description:
      'Tracked delivery across Europe, with dispatch updates and insured handling on larger orders.',
    note: '2-5 business days',
  },
  {
    title: 'Payments',
    description:
      'Secure checkout flow with cards, PayPal, Apple Pay, Google Pay, and local wallet support.',
    note: 'Encrypted checkout',
  },
  {
    title: 'Returns',
    description:
      'Returns accepted on unworn pieces and unopened printed matter within fourteen days of delivery.',
    note: '14 day returns',
  },
];
