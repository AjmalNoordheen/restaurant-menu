import Image from "next/image";
import { Flame } from "lucide-react";
import type { MenuItem } from "@/data/menu";

type MenuCardProps = {
  item: MenuItem;
};

export default function MenuCard({ item }: MenuCardProps) {
  return (
    <article className="group overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
        />

        {!item.available && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold">
              Currently Unavailable
            </span>
          </div>
        )}

        {item.popular && item.available && (
          <div className="absolute left-4 top-4 flex items-center gap-1 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold shadow-md">
            <Flame size={14} />
            Popular
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-neutral-900">
              {item.name}
            </h3>

            <p className="mt-2 text-sm leading-6 text-neutral-500">
              {item.description}
            </p>
          </div>

          <div className="shrink-0 rounded-full bg-neutral-900 px-3 py-1.5 text-sm font-bold text-white">
            AED {item.price}
          </div>
        </div>
      </div>
    </article>
  );
}