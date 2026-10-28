export type Product = { id: number; name: string; category: string; price: number; image: string; active: boolean }
export type OrderItem = { productId: number; name: string; qty: number; price: number; note?: string }
export type Order = { id: number; table: string; waiter: string; status: 'Pendiente' | 'En preparación' | 'Listo' | 'Entregado' | 'Pagado'; createdAt: string; items: OrderItem[]; note?: string; paid?: boolean }

export const products: Product[] = [
  { id: 1, name: 'Hamburguesa clásica', category: 'Hamburguesas', price: 120, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=700&q=80', active: true },
  { id: 2, name: 'Hamburguesa especial', category: 'Hamburguesas', price: 150, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=700&q=80', active: true },
  { id: 3, name: 'Tacos de res (3 pzas)', category: 'Tacos', price: 90, image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=700&q=80', active: true },
  { id: 4, name: 'Corte Rib Eye', category: 'Carnes', price: 280, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=700&q=80', active: true },
  { id: 5, name: 'Papas a la francesa', category: 'Acompañamientos', price: 60, image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=700&q=80', active: true },
  { id: 6, name: 'Alitas BBQ (8 pzas)', category: 'Carnes', price: 110, image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&w=700&q=80', active: true },
  { id: 7, name: 'Refresco', category: 'Bebidas', price: 35, image: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?auto=format&fit=crop&w=700&q=80', active: true },
  { id: 8, name: 'Agua natural', category: 'Bebidas', price: 25, image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=700&q=80', active: true },
  { id: 9, name: 'Tacos al pastor (3 pzas)', category: 'Tacos', price: 85, image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=700&q=80', active: true },
  { id: 10, name: "Ensalada Duke's", category: 'Acompañamientos', price: 70, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=700&q=80', active: true },
  { id: 11, name: 'Papas con queso', category: 'Acompañamientos', price: 80, image: 'https://images.unsplash.com/photo-1518013431117-eb1465fa5752?auto=format&fit=crop&w=700&q=80', active: true },
  { id: 12, name: 'Cerveza', category: 'Bebidas', price: 50, image: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?auto=format&fit=crop&w=700&q=80', active: true },
]
export const initialOrders: Order[] = [
  { id: 1025, table: '04', waiter: 'Carlos Ramírez', status: 'En preparación', createdAt: '12:45', items: [{ productId: 1, name: 'Hamburguesa clásica', qty: 1, price: 120 }, { productId: 5, name: 'Papas a la francesa', qty: 1, price: 60 }, { productId: 7, name: 'Refresco', qty: 2, price: 35 }], note: 'Sin cebolla' },
  { id: 1026, table: '02', waiter: 'María López', status: 'Pendiente', createdAt: '12:51', items: [{ productId: 4, name: 'Corte Rib Eye', qty: 1, price: 280 }, { productId: 8, name: 'Agua natural', qty: 1, price: 25 }] },
  { id: 1027, table: '06', waiter: 'Carlos Ramírez', status: 'Listo', createdAt: '12:40', items: [{ productId: 6, name: 'Alitas BBQ (8 pzas)', qty: 1, price: 110 }] },
  { id: 1028, table: '01', waiter: 'María López', status: 'Pendiente', createdAt: '12:53', items: [{ productId: 2, name: 'Hamburguesa especial', qty: 2, price: 150 }] },
]
export const initialUsers = [
  { id: 1, name: 'Admin Duke', username: 'admin', role: 'Administrador', status: 'Activo' },
  { id: 2, name: 'Carlos Ramírez', username: 'carlos', role: 'Mesero', status: 'Activo' },
  { id: 3, name: 'Chef Luis', username: 'cocina', role: 'Cocina', status: 'Activo' },
]
export const money = (amount: number) => amount.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })
