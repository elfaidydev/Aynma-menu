export type MenuTheme = "default" | "hot" | "cold" | "sweets";

export type MenuItem = {
  id: string;
  nameAr: string;
  nameEn: string;
  price: number;
  image: string;
};

export type MenuSection = {
  id: string;
  title: string;
  layout: "grid" | "slider";
  theme: MenuTheme;
  items: MenuItem[];
};

export const NAV_ITEMS = [
  { id: "desserts", label: "الحلا", icon: "sweets" },
  { id: "hot", label: "المشروبات الحارة", icon: "hot" },
  { id: "cold", label: "المشروبات الباردة", icon: "cold" },
] as const;

const asset = (folder: "cold" | "hot" | "sweets", file: string) => `/assets/${folder}/${file}`;

export const MENU_SECTIONS: MenuSection[] = [
  {
    id: "desserts",
    title: "الحلا",
    layout: "slider",
    theme: "sweets",
    items: [
      { id: "qishta", nameAr: "تشيز القشد", nameEn: "QISHTA CHEESECAKE", price: 20, image: asset("sweets", "1.jpeg") },
      { id: "mango-trifle", nameAr: "ترافيل مانجو", nameEn: "MANGO TRIFLE", price: 22, image: asset("sweets", "2.jpg") },
      { id: "pecan", nameAr: "بيكان كراميل", nameEn: "PECAN CARAMEL", price: 22, image: asset("sweets", "3.jpg") },
      { id: "berry-cake", nameAr: "بيري كيك", nameEn: "BERRY CAKE", price: 22, image: asset("sweets", "4.jpg") },
      { id: "latte-cake", nameAr: "لاتيه", nameEn: "LATTE CAKE", price: 20, image: asset("sweets", "5.jpg") },
      { id: "caramel-cheesecake", nameAr: "تشيز كيك كراميل", nameEn: "CARAMEL CHEESECAKE", price: 20, image: asset("sweets", "6.jpg") },
      { id: "berry-cheesecake", nameAr: "تشيز كيك توت", nameEn: "BERRY CHEESECAKE", price: 20, image: asset("sweets", "7.jpg") },
      { id: "cookies", nameAr: "كوكيز", nameEn: "CLASSIC COOKIES", price: 10, image: asset("sweets", "8.jpg") },
      { id: "magic-bar", nameAr: "ماجيك بار", nameEn: "MAGIC BAR", price: 12, image: asset("sweets", "9.jpg") },
    ],
  },
  {
    id: "hot",
    title: "المشروبات الحارة",
    layout: "grid",
    theme: "hot",
    items: [
      { id: "hot-chocolate", nameAr: "هوت شوكليت", nameEn: "HOT CHOCOLATE", price: 19, image: asset("hot", "5.jpeg") },
      { id: "spanish-latte", nameAr: "سبانش لاتيه", nameEn: "SPANISH LATTE", price: 17, image: asset("hot", "4.jpg") },
      { id: "v60-hot", nameAr: "V60 حار", nameEn: "V60 HOT DRIP", price: 16, image: asset("hot", "3.jpg") },
      { id: "espresso", nameAr: "اسبريسو", nameEn: "ESPRESSO", price: 11, image: asset("hot", "1.jpg") },
      { id: "macchiato", nameAr: "ميكاتو", nameEn: "MACCHIATO", price: 11, image: asset("hot", "2.jpg") },
      { id: "today-hot", nameAr: "قهوة اليوم حار", nameEn: "TODAY'S COFFEE", price: 11, image: asset("hot", "3.jpg") },
    ],
  },
  {
    id: "cold",
    title: "المشروبات الباردة",
    layout: "slider",
    theme: "cold",
    items: [
      { id: "berry-matcha", nameAr: "بيري ماتشا", nameEn: "BERRY MATCHA", price: 20, image: asset("cold", "11.jpg") },
      { id: "hibiscus", nameAr: "كركديه", nameEn: "HIBISCUS TEA", price: 19, image: asset("cold", "1.jpg") },
      { id: "peach-tea", nameAr: "ايس تي خوخ", nameEn: "PEACH ICED TEA", price: 18, image: asset("cold", "2.jpg") },
      { id: "red", nameAr: "رد", nameEn: "RED FUSION", price: 18, image: asset("cold", "3.jpg") },
      { id: "blue", nameAr: "بلو", nameEn: "BLUE FUSION", price: 18, image: asset("cold", "4.jpg") },
      { id: "matcha", nameAr: "ماتشا", nameEn: "MATCHA LATTE", price: 18, image: asset("cold", "10.jpg") },
      { id: "iced-spanish", nameAr: "ايس سبانيش لاتيه", nameEn: "ICED SPANISH LATTE", price: 17, image: asset("cold", "5.jpg") },
      { id: "today-cold", nameAr: "قهوة اليوم بارد", nameEn: "TODAY'S COFFEE", price: 13, image: asset("cold", "6.jpg") },
      { id: "v60-cold", nameAr: "V60 بارد", nameEn: "V60 COLD DRIP", price: 19, image: asset("cold", "6.jpg") },
      { id: "freddo", nameAr: "الفريدو", nameEn: "FREDDO ESPRESSO", price: 12, image: asset("cold", "7.jpg") },
      { id: "iced-americano", nameAr: "ايس امريكانو", nameEn: "ICED AMERICANO", price: 14, image: asset("cold", "8.jpg") },
      { id: "iced-caramel", nameAr: "ايس شوكلت كراميل", nameEn: "ICED CARAMEL CHOCOLATE", price: 17, image: asset("cold", "9.jpg") },
    ],
  },
];
