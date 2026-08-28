# AgroFeeds & Silage — Multi-Branch Inventory, Sales & POS Billing System

A responsive, modular, and modern **Multi-Branch Inventory Management and Point of Sale (POS) Billing Application** built with **React, Vite, and Tailwind CSS**.

The system is designed with a **client-side LocalStorage data architecture**, allowing full offline persistence and seamless drop-in integration with any REST / Express / MongoDB backend in the future without UI refactoring.

---

## 🌟 Key Features

### 1. Multi-Branch Hierarchy (Admin HQ + Branches 2 to 5)
* **Shop 1 (Main HQ Shop)**: Central administrative hub and flagship retail counter located at Krishnagiri.
* **Shop 2 (Hosur Branch)**: Managed by Kumar.
* **Shop 3 (Krishnagiri Branch)**: Managed by Ravi.
* **Shop 4 (Dharmapuri Branch)**: Managed by Selvam.
* **Shop 5 (Salem Branch)**: Managed by Murugan.

---

### 2. Central Inventory & Automatic Branch Stock Transfers
* **Central Warehouse Master**: Central Admin manages bulk purchases and overall warehouse stock.
* **Live Calculation Add Stock**: Real-time calculation (*Previous Stock + Added = New Stock*).
* **Automatic Branch Stock Updates**: When Admin dispatches stock to any branch:
  - Central warehouse stock automatically decreases.
  - **Branch inventory is automatically created / incremented** without requiring branch staff to manually enter products.

---

### 3. Dedicated Portals & 1-Click Fast Login
* **Separate Login Screen**:
  - **👑 Central Admin Portal**: Manage bulk inventory and dispatch transfers to all shops.
  - **🏪 Branch Shop Portals**: Direct 1-click buttons for each shop location (Hosur, Krishnagiri, Dharmapuri, Salem, HQ Shop).
* **Instant Demo Switcher**: Fast switching dropdown in top navigation to jump between Central Admin and any branch.

---

### 4. Interactive POS Billing Counter & Invoicing
* **1-Screen POS Terminal**:
  - Fast search & category filtering (`Summons`, `Feeds`, `Silage`).
  - Real-time stock pills with quantity limits preventing over-selling ("Insufficient Stock" alerts).
  - Quick customer details (defaults to Walk-in Customer).
  - Payment modes: **Cash**, **UPI / GPay**, **Card**, **Credit**.
* **Dual Print Formats**:
  - **A4 Retail Tax Invoice**: Company header, GSTIN, itemized table, authorized signatory, and terms.
  - **80mm POS Thermal Receipt**: Compact format designed for POS receipt roll printers.

---

### 5. Custom Data Importer & Clean Slate
* **CSV / Excel Product Upload**: Upload custom product catalogs via `.csv` file or paste text directly.
* **Clean Slate Option**: 1-click feature to wipe sample data and start 100% fresh with your own real products.
* **JSON Backup / Restore**: Export and import full database backups.

---

## 🚀 Getting Started

### Prerequisites
* Node.js (v18 or higher)
* npm or yarn

### Installation
```bash
# Clone repository
git clone https://github.com/madhusudhan93ms/feeds-billing.git

# Navigate to directory
cd feeds-billing

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be accessible at `http://localhost:5173/` (or `http://localhost:5174/`).

### Building for Production
```bash
npm run build
```

---

## 📁 Project Structure

```text
src/
├── components/
│   ├── billing/
│   │   ├── InvoiceModal.jsx        # Invoice preview & format switcher (A4 / Thermal)
│   │   ├── PointOfSale.jsx         # Sticky 1-screen POS billing terminal
│   │   └── PrintableInvoice.jsx    # A4 and 80mm thermal receipt templates
│   ├── common/
│   │   ├── ConfirmDialog.jsx       # Modal confirmation dialogs
│   │   ├── DataTable.jsx           # Sortable, paginated data table
│   │   ├── Modal.jsx               # Reusable modal container
│   │   ├── SearchBar.jsx           # Instant search input
│   │   ├── StatCard.jsx            # Metric & KPI cards
│   │   ├── StockStatusBadge.jsx    # Normal / Low / Out of Stock badges
│   │   └── ToastContainer.jsx      # Global toast notification system
│   └── layout/
│       ├── AdminSidebar.jsx        # Streamlined 5-item admin workflow
│       ├── AppLayout.jsx           # Responsive shell layout
│       ├── ShopSidebar.jsx         # 3-item shop staff workflow
│       └── TopNav.jsx              # Role badge, stock alert bell, user switcher
├── context/
│   ├── AppContext.jsx              # Global events, toasts, settings
│   └── AuthContext.jsx             # Role-based sessions & fast demo switching
├── data/
│   └── initialData.js              # Seed data for 5 branches, products & sales
├── pages/
│   ├── admin/                      # Admin pages (Dashboard, Central Stock, Transfers, Branches, Sales, Settings)
│   ├── auth/                       # LoginPage with separate branch portals
│   └── shop/                       # Shop pages (POS, My Stock, Bills & Invoices)
├── services/
│   └── storageService.js           # Decoupled localStorage CRUD & business invariants
├── App.jsx                         # Dynamic role-based view routing
└── index.css                       # Tailwind CSS v4 & print stylesheet
```

---

## 📄 License
MIT
