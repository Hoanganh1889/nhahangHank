import { Injectable, computed, signal } from '@angular/core';

const ADMIN_SESSION_KEY = 'restaurant_admin_session';
const ADMIN_PIN = 'admin123';

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly isAdmin = signal(this.readAdminState());
  readonly roleLabel = computed(() => (this.isAdmin() ? 'Quản trị viên' : 'Khách hàng'));

  signIn(pin: string): boolean {
    const normalizedPin = pin.trim();
    const matched = normalizedPin === ADMIN_PIN;

    if (matched) {
      this.isAdmin.set(true);
      localStorage.setItem(ADMIN_SESSION_KEY, 'true');
    }

    return matched;
  }

  signOut(): void {
    this.isAdmin.set(false);
    localStorage.removeItem(ADMIN_SESSION_KEY);
  }

  private readAdminState(): boolean {
    if (typeof localStorage === 'undefined') {
      return false;
    }

    return localStorage.getItem(ADMIN_SESSION_KEY) === 'true';
  }
}
