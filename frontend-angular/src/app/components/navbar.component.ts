import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="nav-shell">
      <a class="brand" routerLink="/">
        <span class="brand-mark">F</span>
        <span class="brand-copy">
          <strong>Hank Restaurant</strong>
          <small>Đặt món trực tuyến cao cấp</small>
        </span>
      </a>

      <div class="nav-center">
        <div class="nav-links">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }"
            >Thực đơn</a
          >
          <a routerLink="/booking" routerLinkActive="active">
            Giỏ đặt món
            @if (totalItems() > 0) {
              <span class="badge">{{ totalItems() }}</span>
            }
          </a>
          @if (isAdmin()) {
            <a routerLink="/admin/foods" routerLinkActive="active">Quản lý món</a>
            <a routerLink="/admin/bookings" routerLinkActive="active">Đơn đặt món</a>
          } @else {
            <a routerLink="/admin/access" routerLinkActive="active">Khu quản trị</a>
          }
        </div>
      </div>

      <div class="account-box">
        <div class="account-copy">
          <span class="account-label">{{ roleLabel() }}</span>
          <small>{{ isAdmin() ? 'Đã xác thực quản trị' : 'Chế độ khách' }}</small>
        </div>
        @if (isAdmin()) {
          <button type="button" class="ghost-button" (click)="signOut()">Thoát quản trị</button>
        } @else {
          <a class="ghost-link" routerLink="/admin/access">Đăng nhập</a>
        }
      </div>
    </nav>
  `,
  styles: [
    `
      .nav-shell {
        position: sticky;
        top: 0;
        z-index: 30;
        display: grid;
        grid-template-columns: auto 1fr auto;
        align-items: center;
        gap: 1rem;
        padding: 1rem 1.5rem;
        margin: 1rem auto 0;
        max-width: 1320px;
        border: 1px solid rgba(255, 255, 255, 0.45);
        border-radius: 28px;
        backdrop-filter: blur(24px);
        background: rgba(255, 251, 246, 0.75);
        box-shadow: 0 18px 50px rgba(25, 17, 12, 0.08);
      }

      .brand {
        display: flex;
        align-items: center;
        gap: 0.9rem;
        text-decoration: none;
        color: var(--text-strong);
      }

      .brand-mark {
        display: grid;
        place-items: center;
        width: 2.9rem;
        height: 2.9rem;
        border-radius: 1rem;
        background: linear-gradient(140deg, #23170f, #9b5531);
        color: #fff7ef;
        font-family: var(--font-display);
        font-size: 1.2rem;
        font-weight: 700;
      }

      .brand-copy {
        display: grid;
      }

      .brand-copy strong {
        font-size: 0.95rem;
        letter-spacing: 0.12em;
        text-transform: uppercase;
      }

      .brand-copy small {
        color: var(--text-muted);
      }

      .nav-center {
        display: flex;
        justify-content: center;
      }

      .nav-links {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 0.7rem;
      }

      .nav-links a,
      .ghost-link,
      .ghost-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.45rem;
        padding: 0.8rem 1rem;
        border-radius: 999px;
        border: 0;
        text-decoration: none;
        color: var(--text-soft);
        background: transparent;
        font: inherit;
        cursor: pointer;
        transition:
          transform 160ms ease,
          background 160ms ease,
          color 160ms ease;
      }

      .nav-links a:hover,
      .nav-links a.active,
      .ghost-link:hover,
      .ghost-button:hover {
        transform: translateY(-1px);
        color: #fff7ef;
        background: linear-gradient(135deg, #22150d, #8f4b28);
      }

      .badge {
        display: inline-grid;
        place-items: center;
        min-width: 1.2rem;
        height: 1.2rem;
        border-radius: 999px;
        background: #ef7d32;
        color: white;
        font-size: 0.72rem;
        font-weight: 700;
        padding: 0 0.3rem;
      }

      .account-box {
        display: flex;
        align-items: center;
        gap: 0.9rem;
      }

      .account-copy {
        display: grid;
        justify-items: end;
      }

      .account-label {
        font-size: 0.85rem;
        font-weight: 700;
        color: var(--text-strong);
      }

      .account-copy small {
        color: var(--text-muted);
      }

      @media (max-width: 1040px) {
        .nav-shell {
          grid-template-columns: 1fr;
          justify-items: stretch;
        }

        .account-box {
          justify-content: space-between;
        }

        .account-copy {
          justify-items: start;
        }
      }

      @media (max-width: 640px) {
        .nav-shell {
          padding: 1rem;
          border-radius: 22px;
        }

        .account-box {
          flex-direction: column;
          align-items: stretch;
        }

        .ghost-link,
        .ghost-button {
          width: 100%;
        }
      }
    `
  ]
})
export class NavbarComponent {
  private readonly cartService = inject(CartService);
  private readonly authService = inject(AuthService);

  protected readonly totalItems = computed(() => this.cartService.totalItems());
  protected readonly isAdmin = computed(() => this.authService.isAdmin());
  protected readonly roleLabel = computed(() => this.authService.roleLabel());

  protected signOut(): void {
    this.authService.signOut();
  }
}
