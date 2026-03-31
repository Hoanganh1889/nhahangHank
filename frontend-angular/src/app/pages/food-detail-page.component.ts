import { Component, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { CartService } from '../services/cart.service';
import { FoodService } from '../services/food.service';
import { Food } from '../types';
import { resolveImageUrl } from '../utils';

@Component({
  selector: 'app-food-detail-page',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe],
  template: `
    @if (loading()) {
      <p class="state-card">Đang tải chi tiết món ăn...</p>
    } @else if (!food()) {
      <section class="state-card">
        <p>Không tìm thấy món ăn.</p>
        <a routerLink="/">Quay lại thực đơn</a>
      </section>
    } @else {
      <section class="detail-layout">
        <img class="hero-image" [src]="imageUrl(food()?.image)" [alt]="food()?.name" />

        <article class="detail-card">
          <a class="back-link" routerLink="/">Quay lại thực đơn</a>
          <span class="pill">{{ food()?.category || 'Chưa phân loại' }}</span>
          <h1>{{ food()?.name }}</h1>
          <strong>{{ food()?.price | currency: 'VND' : 'symbol' : '1.0-0' : 'vi-VN' }}</strong>
          <p>{{
            food()?.description ||
              'Món ăn được chế biến kỹ lưỡng từ nguyên liệu tươi mỗi ngày, phù hợp cho trải nghiệm đặt món trực tuyến cao cấp.'
          }}</p>

          <div class="feature-list">
            <div>
              <span>Tình trạng</span>
              <strong>{{ food()?.isAvailable ? 'Sẵn sàng phục vụ' : 'Tạm hết món' }}</strong>
            </div>
            <div>
              <span>Danh mục</span>
              <strong>{{ food()?.category || 'Đang cập nhật' }}</strong>
            </div>
            <div>
              <span>Phù hợp</span>
              <strong>Đặt nhanh trong ngày</strong>
            </div>
          </div>

          <button type="button" (click)="addToCart()" [disabled]="!food()?.isAvailable">
            {{ food()?.isAvailable ? 'Thêm vào giỏ đặt món' : 'Tạm hết món' }}
          </button>

          @if (message()) {
            <p class="flash">{{ message() }}</p>
          }
        </article>
      </section>
    }
  `,
  styles: [
    `
      .detail-layout {
        display: grid;
        grid-template-columns: minmax(320px, 1.05fr) minmax(320px, 0.95fr);
        gap: 1.5rem;
      }

      .hero-image,
      .detail-card {
        border-radius: 2rem;
      }

      .hero-image {
        width: 100%;
        min-height: 420px;
        object-fit: cover;
        box-shadow: var(--shadow-soft);
      }

      .detail-card {
        display: grid;
        align-content: start;
        gap: 1rem;
        padding: 2rem;
        border-radius: 32px;
        background: var(--bg-soft);
        border: 1px solid rgba(255, 255, 255, 0.45);
        box-shadow: var(--shadow-soft);
      }

      .detail-card h1,
      .detail-card p {
        margin: 0;
      }

      .detail-card strong {
        font-size: 1.5rem;
        color: var(--accent-strong);
      }

      .detail-card p {
        color: var(--text-soft);
        line-height: 1.75;
      }

      .back-link,
      button {
        width: fit-content;
        padding: 0.85rem 1rem;
        border: 0;
        border-radius: 1rem;
        text-decoration: none;
        font: inherit;
      }

      .back-link {
        color: var(--accent-strong);
        background: #f5e6d6;
      }

      button {
        background: linear-gradient(135deg, #21150d, #8f4b28);
        color: #fff7ef;
        cursor: pointer;
      }

      button[disabled] {
        opacity: 0.45;
        cursor: not-allowed;
      }

      .pill,
      .flash {
        width: fit-content;
      }

      .pill {
        padding: 0.35rem 0.75rem;
        border-radius: 999px;
        background: #f4e4d1;
        color: var(--accent-strong);
      }

      .feature-list {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 0.85rem;
      }

      .feature-list div {
        padding: 1rem;
        border-radius: 18px;
        background: rgba(255, 255, 255, 0.75);
        box-shadow: inset 0 0 0 1px var(--line-soft);
      }

      .feature-list span,
      .feature-list strong {
        display: block;
      }

      .feature-list span {
        margin-bottom: 0.45rem;
        font-size: 0.82rem;
        color: var(--text-muted);
      }

      .feature-list strong {
        font-size: 0.95rem;
      }

      .flash,
      .state-card {
        margin: 0;
        padding: 1rem 1.2rem;
        border-radius: 1rem;
        background: rgba(255, 252, 247, 0.9);
      }

      @media (max-width: 900px) {
        .detail-layout {
          grid-template-columns: 1fr;
        }

        .feature-list {
          grid-template-columns: 1fr;
        }
      }
    `
  ]
})
export class FoodDetailPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly foodService = inject(FoodService);
  private readonly cartService = inject(CartService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly food = signal<Food | null>(null);
  protected readonly loading = signal(true);
  protected readonly message = signal('');

  constructor() {
    this.route.paramMap
      .pipe(
        switchMap((params) => this.foodService.getFoodById(params.get('id') ?? '')),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (response) => {
          this.food.set(response.data);
          this.loading.set(false);
        },
        error: () => {
          this.food.set(null);
          this.loading.set(false);
        }
      });
  }

  protected addToCart(): void {
    const selectedFood = this.food();
    if (!selectedFood) return;
    this.cartService.addToCart(selectedFood);
    this.message.set(`Đã thêm "${selectedFood.name}" vào giỏ đặt món.`);
  }

  protected imageUrl(image?: string): string {
    return resolveImageUrl(image);
  }
}
