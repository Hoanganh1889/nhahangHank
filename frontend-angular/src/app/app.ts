import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { NavbarComponent } from './components/navbar.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent],
  template: `
    <div class="app-shell">
      <app-navbar />
      <main class="content-shell">
        <router-outlet />
      </main>
    </div>
  `,
  styleUrl: './app.css'
})
export class App {}
