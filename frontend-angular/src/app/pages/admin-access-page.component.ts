import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-admin-access-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="access-shell">
      <div class="access-copy">
        <span class="eyebrow">Khu vực quản trị</span>
        <h1>Đăng nhập để quản lý thực đơn và đơn hàng</h1>
        <p>
          Phần quản trị đã được tách riêng. Người dùng thường chỉ xem thực đơn và đặt món.
        </p>
      </div>

      <form class="access-card" [formGroup]="form" (ngSubmit)="submit()">
        <label for="pin">Mã truy cập quản trị</label>
        <input id="pin" type="password" formControlName="pin" placeholder="Nhập mã PIN" />
        <button type="submit" [disabled]="form.invalid">Vào khu quản trị</button>

        @if (message()) {
          <p class="message">{{ message() }}</p>
        }

        <small>PIN mẫu hiện tại: <strong>admin123</strong></small>
      </form>
    </section>
  `,
  styles: [
    `
      .access-shell {
        display: grid;
        grid-template-columns: minmax(280px, 1.1fr) minmax(320px, 0.9fr);
        gap: 1.5rem;
        align-items: stretch;
      }

      .access-copy,
      .access-card {
        padding: 2rem;
        border-radius: 32px;
        background: rgba(255, 252, 247, 0.92);
        box-shadow: 0 24px 60px rgba(26, 18, 11, 0.08);
      }

      .access-copy {
        background:
          radial-gradient(circle at top right, rgba(230, 167, 92, 0.25), transparent 30%),
          linear-gradient(160deg, rgba(31, 22, 16, 0.98), rgba(106, 53, 30, 0.96));
        color: #fff7ef;
      }

      .eyebrow {
        display: inline-flex;
        margin-bottom: 1rem;
        border: 1px solid rgba(255, 247, 239, 0.16);
        border-radius: 999px;
        padding: 0.45rem 0.8rem;
        font-size: 0.8rem;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      h1,
      p {
        margin: 0;
      }

      h1 {
        margin-bottom: 1rem;
        font-size: clamp(2rem, 4vw, 3rem);
        line-height: 1.05;
      }

      .access-card {
        display: grid;
        gap: 1rem;
        align-content: center;
      }

      label,
      small {
        color: #6f5a47;
      }

      input,
      button {
        border: 0;
        border-radius: 18px;
        font: inherit;
      }

      input {
        padding: 1rem 1.1rem;
        background: #fff;
        box-shadow: inset 0 0 0 1px rgba(31, 22, 16, 0.08);
      }

      button {
        padding: 1rem 1.2rem;
        background: linear-gradient(135deg, #1f1610, #8c4e2d);
        color: #fff7ef;
        cursor: pointer;
      }

      .message {
        margin: 0;
        border-radius: 16px;
        padding: 0.85rem 1rem;
        background: #fbe6dc;
        color: #8e3f2f;
      }

      @media (max-width: 900px) {
        .access-shell {
          grid-template-columns: 1fr;
        }
      }
    `
  ]
})
export class AdminAccessPageComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly message = signal('');
  protected readonly form = this.formBuilder.nonNullable.group({
    pin: ['', Validators.required]
  });

  protected submit(): void {
    const matched = this.authService.signIn(this.form.getRawValue().pin);

    if (!matched) {
      this.message.set('Mã truy cập không hợp lệ. Vui lòng kiểm tra lại.');
      return;
    }

    void this.router.navigateByUrl('/admin/foods');
  }
}
