export type MenuCategory = 'desserts' | 'hot' | 'cold'

export interface MenuItem {
  id: number
  name: string
  image: string
  price: number
  category: MenuCategory
}

export const categories: { id: MenuCategory; label: string }[] = [
  { id: 'desserts', label: 'الحلا' },
  { id: 'hot', label: 'المشروبات الحارة' },
  { id: 'cold', label: 'المشروبات الباردة' },
]

const asset = (folder: 'cold' | 'hot' | 'sweets', file: string) =>
  `/assets/${folder}/${file}`

export const menuItems: MenuItem[] = [
  // الحلا
  { id: 0, name: 'تشيز القشد', price: 20, image: asset('sweets', '1.jpeg'), category: 'desserts' },
  { id: 1, name: 'ترافيل مانجو', price: 22, image: asset('sweets', '2.jpg'), category: 'desserts' },
  { id: 2, name: 'بيكان كراميل', price: 22, image: asset('sweets', '3.jpg'), category: 'desserts' },
  { id: 3, name: 'بيري كيك', price: 22, image: asset('sweets', '4.jpg'), category: 'desserts' },
  { id: 4, name: 'لاتيه', price: 20, image: asset('sweets', '5.jpg'), category: 'desserts' },
  { id: 5, name: 'تشيز كيك كراميل', price: 20, image: asset('sweets', '6.jpg'), category: 'desserts' },
  { id: 6, name: 'تشيز كيك توت', price: 20, image: asset('sweets', '7.jpg'), category: 'desserts' },
  { id: 7, name: 'كوكيز', price: 10, image: asset('sweets', '8.jpg'), category: 'desserts' },
  { id: 8, name: 'ماجيك بار', price: 12, image: asset('sweets', '9.jpg'), category: 'desserts' },

  // المشروبات الحارة
  { id: 9, name: 'هوت شوكليت', price: 19, image: asset('hot', '5.jpeg'), category: 'hot' },
  { id: 10, name: 'سبانش لاتيه', price: 17, image: asset('hot', '4.jpg'), category: 'hot' },
  { id: 11, name: 'V60 حار', price: 16, image: asset('hot', '3.jpg'), category: 'hot' },
  { id: 12, name: 'اسبريسو', price: 11, image: asset('hot', '1.jpg'), category: 'hot' },
  { id: 13, name: 'ميكاتو', price: 11, image: asset('hot', '2.jpg'), category: 'hot' },
  { id: 14, name: 'قهوة اليوم حار', price: 11, image: asset('hot', '3.jpg'), category: 'hot' },

  // المشروبات الباردة
  { id: 15, name: 'بيري ماتشا', price: 20, image: asset('cold', '11.jpg'), category: 'cold' },
  { id: 16, name: 'كركديه', price: 19, image: asset('cold', '1.jpg'), category: 'cold' },
  { id: 17, name: 'ايس تي خوخ', price: 18, image: asset('cold', '2.jpg'), category: 'cold' },
  { id: 18, name: 'رد', price: 18, image: asset('cold', '3.jpg'), category: 'cold' },
  { id: 19, name: 'بلو', price: 18, image: asset('cold', '4.jpg'), category: 'cold' },
  { id: 20, name: 'ماتشا', price: 18, image: asset('cold', '10.jpg'), category: 'cold' },
  { id: 21, name: 'ايس سبانيش لاتيه', price: 17, image: asset('cold', '5.jpg'), category: 'cold' },
  { id: 22, name: 'قهوة اليوم بارد', price: 13, image: asset('cold', '6.jpg'), category: 'cold' },
  { id: 23, name: 'V60 بارد', price: 19, image: asset('cold', '6.jpg'), category: 'cold' },
  { id: 24, name: 'الفريدو', price: 12, image: asset('cold', '7.jpg'), category: 'cold' },
  { id: 25, name: 'ايس امريكانو', price: 14, image: asset('cold', '8.jpg'), category: 'cold' },
  { id: 26, name: 'ايس شوكلت كراميل', price: 17, image: asset('cold', '9.jpg'), category: 'cold' },
]

export function getItemsByCategory(category: MenuCategory): MenuItem[] {
  return menuItems.filter((item) => item.category === category)
}

export function getCategoryIndex(category: MenuCategory): number {
  return categories.findIndex((c) => c.id === category)
}

export function getAllMenuImageUrls(): string[] {
  return [...new Set(menuItems.map((item) => item.image))]
}
