import { describe, it, expect } from 'vitest';
import { calculateNextReportDate, generateReport } from '../src/utils/reportLogic';
import { format } from 'date-fns';

describe('Payroll Logic Verification', () => {

    it('should correctly aggregate expenses for a report', () => {
        const expenses = [
            { orgId: 'org123', name: 'One-time', price: 100, isRecurring: false },
            { orgId: 'org123', name: 'Monthly', price: 200, isRecurring: true, frequency: 'monthly' }
        ];

        const report = generateReport(expenses, 'Test Period');

        expect(report.totalOneTime).toBe(100);
        expect(report.totalRecurring).toBe(200);
        expect(report.totalCost).toBe(300);
        expect(report.payPeriod).toBe('Test Period');

        // Ensure expenses in report still have their orgId
        expect(report.expenses[0].orgId).toBe('org123');
    });

    it('should calculate the next report date correctly', () => {
        // Mock current date if needed, but for now we test if it returns a future date
        const nextDate = calculateNextReportDate('2026-03-01', 'monthly', '1');
        const nextDateFormatted = format(nextDate, 'yyyy-MM-dd');

        // Should be at least 2026-04-01 relative to 2026-03-01
        expect(nextDateFormatted).toBe('2026-04-01');
    });

    it('should correctly pro-rate expenses based on frequency', () => {
        const expenses = [
            { name: 'Annual Server', price: 1200, isRecurring: true, frequency: 'annual' },
            { name: 'Weekly Contractor', price: 100, isRecurring: true, frequency: 'weekly' },
            { name: 'One-time Hardware', price: 50, isRecurring: false }
        ];

        // Case 1: Monthly Report
        const monthlyReport = generateReport(expenses, 'Month View', 'monthly');
        // (1200 * 1 / 12) = 100
        // (100 * 52 / 12) = 433.333...
        // One-time = 50
        expect(monthlyReport.totalRecurring).toBeCloseTo(533.33, 1);
        expect(monthlyReport.totalOneTime).toBe(50);
        expect(monthlyReport.totalCost).toBeCloseTo(583.33, 1);

        // Case 2: Weekly Report
        const weeklyReport = generateReport(expenses, 'Week View', 'weekly');
        // (1200 * 1 / 52) = 23.076...
        // (100 * 52 / 52) = 100
        // One-time = 50
        expect(weeklyReport.totalRecurring).toBeCloseTo(123.08, 1);
        expect(weeklyReport.totalCost).toBeCloseTo(173.08, 1);

        // Case 3: Annual Report
        const annualReport = generateReport(expenses, 'Year View', 'annual');
        // (1200 * 1 / 1) = 1200
        // (100 * 52 / 1) = 5200
        // One-time = 50
        expect(annualReport.totalRecurring).toBe(6400);
        expect(annualReport.totalCost).toBe(6450);
    });

    it('should handle empty expense lists', () => {
        const report = generateReport([], 'Empty');
        expect(report.totalCost).toBe(0);
        expect(report.expenses).toEqual([]);
    });
});
