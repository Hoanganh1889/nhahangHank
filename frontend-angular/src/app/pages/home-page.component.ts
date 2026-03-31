import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { FoodService } from '../services/food.service';
import { Food } from '../types';
import { resolveImageUrl } from '../utils';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, CurrencyPipe],
  template: `
    <section class="hero">
      <div class="hero-copy">
        <span class="eyebrow">Tinh hoa ẩm thực hiện đại</span>
        <h1>Thực đơn tuyển chọn cho trải nghiệm đặt món chuyên nghiệp</h1>
        <p>
          Giao diện đã được làm lại theo phong cách cửa hàng cao cấp: rõ ràng, sang trọng,
          tập trung vào món ăn và chuyển đổi đặt hàng.
        </p>
      </div>

      <div class="hero-panel">
        <div>
          <strong>{{ foods().length }}</strong>
          <span>Món đang hiển thị</span>
        </div>
        <div>
          <strong>{{ categoryOptions().length }}</strong>
          <span>Danh mục khả dụng</span>
        </div>
        <div>
          <strong>24h</strong>
          <span>Nhận đơn trực tuyến</span>
        </div>
      </div>
    </section>

    <section class="filter-bar">
      <label class="field">
        <span>Tìm món</span>
        <input
          type="text"
          placeholder="Ví dụ: Bò nướng, mì Ý..."
          [(ngModel)]="search"
          (ngModelChange)="onFiltersChanged()"
        />
      </label>

      <label class="field">
        <span>Danh mục</span>
        <select [(ngModel)]="category" (ngModelChange)="onFiltersChanged()">
          <option value="">Tất cả danh mục</option>
          @for (option of categoryOptions(); track option) {
            <option [value]="option">{{ option }}</option>
          }
        </select>
      </label>

      <label class="field">
        <span>Sắp xếp</span>
        <select [(ngModel)]="sort" (ngModelChange)="onFiltersChanged()">
          <option value="">Mặc định</option>
          <option value="price_asc">Giá tăng dần</option>
          <option value="price_desc">Giá giảm dần</option>
          <option value="newest">Mới nhất</option>
        </select>
      </label>
    </section>

    @if (loading()) {
      <p class="state-card">Đang tải thực đơn...</p>
    } @else if (foods().length === 0) {
      <p class="state-card">
        Không tìm thấy món phù hợp. Bạn hãy thử đổi từ khóa hoặc bỏ bớt bộ lọc.
      </p>
    } @else {
      <section class="food-grid">
        @for (food of foods(); track food._id) {
          <article class="food-card">
            <div class="media-wrap">
              <img [src]="imageUrl(food.image)" [alt]="food.name" />
              <span class="status-pill" [class.out]="!food.isAvailable">
                {{ food.isAvailable ? 'Đang phục vụ' : 'Tạm hết món' }}
              </span>
            </div>

            <div class="food-body">
              <div class="meta-row">
                <span class="category-pill">{{ food.category || 'Chưa phân loại' }}</span>
                <span class="price">{{
                  food.price | currency: 'VND' : 'symbol' : '1.0-0' : 'vi-VN'
                }}</span>
              </div>

              <h2>{{ food.name }}</h2>
              <p>{{
                food.description || 'Món ăn được chuẩn bị từ nguồn nguyên liệu chọn lọc trong ngày.'
              }}</p>

              <div class="card-actions">
                <a [routerLink]="['/foods', food._id]" class="primary-link">Xem chi tiết</a>
                <span class="hint">Phù hợp cho đặt món nhanh</span>
              </div>
            </div>
          </article>
        }
      </section>
    }

    <section class="pager">
      <button type="button" (click)="previousPage()" [disabled]="page() === 1">
        Trang trước
      </button>
      <span>Trang {{ page() }} / {{ totalPages() }}</span>
      <button type="button" (click)="nextPage()" [disabled]="page() >= totalPages()">
        Trang sau
      </button>
    </section>
  `,
  styles: [
    `
      :host {
        display: grid;
        gap: 1.5rem;
      }

      .hero {
        display: grid;
        grid-template-columns: minmax(0, 1.25fr) minmax(280px, 0.75fr);
        gap: 1.25rem;
      }

      .hero-copy,
      .hero-panel,
      .filter-bar,
      .state-card {
        background: var(--bg-soft);
        border: 1px solid rgba(255, 255, 255, 0.45);
        box-shadow: var(--shadow-soft);
      }

      .hero-copy {
        padding: 2.2rem;
        border-radius: 36px;
        background:
          radial-gradient(circle at top right, rgba(242, 189, 120, 0.36), transparent 25%),
          linear-gradient(145deg, rgba(33, 22, 15, 0.98), rgba(118, 59, 30, 0.96));
        color: #fff7ef;
      }

      .eyebrow {
        display: inline-flex;
        margin-bottom: 1rem;
        padding: 0.5rem 0.9rem;
        border: 1px solid rgba(255, 247, 239, 0.15);
        border-radius: 999px;
        font-size: 0.78rem;
        font-weight: 600;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      .hero-copy h1,
      .hero-copy p {
        margin: 0;
      }

      .hero-copy h1 {
        font-size: clamp(2.4rem, 5vw, 4.6rem);
        line-height: 0.96;
        margin-bottom: 1rem;
      }

      .hero-copy p {
        max-width: 62ch;
        color: rgba(255, 247, 239, 0.82);
        line-height: 1.7;
      }

      .hero-panel {
        display: grid;
        gap: 1rem;
        padding: 1.4rem;
        border-radius: 30px;
        align-content: center;
      }

      .hero-panel div {
        padding: 1rem 1.1rem;
        border-radius: 22px;
        background: rgba(255, 255, 255, 0.62);
      }

      .hero-panel strong,
      .hero-panel span {
        display: block;
      }

      .hero-panel strong {
        font-size: 1.8rem;
        color: var(--accent-strong);
      }

      .hero-panel span {
        color: var(--text-muted);
      }

      .filter-bar {
        display: grid;
        grid-template-columns: 2fr 1fr 1fr;
        gap: 1rem;
        padding: 1rem;
        border-radius: 28px;
      }

      .field {
        display: grid;
        gap: 0.55rem;
      }

      .field span {
        font-size: 0.84rem;
        font-weight: 600;
        color: var(--text-muted);
      }

      .field input,
      .field select,
      .pager button,
      .primary-link {
        border: 0;
        border-radius: 18px;
        font: inherit;
      }

      .field input,
      .field select {
        padding: 1rem 1.05rem;
        background: rgba(255, 255, 255, 0.96);
        color: var(--text-strong);
        box-shadow: inset 0 0 0 1px var(--line-soft);
      }

      .food-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 1.25rem;
      }

      .food-card {
        overflow: hidden;
        border-radius: 30px;
        background: var(--surface);
        border: 1px solid rgba(255, 255, 255, 0.46);
        box-shadow: var(--shadow-soft);
      }

      .media-wrap {
        position: relative;
      }

      .food-card img {
        width: 100%;
        height: 250px;
        object-fit: cover;
      }

      .status-pill {
        position: absolute;
        left: 1rem;
        top: 1rem;
        display: inline-flex;
        align-items: center;
        padding: 0.48rem 0.85rem;
        border-radius: 999px;
        background: rgba(29, 122, 87, 0.92);
        color: #f4fffa;
        font-size: 0.78rem;
        font-weight: 700;
      }

      .status-pill.out {
        background: rgba(165, 58, 43, 0.92);
      }

      .food-body {
        display: grid;
        gap: 1rem;
        padding: 1.35rem;
      }

      .food-body h2,
      .food-body p {
        margin: 0;
      }

      .food-body h2 {
        font-size: 1.6rem;
      }

      .food-body p {
        color: var(--text-soft);
        line-height: 1.7;
      }

      .meta-row,
      .card-actions,
      .pager {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
      }

      .category-pill {
        padding: 0.45rem 0.75rem;
        border-radius: 999px;
        background: #f2e4d5;
        color: var(--accent-strong);
        font-size: 0.8rem;
        font-weight: 700;
      }

      .price {
        font-weight: 800;
        color: var(--accent-strong);
      }

      .primary-link {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0.9rem 1rem;
        border-radius: 999px;
        background: linear-gradient(135deg, #21150d, #8f4b28);
        text-decoration: none;
        color: #fff7ef;
        font-weight: 700;
      }

      .hint {
        color: var(--text-muted);
        font-size: 0.85rem;
      }

      .pager {
        justify-content: center;
      }

      .pager button {
        padding: 0.9rem 1.2rem;
        background: #261810;
        color: #fff7ef;
        cursor: pointer;
      }

      .pager button[disabled] {
        cursor: not-allowed;
        opacity: 0.4;
      }

      .state-card {
        margin: 0;
        padding: 2rem;
        text-align: center;
        border-radius: 26px;
      }

      @media (max-width: 980px) {
        .hero,
        .filter-bar {
          grid-template-columns: 1fr;
        }
      }
    `
  ]
})
export class HomePageComponent {
  private readonly foodService = inject(FoodService);
  private readonly destroyRef = inject(DestroyRef);

  protected search = '';
  protected category = '';
  protected sort = '';
  protected readonly page = signal(1);
  protected readonly foods = signal<Food[]>([]);
  protected readonly totalPages = signal(1);
  protected readonly loading = signal(false);
  protected readonly categoryCatalog = signal<string[]>([]);
  protected readonly categoryOptions = computed(() =>
    this.categoryCatalog().filter((item) => item && item.trim().length > 0)
  );

  constructor() {
    this.fetchFoods();
    this.loadCategoryCatalog();
  }

  protected onFiltersChanged(): void {
    this.page.set(1);
    this.fetchFoods();
  }

  protected previousPage(): void {
    if (this.page() === 1) return;
    this.page.update((value) => value - 1);
    this.fetchFoods();
  }

  protected nextPage(): void {
    if (this.page() >= this.totalPages()) return;
    this.page.update((value) => value + 1);
    this.fetchFoods();
  }

  protected imageUrl(image?: string): string {
    return resolveImageUrl(image);
  }

  private fetchFoods(): void {
    this.loading.set(true);
    this.foodService
      .getFoods({
        search: this.search,
        category: this.category,
        sort: this.sort,
        page: this.page(),
        limit: 6
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.foods.set(response.data ?? []);
          this.totalPages.set(Math.max(response.pagination?.totalPages ?? 1, 1));
          this.loading.set(false);
        },
        error: () => {
          this.foods.set([]);
          this.totalPages.set(1);
          this.loading.set(false);
        }
      });
  }

  private loadCategoryCatalog(): void {
    this.foodService
      .getFoods({ page: 1, limit: 100 })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          const uniqueCategories = Array.from(
            new Set((response.data ?? []).map((item) => item.category).filter(Boolean))
          );
          this.categoryCatalog.set(uniqueCategories);
        },
        error: () => {
          this.categoryCatalog.set([]);
        }
      });
  }
}
