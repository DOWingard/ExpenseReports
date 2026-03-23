import {
    addWeeks,
    addMonths,
    addYears,
    isAfter,
    startOfDay,
    format,
    parseISO,
    isBefore,
    isSameDay
} from 'date-fns';

export const calculateNextReportDate = (startDate, frequency, reportDay) => {
    let date = startOfDay(parseISO(startDate));
    const now = startOfDay(new Date());

    // Simple heuristic for frequency - in real app would be more robust
    const advance = (d) => {
        switch (frequency) {
            case 'weekly': return addWeeks(d, 1);
            case 'bi-weekly': return addWeeks(d, 2);
            case 'monthly': return addMonths(d, 1);
            case 'annually': return addYears(d, 1);
            default: return addMonths(d, 1);
        }
    };

    while (isBefore(date, now) || isSameDay(date, now)) {
        date = advance(date);
    }

    return date;
};

export const generateReport = (expenses, periodName) => {
    const oneTime = expenses.filter(e => !e.isRecurring);
    const recurring = expenses.filter(e => e.isRecurring);

    const totalOneTime = oneTime.reduce((sum, e) => sum + Number(e.price), 0);
    const totalRecurring = recurring.reduce((sum, e) => sum + Number(e.price), 0);

    return {
        payPeriod: periodName,
        totalOneTime,
        totalRecurring,
        totalCost: totalOneTime + totalRecurring,
        generationDate: new Date().toISOString(),
        expenses: expenses // Store a snapshot of expenses for that period
    };
};
