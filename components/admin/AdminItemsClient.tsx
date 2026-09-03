"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  X,
  Upload,
  Loader2,
  Tags,
} from "lucide-react";
import { fetchMenu, getMenuImageUrl } from "@/lib/menu";
import { EMPTY_MENU, type Category, type MenuData, type MenuItem } from "@/types/menu";
import MenuImage from "@/components/menu/MenuImage";
import CategoryForm from "@/components/admin/CategoryForm";

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
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingItem, setEditingItem] =
    useState<MenuItem | null>(null);
  const [categoryName, setCategoryName] = useState("");
  const [categoryIcon, setCategoryIcon] = useState("🍽️");
  const [categoryError, setCategoryError] = useState("");

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

      setMenu(await fetchMenu({ includeAll: true }));
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

  function extractFilenameFromImageUrl(imageUrl: string): string | null {
    const match = imageUrl.match(/\/api\/menu\/image\/([^/?]+)/);
    return match ? match[1] : null;
  }

  async function deleteImageFile(imageUrl: string) {
    const filename = extractFilenameFromImageUrl(imageUrl);
    if (!filename) return;

    try {
      const response = await fetch(
        `/api/menu/image/${filename}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        console.warn(`Failed to delete image: ${filename}`);
      }
    } catch (error) {
      console.error("Error deleting image:", error);
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

    // Delete the image file from storage
    if (item.image) {
      await deleteImageFile(item.image);
    }

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
    // If editing and image changed, delete the old image
    if (editingItem && editingItem.image !== item.image) {
      await deleteImageFile(editingItem.image);
    }

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

  async function handleSaveCategory(event: React.FormEvent) {
    event.preventDefault();

    const name = categoryName.trim();
    const id = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

    if (name.length < 3 || !id) {
      setCategoryError("Category name must be at least 3 characters");
      return;
    }

    if (menu.categories.some(
      (category) =>
        category.id === id ||
        category.name.trim().toLowerCase() === name.toLowerCase(),
    )) {
      setCategoryError("A category with this name already exists");
      return;
    }

    const category: Category = {
      id,
      name,
      icon: categoryIcon.trim() || "🍽️",
      sort_order: Math.max(0, ...menu.categories.map((item) => item.sort_order)) + 1,
      active: true,
    };

    const success = await saveMenu({
      ...menu,
      categories: [...menu.categories, category],
    });

    if (success) {
      setCategoryName("");
      setCategoryIcon("🍽️");
      setCategoryError("");
      setShowCategoryForm(false);
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
      <header className="border-b border-[#e1d7c8] bg-[#fffdf8] px-5 py-6 sm:px-10 sm:py-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#e4b85f]">Content library</p>

            <h1 className="mt-2 text-3xl font-black tracking-tight text-[#15382f]">
              Menu Items
            </h1>
            <p className="mt-2 text-sm text-neutral-500">Keep dishes, prices, and availability up to date.</p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              onClick={() => setShowCategoryForm(true)}
              disabled={saving}
              className="flex items-center justify-center gap-2 rounded-2xl border border-[#b8c9c0] bg-[#fffdf8] px-5 py-3 text-sm font-bold text-[#15382f] transition hover:bg-[#e7efe9] disabled:opacity-50"
            >
              <Tags size={18} />
              Add Category
            </button>

            <button
              onClick={handleAdd}
              disabled={saving}
              className="flex items-center justify-center gap-2 rounded-2xl bg-[#15382f] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#285647] disabled:opacity-50"
            >
              <Plus size={18} />
              Add Item
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl p-5 sm:p-10">
        <div className="flex flex-col gap-4 rounded-3xl border border-[#e1d7c8] bg-[#fffdf8] p-4 shadow-[0_8px_25px_rgb(75_53_35/0.05)] sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div>
            <p className="text-sm font-bold text-[#15382f]">Menu catalog</p>
            <p className="mt-1 text-xs text-neutral-500">Search and manage every dish in one place.</p>
          </div>
          <div className="relative w-full sm:max-w-sm">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
            />

            <input
              type="search"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search menu items..."
              className="w-full rounded-2xl border border-[#b8c9c0] bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#285647] focus:ring-2 focus:ring-[#285647]/10"
            />
          </div>
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
        <div className="mt-6 overflow-hidden rounded-3xl border border-[#e3ded4] bg-[#fbfaf7] shadow-[0_12px_35px_rgb(24_60_50/0.05)]">
          <div className="flex items-center justify-between border-b border-[#e9e4db] px-5 py-4 sm:px-7">
            <div>
              <p className="text-sm font-bold text-[#15382f]">All menu items</p>
              <p className="mt-1 text-xs text-neutral-500">{filteredItems.length} {filteredItems.length === 1 ? "item" : "items"} shown</p>
            </div>
            <span className="hidden rounded-full bg-[#e7efe9] px-3 py-1 text-xs font-bold text-[#285647] sm:inline-flex">Live catalog</span>
          </div>
          <div className="hidden grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 border-b border-[#e9e4db] px-5 py-4 text-xs font-bold uppercase tracking-wide text-[#9a9388] md:grid">
            <span>Item</span>
            <span>Category</span>
            <span>Price</span>
            <span>Status</span>
            <span>Actions</span>
          </div>

          <div className="divide-y divide-[#eee9e1]">
            {filteredItems.length > 0 ? filteredItems.map((item) => {
              const category =
                menu.categories.find(
                  (category) =>
                    category.id === item.categoryId
                );

              return (
                <div
                  key={item.id}
                  className="flex flex-col gap-4 px-5 py-5 transition hover:bg-white md:grid md:grid-cols-[2fr_1fr_1fr_1fr_auto] md:items-center"
                >
                  {/* Item */}
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-[#e9e2d7] ring-1 ring-[#d9d3c8]">
                      {item.image ? (
                        <MenuImage
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
                      <div className="flex min-w-0 items-center gap-2">
                        <p className="truncate font-bold text-neutral-900">{item.name}</p>
                        {item.popular && (
                          <span className="shrink-0 rounded-full bg-[#f7e8bd] px-2 py-0.5 text-[10px] font-bold text-[#8a632c]">
                            Popular
                          </span>
                        )}
                      </div>

                      <p className="mt-1 truncate text-xs text-neutral-500">
                        {item.description}
                      </p>
                      <div className="mt-2 flex items-center gap-2 md:hidden">
                        <span className="rounded-full bg-[#f0e8db] px-2 py-1 text-[10px] font-bold text-[#6d6253]">
                          {category?.icon} {category?.name ?? "Uncategorized"}
                        </span>
                        <span className="text-xs font-bold text-[#285647]">AED {item.price}</span>
                      </div>
                    </div>
                  </div>

                  {/* Category */}
                  <div className="hidden text-sm text-neutral-600 md:block">
                    {category?.icon}{" "}
                    {category?.name}
                  </div>

                  {/* Price */}
                  <div className="hidden font-semibold text-neutral-900 md:block">
                    AED {item.price}
                  </div>

                  {/* Status */}
                  <div className="hidden md:block">
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
                  <div className="flex shrink-0 gap-2">
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
            }) : (
              <div className="px-5 py-16 text-center sm:px-7">
                <p className="font-bold text-[#15382f]">No menu items found</p>
                <p className="mt-1 text-sm text-neutral-500">Try a different search term.</p>
              </div>
            )}
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

      {showCategoryForm && (
        <CategoryForm
          name={categoryName}
          icon={categoryIcon}
          title="Add Category"
          submitLabel="Add Category"
          error={categoryError}
          saving={saving}
          onNameChange={setCategoryName}
          onIconChange={setCategoryIcon}
          onClose={() => {
            setShowCategoryForm(false);
            setCategoryError("");
          }}
          onSubmit={handleSaveCategory}
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

  const [image] = useState(item?.image ?? "");

  const [selectedImage, setSelectedImage] =
    useState<File | null>(null);

  const [previewUrl, setPreviewUrl] =
    useState<string | null>(null);

  const [available, setAvailable] =
    useState(item?.available ?? true);

  const [popular, setPopular] =
    useState(item?.popular ?? false);

  const [saving, setSaving] =
    useState(false);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function handleImageSelect(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];

    if (!file) return;

    if (previewUrl) URL.revokeObjectURL(previewUrl);

    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  async function uploadImage(file: File) {
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
      throw new Error(data.error || "Upload failed");
    }

    return data.path as string;
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

    if (!image && !selectedImage) {
      alert("Please upload an image");
      return;
    }

    try {
      setSaving(true);

      const savedImage = selectedImage
        ? await uploadImage(selectedImage)
        : image;

      const newItem: MenuItem = {
        id:
          item?.id ??
          crypto.randomUUID(),

        name: name.trim(),

        description: description.trim(),

        price: Number(price),

        categoryId,

        image: savedImage,

        available,

        popular,
      };

      await onSave(newItem);
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to save menu item"
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-5">
      <div className="max-h-[calc(100dvh-1rem)] w-full max-w-xl overflow-y-auto rounded-t-3xl bg-white p-5 sm:rounded-3xl sm:p-6">
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
              {image || previewUrl ? (
                <div className="relative aspect-video">
                  <MenuImage
                    src={
                      previewUrl ??
                      getMenuImageUrl(image)
                    }
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
                        handleImageSelect
                      }
                      className="hidden"
                    />
                  </label>
                </div>
              ) : (
                <label className="flex cursor-pointer flex-col items-center justify-center px-5 py-12 text-center">
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

                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/avif"
                    onChange={
                      handleImageSelect
                    }
                    className="hidden"
                  />
                </label>
              )}
            </div>

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
              disabled={saving}
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

