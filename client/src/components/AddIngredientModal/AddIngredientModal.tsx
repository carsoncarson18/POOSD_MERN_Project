import { useState } from "react";
import styles from "./AddIngredientModal.module.css";

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

export default function ({ neighborhoodId, token, onCreated, onClose }: Props) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Min date for expiry the current day
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

    // Validate quantity is a positive integer
    const qtyNum = parseInt(form.quantity_value);
    if (isNaN(qtyNum) || qtyNum <= 0) {
      setError("Quantity must be a positive number.");
      return;
    }

    setLoading(true);
    try {
      console.log("token being sent: ", token);
      const res = await fetch(`${API_URL}/api/createIngredient`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          expiresAt: form.expiresAt,
          category: form.category,
          neighborhood: neighborhoodId,
          quantity: {
            value: qtyNum,
            unit: form.quantity_unit,
          },
        }),
      });
      console.log("token here??? ", token);
      const json = await res.json();
      if (!res.ok) {
        if (json.errors) {
          const messages = Object.values(json.errors).flat().join(", ");
          throw new Error(messages);
        }
        throw new Error(json.error || "Failed to create listing");
      }

      onCreated(json.ingredient);
      setForm(EMPTY_FORM);
      setImage(null);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    // Backdrop: clicking outside closes modal
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Post a Scrap</h2>
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
              className={styles.input}
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
            <input
              className={styles.input}
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] ?? null)}
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
              {loading ? "Posting..." : "Post Scrap"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
