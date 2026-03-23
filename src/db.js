import Dexie from 'dexie';

export const db = new Dexie('PayrollDB');

db.version(1).stores({
  settings: 'id, companyName, reportFrequency, reportDay, startDate',
  expenses: '++id, name, date, price, category, isRecurring, frequency, recurringDay',
  reports: '++id, payPeriod, totalOneTime, totalRecurring, totalCost, generationDate'
});

export const getSettings = () => db.settings.get('config');
export const saveSettings = (settings) => db.settings.put({ ...settings, id: 'config' });

export const getExpenses = () => db.expenses.toArray();
export const addExpense = (expense) => db.expenses.add(expense);
export const deleteExpense = (id) => db.expenses.delete(id);

export const getReports = () => db.reports.toArray();
export const addReport = (report) => db.reports.add(report);
