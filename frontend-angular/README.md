# FrontendAngular

App Angular nay duoc them vao repo de dung chung backend Express/MongoDB hien tai.

## Chay local

1. Chay backend:

```bash
cd ../backend
npm run dev
```

2. Chay frontend Angular:

```bash
cd ../frontend-angular
npm start
```

Frontend Angular se mo mac dinh tai `http://localhost:4200`.

## Da ket noi san

- Route menu: `/`
- Chi tiet mon: `/foods/:id`
- Dat mon: `/booking`
- Admin mon an: `/admin/foods`
- Tao/sua mon: `/admin/foods/new`, `/admin/foods/edit/:id`
- Admin booking: `/admin/bookings`

## API dang dung

- `GET /api/foods`
- `GET /api/foods/:id`
- `POST /api/foods`
- `PUT /api/foods/:id`
- `DELETE /api/foods/:id`
- `GET /api/bookings`
- `POST /api/bookings`
- `PATCH /api/bookings/:id/status`

Script `npm start` da duoc cau hinh kem `proxy.conf.json` de goi backend local thuan tien hon khi dev.
