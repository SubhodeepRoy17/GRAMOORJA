export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: 'user' | 'admin';
  createdAt: Date;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  weight: string;
  category: 'ladoo' | 'gift' | 'pack' | 'assorted' | 'premium' | 'sugarfree';
  image: string;
  rating: number;
  reviews: number;
  stock: number;
  isFeatured: boolean;
}

export interface CartItem {
  product: Product | string;
  quantity: number;
  price: number;
}

export interface Order {
  _id: string;
  orderId: string;
  user: User | string;
  items: OrderItem[];
  total: number;
  tax: number;
  shipping: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: 'cod' | 'card' | 'upi';
  paymentStatus: 'pending' | 'paid' | 'failed';
  shippingAddress: ShippingAddress;
  trackingNumber?: string;
  estimatedDelivery?: Date;
  createdAt: Date;
}

export interface OrderItem {
  product: Product | string;
  name: string;
  price: number;
  quantity: number;
  weight: string;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
}

export interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  category: 'recipe' | 'story' | 'health' | 'festival' | 'news';
  published: boolean;
  views: number;
  createdAt: Date;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}