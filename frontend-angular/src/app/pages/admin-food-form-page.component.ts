import { Component, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { FoodService } from '../services/food.service';

@Component({
  selector: 'app-admin-food-form-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <section class="card">
      <header class="header-row">
        <div>
          <p>Quản trị thực đơn</p>
          <h1>{{ editing() ? 'Cập nhật món ăn' : 'Tạo món ăn mới' }}</h1>
        </div>
        <a routerLink="/admin/foods">Quay lại danh sách</a>
      </header>

      <form [formGroup]="form" (ngSubmit)="submit()">
        <input type="text" formControlName="name" placeholder="Tên món" />
        <input type="text" formControlName="category" placeholder="Danh mục" />
        <input type="number" formControlName="price" placeholder="Giá" />
        <input type="text" formControlName="image" placeholder="Ảnh URL hoặc /uploads/..." />
        <textarea rows="5" formControlName="description" placeholder="Mô tả"></textarea>

        <label class="checkbox">
          <input type="checkbox" formControlName="isAvailable" />
          <span>Sẵn sàng phục vụ</span>
        </label>

        <button type="submit" [disabled]="form.invalid || saving()">
          {{ saving() ? 'Đang lưu...' : editing() ? 'Cập nhật món' : 'Tạo món mới' }}
        </button>
      </form>

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
      form button {
        width: fit-content;
        padding: 0.8rem 1rem;
        border: 0;
        border-radius: 999px;
        text-decoration: none;
        font: inherit;
      }

      .header-row a,
      form button {
        background: linear-gradient(135deg, #21150d, #8f4b28);
        color: #fff7ef;
      }

      form {
        display: grid;
        gap: 0.9rem;
      }

      input,
      textarea {
        padding: 0.95rem 1rem;
        border: 0;
        border-radius: 1rem;
        background: white;
        font: inherit;
        box-shadow: inset 0 0 0 1px rgba(87, 54, 24, 0.08);
      }

      .checkbox {
        display: inline-flex;
        align-items: center;
        gap: 0.6rem;
      }

      form button {
        cursor: pointer;
      }
    `
  ]
})
export class AdminFoodFormPageComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly foodService = inject(FoodService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly editing = signal(false);
  protected readonly saving = signal(false);
  protected readonly message = signal('');
  private foodId = '';

  protected readonly form = this.formBuilder.nonNullable.group({
    name: ['', Validators.required],
    category: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    image: [''],
    description: [''],
    isAvailable: [true]
  });

  constructor() {
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const id = params.get('id');
      if (!id) return;

      this.editing.set(true);
      this.foodId = id;
      this.foodService.getFoodById(id).subscribe({
        next: (response) => this.form.patchValue(response.data),
        error: () => this.message.set('Không tải được dữ liệu món ăn để chỉnh sửa.')
      });
    });
  }

  protected submit(): void {
    if (this.form.invalid) return;

    this.saving.set(true);
    const payload = this.form.getRawValue();
    const request = this.editing()
      ? this.foodService.updateFood(this.foodId, payload)
      : this.foodService.createFood(payload);

    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.router.navigateByUrl('/admin/foods');
      },
      error: () => {
        this.saving.set(false);
        this.message.set('Không thể lưu món ăn. Vui lòng kiểm tra lại dữ liệu.');
      }
    });
  }
}
