import { create } from 'zustand';
import {
    db,
    getAllOrganizations,
    saveOrganization,
    deleteOrganization,
    getExpensesByOrg,
    getReportsByOrg,
    addExpense as dbAddExpense,
    deleteExpense as dbDeleteExpense,
    addReport as dbAddReport
} from './db';

const useStore = create((set, get) => ({
    organizations: [],
    activeOrgId: localStorage.getItem('activeOrgId') || null,
    settings: null, // Current active org settings
    expenses: [],
    reports: [],
    isLoading: true,

    init: async () => {
        const orgs = await getAllOrganizations();
        let activeId = get().activeOrgId;

        // If activeOrgId is set but not in list, clear it
        if (activeId && !orgs.find(o => o.id === activeId)) {
            activeId = null;
        }

        set({ organizations: orgs, activeOrgId: activeId });

        if (activeId) {
            await get().loadOrgData(activeId);
        } else {
            set({ isLoading: false });
        }
    },

    loadOrgData: async (orgId) => {
        set({ isLoading: true });
        const orgs = await getAllOrganizations();
        const settings = orgs.find(o => o.id === orgId);
        const expenses = await getExpensesByOrg(orgId);
        const reports = await getReportsByOrg(orgId);

        localStorage.setItem('activeOrgId', orgId);
        set({
            settings,
            expenses,
            reports,
            activeOrgId: orgId,
            isLoading: false
        });
    },

    setActiveOrg: async (orgId) => {
        if (!orgId) {
            localStorage.removeItem('activeOrgId');
            set({ activeOrgId: null, settings: null, expenses: [], reports: [] });
            return;
        }
        await get().loadOrgData(orgId);
    },

    addOrganization: async (orgData) => {
        await saveOrganization(orgData);
        const orgs = await getAllOrganizations();
        set({ organizations: orgs });
        await get().loadOrgData(orgData.id);
    },

    removeOrganization: async (orgId) => {
        await deleteOrganization(orgId);
        const orgs = await getAllOrganizations();
        const nextActiveId = get().activeOrgId === orgId ? null : get().activeOrgId;

        set({ organizations: orgs });
        if (!nextActiveId) {
            await get().setActiveOrg(null);
        }
    },

    updateSettings: async (newSettings) => {
        const orgId = get().activeOrgId;
        const updated = { ...newSettings, id: orgId };
        await saveOrganization(updated);
        set({ settings: updated });
    },

    addExpense: async (expense) => {
        const orgId = get().activeOrgId;
        const expenseWithOrg = { ...expense, orgId };
        const id = await dbAddExpense(expenseWithOrg);
        set((state) => ({ expenses: [...state.expenses, { ...expenseWithOrg, id }] }));
    },

    removeExpense: async (id) => {
        await dbDeleteExpense(id);
        set((state) => ({ expenses: state.expenses.filter(e => e.id !== id) }));
    },

    addReport: async (report) => {
        const orgId = get().activeOrgId;
        const reportWithOrg = { ...report, orgId };
        const id = await dbAddReport(reportWithOrg);
        set((state) => ({ reports: [...state.reports, { ...reportWithOrg, id }] }));
    }
}));

export default useStore;
