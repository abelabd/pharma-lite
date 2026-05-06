"use client";

import { Medicine } from "@/types/medicine";
import ExpiryBadge from "./ExpiryBadge";
import { getExpiryStatus } from "@/lib/expiry";

interface MedicineTableProps {
  medicines: Medicine[];
  onEdit: (medicine: Medicine) => void;
  onDelete: (medicine: Medicine) => void;
}

const rowHighlight = {
  expired: "bg-red-50/60",
  critical: "bg-red-50/30",
  warning: "bg-amber-50/40",
  ok: "",
};

export default function MedicineTable({ medicines, onEdit, onDelete }: MedicineTableProps) {
  if (medicines.length === 0) {
    return (
      <div className="text-center py-20 text-slate-400">
        <div className="text-4xl mb-3">💊</div>
        <p className="font-medium">No medicines in inventory</p>
        <p className="text-sm mt-1">Add your first item to get started</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100">
            {["Medicine", "Category", "Stock", "Price", "Expiry Date", "Supplier", ""].map((h) => (
              <th
                key={h}
                className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide pb-3 px-4 first:pl-6 last:pr-6"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {medicines.map((med) => {
            const status = getExpiryStatus(med.expiryDate);
            return (
              <tr key={med.id} className={`medicine-row transition-colors ${rowHighlight[status]}`}>
                <td className="py-4 px-4 pl-6">
                  <p className="font-medium text-slate-800">{med.name}</p>
                </td>
                <td className="py-4 px-4">
                  <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
                    {med.category}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span
                    className={`font-semibold ${
                      med.quantity <= 20 ? "text-red-600" : "text-slate-800"
                    }`}
                  >
                    {med.quantity}
                  </span>
                  <span className="text-slate-400 text-xs ml-1">{med.unit}</span>
                </td>
                <td className="py-4 px-4 text-slate-700">
                  ${Number(med.price).toFixed(2)}
                </td>
                <td className="py-4 px-4">
                  <ExpiryBadge expiryDate={med.expiryDate} />
                </td>
                <td className="py-4 px-4 text-slate-500">{med.supplier}</td>
                <td className="py-4 px-4 pr-6">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(med)}
                      className="text-xs font-medium text-teal-600 hover:text-teal-800 hover:bg-teal-50 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(med)}
                      className="text-xs font-medium text-slate-400 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
