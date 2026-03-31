import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../utils';
import { Booking, SingleItemResponse } from '../types';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${API_BASE_URL}/bookings`;

  getBookings(): Observable<SingleItemResponse<Booking[]>> {
    return this.http.get<SingleItemResponse<Booking[]>>(this.baseUrl);
  }

  createBooking(payload: Omit<Booking, '_id'>): Observable<SingleItemResponse<Booking>> {
    return this.http.post<SingleItemResponse<Booking>>(this.baseUrl, payload);
  }

  updateStatus(
    id: string,
    status: Booking['status']
  ): Observable<SingleItemResponse<Booking>> {
    return this.http.patch<SingleItemResponse<Booking>>(`${this.baseUrl}/${id}/status`, {
      status
    });
  }
}
