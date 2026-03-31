import { Routes } from '@angular/router';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home-page.component').then((module) => module.HomePageComponent)
  },
  {
    path: 'foods/:id',
    loadComponent: () =>
      import('./pages/food-detail-page.component').then(
        (module) => module.FoodDetailPageComponent
      )
  },
  {
    path: 'booking',
    loadComponent: () =>
      import('./pages/booking-page.component').then((module) => module.BookingPageComponent)
  },
  {
    path: 'admin/access',
    loadComponent: () =>
      import('./pages/admin-access-page.component').then(
        (module) => module.AdminAccessPageComponent
      )
  },
  {
    path: 'admin/foods',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./pages/admin-foods-page.component').then(
        (module) => module.AdminFoodsPageComponent
      )
  },
  {
    path: 'admin/foods/new',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./pages/admin-food-form-page.component').then(
        (module) => module.AdminFoodFormPageComponent
      )
  },
  {
    path: 'admin/foods/edit/:id',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./pages/admin-food-form-page.component').then(
        (module) => module.AdminFoodFormPageComponent
      )
  },
  {
    path: 'admin/bookings',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./pages/admin-bookings-page.component').then(
        (module) => module.AdminBookingsPageComponent
      )
  },
  {
    path: '**',
    redirectTo: ''
  }
];
