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

    const advance = (d) => {
        switch (frequency) {
            case 'weekly': return addWeeks(d, 1);
            case 'bi-weekly': return addWeeks(d, 2);
            case 'monthly': return addMonths(d, 1);
            case 'annually':
            case 'annual': return addYears(d, 1);
            default: return addMonths(d, 1);
        }
    };

    while (isBefore(date, now) || isSameDay(date, now)) {
        date = advance(date);
    }

    return date;
};

export const FREQUENCY_FACTORS = {
    'weekly': 52,
    'bi-weekly': 26,
    'monthly': 12,
    'annual': 1,
    'annually': 1
};

export const generateReport = (expenses, periodName, reportFrequency = 'monthly') => {
    const reportFactor = FREQUENCY_FACTORS[reportFrequency] || 12;

    const proRatedExpenses = expenses.map(e => {
        if (!e.isRecurring) return { ...e, reportPrice: Math.round(Number(e.price) * 100) / 100 };

        const expenseFactor = FREQUENCY_FACTORS[e.frequency] || 12;
        const reportPrice = Math.round(((Number(e.price) * expenseFactor) / reportFactor) * 100) / 100;

        return {
            ...e,
            reportPrice,
            originalPrice: Number(e.price)
        };
    });

    const oneTime = proRatedExpenses.filter(e => !e.isRecurring);
    const recurring = proRatedExpenses.filter(e => e.isRecurring);

    const totalOneTime = Math.round(oneTime.reduce((sum, e) => sum + e.reportPrice, 0) * 100) / 100;
    const totalRecurring = Math.round(recurring.reduce((sum, e) => sum + e.reportPrice, 0) * 100) / 100;

    return {
        payPeriod: periodName,
        totalOneTime,
        totalRecurring,
        totalCost: totalOneTime + totalRecurring,
        generationDate: new Date().toISOString(),
        expenses: proRatedExpenses,
        reportFrequency
    };
};
