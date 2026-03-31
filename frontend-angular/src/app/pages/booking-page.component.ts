import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { BookingService } from '../services/booking.service';
import { CartService } from '../services/cart.service';
import { Booking } from '../types';
import { resolveImageUrl } from '../utils';

@Component({
  selector: 'app-booking-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, CurrencyPipe],
  template: `
    <section class="booking-layout">
      <article class="card">
        <header class="section-head">
          <div>
            <p class="eyebrow">Giỏ hàng</p>
            <h1>Danh sách đặt món</h1>
          </div>
          <span class="summary-pill">{{ totalItems() }} món</span>
        </header>

        @if (items().length === 0) {
          <p class="empty">Giỏ hàng đang trống. <a routerLink="/">Quay lại thực đơn</a></p>
        } @else {
          <div class="cart-list">
            @for (item of items(); track item._id) {
              <div class="cart-row">
                <img [src]="imageUrl(item.image)" [alt]="item.name" />
                <div>
                  <strong>{{ item.name }}</strong>
                  <p>{{ item.price | currency: 'VND' : 'symbol' : '1.0-0' : 'vi-VN' }}</p>
                </div>
                <div class="qty-group">
                  <button type="button" (click)="cartService.decreaseQuantity(item._id)">-</button>
                  <span>{{ item.quantity }}</span>
                  <button type="button" (click)="cartService.increaseQuantity(item._id)">+</button>
                </div>
                <button type="button" class="remove" (click)="cartService.removeFromCart(item._id)">
                  Xóa
                </button>
              </div>
            }
          </div>

          <div class="summary">
            <span>Tổng cộng</span>
            <strong>{{ totalPrice() | currency: 'VND' : 'symbol' : '1.0-0' : 'vi-VN' }}</strong>
          </div>
        }
      </article>

      <article class="card">
        <header class="section-head">
          <div>
            <p class="eyebrow">Xác nhận đơn hàng</p>
            <h2>Thông tin khách hàng</h2>
          </div>
        </header>

        <form [formGroup]="form" (ngSubmit)="submit()">
          <input type="text" formControlName="customerName" placeholder="Họ và tên" />
          <input type="text" formControlName="phone" placeholder="Số điện thoại" />
          <input type="text" formControlName="address" placeholder="Địa chỉ giao hàng" />
          <textarea rows="4" formControlName="note" placeholder="Ghi chú cho nhà hàng"></textarea>
          <button type="submit" [disabled]="form.invalid || items().length === 0 || submitting()">
            {{ submitting() ? 'Đang gửi...' : 'Xác nhận đặt món' }}
          </button>
        </form>

        @if (message()) {
          <p class="flash">{{ message() }}</p>
        }
      </article>
    </section>
  `,
  styles: [
    `
      .booking-layout {
        display: grid;
        grid-template-columns: minmax(320px, 1.2fr) minmax(320px, 0.8fr);
        gap: 1.5rem;
      }

      .card {
        display: grid;
        gap: 1rem;
        padding: 1.5rem;
        border-radius: 2rem;
        background: var(--bg-soft);
        border: 1px solid rgba(255, 255, 255, 0.45);
        box-shadow: var(--shadow-soft);
      }

      .section-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
      }

      .section-head h1,
      .section-head h2,
      .section-head p,
      .empty,
      .flash {
        margin: 0;
      }

      .eyebrow {
        margin-bottom: 0.45rem;
        color: var(--text-muted);
        font-size: 0.82rem;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      .summary-pill {
        display: inline-flex;
        align-items: center;
        padding: 0.55rem 0.85rem;
        border-radius: 999px;
        background: #f2e4d5;
        color: var(--accent-strong);
        font-weight: 700;
      }

      .cart-list {
        display: grid;
        gap: 0.9rem;
      }

      .cart-row {
        display: grid;
        grid-template-columns: 80px 1fr auto auto;
        gap: 1rem;
        align-items: center;
        padding-bottom: 1rem;
        border-bottom: 1px solid rgba(87, 54, 24, 0.08);
      }

      .cart-row img {
        width: 80px;
        height: 80px;
        border-radius: 1rem;
        object-fit: cover;
      }

      .cart-row p {
        margin: 0;
        color: var(--text-soft);
      }

      .qty-group {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.35rem;
        border-radius: 999px;
        background: #f5ebdf;
      }

      button,
      input,
      textarea {
        border: 0;
        border-radius: 1rem;
        font: inherit;
      }

      .qty-group button,
      .remove,
      form button {
        cursor: pointer;
      }

      .qty-group button {
        width: 2rem;
        height: 2rem;
      }

      .remove {
        background: transparent;
        color: var(--danger);
      }

      .summary {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 1rem;
      }

      form {
        display: grid;
        gap: 0.9rem;
      }

      input,
      textarea {
        padding: 0.95rem 1rem;
        background: white;
        box-shadow: inset 0 0 0 1px rgba(87, 54, 24, 0.08);
      }

      form button {
        padding: 1rem;
        background: linear-gradient(135deg, #21150d, #8f4b28);
        color: #fff7ef;
      }

      form button[disabled] {
        opacity: 0.45;
        cursor: not-allowed;
      }

      .flash {
        padding: 1rem;
        border-radius: 1rem;
        background: #f6e6d3;
      }

      @media (max-width: 980px) {
        .booking-layout {
          grid-template-columns: 1fr;
        }

        .cart-row {
          grid-template-columns: 80px 1fr;
        }
      }
    `
  ]
})
export class BookingPageComponent {
  protected readonly cartService = inject(CartService);
  private readonly bookingService = inject(BookingService);
  private readonly formBuilder = inject(FormBuilder);

  protected readonly items = computed(() => this.cartService.items());
  protected readonly totalItems = computed(() => this.cartService.totalItems());
  protected readonly totalPrice = computed(() => this.cartService.totalPrice());
  protected readonly submitting = signal(false);
  protected readonly message = signal('');

  protected readonly form = this.formBuilder.nonNullable.group({
    customerName: ['', Validators.required],
    phone: ['', [Validators.required, Validators.pattern(/^0[0-9]{9,10}$/)]],
    address: ['', Validators.required],
    note: ['']
  });

  protected submit(): void {
    if (this.form.invalid || this.items().length === 0) {
      this.message.set('Vui lòng nhập đầy đủ thông tin và chọn món ăn.');
      return;
    }

    const formValue = this.form.getRawValue();
    const payload: Omit<Booking, '_id'> = {
      customerName: formValue.customerName,
      phone: formValue.phone,
      address: formValue.address,
      note: formValue.note,
      items: this.items().map((item) => ({
        foodName: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      total: this.totalPrice(),
      status: 'pending'
    };

    this.submitting.set(true);
    this.bookingService.createBooking(payload).subscribe({
      next: () => {
        this.submitting.set(false);
        this.message.set('Đặt món thành công. Nhà hàng đã nhận được đơn của bạn.');
        this.cartService.clearCart();
        this.form.reset({
          customerName: '',
          phone: '',
          address: '',
          note: ''
        });
      },
      error: () => {
        this.submitting.set(false);
        this.message.set('Không gửi được đơn đặt món. Vui lòng kiểm tra lại kết nối.');
      }
    });
  }

  protected imageUrl(image?: string): string {
    return resolveImageUrl(image);
  }
}
