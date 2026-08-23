export interface Dish {
  id: number
  name: string
  ingredients: string
  image: string
  price: number
}

export const dishes: Dish[] = [
  {
    id: 0,
    name: 'TARTUFO',
    ingredients: 'Mozarella, Brown Mushrooms, Truffle Paste, Basil',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=900&h=1350&fit=crop&q=85',
    price: 89,
  },
  {
    id: 1,
    name: 'CALABRESE',
    ingredients: 'Tomato Sauce, Mozarella, Spicy Salami, Beef or Pork, Basil',
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=900&h=1350&fit=crop&q=85',
    price: 65,
  },
  {
    id: 2,
    name: 'MARGHERITA',
    ingredients: 'Tomato Sauce, Mozzarella, Basil',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=900&h=1350&fit=crop&q=85',
    price: 55,
  },
  {
    id: 3,
    name: 'MARE E MONTE',
    ingredients: 'Mozarella, Saffron Cream, Shrimps, Porcini, Fried Basil',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=900&h=1350&fit=crop&q=85',
    price: 95,
  },
  {
    id: 4,
    name: 'BUFALINA',
    ingredients: 'Tomato Sauce, Buffalo Mozzarella, Cherry Tomatos, Basil',
    image: 'https://images.unsplash.com/photo-1593504049359-74330189a345?w=900&h=1350&fit=crop&q=85',
    price: 72,
  },
  {
    id: 5,
    name: 'QUATTRO FORMAGGI',
    ingredients: 'Mozzarella, Gorgonzola, Parmesan, Fontina',
    image: 'https://images.unsplash.com/photo-1571997478779-2adcb4de2c9a?w=900&h=1350&fit=crop&q=85',
    price: 78,
  },
]

export function formatPrice(sar: number): string {
  return `${sar}`
}
