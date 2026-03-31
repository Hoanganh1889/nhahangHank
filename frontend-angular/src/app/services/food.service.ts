import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../utils';
import { Food, FoodListResponse, SingleItemResponse } from '../types';

@Injectable({ providedIn: 'root' })
export class FoodService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${API_BASE_URL}/foods`;

  getFoods(filters: {
    search?: string;
    category?: string;
    sort?: string;
    page?: number;
    limit?: number;
  }): Observable<FoodListResponse> {
    let params = new HttpParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, String(value));
      }
    });

    return this.http.get<FoodListResponse>(this.baseUrl, { params });
  }

  getFoodById(id: string): Observable<SingleItemResponse<Food>> {
    return this.http.get<SingleItemResponse<Food>>(`${this.baseUrl}/${id}`);
  }

  createFood(payload: Partial<Food>): Observable<SingleItemResponse<Food>> {
    return this.http.post<SingleItemResponse<Food>>(this.baseUrl, payload);
  }

  updateFood(id: string, payload: Partial<Food>): Observable<SingleItemResponse<Food>> {
    return this.http.put<SingleItemResponse<Food>>(`${this.baseUrl}/${id}`, payload);
  }

  deleteFood(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.baseUrl}/${id}`);
  }
}
