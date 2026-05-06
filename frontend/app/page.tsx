"use client";

import { useState, useEffect, useMemo } from "react";
import { Medicine, MedicineFormData } from "@/types/medicine";
import { api } from "@/lib/api";
import { getExpiryStatus } from "@/lib/expiry";
import StatCard from "@/components/StatCard";
import MedicineTable from "@/components/MedicineTable";
import MedicineModal from "@/components/MedicineModal";
import DeleteConfirm from "@/components/DeleteConfirm";

export default function Dashboard() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Medicine | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<Medicine | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchMedicines = async () => {
    try {
      const data = await api.getMedicines();
      setMedicines(data);
    } catch {
      setError("Could not connect to the API. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  // Derived stats
  const stats = useMemo(() => {
    const expiring = medicines.filter((m) => {
      const s = getExpiryStatus(m.expiryDate);
      return s === "critical" || s === "warning";
    });
    const expired = medicines.filter((m) => getExpiryStatus(m.expiryDate) === "expired");
    const lowStock = medicines.filter((m) => m.quantity <= 20);
    return { total: medicines.length, expiring: expiring.length, expired: expired.length, lowStock: lowStock.length };
  }, [medicines]);

  // Categories for filter dropdown
  const categories = useMemo(() => {
    const unique = [...new Set(medicines.map((m) => m.category))];
    return ["All", ...unique.sort()];
  }, [medicines]);

  // Filtered list
  const filtered = useMemo(() => {
    return medicines.filter((m) => {
      const matchSearch =
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.supplier.toLowerCase().includes(search.toLowerCase());
      const matchCategory = filterCategory === "All" || m.category === filterCategory;
      return matchSearch && matchCategory;
    });
  }, [medicines, search, filterCategory]);

  const handleAdd = async (data: MedicineFormData) => {
    const created = await api.addMedicine(data);
    setMedicines((prev) => [...prev, created]);
  };

  const handleEdit = async (data: MedicineFormData) => {
    if (!editTarget) return;
    const updated = await api.updateMedicine(editTarget.id, data);
    setMedicines((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await api.deleteMedicine(deleteTarget.id);
      setMedicines((prev) => prev.filter((m) => m.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch {
      // leave modal open with backend error
    } finally {
      setDeleteLoading(false);
    }
  };

  const openAdd = () => {
    setEditTarget(null);
    setModalOpen(true);
  };

  const openEdit = (medicine: Medicine) => {
    setEditTarget(medicine);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#f4f6f9]">
      {/* Top nav */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">💊</span>
            </div>
            <div>
              <span className="font-semibold text-slate-800 text-lg leading-none">PharmaLite</span>
              <span className="block text-xs text-slate-400 leading-none">Inventory Manager</span>
            </div>
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <span className="text-base leading-none">+</span>
            Add Medicine
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Items"
            value={stats.total}
            accent="teal"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
          />
          <StatCard
            label="Expiring Soon"
            value={stats.expiring}
            accent="amber"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          />
          <StatCard
            label="Expired"
            value={stats.expired}
            accent="red"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
          />
          <StatCard
            label="Low Stock"
            value={stats.lowStock}
            accent="slate"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>}
          />
        </div>

        {/* Table card */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-6 py-4 border-b border-slate-100">
            <div className="flex-1">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search by name or supplier…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg text-slate-700 placeholder-slate-300"
                />
              </div>
            </div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="text-sm border border-slate-200 rounded-lg px-3 py-2 text-slate-600 bg-white"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <span className="text-xs text-slate-400 whitespace-nowrap">
              {filtered.length} result{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Content */}
          {loading ? (
            <div className="text-center py-20 text-slate-400">
              <div className="w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm">Loading inventory…</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <div className="text-3xl mb-3">⚠️</div>
              <p className="text-sm font-medium text-red-600">{error}</p>
              <button
                onClick={fetchMedicines}
                className="mt-4 text-sm text-teal-600 hover:underline"
              >
                Retry
              </button>
            </div>
          ) : (
            <MedicineTable medicines={filtered} onEdit={openEdit} onDelete={setDeleteTarget} />
          )}
        </div>
      </main>

      {/* Add/Edit modal */}
      {modalOpen && (
        <MedicineModal
          medicine={editTarget}
          onClose={() => setModalOpen(false)}
          onSubmit={editTarget ? handleEdit : handleAdd}
        />
      )}

      {/* Delete confirm */}
      {deleteTarget && (
        <DeleteConfirm
          medicine={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleteLoading}
        />
      )}
    </div>
  );
}
