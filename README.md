# PharmaLite — Pharmacy Inventory Manager

A minimal full-stack pharmacy inventory management system built with Next.js and Express.

## Tech Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: JSON flat-file (no setup needed)

## Project Structure

```
pharma-lite/
├── backend/
│   ├── index.js                        # Entry point
│   └── src/
│       ├── controllers/
│       │   └── medicines.controller.js # Business logic
│       ├── routes/
│       │   └── medicines.routes.js     # Route definitions
│       ├── middleware/
│       │   └── validate.js             # Input validation
│       └── data/
│           └── medicines.json          # Data store
├── frontend/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx                    # Main dashboard
│   │   └── globals.css
│   ├── components/
│   │   ├── StatCard.tsx
│   │   ├── MedicineTable.tsx
│   │   ├── MedicineModal.tsx           # Add / Edit form
│   │   ├── ExpiryBadge.tsx
│   │   └── DeleteConfirm.tsx
│   ├── lib/
│   │   ├── api.ts                      # Fetch wrappers
│   │   └── expiry.ts                   # Expiry date helpers
│   └── types/
│       └── medicine.ts
└── README.md
```

## Getting Started

### 1. Backend

```bash
cd backend
npm install
npm run dev       # uses nodemon for auto-reload
# or
npm start         # production
```

API runs at **http://localhost:4000**

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs at **http://localhost:3000**

---

## API Reference

| Method | Endpoint            | Description        |
|--------|---------------------|--------------------|
| GET    | /medicines          | List all medicines |
| POST   | /medicines          | Add a medicine     |
| PUT    | /medicines/:id      | Update by ID       |
| DELETE | /medicines/:id      | Delete by ID       |
| GET    | /health             | Health check       |

### Example payload (POST / PUT)

```json
{
  "name": "Amoxicillin 500mg",
  "category": "Antibiotic",
  "quantity": 120,
  "unit": "capsules",
  "price": 12.50,
  "expiryDate": "2026-06-01",
  "supplier": "MedCore Pharma"
}
```

---

## Features

- View all medicines in a clean dashboard table
- Add / edit / delete medicines
- Expiry status highlighting:
  - 🔴 **Critical** — expiring within 30 days
  - 🟡 **Warning** — expiring within 90 days
  - 🔴 **Expired** — past expiry date
- Search by name or supplier
- Filter by category
- Stats overview (total, expiring, expired, low stock)
- Input validation on both frontend and backend

## Notes

- Data is stored in `backend/src/data/medicines.json`. It persists between restarts.
- For production, swap the JSON store for SQLite or PostgreSQL using the same controller interface.
