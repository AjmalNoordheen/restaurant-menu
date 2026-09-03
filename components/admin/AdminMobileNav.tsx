"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ExternalLink,
  LayoutDashboard,
  Menu,
  Tags,
  Utensils,
  X,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Menu Items", href: "/admin/items", icon: Utensils },
  { name: "Categories", href: "/admin/categories", icon: Tags },
];

export default function AdminMobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between border-b border-[#285647] bg-[#15382f] px-5 py-4 text-white lg:hidden">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#e4b85f]">
            Restaurant
          </p>
          <p className="text-lg font-black text-white">Menu Admin</p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 text-white hover:bg-white/10"
          aria-label="Open admin navigation"
          aria-expanded={open}
        >
          <Menu size={21} />
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
            aria-label="Close admin navigation"
          />
          <aside className="relative h-full w-72 max-w-[85vw] bg-white p-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-5">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">
                  Restaurant
                </p>
                <p className="mt-1 text-lg font-black text-neutral-900">Menu Admin</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-xl text-neutral-500 hover:bg-neutral-100"
                aria-label="Close admin navigation"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="mt-5 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-900"
                  >
                    <Icon size={19} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            <Link
              href="/menu"
              target="_blank"
              onClick={() => setOpen(false)}
              className="mt-6 flex items-center gap-3 border-t border-neutral-100 px-4 pt-5 text-sm font-medium text-neutral-600 hover:text-neutral-900"
            >
              <ExternalLink size={18} />
              View Menu
            </Link>
          </aside>
        </div>
      )}
    </>
  );
}
