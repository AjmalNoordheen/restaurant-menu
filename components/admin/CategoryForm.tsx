import { Loader2, Tags, X } from "lucide-react";
import { CATEGORY_EMOJIS } from "@/components/admin/category-options";

type CategoryFormProps = {
  name: string;
  icon: string;
  title: string;
  submitLabel: string;
  error: string;
  saving: boolean;
  onNameChange: (value: string) => void;
  onIconChange: (value: string) => void;
  onClose: () => void;
  onSubmit: (event: React.FormEvent) => Promise<void>;
};

export default function CategoryForm({
  name,
  icon,
  title,
  submitLabel,
  error,
  saving,
  onNameChange,
  onIconChange,
  onClose,
  onSubmit,
}: CategoryFormProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-5">
      <div className="max-h-[calc(100dvh-1rem)] w-full max-w-md overflow-y-auto rounded-t-3xl bg-white p-5 sm:rounded-3xl sm:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tags size={20} />
            <h2 className="text-xl font-black text-neutral-900">{title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-neutral-500 hover:bg-neutral-100"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="mt-6 space-y-5">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-neutral-700">Category Name</span>
            <input
              required
              value={name}
              onChange={(event) => onNameChange(event.target.value)}
              className="input"
              placeholder="Hot Drinks"
            />
            {error && (
              <p className="mt-2 text-xs font-medium text-red-600">{error}</p>
            )}
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-neutral-700">Icon</span>
            <input
              value={icon}
              readOnly
              className="input"
              aria-label="Selected category icon"
            />
            <div className="no-scrollbar mt-3 grid max-h-40 grid-cols-8 gap-2 overflow-y-auto overscroll-contain pr-1 sm:max-h-48">
              {CATEGORY_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => onIconChange(emoji)}
                  aria-label={`Select ${emoji} icon`}
                  aria-pressed={icon === emoji}
                  className={`flex h-10 items-center justify-center rounded-lg border text-xl transition ${
                    icon === emoji
                      ? "border-neutral-900 bg-neutral-100"
                      : "border-neutral-200 hover:bg-neutral-50"
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </label>

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
              {saving && <Loader2 size={16} className="animate-spin" />}
              {submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
