import { Medicine, MedicineFormData } from "@/types/medicine";

const BASE = "http://localhost:4000";

async function req<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(err.error || "Something went wrong");
  }

  return res.json();
}

export const api = {
  getMedicines: () => req<Medicine[]>("/medicines"),

  addMedicine: (data: MedicineFormData) =>
    req<Medicine>("/medicines", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateMedicine: (id: string, data: MedicineFormData) =>
    req<Medicine>(`/medicines/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteMedicine: (id: string) =>
    req<{ message: string }>(`/medicines/${id}`, { method: "DELETE" }),
};
