import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, of, type Observable } from 'rxjs';
import type { ShopProduct } from './shop.models';

interface DummyJsonProduct {
  readonly id: number;
  readonly title: string;
  readonly description: string;
  readonly category: string;
  readonly price: number;
  readonly stock: number;
  readonly sku?: string;
  readonly brand?: string;
  readonly availabilityStatus?: string;
  readonly thumbnail: string;
  readonly images?: readonly string[];
  readonly tags?: readonly string[];
}

interface DummyJsonProductsResponse {
  readonly products: readonly DummyJsonProduct[];
  readonly total: number;
  readonly skip: number;
  readonly limit: number;
}

const PRODUCT_ACCENTS: readonly ShopProduct['accent'][] = ['cyan', 'lime', 'amber'];
const PRODUCT_BADGES = ['Latest', 'Edition', 'Core', 'Limited', 'Seasonal'] as const;

@Injectable({ providedIn: 'root' })
export class ShopCatalogService {
  private readonly http = inject(HttpClient);

  getProducts(): Observable<readonly ShopProduct[]> {
    const select = [
      'id',
      'title',
      'description',
      'category',
      'price',
      'stock',
      'sku',
      'brand',
      'availabilityStatus',
      'thumbnail',
      'images',
      'tags',
    ].join(',');

    return this.http
      .get<DummyJsonProductsResponse>(`https://dummyjson.com/products?limit=0&select=${select}`)
      .pipe(
        map((response) =>
          response.products.map((product, index) => this.mapProduct(product, index)),
        ),
        catchError(() => of([])),
      );
  }

  private mapProduct(product: DummyJsonProduct, index: number): ShopProduct {
    return {
      id: product.id.toString(),
      sku: product.sku || `DJ-${product.id.toString().padStart(3, '0')}`,
      title: product.title,
      category: product.category,
      categoryLabel: this.formatCategoryLabel(product.category),
      description: product.description,
      priceCents: Math.round(product.price * 100),
      status: this.mapStatus(product.availabilityStatus, product.stock),
      accent: PRODUCT_ACCENTS[index % PRODUCT_ACCENTS.length],
      badge: PRODUCT_BADGES[index % PRODUCT_BADGES.length],
      imageUrl: product.thumbnail,
      imageAlt: `${product.title}${product.brand ? ` by ${product.brand}` : ''}`,
      tags: product.tags?.length ? product.tags : [product.category, 'dummyjson'],
    };
  }

  private mapStatus(availabilityStatus: string | undefined, stock: number): ShopProduct['status'] {
    if (stock <= 0) {
      return 'Sold out';
    }

    if (availabilityStatus === 'Low Stock' || stock <= 7) {
      return 'Low stock';
    }

    if (availabilityStatus === 'In Stock') {
      return 'In stock';
    }

    return 'Preorder';
  }

  private formatCategoryLabel(category: string): string {
    return category
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }
}
