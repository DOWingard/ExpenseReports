import { create } from 'zustand';
import { db, getSettings, saveSettings, getExpenses, addExpense, deleteExpense, getReports } from './db';

const useStore = create((set, get) => ({
    settings: null,
    expenses: [],
    reports: [],
    isLoading: true,

    init: async () => {
        const settings = await getSettings();
        const expenses = await getExpenses();
        const reports = await getReports();
        set({ settings, expenses, reports, isLoading: false });
    },

    updateSettings: async (newSettings) => {
        await saveSettings(newSettings);
        set({ settings: newSettings });
    },

    addExpense: async (expense) => {
        const id = await addExpense(expense);
        set((state) => ({ expenses: [...state.expenses, { ...expense, id }] }));
    },

    removeExpense: async (id) => {
        await deleteExpense(id);
        set((state) => ({ expenses: state.expenses.filter(e => e.id !== id) }));
    },

    addReport: async (report) => {
        const id = await db.reports.add(report);
        set((state) => ({ reports: [...state.reports, { ...report, id }] }));
    }
}));

export default useStore;
