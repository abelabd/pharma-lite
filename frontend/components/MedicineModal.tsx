"use client";

import { useState, useEffect } from "react";
import { Medicine, MedicineFormData } from "@/types/medicine";

interface MedicineModalProps {
  medicine: Medicine | null;
  onClose: () => void;
  onSubmit: (data: MedicineFormData) => Promise<void>;
}

const CATEGORIES = [
  "Analgesic",
  "Antibiotic",
  "Antacid",
  "Antidiabetic",
  "Antihistamine",
  "Antihypertensive",
  "Cholesterol",
  "Vitamin & Supplement",
  "Other",
];

const UNITS = ["tablets", "capsules", "ml", "mg", "sachets", "vials", "strips"];

const empty: MedicineFormData = {
  name: "",
  category: "",
  quantity: 0,
  unit: "tablets",
  price: 0,
  expiryDate: "",
  supplier: "",
};

export default function MedicineModal({ medicine, onClose, onSubmit }: MedicineModalProps) {
  const [form, setForm] = useState<MedicineFormData>(empty);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isEditing = !!medicine;

  useEffect(() => {
    if (medicine) {
      const { id, ...rest } = medicine;
      setForm(rest);
    } else {
      setForm(empty);
    }
  }, [medicine]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async () => {
    if (!form.name || !form.category || !form.expiryDate || !form.supplier) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      await onSubmit(form);
      onClose();
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="modal-backdrop fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-panel bg-white rounded-2xl shadow-xl w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              {isEditing ? "Edit Medicine" : "Add Medicine"}
            </h2>
            <p className="text-sm text-slate-400 mt-0.5">
              {isEditing ? `Editing ${medicine.name}` : "Add a new item to inventory"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <div className="px-6 py-5 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label text="Medicine Name *" />
              <Input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Amoxicillin 500mg" />
            </div>

            <div>
              <Label text="Category *" />
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 bg-white transition-all"
              >
                <option value="">Select category</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <Label text="Supplier *" />
              <Input name="supplier" value={form.supplier} onChange={handleChange} placeholder="e.g. MedCore Pharma" />
            </div>

            <div>
              <Label text="Quantity *" />
              <Input name="quantity" type="number" value={String(form.quantity)} onChange={handleChange} placeholder="0" />
            </div>

            <div>
              <Label text="Unit *" />
              <select
                name="unit"
                value={form.unit}
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 bg-white transition-all"
              >
                {UNITS.map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>

            <div>
              <Label text="Price (USD) *" />
              <Input name="price" type="number" step="0.01" value={String(form.price)} onChange={handleChange} placeholder="0.00" />
            </div>

            <div>
              <Label text="Expiry Date *" />
              <Input name="expiryDate" type="date" value={form.expiryDate} onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-2 text-sm font-medium bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Saving…" : isEditing ? "Save Changes" : "Add Medicine"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Label({ text }: { text: string }) {
  return <p className="text-xs font-medium text-slate-500 mb-1.5">{text}</p>;
}

function Input({
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  step,
}: {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  step?: string;
}) {
  return (
    <input
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      step={step}
      className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 placeholder-slate-300 transition-all"
    />
  );
}
