import { Component, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { FoodService } from '../services/food.service';
import { Food } from '../types';

@Component({
  selector: 'app-admin-foods-page',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe],
  template: `
    <section class="card">
      <header class="header-row">
        <div>
          <p>Quản trị thực đơn</p>
          <h1>Danh sách món ăn</h1>
        </div>
        <a routerLink="/admin/foods/new">Thêm món mới</a>
      </header>

      @if (loading()) {
        <p class="state">Đang tải danh sách món ăn...</p>
      } @else {
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Tên món</th>
                <th>Danh mục</th>
                <th>Gia</th>
                <th>Sẵn sàng</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              @for (food of foods(); track food._id) {
                <tr>
                  <td>{{ food.name }}</td>
                  <td>{{ food.category }}</td>
                  <td>{{ food.price | currency: 'VND' : 'symbol' : '1.0-0' : 'vi-VN' }}</td>
                  <td>{{ food.isAvailable ? 'Có' : 'Không' }}</td>
                  <td class="actions">
                    <a [routerLink]="['/admin/foods/edit', food._id]">Sửa</a>
                    <button type="button" (click)="deleteFood(food)">Xóa</button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }

      @if (message()) {
        <p class="state">{{ message() }}</p>
      }
    </section>
  `,
  styles: [
    `
      .card {
        display: grid;
        gap: 1rem;
        padding: 1.5rem;
        border-radius: 2rem;
        background: var(--bg-soft);
        border: 1px solid rgba(255, 255, 255, 0.45);
        box-shadow: var(--shadow-soft);
      }

      .header-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
      }

      .header-row p,
      .header-row h1,
      .state {
        margin: 0;
      }

      .header-row p {
        color: var(--text-muted);
        font-size: 0.82rem;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      .header-row a,
      .actions a,
      .actions button {
        width: fit-content;
        padding: 0.75rem 1rem;
        border: 0;
        border-radius: 999px;
        text-decoration: none;
        font: inherit;
      }

      .header-row a,
      .actions a {
        background: linear-gradient(135deg, #21150d, #8f4b28);
        color: #fff7ef;
      }

      .actions button {
        background: #f8ded6;
        color: var(--danger);
        cursor: pointer;
      }

      .table-wrap {
        overflow: auto;
      }

      table {
        width: 100%;
        border-collapse: collapse;
      }

      thead {
        background: rgba(244, 230, 214, 0.75);
      }

      th,
      td {
        text-align: left;
        padding: 0.95rem 0.75rem;
        border-bottom: 1px solid rgba(87, 54, 24, 0.08);
      }

      .actions {
        display: flex;
        gap: 0.5rem;
      }
    `
  ]
})
export class AdminFoodsPageComponent {
  private readonly foodService = inject(FoodService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly foods = signal<Food[]>([]);
  protected readonly loading = signal(true);
  protected readonly message = signal('');

  constructor() {
    this.loadFoods();
  }

  protected deleteFood(food: Food): void {
    const confirmed = window.confirm(`Xóa món "${food.name}"?`);
    if (!confirmed) return;

    this.foodService.deleteFood(food._id).subscribe({
      next: () => {
        this.message.set(`Đã xóa món "${food.name}".`);
        this.loadFoods();
      },
      error: () => {
        this.message.set('Không thể xóa món ăn này.');
      }
    });
  }

  private loadFoods(): void {
    this.loading.set(true);
    this.foodService
      .getFoods({ page: 1, limit: 100 })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.foods.set(response.data ?? []);
          this.loading.set(false);
        },
        error: () => {
          this.foods.set([]);
          this.loading.set(false);
        }
      });
  }
}
