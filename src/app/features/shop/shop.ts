import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SHOP_ALL_CATEGORY, SHOP_INFO_CARDS } from './shop.content';
import { NgxSkeletonLoaderComponent } from 'ngx-skeleton-loader';
import { ShopCatalogService } from './shop-catalog.service';
import type { ShopCategory, ShopProduct } from './shop.models';

interface CartState {
  readonly [productId: string]: number;
}

@Component({
  selector: 'app-shop',
  imports: [NgxSkeletonLoaderComponent],
  templateUrl: './shop.html',
  styleUrl: './shop.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Shop {
  private readonly shopCatalogService = inject(ShopCatalogService);

  readonly products = toSignal(this.shopCatalogService.getProducts(), {
    initialValue: undefined,
  });
  readonly infoCards = SHOP_INFO_CARDS;
  readonly productsPerPage = 12;
  readonly categories = computed<readonly ShopCategory[]>(() => [
    SHOP_ALL_CATEGORY,
    ...Array.from(
      new Map(
        this.loadedProducts()
          .map((product) => ({
            id: product.category,
            label: product.categoryLabel,
          }))
          .sort((first, second) => first.label.localeCompare(second.label))
          .map((category) => [category.id, category]),
      ).values(),
    ),
  ]);

  readonly selectedCategory = signal(SHOP_ALL_CATEGORY.id);
  readonly currentPage = signal(1);
  readonly cart = signal<CartState>({});
  readonly isLoading = computed(() => this.products() === undefined);
  readonly loadedProducts = computed(() => this.products() ?? []);
  readonly hasLoadedProducts = computed(() => this.loadedProducts().length > 0);

  readonly heroPrimaryProduct = computed<ShopProduct | null>(
    () => this.loadedProducts()[0] ?? null,
  );
  readonly heroSecondaryProduct = computed<ShopProduct | null>(
    () => this.loadedProducts()[1] ?? null,
  );

  readonly filteredProducts = computed(() => {
    const selectedCategory = this.selectedCategory();
    const products = this.loadedProducts();

    if (selectedCategory === SHOP_ALL_CATEGORY.id) {
      return products;
    }

    return products.filter((product) => product.category === selectedCategory);
  });

  readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.filteredProducts().length / this.productsPerPage)),
  );

  readonly visiblePage = computed(() => Math.min(this.currentPage(), this.totalPages()));

  readonly paginatedProducts = computed(() => {
    const page = this.visiblePage();
    const start = (page - 1) * this.productsPerPage;
    return this.filteredProducts().slice(start, start + this.productsPerPage);
  });

  readonly pageNumbers = computed(() =>
    Array.from({ length: this.totalPages() }, (_, index) => index + 1),
  );

  readonly pageStart = computed(() => {
    if (this.filteredProducts().length === 0) {
      return 0;
    }

    return (this.visiblePage() - 1) * this.productsPerPage + 1;
  });

  readonly pageEnd = computed(() =>
    Math.min(this.visiblePage() * this.productsPerPage, this.filteredProducts().length),
  );

  readonly cartEntries = computed(() =>
    this.loadedProducts()
      .map((product) => ({
        product,
        quantity: this.quantityFor(product.id),
      }))
      .filter((entry) => entry.quantity > 0),
  );

  readonly cartCount = computed(() =>
    this.cartEntries().reduce((total, entry) => total + entry.quantity, 0),
  );

  readonly subtotalCents = computed(() =>
    this.cartEntries().reduce(
      (total, entry) => total + entry.product.priceCents * entry.quantity,
      0,
    ),
  );

  readonly shippingCents = computed(() => {
    const subtotal = this.subtotalCents();

    if (subtotal === 0 || subtotal >= 6000) {
      return 0;
    }

    return 900;
  });

  readonly totalCents = computed(() => this.subtotalCents() + this.shippingCents());

  setCategory(categoryId: string): void {
    this.selectedCategory.set(categoryId);
    this.currentPage.set(1);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages()) {
      return;
    }

    this.currentPage.set(page);
  }

  nextPage(): void {
    this.goToPage(this.visiblePage() + 1);
  }

  previousPage(): void {
    this.goToPage(this.visiblePage() - 1);
  }

  addToCart(productId: string): void {
    this.cart.update((cart) => ({
      ...cart,
      [productId]: (cart[productId] ?? 0) + 1,
    }));
  }

  increment(productId: string): void {
    this.addToCart(productId);
  }

  decrement(productId: string): void {
    this.cart.update((cart) => {
      const quantity = cart[productId] ?? 0;

      if (quantity <= 1) {
        const { [productId]: _, ...rest } = cart;
        return rest;
      }

      return {
        ...cart,
        [productId]: quantity - 1,
      };
    });
  }

  remove(productId: string): void {
    this.cart.update((cart) => {
      const { [productId]: _, ...rest } = cart;
      return rest;
    });
  }

  quantityFor(productId: string): number {
    return this.cart()[productId] ?? 0;
  }

  categoryCount(categoryId: string): string {
    if (categoryId === SHOP_ALL_CATEGORY.id) {
      return this.formatCount(this.loadedProducts().length);
    }

    return this.formatCount(
      this.loadedProducts().filter((product) => product.category === categoryId).length,
    );
  }

  formatPrice(priceCents: number): string {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 2,
    }).format(priceCents / 100);
  }

  private formatCount(count: number): string {
    return count.toString().padStart(2, '0');
  }
}
