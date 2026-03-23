import { describe, it, expect } from 'vitest';
import { calculateNextReportDate, generateReport } from '../src/utils/reportLogic';
import { format } from 'date-fns';

describe('Payroll Logic Verification', () => {

    it('should correctly aggregate expenses for a report', () => {
        const expenses = [
            { name: 'One-time', price: 100, isRecurring: false },
            { name: 'Monthly', price: 200, isRecurring: true, frequency: 'monthly' }
        ];

        const report = generateReport(expenses, 'Test Period');

        expect(report.totalOneTime).toBe(100);
        expect(report.totalRecurring).toBe(200);
        expect(report.totalCost).toBe(300);
        expect(report.payPeriod).toBe('Test Period');
    });

    it('should calculate the next report date correctly', () => {
        // Mock current date if needed, but for now we test if it returns a future date
        const nextDate = calculateNextReportDate('2026-03-01', 'monthly', '1');
        const nextDateFormatted = format(nextDate, 'yyyy-MM-dd');

        // Should be at least 2026-04-01 relative to 2026-03-01
        expect(nextDateFormatted).toBe('2026-04-01');
    });

    it('should handle empty expense lists', () => {
        const report = generateReport([], 'Empty');
        expect(report.totalCost).toBe(0);
        expect(report.expenses).toEqual([]);
    });
});
