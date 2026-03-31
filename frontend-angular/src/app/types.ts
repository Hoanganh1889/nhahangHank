export interface Food {
  _id: string;
  name: string;
  category: string;
  price: number;
  image?: string;
  description?: string;
  isAvailable: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  _id: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
}

export interface BookingItem {
  foodName: string;
  quantity: number;
  price: number;
}

export interface Booking {
  _id: string;
  customerName: string;
  phone: string;
  address: string;
  note?: string;
  items: BookingItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'done' | 'cancelled';
  createdAt?: string;
  updatedAt?: string;
}

export interface FoodListResponse {
  success: boolean;
  data: Food[];
  pagination: {
    total: number;
    page: number;
    totalPages: number;
  };
}

export interface SingleItemResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
