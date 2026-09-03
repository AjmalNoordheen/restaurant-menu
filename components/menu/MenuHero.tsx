import { motion } from "framer-motion";
import { Loader2, Search } from "lucide-react";

type MenuHeroProps = {
  search: string;
  onSearchChange: (value: string) => void;
  loading?: boolean;
};

export default function MenuHero({
  search,
  onSearchChange,
  loading = false,
}: MenuHeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-[#183c32] px-5 pb-12 pt-12 text-white sm:pb-16 sm:pt-16">
      <div className="pointer-events-none absolute -right-24 -top-32 -z-10 h-80 w-80 rounded-full border-32 border-[#d8784b]/30" />
      <div className="pointer-events-none absolute -bottom-40 left-1/3 -z-10 h-80 w-80 rounded-full border-18 border-[#e4b85f]/20" />
      <div className="mx-auto max-w-6xl">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-3 text-sm font-medium uppercase tracking-[0.25em] text-[#e4b85f]"
        >
          Kerala kitchen · Dubai
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="max-w-2xl text-4xl font-black tracking-tight sm:text-6xl"
        >
          Taste of Kerala
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.6 }}
          className="mt-3 max-w-xl text-sm leading-6 text-[#d7e2dc] sm:text-base"
        >
          Authentic flavours, freshly prepared for your table.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6 }}
          className="relative mt-8 max-w-xl"
        >
          {loading ? (
            <Loader2
              size={20}
              aria-label="Searching menu"
              className="absolute left-4 top-1/2 z-10 -translate-y-1/2 animate-spin text-[#e4b85f]"
            />
          ) : (
            <Search size={20} className="absolute left-4 top-1/2 z-10 -translate-y-1/2 text-[#e4b85f]" />
          )}
          <input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search for food or drinks..."
            className="w-full rounded-2xl border border-white/15 bg-white/10 py-4 pl-12 pr-4 text-sm text-white outline-none backdrop-blur-sm placeholder:text-[#b8c9c0] focus:border-[#e4b85f]"
          />
          {search.trim().length > 0 && search.trim().length < 3 && (
            <p className="absolute left-0 top-full pt-2 text-xs text-[#d7e2dc]">
              Enter at least 3 characters to search.
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
