# Payroll & Expense Tracker

A professional, high-fidelity React application designed for streamlined financial management. This tool allows businesses to track personnel, infrastructure, and vendor costs with robust persistence and automated report generation.

## Key Features

- **💼 Categorized Expenses**: Organize entries into Personnel, Infrastructure, Vendors, and Field Expenses.
- **🔄 Recurring Payments**: Manage recurring costs with custom frequencies (Weekly, Bi-weekly, Monthly, Annually).
- **📊 Professional Dashboard**: Real-time totals for current period expenditure and active recurring payments.
- **📄 Automated Invoicing**: Generates professional, print-ready financial reports (invoices) for each pay period.
- **💾 Robust Persistence**: Uses IndexedDB (via Dexie.js) to ensure data stays safe across sessions.
- **🎨 Financial Aesthetic**: A sleek "Money Green" and White theme for a professional experience.

## How to Use

### 1. Initial Setup
On your first visit, enter your **Company Name** and preferred **Reporting Frequency**. This defines when the app will "close the books" and generate reports.

### 2. Adding Expenses
Click **"Add Entry"** to log an expense. Provide a name, optional details, date, and price. For ongoing costs, check the **"Recurring"** box to set a frequency.

### 3. Monitoring Totals
Your dashboard always displays:
- **Current Period Total**: The sum of all active entries in the current pay period.
- **Recurring Payments**: The total commitment for all recurring items.

### 4. Generating Reports
When a pay period ends (or manually triggered), click **"Close Period & Generate Report"**. This creates an invoice-style snapshot in the **Reports** tab.

## Technical Details

- **Stack**: React 19 + Vite
- **State**: Zustand
- **Storage**: Dexie.js (IndexedDB)
- **Icons**: Lucide React
- **Styling**: Pure CSS (Financial Theme)

Developed with focus on visual excellence and data integrity.
