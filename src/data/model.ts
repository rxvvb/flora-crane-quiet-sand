import { catalog, type Service, type Review } from "./catalog";

export type Group = "tile" | "fiber" | "profile" | "aluminum" | "mapei";

export type Product = {
  key: string;
  group: Group;
  name: string;
  short: string;
  price: string;
  images: string[];
  description: string;
  tags: string[];
  specs?: Record<string, string>;
  cert?: string;
  packing?: string;
  application?: string;
};

export const GROUP_LABEL: Record<Group, string> = {
  tile: "Керамогранит",
  fiber: "Фибра HENDIX",
  profile: "Профили",
  aluminum: "Алюминий",
  mapei: "MAPEI",
};

const tiles: Product[] = catalog.productsData.map((item) => ({
  key: `tile:${item.id}`,
  group: "tile",
  name: item.name,
  short: item.category === "мрамор" ? "Мраморный рисунок · 60×120" : "Керамогранит · 60×120",
  price: item.price,
  images: item.images,
  description: item.description,
  tags: item.tags,
}));

function fromTech(group: Group, items: typeof catalog.hendixFibers): Product[] {
  return items.map((item) => ({
    key: `${group}:${item.id}`,
    group,
    name: item.name,
    short: item.short,
    price: item.price,
    images: item.images,
    description: item.description,
    tags: [],
    specs: item.specs,
    cert: item.cert,
    packing: item.packing,
    application: item.application,
  }));
}

export const products: Product[] = [
  ...tiles,
  ...fromTech("fiber", catalog.hendixFibers),
  ...fromTech("profile", catalog.industrialProfiles),
  ...fromTech("aluminum", catalog.aluminumProfiles),
  ...fromTech("mapei", catalog.mapeiProducts),
];

export const services: Service[] = catalog.servicesData;
export const reviews: Review[] = catalog.reviewsData;

export const directions: { name: string; desc: string; group: Group | null }[] = [
  { name: "Керамогранит", desc: "Премиум плитка 60×120", group: "tile" },
  { name: "Фибра HENDIX", desc: "7 типов стальной фибры", group: "fiber" },
  { name: "Профили швов", desc: "Стальные и алюминиевые", group: "profile" },
  { name: "MAPEI", desc: "Топпинги и ремонт бетона", group: "mapei" },
  { name: "Полы промышленные", desc: "СФБ-решения и фибра", group: "fiber" },
  { name: "Алюминий", desc: "Полы, паркинги, стены", group: "aluminum" },
  { name: "Комплектация", desc: "Склады, офисы, объекты", group: null },
  { name: "Кровля", desc: "Металлочерепица, гибкая", group: null },
  { name: "Фасад", desc: "Системы и отделка", group: null },
  { name: "Гидроизоляция", desc: "Мембраны и составы", group: null },
  { name: "Пиломатериалы", desc: "Брус, доска, вагонка", group: null },
];

export const highlights = [
  "Бесплатные консультации и инженерные расчёты",
  "Наличие готовой продукции на складах",
  "Работа с госзакупками и B2B",
  "Сопровождение на стройплощадке",
  "Индивидуальные программы для постоянных клиентов",
];

export function specValue(product: Product, hint: string) {
  if (!product.specs) return "—";
  const found = Object.entries(product.specs).find(([key]) =>
    key.toLowerCase().includes(hint.toLowerCase()),
  );
  return found?.[1] ?? "—";
}

export function findProduct(key: string) {
  return products.find((item) => item.key === key);
}
