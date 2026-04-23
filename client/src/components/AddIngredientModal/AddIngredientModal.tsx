import { useState } from "react";
import styles from "./AddIngredientModal.module.css";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

const CATEGORIES = [
  "vegetables",
  "fruits",
  "dairy",
  "meat",
  "seafood",
  "grains",
  "herbs",
  "spices",
  "baked goods",
  "canned goods",
  "frozen",
  "sauces",
  "spreads",
  "snacks",
  "other",
];

const UNITS = [
  "g",
  "kg",
  "ml",
  "L",
  "cup",
  "tbsp",
  "tsp",
  "piece",
  "lb",
  "count",
  "oz",
  "",
];

type Props = {
  neighborhoodId: string;
  token: string | null;
  onCreated: (ingredient: any) => void;
  onClose: () => void;
  existingIngredient?: {
    _id: string;
    name: string;
    description: string;
    quantity: { value: number; unit: string };
    expiresAt: string;
    category: string;
    imageUrl: string;
  };
};

type FormState = {
  name: string;
  quantity_value: string;
  quantity_unit: string;
  category: string;
  description: string;
  expiresAt: string;
};

const EMPTY_FORM: FormState = {
  name: "",
  quantity_value: "",
  quantity_unit: "g",
  category: "vegetables",
  description: "",
  expiresAt: "",
};

const INITIAL_FORM = (existing?: Props["existingIngredient"]): FormState =>
  existing
    ? {
        name: existing.name,
        quantity_value: String(existing.quantity.value),
        quantity_unit: existing.quantity.unit,
        category: existing.category,
        description: existing.description,
        expiresAt: existing.expiresAt.split("T")[0],
      }
    : EMPTY_FORM;

export default function AddIngredientModal({
  neighborhoodId,
  onCreated,
  onClose,
  existingIngredient,
}: Props) {
  const isEditing = !!existingIngredient;
  const [form, setForm] = useState<FormState>(INITIAL_FORM(existingIngredient));
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    existingIngredient?.imageUrl ?? null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const today = new Date().toISOString().split("T")[0];

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const qtyNum = parseInt(form.quantity_value);
    if (isNaN(qtyNum) || qtyNum <= 0) {
      setError("Quantity must be a positive number.");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      console.log("editing token:", token);
      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("expiresAt", form.expiresAt);
      formData.append("category", form.category);
      formData.append("quantity[value]", String(qtyNum));
      formData.append("quantity[unit]", form.quantity_unit);

      if (isEditing) {
        formData.append("_id", existingIngredient!._id);
        console.log("_id being sent:", formData.get("_id"));

        if (image) formData.append("image", image);
        console.log("editing id:", existingIngredient!._id);
        console.log("formData _id:", formData.get("_id"));

        console.log("FormData entries:");
        for (const [key, value] of formData.entries()) {
          console.log(key, value);
        }

        await axios.post(`${API_URL}/api/editIngredient`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            // "Content-Type": "multipart/form-data",
          },
        });
      } else {
        formData.append("neighborhood", neighborhoodId);
        if (image) formData.append("image", image);

        const res = await axios.post(
          `${API_URL}/api/createIngredient`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              // "Content-Type": "multipart/form-data",
            },
          },
        );
        onCreated(res.data.ingredient);
        setForm(EMPTY_FORM);
        setImage(null);
        onClose();
        return;
      }

      onCreated(null);
      setForm(EMPTY_FORM);
      setImage(null);
      onClose();
    } catch (err: any) {
      const message = err.response?.data?.errors
        ? Object.values(err.response.data.errors).flat().join(", ")
        : err.response?.data?.error ||
          err.message ||
          "Failed to create listing";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>{isEditing ? "Edit Scrap" : "Post a Scrap"}</h2>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <p className={styles.error}>{error}</p>}

          <label className={styles.label}>
            Name *
            <input
              className={styles.input}
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Tomatoes"
              required
            />
          </label>

          <div className={styles.row}>
            <label className={styles.label}>
              Quantity *
              <input
                className={styles.input}
                type="number"
                name="quantity_value"
                value={form.quantity_value}
                onChange={handleChange}
                placeholder="Amount"
                min="1"
                step="1"
                required
              />
            </label>

            <label className={styles.label}>
              Unit
              <select
                className={styles.input}
                name="quantity_unit"
                value={form.quantity_unit}
                onChange={handleChange}
              >
                {UNITS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className={styles.label}>
            Category
            <select
              className={`${styles.input} ${styles.inputCategory}`}
              name="category"
              value={form.category}
              onChange={handleChange}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>

          <label className={styles.label}>
            Expiration Date *
            <input
              className={styles.input}
              type="date"
              name="expiresAt"
              value={form.expiresAt}
              onChange={handleChange}
              min={today}
              required
            />
          </label>

          <label className={styles.label}>
            Description
            <textarea
              className={styles.input}
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Any notes about the ingredient..."
              rows={2}
            />
          </label>

          <label className={styles.label}>
            Photo (optional)
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Current Image"
                style={{
                  width: "140px",
                  maxHeight: "auto",
                  objectFit: "cover",
                  borderRadius: "6px",
                  marginBottom: "6px",
                }}
              />
            )}
            <input
              className={styles.input}
              type="file"
              accept="image/*"
              // onChange={(e) => setImage(e.target.files?.[0] ?? null)}
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null;
                setImage(file);
                if (file) setPreviewUrl(URL.createObjectURL(file));
              }}
            />
          </label>

          <div className={styles.modalFooter}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={loading}
            >
              {loading
                ? isEditing
                  ? "Saving..."
                  : "Posting..."
                : isEditing
                  ? "Save Changes"
                  : "Post Scrap"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
