"use client";

import { useEffect, useState } from "react";
import { Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import { fetchMenu } from "@/lib/menu";
import { EMPTY_MENU, type Category, type MenuData } from "@/types/menu";
import CategoryForm from "@/components/admin/CategoryForm";

type AdminCategoriesClientProps = {
  initialMenu: MenuData | null;
};

export default function AdminCategoriesClient({
  initialMenu,
}: AdminCategoriesClientProps) {
  const [menu, setMenu] = useState(initialMenu ?? EMPTY_MENU);
  const [loading, setLoading] = useState(!initialMenu);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("🍽️");
  const [formError, setFormError] = useState("");
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  useEffect(() => {
    if (initialMenu) return;

    async function loadMenu() {
      try {
        setMenu(await fetchMenu({ includeAll: true }));
      } catch (error) {
        console.error(error);
        alert("Failed to load categories");
      } finally {
        setLoading(false);
      }
    }

    loadMenu();
  }, [initialMenu]);

  async function saveMenu(updatedMenu: MenuData) {
    try {
      setSaving(true);
      const response = await fetch("/api/menu", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedMenu),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save category");
      }

      setMenu(updatedMenu);
      return true;
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Failed to save category");
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const categoryName = name.trim();
    if (categoryName.length < 3) {
      setFormError("Category name must be at least 3 characters");
      return;
    }

    const id = categoryName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    if (!categoryName || !id) {
      setFormError("Please enter a valid category name");
      return;
    }

    if (menu.categories.some(
      (category) =>
        (category.id === id ||
          category.name.trim().toLowerCase() === categoryName.toLowerCase()) &&
          category.id !== editingCategory?.id,
    )) {
      setFormError("A category with this name already exists");
      return;
    }

    const category: Category = {
      id,
      name: categoryName,
      icon: icon.trim() || "🍽️",
      sort_order: editingCategory?.sort_order ??
        Math.max(0, ...menu.categories.map((item) => item.sort_order)) + 1,
      active: true,
    };

    const updatedCategories = editingCategory
      ? menu.categories.map((current) =>
          current.id === editingCategory.id ? category : current,
        )
      : [...menu.categories, category];
    const updatedItems = editingCategory && editingCategory.id !== id
      ? menu.items.map((item) =>
          item.categoryId === editingCategory.id
            ? { ...item, categoryId: id }
            : item,
        )
      : menu.items;

    if (await saveMenu({ ...menu, categories: updatedCategories, items: updatedItems })) {
      setName("");
      setIcon("🍽️");
      setEditingCategory(null);
      setFormError("");
      setShowForm(false);
    }
  }

  function openAddForm() {
    setEditingCategory(null);
    setName("");
    setIcon("🍽️");
    setFormError("");
    setShowForm(true);
  }

  function openEditForm(category: Category) {
    setEditingCategory(category);
    setName(category.name);
    setIcon(category.icon || "🍽️");
    setFormError("");
    setShowForm(true);
  }

  async function handleDelete(category: Category) {
    if (menu.items.some((item) => item.categoryId === category.id)) {
      setFormError("Remove the items in this category before deleting it");
      setEditingCategory(category);
      setName(category.name);
      setIcon(category.icon || "🍽️");
      setShowForm(true);
      return;
    }

    setCategoryToDelete(category);
  }

  async function confirmDeleteCategory() {
    if (!categoryToDelete) return;

    const success = await saveMenu({
      ...menu,
      categories: menu.categories.filter(
        (current) => current.id !== categoryToDelete.id,
      ),
    });

    if (success) setCategoryToDelete(null);
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  const categories = [...menu.categories].sort(
    (first, second) => first.sort_order - second.sort_order,
  );

  return (
    <div className="min-h-screen bg-[#eef3ef]">
      <header className="border-b border-[#e1d7c8] bg-[#fffdf8] px-5 py-6 sm:px-10 sm:py-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#e4b85f]">Menu structure</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-[#15382f]">Categories</h1>
            <p className="mt-2 text-sm text-neutral-500">Organize the menu into clear, discoverable sections.</p>
          </div>
          <button
            onClick={openAddForm}
            disabled={saving}
            className="flex items-center justify-center gap-2 rounded-2xl bg-[#15382f] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#285647] disabled:opacity-50"
          >
            <Plus size={18} />
            Add Category
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl p-5 sm:p-10">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-[#15382f]">Menu sections</p>
            <p className="mt-1 text-xs text-neutral-500">{categories.length} organized categories</p>
          </div>
          <span className="rounded-full bg-[#e7efe9] px-3 py-1 text-xs font-bold text-[#285647]">Live menu</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex items-center gap-4 rounded-3xl border border-[#e1d7c8] bg-[#fffdf8] p-5 shadow-[0_8px_25px_rgb(75_53_35/0.05)] transition hover:-translate-y-0.5 hover:border-[#d7a28e] hover:shadow-lg"
            >
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#e7efe9] text-3xl">
                {category.icon || "🍽️"}
              </span>
              <div className="min-w-0">
                <p className="truncate font-bold text-neutral-900">{category.name}</p>
                <p className="mt-1 text-xs text-neutral-500">
                  {menu.items.filter((item) => item.categoryId === category.id).length} {menu.items.filter((item) => item.categoryId === category.id).length === 1 ? "item" : "items"}
                  <span className="mx-1 text-neutral-300">·</span>
                  {category.active ? "Active" : "Inactive"}
                </p>
              </div>
              <div className="ml-auto flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => openEditForm(category)}
                    className="rounded-xl border border-[#b8c9c0] p-2 text-neutral-600 hover:bg-[#e7efe9]"
                  aria-label={`Edit ${category.name}`}
                >
                  <Pencil size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(category)}
                  className="rounded-xl border border-red-100 p-2 text-red-500 hover:bg-red-50"
                  aria-label={`Delete ${category.name}`}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showForm && (
        <CategoryForm
          name={name}
          icon={icon}
          title={editingCategory ? "Edit Category" : "Add Category"}
          submitLabel={editingCategory ? "Save Changes" : "Add Category"}
          error={formError}
          saving={saving}
          onNameChange={setName}
          onIconChange={setIcon}
          onClose={() => {
            setShowForm(false);
            setEditingCategory(null);
            setFormError("");
          }}
          onSubmit={handleSubmit}
        />
      )}

      {categoryToDelete && (
        <ConfirmDialog
          title="Delete Category?"
          message={`Are you sure you want to delete "${categoryToDelete.name}"?`}
          saving={saving}
          onCancel={() => setCategoryToDelete(null)}
          onConfirm={confirmDeleteCategory}
        />
      )}
    </div>
  );
}

function ConfirmDialog({
  title,
  message,
  saving,
  onCancel,
  onConfirm,
}: {
  title: string;
  message: string;
  saving: boolean;
  onCancel: () => void;
  onConfirm: () => Promise<void>;
}) {
  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 px-5">
      <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-black text-neutral-900">{title}</h2>
            <p className="mt-2 text-sm leading-5 text-neutral-500">{message}</p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-100 disabled:opacity-50"
            aria-label="Close confirmation"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="flex-1 rounded-xl border border-neutral-200 px-4 py-3 text-sm font-bold text-neutral-700 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={saving}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-50"
          >
            {saving && <Loader2 size={16} className="animate-spin" />}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

