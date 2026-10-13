export type AuthState = 'unknown' | 'authenticated' | 'anonymous';

export interface User {
  id: string;
  username: string;
  name: string;
  role: 'user' | 'admin';
}

export interface Order {
  id: number;
  item: string;
  total: number;
  status: 'Processing' | 'Shipped' | 'Delivered';
}
