"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  X,
  Upload,
  Loader2,
} from "lucide-react";
import { fetchMenu, getMenuImageUrl } from "@/lib/menu";
import { EMPTY_MENU, type Category, type MenuData, type MenuItem } from "@/types/menu";

export default function AdminItemsClient({
  initialMenu,
}: {
  initialMenu: MenuData | null;
}) {
  const [menu, setMenu] = useState<MenuData>(initialMenu ?? EMPTY_MENU);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] =
    useState<MenuItem | null>(null);

  useEffect(() => {
    if (initialMenu) {
      setLoading(false);
      return;
    }

    loadMenu();
  }, []);

  async function loadMenu() {
    try {
      setLoading(true);

      setMenu(await fetchMenu());
    } catch (error) {
      console.error(error);
      alert("Failed to load menu");
    } finally {
      setLoading(false);
    }
  }

  async function saveMenu(updatedMenu: MenuData) {
    try {
      setSaving(true);

      const response = await fetch("/api/menu", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedMenu),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to save menu"
        );
      }

      setMenu(updatedMenu);

      return true;
    } catch (error) {
      console.error(error);
      alert("Failed to save menu");
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    const item = menu.items.find(
      (item) => item.id === id
    );

    if (!item) return;

    const confirmed = window.confirm(
      `Delete "${item.name}"?`
    );

    if (!confirmed) return;

    const updatedMenu = {
      ...menu,
      items: menu.items.filter(
        (item) => item.id !== id
      ),
    };

    await saveMenu(updatedMenu);
  }

  function handleEdit(item: MenuItem) {
    setEditingItem(item);
    setShowForm(true);
  }

  function handleAdd() {
    setEditingItem(null);
    setShowForm(true);
  }

  async function handleSaveItem(item: MenuItem) {
    let updatedItems: MenuItem[];

    if (editingItem) {
      updatedItems = menu.items.map((existing) =>
        existing.id === item.id ? item : existing
      );
    } else {
      updatedItems = [...menu.items, item];
    }

    const updatedMenu = {
      ...menu,
      items: updatedItems,
    };

    const success = await saveMenu(updatedMenu);

    if (success) {
      setShowForm(false);
      setEditingItem(null);
    }
  }

  const filteredItems = menu.items.filter((item) =>
    item.name
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2
          className="animate-spin"
          size={32}
        />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <header className="border-b border-neutral-200 bg-white px-5 py-5 sm:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-neutral-500">
              Restaurant Menu
            </p>

            <h1 className="mt-1 text-2xl font-black text-neutral-900">
              Menu Items
            </h1>
          </div>

          <button
            onClick={handleAdd}
            disabled={saving}
            className="flex items-center justify-center gap-2 rounded-xl bg-neutral-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-neutral-800 disabled:opacity-50"
          >
            <Plus size={18} />
            Add Item
          </button>
        </div>
      </header>

      <div className="p-5 sm:p-8">
        {/* Search */}
        <div className="relative max-w-md">
          <Search
            size={19}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
          />

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search menu items..."
            className="w-full rounded-xl border border-neutral-200 bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-neutral-400"
          />
        </div>

        {/* Saving indicator */}
        {saving && (
          <div className="mt-4 flex items-center gap-2 text-sm text-neutral-500">
            <Loader2
              size={16}
              className="animate-spin"
            />
            Saving changes to GitHub...
          </div>
        )}

        {/* Items */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-neutral-200 bg-white">
          <div className="hidden grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 border-b border-neutral-100 px-5 py-4 text-xs font-bold uppercase tracking-wide text-neutral-400 md:grid">
            <span>Item</span>
            <span>Category</span>
            <span>Price</span>
            <span>Status</span>
            <span>Actions</span>
          </div>

          <div className="divide-y divide-neutral-100">
            {filteredItems.map((item) => {
              const category =
                menu.categories.find(
                  (category) =>
                    category.id === item.categoryId
                );

              return (
                <div
                  key={item.id}
                  className="flex flex-col gap-4 px-5 py-5 md:grid md:grid-cols-[2fr_1fr_1fr_1fr_auto] md:items-center"
                >
                  {/* Item */}
                  <div className="flex items-center gap-3">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-neutral-100">
                      {item.image ? (
                        <Image
                          src={getMenuImageUrl(item.image)}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-neutral-400">
                          No image
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="font-bold text-neutral-900">
                        {item.name}
                      </p>

                      <p className="mt-1 truncate text-xs text-neutral-500">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Category */}
                  <div className="text-sm text-neutral-600">
                    {category?.icon}{" "}
                    {category?.name}
                  </div>

                  {/* Price */}
                  <div className="font-semibold text-neutral-900">
                    AED {item.price}
                  </div>

                  {/* Status */}
                  <div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        item.available
                          ? "bg-green-50 text-green-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      {item.available
                        ? "Available"
                        : "Unavailable"}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        handleEdit(item)
                      }
                      className="rounded-lg border border-neutral-200 p-2 text-neutral-600 transition hover:bg-neutral-100"
                    >
                      <Pencil size={17} />
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(item.id)
                      }
                      className="rounded-lg border border-red-100 p-2 text-red-500 transition hover:bg-red-50"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <MenuItemForm
          item={editingItem}
          categories={menu.categories}
          onClose={() => {
            setShowForm(false);
            setEditingItem(null);
          }}
          onSave={handleSaveItem}
        />
      )}
    </div>
  );
}


function MenuItemForm({
  item,
  categories,
  onClose,
  onSave,
}: {
  item: MenuItem | null;
  categories: Category[];
  onClose: () => void;
  onSave: (item: MenuItem) => Promise<void>;
}) {
  const [name, setName] = useState(
    item?.name ?? ""
  );

  const [description, setDescription] = useState(
    item?.description ?? ""
  );

  const [price, setPrice] = useState(
    item?.price?.toString() ?? ""
  );

  const [categoryId, setCategoryId] = useState(
    item?.categoryId ??
      categories[0]?.id ??
      ""
  );

  const [image, setImage] = useState(
    item?.image ?? ""
  );

  const [available, setAvailable] =
    useState(item?.available ?? true);

  const [popular, setPopular] =
    useState(item?.popular ?? false);

  const [uploading, setUploading] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  async function handleImageUpload(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      setUploading(true);

      const formData = new FormData();

      formData.append("file", file);

      const response = await fetch(
        "/api/menu/image",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Upload failed"
        );
      }

      setImage(data.path);
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to upload image"
      );
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    if (!name.trim()) {
      alert("Please enter a food name");
      return;
    }

    if (!price || Number(price) < 0) {
      alert("Please enter a valid price");
      return;
    }

    if (!categoryId) {
      alert("Please select a category");
      return;
    }

    if (!image) {
      alert("Please upload an image");
      return;
    }

    const newItem: MenuItem = {
      id:
        item?.id ??
        crypto.randomUUID(),

      name: name.trim(),

      description: description.trim(),

      price: Number(price),

      categoryId,

      image,

      available,

      popular,
    };

    try {
      setSaving(true);

      await onSave(newItem);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-5">
      <div className="max-h-[95vh] w-full max-w-xl overflow-y-auto rounded-t-3xl bg-white p-6 sm:rounded-3xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-neutral-900">
              {item
                ? "Edit Menu Item"
                : "Add Menu Item"}
            </h2>

            <p className="mt-1 text-sm text-neutral-500">
              Manage food details and image
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 text-neutral-500 hover:bg-neutral-100"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-5"
        >
          {/* Name */}
          <Field label="Food Name">
            <input
              required
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              className="input"
              placeholder="Chicken Biriyani"
            />
          </Field>

          {/* Description */}
          <Field label="Description">
            <textarea
              required
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              className="input min-h-24 resize-none"
              placeholder="Describe the food..."
            />
          </Field>

          {/* Price / Category */}
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Price (AED)">
              <input
                required
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) =>
                  setPrice(e.target.value)
                }
                className="input"
                placeholder="18"
              />
            </Field>

            <Field label="Category">
              <select
                required
                value={categoryId}
                onChange={(e) =>
                  setCategoryId(e.target.value)
                }
                className="input"
              >
                {categories
                  .filter(
                    (category) =>
                      category.active
                  )
                  .map((category) => (
                    <option
                      key={category.id}
                      value={category.id}
                    >
                      {category.icon}{" "}
                      {category.name}
                    </option>
                  ))}
              </select>
            </Field>
          </div>

          {/* Image */}
          <Field label="Food Image">
            <div className="overflow-hidden rounded-2xl border border-dashed border-neutral-300">
              {image ? (
                <div className="relative aspect-video">
                  <Image
                    src={getMenuImageUrl(image)}
                    alt="Food preview"
                    fill
                    className="object-cover"
                  />

                  <label className="absolute bottom-3 right-3 flex cursor-pointer items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-bold shadow-lg">
                    <Upload size={16} />

                    Change Image

                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/avif"
                      onChange={
                        handleImageUpload
                      }
                      className="hidden"
                    />
                  </label>
                </div>
              ) : (
                <label className="flex cursor-pointer flex-col items-center justify-center px-5 py-12 text-center">
                  {uploading ? (
                    <>
                      <Loader2
                        size={30}
                        className="animate-spin text-neutral-500"
                      />

                      <p className="mt-3 text-sm font-semibold">
                        Uploading image...
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="rounded-full bg-neutral-100 p-4">
                        <Upload size={24} />
                      </div>

                      <p className="mt-4 text-sm font-bold">
                        Upload food image
                      </p>

                      <p className="mt-1 text-xs text-neutral-500">
                        JPG, PNG, WEBP or AVIF
                        · Max 5MB
                      </p>
                    </>
                  )}

                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/avif"
                    onChange={
                      handleImageUpload
                    }
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {uploading && image && (
              <p className="mt-2 flex items-center gap-2 text-xs text-neutral-500">
                <Loader2
                  size={13}
                  className="animate-spin"
                />
                Uploading new image...
              </p>
            )}
          </Field>

          {/* Options */}
          <div className="space-y-3">
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={available}
                onChange={(e) =>
                  setAvailable(
                    e.target.checked
                  )
                }
                className="h-4 w-4"
              />

              <span className="text-sm font-medium">
                Available
              </span>
            </label>

            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={popular}
                onChange={(e) =>
                  setPopular(
                    e.target.checked
                  )
                }
                className="h-4 w-4"
              />

              <span className="text-sm font-medium">
                Popular item
              </span>
            </label>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-neutral-200 px-5 py-3 text-sm font-bold"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                saving || uploading
              }
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-neutral-900 px-5 py-3 text-sm font-bold text-white disabled:opacity-50"
            >
              {saving && (
                <Loader2
                  size={16}
                  className="animate-spin"
                />
              )}

              {item
                ? "Save Changes"
                : "Add Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-neutral-700">
        {label}
      </span>

      {children}
    </label>
  );
}

