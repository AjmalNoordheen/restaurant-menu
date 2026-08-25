import Image from "next/image";
import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import { getMenuImageUrl } from "@/lib/menu";
import type { MenuItem } from "@/types/menu";

type MenuCardProps = {
  item: MenuItem;
  index?: number;
  priority?: boolean;
};

export default function MenuCard({
  item,
  index = 0,
  priority = false,
}: MenuCardProps) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: "easeOut" }}
      className="group flex h-full min-h-0 flex-col overflow-hidden rounded-3xl border border-[#e8ddce] bg-[#fffdf9] p-1.5 shadow-[0_8px_25px_rgb(24_60_50/0.07)] transition-shadow hover:border-[#b8c9c0] hover:shadow-[0_22px_48px_rgb(24_60_50/0.16)] sm:min-h-85 sm:rounded-4xl sm:p-2"
    >
      <div className="relative aspect-4/3 overflow-hidden rounded-2xl bg-[#e9e2d7] ring-1 ring-black/5 sm:rounded-[1.6rem]">
        <Image
          src={getMenuImageUrl(item.image)}
          alt={item.name}
          fill
          priority={priority}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#102b24]/90 via-[#102b24]/10 to-black/5 opacity-85 transition-opacity duration-500 group-hover:opacity-100" />

        {!item.available && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-neutral-900 shadow-lg">
              Currently Unavailable
            </span>
          </div>
        )}

        {item.popular && item.available && (
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.06 + 0.2, duration: 0.3 }}
            className="absolute left-4 top-4 flex items-center gap-1 rounded-full bg-[#e4b85f] px-3 py-1.5 text-xs font-bold text-[#183c32] shadow-md"
          >
            <Flame size={14} />
            Chef's pick
          </motion.div>
        )}

        <div className="absolute bottom-3 left-3 right-3 text-white sm:bottom-4 sm:left-4 sm:right-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#e4b85f]">
            Taste of Kerala
          </p>
          <p className="mt-1 text-lg font-black leading-tight sm:text-xl">
            {item.name}
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-3 sm:p-5">
        <p className="min-h-8 line-clamp-2 text-[11px] font-normal leading-4 text-neutral-500 sm:min-h-10 sm:text-xs sm:leading-5">
          {item.description}
        </p>
        <div className="h-1.5 shrink-0" />

        <div className="mt-auto space-y-2 border-t border-[#eee7dc] pt-3 sm:space-y-3 sm:pt-4">
          <div
            title={item.available ? "Available today" : "Currently unavailable"}
            className={`flex w-full items-center gap-2 rounded-xl px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-widest sm:px-3 sm:py-2 ${
              item.available
                ? "bg-emerald-50 text-emerald-700"
                : "bg-neutral-100 text-neutral-500"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                item.available ? "bg-emerald-500" : "bg-neutral-300"
              }`}
            />
            <span>
              {item.available ? "Available today" : "Currently unavailable"}
            </span>
          </div>

          <div className="flex items-center justify-between rounded-2xl bg-[#f5efe5] px-2.5 py-1.5 sm:px-3 sm:py-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#9a8f80]">
              Price
            </span>
            <motion.div
              whileHover={{ scale: 1.06, rotate: -2 }}
              className="flex items-baseline gap-1 rounded-xl bg-linear-to-br from-[#183c32] to-[#285f4e] px-3 py-2 text-white shadow-md sm:px-3 sm:py-2"
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#e4b85f]">
                AED
              </span>
              <span className="text-xl font-black leading-none sm:text-2xl">
                {item.price}
              </span>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

