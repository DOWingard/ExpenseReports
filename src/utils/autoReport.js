import { format, isSameDay, parseISO, startOfDay } from 'date-fns';
import { generateReport } from './reportLogic';

export const checkAndAutoGenerateReport = async (settings, expenses, reports, addReport) => {
    if (!settings) return;

    const today = startOfDay(new Date());
    const reportDay = settings.reportDay; // e.g. "23" for today's date in this context
    const currentMonthYear = format(today, 'MMMM yyyy');

    // Check if report for this period already exists
    const reportExists = reports.some(r => r.payPeriod === currentMonthYear);

    // If it's the report day and the report hasn't been generated yet
    if (!reportExists && (today.getDate().toString() === reportDay || isSameDay(today, new Date()))) {
        console.log(`Auto-generating report for ${currentMonthYear}`);
        const report = generateReport(expenses, currentMonthYear);
        await addReport(report);
        return true;
    }

    return false;
};
