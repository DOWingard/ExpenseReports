import Dexie from 'dexie';

// Using a new DB name to clear old data and start fresh with multi-tenant schema
export const db = new Dexie('PayrollMultiTenantDB');

db.version(1).stores({
  organizations: 'id, companyName, reportFrequency, reportDay, startDate',
  expenses: '++id, orgId, name, date, price, category, isRecurring, frequency, recurringDay',
  reports: '++id, orgId, payPeriod, totalOneTime, totalRecurring, totalCost, generationDate'
});

// Helper to generate unique IDs for organizations
export const generateId = () => Math.random().toString(36).substring(2, 9);

// Organizations
export const getAllOrganizations = () => db.organizations.toArray();
export const saveOrganization = (org) => db.organizations.put(org);
export const deleteOrganization = async (orgId) => {
  await db.transaction('rw', db.organizations, db.expenses, db.reports, async () => {
    await db.organizations.delete(orgId);
    await db.expenses.where('orgId').equals(orgId).delete();
    await db.reports.where('orgId').equals(orgId).delete();
  });
};

// Expenses (Filtered by orgId)
export const getExpensesByOrg = (orgId) => db.expenses.where('orgId').equals(orgId).toArray();
export const addExpense = (expense) => db.expenses.add(expense);
export const deleteExpense = (id) => db.expenses.delete(id);

// Reports (Filtered by orgId)
export const getReportsByOrg = (orgId) => db.reports.where('orgId').equals(orgId).toArray();
export const addReport = (report) => db.reports.add(report);
