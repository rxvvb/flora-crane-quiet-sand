import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  ArrowUpRight,
  Building2,
  Check,
  Clock,
  FileText,
  Handshake,
  HeartPulse,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Ruler,
  Search,
  Store,
  TreePine,
  Truck,
  UtensilsCrossed,
  Warehouse,
  X,
} from "lucide-react";
import {
  GROUP_LABEL,
  directions,
  findProduct,
  highlights,
  products,
  reviews,
  services,
  specValue,
  type Group,
  type Product,
} from "@/data/model";

const PHONE = "+7 (914) 964-48-86";
const PHONE_TEL = "+79149644886";
const WA = "https://wa.me/79149644886";
const STORAGE_KEY = "tp-request";

const FILTERS: { id: Group | "all"; label: string }[] = [
  { id: "all", label: "Все материалы" },
  { id: "tile", label: "Керамогранит" },
  { id: "fiber", label: "Фибра HENDIX" },
  { id: "profile", label: "Профили" },
  { id: "aluminum", label: "Алюминий" },
  { id: "mapei", label: "MAPEI" },
];

const SERVICE_ICONS = [
  Truck,
  Ruler,
  Warehouse,
  Building2,
  Store,
  UtensilsCrossed,
  HeartPulse,
  TreePine,
  FileText,
  Handshake,
];

const MARQUEE = [
  "Керамогранит 60×120",
  "Фибра HENDIX",
  "MAPEI",
  "Профили швов",
  "Алюминиевые профили",
  "Промышленные полы",
  "Дальний Восток",
  "Владивосток",
];

const HERO = {
  main: "/catalog/3ac48ae36e4eaf.jpg",
  side: "/catalog/2ebcf70ad559e3.jpg",
  fiber: "/catalog/12a490504ee245.jpg",
};

function waLink(text: string) {
  return `${WA}?text=${encodeURIComponent(text)}`;
}

export function HomePage() {
  const [filter, setFilter] = useState<Group | "all">("all");
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<Product | null>(null);
  const [photo, setPhoto] = useState(0);
  const [menu, setMenu] = useState(false);
  const [tray, setTray] = useState(false);
  const [keys, setKeys] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [interest, setInterest] = useState("");
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", note: "" });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as unknown;
        if (Array.isArray(parsed)) setKeys(parsed.filter((item) => typeof item === "string"));
      }
    } catch {
      /* ignore broken storage */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(keys));
  }, [keys, ready]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActive(null);
        setTray(false);
        setMenu(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = active || tray || menu ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [active, tray, menu]);

  const list = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return products.filter((item) => {
      if (filter !== "all" && item.group !== filter) return false;
      if (!needle) return true;
      const hay = [item.name, item.short, item.description, item.application ?? "", ...item.tags]
        .join(" ")
        .toLowerCase();
      return hay.includes(needle);
    });
  }, [filter, query]);

  const picked = keys.map((key) => findProduct(key)).filter((item): item is Product => Boolean(item));

  function toggleKey(key: string) {
    setKeys((current) =>
      current.includes(key) ? current.filter((item) => item !== key) : [...current, key],
    );
  }

  function openProduct(item: Product) {
    setActive(item);
    setPhoto(0);
  }

  function goCatalog(group: Group) {
    setFilter(group);
    setQuery("");
    setMenu(false);
    document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" });
  }

  function goDirection(group: Group | null, name: string) {
    setMenu(false);
    if (group) {
      goCatalog(group);
      return;
    }
    setInterest(name);
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  }

  function submitRequest(event: FormEvent) {
    event.preventDefault();
    const lines = [
      "Здравствуйте! Заявка с сайта «Торговый Путь».",
      `Имя: ${form.name}`,
      `Телефон: ${form.phone}`,
    ];
    if (interest) lines.push(`Направление: ${interest}`);
    if (picked.length) lines.push(`Позиции: ${picked.map((item) => item.name).join("; ")}`);
    if (form.note.trim()) lines.push(form.note.trim());
    const payload = { ...form, interest, items: picked.map((item) => item.name), at: Date.now() };
    try {
      const prev = JSON.parse(localStorage.getItem("tp-leads") || "[]") as unknown[];
      localStorage.setItem("tp-leads", JSON.stringify([...prev, payload]));
    } catch {
      /* storage optional */
    }
    setSent(true);
    window.open(waLink(lines.join("\n")), "_blank", "noopener,noreferrer");
  }

  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="sticky top-0 z-30 border-b border-line/80 bg-paper/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-5 py-3">
          <a href="#top" className="min-w-0">
            <span className="block font-display text-xl leading-none tracking-tight md:text-2xl">
              Торговый Путь
            </span>
            <span className="mt-1 block text-xs tracking-widest text-muted uppercase">Владивосток</span>
          </a>
          <nav className="ml-auto hidden items-center gap-7 text-sm text-ink-soft lg:flex">
            <a href="#catalog" className="hover:text-copper-deep">
              Каталог
            </a>
            <a href="#hendix" className="hover:text-copper-deep">
              Фибра
            </a>
            <a href="#services" className="hover:text-copper-deep">
              Услуги
            </a>
            <a href="#about" className="hover:text-copper-deep">
              О компании
            </a>
            <a href="#contact" className="hover:text-copper-deep">
              Контакты
            </a>
          </nav>
          <button
            type="button"
            onClick={() => setTray(true)}
            className="ml-auto inline-flex h-11 items-center gap-2 rounded-full bg-ink px-4 text-sm text-cream lg:ml-0"
          >
            Заявка
            {keys.length > 0 && (
              <span className="grid h-6 min-w-6 place-items-center rounded-full bg-copper px-1 text-xs text-cream">
                {keys.length}
              </span>
            )}
          </button>
          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-full border border-line lg:hidden"
            aria-label="Меню"
            onClick={() => setMenu(true)}
          >
            <Menu className="size-5" />
          </button>
        </div>
      </header>

      <main id="top">
        <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 pt-10 pb-16 md:pt-16 lg:grid-cols-2 lg:gap-14 lg:pb-20">
          <div className="anim-rise">
            <p className="text-sm tracking-widest text-copper-deep uppercase">Премиальные материалы с 2000-х</p>
            <h1 className="mt-4 font-display text-4xl leading-tight font-medium tracking-tight md:text-6xl">
              Строительные материалы{" "}
              <span className="text-copper italic">нового поколения</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-soft">
              Керамогранит, стальная фибра HENDIX, системы MAPEI, несъёмная опалубка и комплексные решения
              для промышленных полов. Поставляем по всему Дальнему Востоку и России.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#catalog"
                className="inline-flex h-12 items-center rounded-full bg-ink px-6 text-sm font-medium text-cream"
              >
                Смотреть каталог
              </a>
              <a
                href={WA}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-12 items-center gap-2 rounded-full border border-line bg-cream px-6 text-sm font-medium"
              >
                <MessageCircle className="size-4 text-copper-deep" />
                WhatsApp
              </a>
            </div>
            <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-line pt-6">
              <div>
                <dt className="font-display text-3xl text-copper-deep md:text-4xl">25+</dt>
                <dd className="mt-1 text-sm text-muted">лет на рынке</dd>
              </div>
              <div>
                <dt className="font-display text-3xl text-copper-deep md:text-4xl">500+</dt>
                <dd className="mt-1 text-sm text-muted">объектов</dd>
              </div>
              <div>
                <dt className="font-display text-3xl text-copper-deep md:text-4xl">ДВ</dt>
                <dd className="mt-1 text-sm text-muted">и вся Россия</dd>
              </div>
            </dl>
          </div>

          <div className="anim-rise relative min-h-[440px] md:min-h-[540px]">
            <div className="absolute top-0 right-0 h-[78%] w-[78%] overflow-hidden rounded-3xl bg-sand shadow-lg">
              <img
                src={HERO.main}
                alt="Керамогранит CLASSIC STATUARIO 60×120"
                className="ken h-full w-full object-cover"
              />
            </div>
            <div className="absolute bottom-0 left-0 h-[46%] w-[52%] overflow-hidden rounded-3xl border-4 border-paper bg-ink shadow-lg">
              <img src={HERO.side} alt="Керамогранит Nero Marquina" className="h-full w-full object-cover" />
            </div>
            <div className="absolute right-3 bottom-8 flex max-w-[240px] items-center gap-3 rounded-2xl border border-line bg-cream/95 p-3 shadow-lg backdrop-blur">
              <img src={HERO.fiber} alt="" className="h-16 w-16 rounded-xl object-cover" />
              <div>
                <p className="text-xs tracking-widest text-copper-deep uppercase">HENDIX 1/50</p>
                <p className="font-display text-lg leading-tight">Стальная фибра для полов</p>
              </div>
            </div>
          </div>
        </section>

        <div className="marquee overflow-hidden border-y border-line bg-cream">
          <div className="marquee-track flex w-max items-center gap-8 py-4">
            {[...MARQUEE, ...MARQUEE].map((item, index) => (
              <span key={`${item}-${index}`} className="flex items-center gap-8 text-sm tracking-widest uppercase">
                {item}
                <span className="size-1.5 rounded-full bg-copper" aria-hidden />
              </span>
            ))}
          </div>
        </div>

        <section id="directions" className="mx-auto max-w-6xl px-5 py-16 md:py-24">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm tracking-widest text-copper-deep uppercase">Направления</p>
              <h2 className="mt-2 font-display text-4xl tracking-tight md:text-5xl">Что поставляем</h2>
            </div>
            <p className="max-w-sm text-ink-soft">
              От плиты 60×120 до сталефибробетона и комплектации объекта под ключ.
            </p>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {directions.map((item, index) => (
              <button
                key={item.name}
                type="button"
                onClick={() => goDirection(item.group, item.name)}
                className="group flex items-start gap-4 rounded-2xl border border-line bg-cream p-5 text-left transition duration-200 hover:-translate-y-1 hover:border-copper"
              >
                <span className="font-display text-lg text-copper-deep">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>
                  <span className="block font-display text-2xl leading-tight">{item.name}</span>
                  <span className="mt-1 block text-sm text-muted">{item.desc}</span>
                </span>
                <ArrowUpRight className="ml-auto size-5 text-muted transition group-hover:text-copper-deep" />
              </button>
            ))}
          </div>
        </section>

        <section id="catalog" className="border-t border-line bg-cream/60 py-16 md:py-24">
          <div className="mx-auto max-w-6xl px-5">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm tracking-widest text-copper-deep uppercase">Каталог материалов</p>
                <h2 className="mt-2 font-display text-4xl tracking-tight md:text-5xl">Позиции со склада и под заказ</h2>
              </div>
              <label className="relative block w-full md:max-w-xs">
                <span className="sr-only">Поиск</span>
                <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Название или свойство"
                  className="h-12 w-full rounded-full border border-line bg-paper pr-4 pl-11 text-sm outline-none focus:border-copper"
                />
              </label>
            </div>

            <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
              {FILTERS.map((item) => {
                const on = filter === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFilter(item.id)}
                    className={`h-11 shrink-0 rounded-full px-4 text-sm ${
                      on ? "bg-ink text-cream" : "border border-line bg-paper text-ink"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>

            <p className="mt-4 text-sm text-muted">
              {list.length} {list.length === 1 ? "позиция" : "позиций"} · цена по запросу
            </p>

            {list.length === 0 ? (
              <div className="mt-8 rounded-3xl border border-dashed border-line bg-paper px-6 py-16 text-center">
                <p className="font-display text-3xl">Ничего не нашли</p>
                <p className="mt-2 text-muted">Измените запрос или напишите нам — подберём аналог.</p>
              </div>
            ) : (
              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {list.map((item) => (
                  <article
                    key={item.key}
                    className="group flex flex-col overflow-hidden rounded-3xl border border-line bg-paper transition duration-200 hover:-translate-y-1 hover:border-copper"
                  >
                    <button type="button" onClick={() => openProduct(item)} className="text-left">
                      <div className="relative aspect-[4/5] bg-sand">
                        <Photo
                          src={item.images[0]}
                          alt={item.name}
                          fit={item.group === "tile" ? "cover" : "contain"}
                        />
                        <span className="absolute top-3 left-3 rounded-full bg-cream/90 px-3 py-1 text-xs tracking-wide text-ink-soft uppercase">
                          {GROUP_LABEL[item.group]}
                        </span>
                      </div>
                      <div className="px-4 pt-4">
                        <h3 className="font-display text-2xl leading-tight">{item.name}</h3>
                        <p className="mt-1 line-clamp-2 text-sm text-muted">{item.short}</p>
                      </div>
                    </button>
                    <div className="mt-auto flex items-center justify-between gap-3 px-4 py-4">
                      <span className="text-sm text-ink-soft">{item.price}</span>
                      <button
                        type="button"
                        onClick={() => toggleKey(item.key)}
                        className={`h-11 rounded-full px-4 text-sm ${
                          keys.includes(item.key) ? "bg-copper-deep text-cream" : "bg-ink text-cream"
                        }`}
                      >
                        {keys.includes(item.key) ? "В заявке" : "В заявку"}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        <section id="hendix" className="mx-auto max-w-6xl px-5 py-16 md:py-24">
          <p className="text-sm tracking-widest text-copper-deep uppercase">Фибра HENDIX™ — все виды</p>
          <h2 className="mt-2 max-w-3xl font-display text-4xl tracking-tight md:text-5xl">
            Семь типов стальной фибры — от стандартных полов до несущих конструкций
          </h2>
          <p className="mt-4 max-w-2xl text-ink-soft">
            Полный каталог с характеристиками. Каждый тип — отдельно. Сертификаты EN 14889-1 и РОСС RU.
            Цена по запросу.
          </p>
          <div className="mt-8 overflow-x-auto rounded-3xl border border-line">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-ink text-cream">
                <tr>
                  <th className="px-4 py-4 font-medium">Модель</th>
                  <th className="px-4 py-4 font-medium">Диаметр</th>
                  <th className="px-4 py-4 font-medium">Длина</th>
                  <th className="px-4 py-4 font-medium">Разрыв</th>
                  <th className="px-4 py-4 font-medium">В 1 кг</th>
                </tr>
              </thead>
              <tbody>
                {products
                  .filter((item) => item.group === "fiber")
                  .map((item, index) => (
                    <tr key={item.key} className={index % 2 ? "bg-cream" : "bg-paper"}>
                      <td className="px-4 py-4">
                        <button type="button" onClick={() => openProduct(item)} className="text-left">
                          <span className="block font-display text-lg">{item.name}</span>
                          <span className="text-muted">{item.short}</span>
                        </button>
                      </td>
                      <td className="px-4 py-4">{specValue(item, "диаметр")}</td>
                      <td className="px-4 py-4">{specValue(item, "длина l")}</td>
                      <td className="px-4 py-4">{specValue(item, "разрыв")}</td>
                      <td className="px-4 py-4">{specValue(item, "кол-во")}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="services" className="border-t border-line bg-ink py-16 text-cream md:py-24">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-sm tracking-widest text-sand uppercase">Услуги</p>
              <h2 className="mt-2 font-display text-4xl tracking-tight md:text-5xl">Не только материал — ведение объекта</h2>
              <p className="mt-4 text-sand">
                Доставка, расчёт дозировки, комплектация и документы для госзакупок. Сопровождаем на площадке.
              </p>
            </div>
            <ul className="divide-y divide-sand/30">
              {services.map((item, index) => {
                const Icon = SERVICE_ICONS[index] ?? Truck;
                return (
                  <li key={item.name} className="flex gap-4 py-5">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-sand/15">
                      <Icon className="size-5 text-sand" />
                    </span>
                    <div>
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h3 className="font-display text-2xl">{item.name}</h3>
                        <span className="text-sm text-sand">{item.price}</span>
                      </div>
                      <p className="mt-1 text-sm leading-relaxed text-sand">{item.description}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        <section id="about" className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:py-24 lg:grid-cols-2">
          <div>
            <p className="text-sm tracking-widest text-copper-deep uppercase">О компании</p>
            <h2 className="mt-2 font-display text-4xl leading-tight tracking-tight md:text-5xl">
              «Торговый Путь» — поставщик для тех, кто строит надолго
            </h2>
            <p className="mt-6 font-display text-2xl leading-snug text-ink-soft italic">
              Более двадцати лет — высококачественные материалы для профессионалов и частных клиентов по всему
              Дальнему Востоку и России.
            </p>
          </div>
          <div>
            <p className="leading-relaxed text-ink-soft">
              Мы расширили ассортимент инновационными решениями: стальная фибра HENDIX, полипропиленовая фибра,
              несъёмная опалубка RusFibra Profile, материалы MAPEI и комплексная комплектация объектов.
            </p>
            <ul className="mt-6 space-y-3">
              {highlights.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-sand">
                    <Check className="size-3.5 text-copper-deep" />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="reviews" className="border-t border-line bg-cream py-16 md:py-24">
          <div className="mx-auto max-w-6xl px-5">
            <p className="text-sm tracking-widest text-copper-deep uppercase">Отзывы клиентов</p>
            <h2 className="mt-2 font-display text-4xl tracking-tight md:text-5xl">Как с нами работают</h2>
            <div className="mt-8 grid gap-4 lg:grid-cols-3">
              {reviews.map((item) => (
                <blockquote key={item.author} className="flex flex-col rounded-3xl border border-line bg-paper p-6">
                  <p className="font-display text-2xl leading-snug">«{item.text}»</p>
                  <footer className="mt-6 text-sm">
                    <span className="block font-medium">{item.author}</span>
                    <span className="text-muted">{item.role}</span>
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="mx-auto grid max-w-6xl gap-6 px-5 py-16 md:py-24 lg:grid-cols-2">
          <div className="rounded-3xl bg-ink p-7 text-cream md:p-10">
            <p className="text-sm tracking-widest text-sand uppercase">Свяжитесь с нами</p>
            <h2 className="mt-3 font-display text-4xl leading-tight md:text-5xl">
              Звоните или пишите — ответим по подбору и срокам
            </h2>
            <ul className="mt-8 space-y-5 text-sm">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 size-5 shrink-0 text-sand" />
                <span>
                  <span className="block text-sand">Адрес</span>
                  690048, Владивосток, ул. Невская, 38, пом. 39
                </span>
              </li>
              <li className="flex gap-3">
                <Phone className="mt-0.5 size-5 shrink-0 text-sand" />
                <span>
                  <span className="block text-sand">Телефон</span>
                  <a href={`tel:${PHONE_TEL}`} className="text-lg">
                    {PHONE}
                  </a>
                </span>
              </li>
              <li className="flex gap-3">
                <Clock className="mt-0.5 size-5 shrink-0 text-sand" />
                <span>
                  <span className="block text-sand">Часы</span>
                  Пн–Пт: 09:00–18:00 · Сб: 09:00–18:00
                </span>
              </li>
              <li className="flex gap-3">
                <MessageCircle className="mt-0.5 size-5 shrink-0 text-sand" />
                <a href={WA} target="_blank" rel="noreferrer" className="underline decoration-sand/60">
                  WhatsApp
                </a>
              </li>
            </ul>
            <p className="mt-8 text-sm text-sand">
              ООО «Торговый Путь» · ИНН 2543192186 · КПП 254301001
            </p>
          </div>

          <form onSubmit={submitRequest} className="rounded-3xl border border-line bg-cream p-7 md:p-10">
            {sent ? (
              <div>
                <p className="font-display text-4xl">Заявка собрана</p>
                <p className="mt-3 text-ink-soft">
                  Открыли WhatsApp с текстом. Если окно не появилось, напишите на {PHONE} — мы на связи.
                </p>
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className="mt-6 h-12 rounded-full bg-ink px-6 text-sm text-cream"
                >
                  Новая заявка
                </button>
              </div>
            ) : (
              <>
                <h3 className="font-display text-3xl">Запросить расчёт</h3>
                <p className="mt-2 text-sm text-muted">
                  {picked.length
                    ? `В заявке ${picked.length} поз. — они попадут в сообщение.`
                    : "Можно без списка: просто опишите объект."}
                  {interest ? ` Направление: ${interest}.` : ""}
                </p>
                <label className="mt-6 block text-sm">
                  Имя
                  <input
                    required
                    value={form.name}
                    onChange={(event) => setForm({ ...form, name: event.target.value })}
                    className="mt-1 h-12 w-full rounded-2xl border border-line bg-paper px-4 outline-none focus:border-copper"
                  />
                </label>
                <label className="mt-4 block text-sm">
                  Телефон
                  <input
                    required
                    type="tel"
                    value={form.phone}
                    onChange={(event) => setForm({ ...form, phone: event.target.value })}
                    className="mt-1 h-12 w-full rounded-2xl border border-line bg-paper px-4 outline-none focus:border-copper"
                  />
                </label>
                <label className="mt-4 block text-sm">
                  Комментарий
                  <textarea
                    rows={4}
                    value={form.note}
                    onChange={(event) => setForm({ ...form, note: event.target.value })}
                    placeholder="Объект, объём, сроки"
                    className="mt-1 w-full rounded-2xl border border-line bg-paper px-4 py-3 outline-none focus:border-copper"
                  />
                </label>
                <button type="submit" className="mt-5 h-12 w-full rounded-full bg-ink text-sm font-medium text-cream">
                  Отправить в WhatsApp
                </button>
              </>
            )}
          </form>
        </section>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-8 text-sm text-muted md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} ООО «Торговый Путь»</p>
          <p>690048, Владивосток, ул. Невская, 38</p>
          <a href={`tel:${PHONE_TEL}`} className="text-ink">
            {PHONE}
          </a>
        </div>
      </footer>

      {keys.length > 0 && !tray && !active && (
        <button
          type="button"
          onClick={() => setTray(true)}
          className="fixed bottom-5 left-1/2 z-30 h-12 -translate-x-1/2 rounded-full bg-copper-deep px-5 text-sm text-cream shadow-lg lg:hidden"
        >
          Открыть заявку · {keys.length}
        </button>
      )}

      {menu && (
        <div className="fixed inset-0 z-40 bg-paper px-5 py-4 lg:hidden">
          <div className="flex items-center justify-between">
            <span className="font-display text-2xl">Меню</span>
            <button type="button" aria-label="Закрыть" onClick={() => setMenu(false)} className="grid h-11 w-11 place-items-center">
              <X />
            </button>
          </div>
          <nav className="mt-8 flex flex-col gap-4 font-display text-4xl">
            <a href="#catalog" onClick={() => setMenu(false)}>
              Каталог
            </a>
            <a href="#hendix" onClick={() => setMenu(false)}>
              Фибра
            </a>
            <a href="#services" onClick={() => setMenu(false)}>
              Услуги
            </a>
            <a href="#about" onClick={() => setMenu(false)}>
              О компании
            </a>
            <a href="#contact" onClick={() => setMenu(false)}>
              Контакты
            </a>
          </nav>
        </div>
      )}

      {tray && (
        <div className="fixed inset-0 z-50 flex justify-end bg-ink/40" onClick={() => setTray(false)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Заявка"
            className="flex h-full w-full max-w-md flex-col bg-paper p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display text-3xl">Заявка</h2>
              <button type="button" aria-label="Закрыть" onClick={() => setTray(false)} className="grid h-11 w-11 place-items-center">
                <X />
              </button>
            </div>
            {picked.length === 0 ? (
              <p className="mt-8 text-muted">Пока пусто. Добавьте позиции из каталога — отправим одним сообщением.</p>
            ) : (
              <ul className="mt-6 flex-1 space-y-3 overflow-y-auto">
                {picked.map((item) => (
                  <li key={item.key} className="flex items-center gap-3 rounded-2xl border border-line bg-cream p-3">
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-sand">
                      <Photo src={item.images[0]} alt="" fit="cover" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-medium">{item.name}</p>
                      <p className="text-sm text-muted">{GROUP_LABEL[item.group]}</p>
                    </div>
                    <button type="button" onClick={() => toggleKey(item.key)} className="ml-auto text-sm text-copper-deep">
                      Убрать
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <a
              href="#contact"
              onClick={() => setTray(false)}
              className="mt-4 inline-flex h-12 items-center justify-center rounded-full bg-ink text-sm text-cream"
            >
              Оформить запрос
            </a>
          </div>
        </div>
      )}

      {active && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-ink/50 p-3 md:p-8" onClick={() => setActive(null)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-label={active.name}
            className="mx-auto grid max-w-5xl overflow-hidden rounded-3xl bg-paper lg:grid-cols-2"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="bg-sand">
              <div className="aspect-square">
                <Photo
                  src={active.images[photo] ?? active.images[0]}
                  alt={active.name}
                  fit={active.group === "tile" ? "cover" : "contain"}
                />
              </div>
              {active.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto p-3">
                  {active.images.map((src, index) => (
                    <button
                      key={src}
                      type="button"
                      onClick={() => setPhoto(index)}
                      className={`h-16 w-16 shrink-0 overflow-hidden rounded-xl border ${
                        photo === index ? "border-copper-deep" : "border-transparent"
                      }`}
                    >
                      <img src={src} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="relative max-h-[80vh] overflow-y-auto p-6 md:p-8">
              <button
                type="button"
                aria-label="Закрыть"
                onClick={() => setActive(null)}
                className="absolute top-4 right-4 grid h-11 w-11 place-items-center rounded-full border border-line"
              >
                <X className="size-5" />
              </button>
              <p className="text-xs tracking-widest text-copper-deep uppercase">{GROUP_LABEL[active.group]}</p>
              <h2 className="mt-2 pr-12 font-display text-4xl leading-tight">{active.name}</h2>
              <p className="mt-2 text-ink-soft">{active.short}</p>
              <p className="mt-4 leading-relaxed">{active.description}</p>
              {active.application && (
                <p className="mt-4 text-sm">
                  <span className="text-muted">Применение. </span>
                  {active.application}
                </p>
              )}
              {active.packing && (
                <p className="mt-2 text-sm">
                  <span className="text-muted">Упаковка. </span>
                  {active.packing}
                </p>
              )}
              {active.cert && (
                <p className="mt-2 text-sm">
                  <span className="text-muted">Сертификат. </span>
                  {active.cert}
                </p>
              )}
              {active.specs && (
                <dl className="mt-5 divide-y divide-line border-y border-line">
                  {Object.entries(active.specs).map(([label, value]) => (
                    <div key={label} className="grid grid-cols-2 gap-3 py-2 text-sm">
                      <dt className="text-muted">{label}</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                </dl>
              )}
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => toggleKey(active.key)}
                  className="h-12 rounded-full bg-ink px-5 text-sm text-cream"
                >
                  {keys.includes(active.key) ? "Убрать из заявки" : "Добавить в заявку"}
                </button>
                <a
                  href={waLink(`Здравствуйте! Интересует ${active.name}. Подскажите цену и срок.`)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-12 items-center rounded-full border border-line px-5 text-sm"
                >
                  Спросить цену
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Photo({ src, alt, fit }: { src?: string; alt: string; fit: "cover" | "contain" }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div className="grid h-full w-full place-items-center bg-sand px-4 text-center font-display text-xl">
        {alt || "Фото"}
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      className={fit === "cover" ? "h-full w-full object-cover" : "h-full w-full object-contain p-6"}
    />
  );
}
