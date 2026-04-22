export interface ShopCategory {
  readonly id: string;
  readonly label: string;
}

export interface ShopProduct {
  readonly id: string;
  readonly sku: string;
  readonly title: string;
  readonly category: string;
  readonly categoryLabel: string;
  readonly description: string;
  readonly priceCents: number;
  readonly status: 'In stock' | 'Low stock' | 'Preorder' | 'Sold out';
  readonly accent: 'cyan' | 'lime' | 'amber';
  readonly badge: string;
  readonly imageUrl: string;
  readonly imageAlt: string;
  readonly tags: readonly string[];
}

export interface ShopInfoCard {
  readonly title: string;
  readonly description: string;
  readonly note: string;
}
