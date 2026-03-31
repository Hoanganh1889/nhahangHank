import { Component, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { BookingService } from '../services/booking.service';
import { Booking } from '../types';

@Component({
  selector: 'app-admin-bookings-page',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DatePipe],
  template: `
    <section class="card">
      <header class="header-row">
        <div>
          <p>Quản trị đơn hàng</p>
          <h1>Danh sách đơn đặt món</h1>
        </div>
      </header>

      @if (loading()) {
        <p class="state">Đang tải danh sách đơn hàng...</p>
      } @else if (bookings().length === 0) {
        <p class="state">Chưa có đơn đặt món nào.</p>
      } @else {
        <div class="booking-list">
          @for (booking of bookings(); track booking._id) {
            <article class="booking-card">
              <div class="booking-head">
                <div>
                  <h2>{{ booking.customerName }}</h2>
                  <p>{{ booking.phone }} · {{ booking.address }}</p>
                </div>
                <select [value]="booking.status" (change)="updateStatus(booking, $any($event.target).value)">
                  <option value="pending">Chờ xác nhận</option>
                  <option value="confirmed">Đã xác nhận</option>
                  <option value="done">Hoàn tất</option>
                  <option value="cancelled">Đã hủy</option>
                </select>
              </div>

              <ul>
                @for (item of booking.items; track item.foodName + item.quantity) {
                  <li>
                    {{ item.foodName }} × {{ item.quantity }} -
                    {{ item.price | currency: 'VND' : 'symbol' : '1.0-0' : 'vi-VN' }}
                  </li>
                }
              </ul>

              <footer>
                <strong>{{ booking.total | currency: 'VND' : 'symbol' : '1.0-0' : 'vi-VN' }}</strong>
                <span>{{ booking.createdAt | date: 'short' : undefined : 'vi' }}</span>
              </footer>
            </article>
          }
        </div>
      }
    </section>
  `,
  styles: [
    `
      .card,
      .booking-card {
        display: grid;
        gap: 1rem;
      }

      .card {
        padding: 1.5rem;
        border-radius: 2rem;
        background: var(--bg-soft);
        border: 1px solid rgba(255, 255, 255, 0.45);
        box-shadow: var(--shadow-soft);
      }

      .header-row p,
      .header-row h1,
      .state,
      .booking-card h2,
      .booking-card p,
      .booking-card ul {
        margin: 0;
      }

      .booking-list {
        display: grid;
        gap: 1rem;
      }

      .header-row p {
        color: var(--text-muted);
        font-size: 0.82rem;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      .booking-card {
        padding: 1.25rem;
        border-radius: 1.4rem;
        background: white;
        box-shadow: inset 0 0 0 1px rgba(87, 54, 24, 0.08);
      }

      .booking-head,
      footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
      }

      select {
        padding: 0.75rem 1rem;
        border: 0;
        border-radius: 999px;
        background: #f6e6d3;
        font: inherit;
      }

      ul {
        padding-left: 1rem;
        color: #6e5845;
      }
    `
  ]
})
export class AdminBookingsPageComponent {
  private readonly bookingService = inject(BookingService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly bookings = signal<Booking[]>([]);
  protected readonly loading = signal(true);

  constructor() {
    this.loadBookings();
  }

  protected updateStatus(booking: Booking, status: Booking['status']): void {
    this.bookingService.updateStatus(booking._id, status).subscribe({
      next: () => this.loadBookings(),
      error: () => undefined
    });
  }

  private loadBookings(): void {
    this.loading.set(true);
    this.bookingService
      .getBookings()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.bookings.set(response.data ?? []);
          this.loading.set(false);
        },
        error: () => {
          this.bookings.set([]);
          this.loading.set(false);
        }
      });
  }
}
