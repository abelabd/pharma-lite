export interface Medicine {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  price: number;
  expiryDate: string; // YYYY-MM-DD
  supplier: string;
}

export type MedicineFormData = Omit<Medicine, "id">;
