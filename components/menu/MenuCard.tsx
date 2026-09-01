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
      whileHover={{ y: -3 }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: "easeOut" }}
      className="group flex h-auto min-h-0 flex-row gap-1.5 overflow-hidden rounded-lg border border-[#e8ddce] bg-[#fffdf9] p-1.5 shadow-[0_2px_6px_rgb(24_60_50/0.03)] transition-shadow hover:border-[#b8c9c0] hover:shadow-[0_4px_10px_rgb(24_60_50/0.08)] sm:flex-col sm:gap-0 sm:rounded-3xl sm:p-1.5 sm:shadow-[0_4px_12px_rgb(24_60_50/0.05)] sm:hover:shadow-[0_12px_28px_rgb(24_60_50/0.12)] md:rounded-4xl md:p-2 md:shadow-[0_8px_25px_rgb(24_60_50/0.07)] md:hover:shadow-[0_22px_48px_rgb(24_60_50/0.16)]"
    >
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-[#e9e2d7] ring-1 ring-black/5 sm:aspect-4/3 sm:h-auto sm:w-full sm:rounded-2xl md:rounded-[1.6rem]">
        <Image
          src={getMenuImageUrl(item.image)}
          alt={item.name}
          fill
          priority={priority}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          sizes="(max-width: 640px) 80px, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#102b24]/60 via-[#102b24]/10 to-black/5 opacity-60 transition-opacity duration-500 group-hover:opacity-75 sm:from-[#102b24]/90 sm:opacity-85" />

        {!item.available && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span className="rounded-full bg-white px-2 py-1 text-[8px] font-semibold text-neutral-900 shadow-lg sm:px-4 sm:py-2 sm:text-sm">
              Unavailable
            </span>
          </div>
        )}

        {item.popular && item.available && (
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.06 + 0.2, duration: 0.3 }}
            className="absolute left-0.5 top-0.5 flex items-center gap-0.5 rounded-full bg-[#e4b85f] px-1 py-0.5 text-[5px] font-bold text-[#183c32] shadow-md sm:left-3 sm:top-3 sm:gap-1 sm:px-3 sm:py-1.5 sm:text-[10px] md:left-4 md:top-4 md:px-3 md:py-1.5"
          >
            <Flame size={7} className="sm:size-[14px]" />
            <span className="hidden sm:inline">Chef's pick</span>
          </motion.div>
        )}

        <div className="absolute bottom-0.5 left-0.5 right-0.5 text-white sm:bottom-3 sm:left-3 sm:right-3 md:bottom-4 md:left-4 md:right-4">
          <p className="text-[5px] font-bold uppercase tracking-[0.05em] text-[#e4b85f] sm:text-[9px] md:text-[10px] md:tracking-[0.2em]">
            Kerala
          </p>
          <p className="hidden sm:mt-0.5 sm:block sm:line-clamp-1 sm:text-base md:mt-1 md:text-lg">
            {item.name}
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1 sm:gap-0 sm:p-3 md:p-5">
        <p className="text-[9px] font-black leading-4 sm:hidden">
          {item.name}
        </p>
        <p className="text-[7px] font-normal leading-3 text-neutral-600 line-clamp-3 sm:min-h-8 sm:line-clamp-2 sm:text-[10px] sm:leading-4 md:min-h-10 md:text-xs md:leading-5">
          {item.description}
        </p>

        <div className="flex items-center gap-1 sm:justify-between sm:border-t sm:border-[#eee7dc] sm:pt-2 md:pt-3">
          <div
            title={item.available ? "Available today" : "Currently unavailable"}
            className={`flex items-center gap-0.5 rounded-md px-1 py-0.5 text-[6px] font-bold uppercase tracking-tight sm:rounded-xl sm:gap-2 sm:px-2.5 sm:py-1.5 sm:text-[9px] md:px-3 md:py-2 md:text-[10px] md:tracking-widest ${
              item.available
                ? "bg-emerald-50 text-emerald-700"
                : "bg-neutral-100 text-neutral-500"
            }`}
          >
            <span
              className={`h-0.5 w-0.5 rounded-full sm:h-1.5 sm:w-1.5 ${
                item.available ? "bg-emerald-500" : "bg-neutral-300"
              }`}
            />
            <span>
              {item.available ? "Available" : "Unavailable"}
            </span>
          </div>

          <motion.div
            whileHover={{ scale: 1.06, rotate: -2 }}
            className="shrink-0 flex items-baseline gap-0.5 rounded-md bg-linear-to-br from-[#183c32] to-[#285f4e] px-1.5 py-0.5 text-white shadow-sm sm:gap-1 sm:rounded-xl sm:px-3 sm:py-2 md:px-3 md:py-2"
          >
            <span className="text-[5px] font-bold uppercase text-[#e4b85f] sm:text-[8px] md:text-[10px]">
              AED
            </span>
            <span className="text-xs font-black leading-none sm:text-lg md:text-2xl">
              {item.price}
            </span>
          </motion.div>
        </div>
      </div>
    </motion.article>
  );
}

