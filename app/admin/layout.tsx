"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Utensils,
  Tags,
  ExternalLink,
} from "lucide-react";
import AdminMobileNav from "@/components/admin/AdminMobileNav";

const navigation = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Menu Items",
    href: "/admin/items",
    icon: Utensils,
  },
  {
    name: "Categories",
    href: "/admin/categories",
    icon: Tags,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#eef3ef] text-neutral-900">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-[#285647] bg-[#15382f] text-white lg:block">
        <div className="flex h-full flex-col">
          <div className="border-b border-white/10 px-7 py-7">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#e4b85f]">
              Restaurant
            </p>

            <h1 className="mt-1 text-2xl font-black tracking-tight text-white">
              Menu Admin
            </h1>
            <p className="mt-2 text-xs leading-5 text-[#b9cec3]">
              Keep the menu fresh and easy to discover.
            </p>
          </div>

          <nav className="flex-1 space-y-2 p-5">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-bold transition ${
                    active
                      ? "bg-[#e4b85f] text-[#15382f] shadow-lg shadow-black/10"
                      : "text-[#c4d5cc] hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon size={19} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-white/10 p-5">
            <Link
              href="/menu"
              target="_blank"
              className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-[#c4d5cc] transition hover:bg-white/10 hover:text-white"
            >
              <ExternalLink size={18} />
              View Menu
            </Link>
          </div>
        </div>
      </aside>

      <main className="min-h-screen lg:pl-72">
        <AdminMobileNav />
        {children}
      </main>
    </div>
  );
}