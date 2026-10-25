import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/components/home-page";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Торговый Путь — премиальные строительные материалы" },
      {
        name: "description",
        content:
          "Керамогранит, стальная фибра HENDIX, системы MAPEI, несъёмная опалубка и профили для промышленных полов. Владивосток, поставки по Дальнему Востоку и России.",
      },
    ],
  }),
  component: HomePage,
});
