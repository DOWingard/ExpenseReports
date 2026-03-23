# Payroll & Expense Tracker

A high-performance, local-first React 19 application built for multi-organization financial management and automated expense reporting.

## 🛠 Tech Stack

- **Core**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) with middleware for local persistence.
- **Persistence Layer**: [Dexie.js](https://dexie.org/) (IndexedDB wrapper) implemented with a multi-tenant schema.
- **DateTime Processing**: [date-fns](https://date-fns.org/) for robust recurrence and reporting logic.
- **Iconography**: [Lucide React](https://lucide.dev/)
- **Styling**: Standard-compliant Vanilla CSS with a custom variable-based design system.

## 🚀 Key Capabilities

### Multi-Organization Support
- Architected for multi-tenancy; users can manage isolated expense registries and reports for an unlimited number of companies.
- Context-aware navigation and automatic redirection upon organization context switching.

### Smart Recurrence Engine
- Implements a frequency-aware pro-rating algorithm in `reportLogic.js`.
- Automatically calculates and converts expense costs between different frequencies (Weekly, Bi-weekly, Monthly, and Annual).
- **Example**: An annual $1,200 subscription is intelligently pro-rated to $100.00 in a monthly financial report.

### Automated Financial Reporting
- Generates immutable snapshots of expense registries at the end of defined pay periods.
- Produces professional, print-ready reports containing both pro-rated period costs and original reference pricing.

### Performance & Security
- **Local-First Architecture**: Data never leaves the client's browser, ensuring 100% privacy and offline availability.
- **Responsive Design**: Optimized for financial desktop workflows with a focus on data density and visual hierarchy.

## 📦 Setup & Installation

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Development Server**:
   ```bash
   npm run dev -- --port 7000
   ```

3. **Running Tests**:
   ```bash
   npm test
   ```

4. **Production Build**:
   ```bash
   npm run build
   ```

## 🧪 Testing Infrastructure
- Utilizes **Vitest** for logical verification.
- Includes automated test suites for reporting normalization, multi-org isolation, and date-based recurrence triggers.
