import Link from "next/link";
import {
  LayoutDashboard,
  Utensils,
  Tags,
  Gamepad2,
  Settings,
  ExternalLink,
} from "lucide-react";

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
  {
    name: "Games",
    href: "/admin/games",
    icon: Gamepad2,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-neutral-100">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-neutral-200 bg-white lg:block">
        <div className="flex h-full flex-col">
          <div className="border-b border-neutral-100 px-6 py-6">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-400">
              Restaurant
            </p>

            <h1 className="mt-1 text-xl font-black text-neutral-900">
              Menu Admin
            </h1>
          </div>

          <nav className="flex-1 space-y-1 p-4">
            {navigation.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-900"
                >
                  <Icon size={19} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-neutral-100 p-4">
            <Link
              href="/menu"
              target="_blank"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-900"
            >
              <ExternalLink size={18} />
              View Menu
            </Link>
          </div>
        </div>
      </aside>

      <main className="min-h-screen lg:pl-64">
        {children}
      </main>
    </div>
  );
}