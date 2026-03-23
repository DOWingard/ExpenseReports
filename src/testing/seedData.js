import { addExpense, saveSettings, db } from '../src/db';

export const seedDatabase = async () => {
    // Clear existing data for fresh test
    await db.expenses.clear();
    await db.reports.clear();

    const sampleExpenses = [
        {
            name: 'Software Engineer - Level 3',
            description: 'Monthly payroll for lead dev',
            date: new Date().toISOString().split('T')[0],
            price: 8500,
            category: 'Personnel',
            isRecurring: true,
            frequency: 'monthly',
            recurringDay: '1'
        },
        {
            name: 'AWS Infrastructure',
            description: 'Cloud hosting costs',
            date: new Date().toISOString().split('T')[0],
            price: 1250.75,
            category: 'Infrastructure',
            isRecurring: true,
            frequency: 'monthly',
            recurringDay: '15'
        },
        {
            name: 'Office Rent - Main St',
            description: '',
            date: new Date().toISOString().split('T')[0],
            price: 3200,
            category: 'Personnel', // Using Personnel category for simplicity in testing groups
            isRecurring: true,
            frequency: 'monthly',
            recurringDay: '1'
        },
        {
            name: 'New Monitor Set',
            description: 'Equipment for new hire',
            date: new Date().toISOString().split('T')[0],
            price: 450.00,
            category: 'Vendors',
            isRecurring: false
        },
        {
            name: 'Business Lunch',
            description: 'Client meeting',
            date: new Date().toISOString().split('T')[0],
            price: 125.50,
            category: 'Field Expenses',
            isRecurring: false
        }
    ];

    for (const exp of sampleExpenses) {
        await addExpense(exp);
    }

    console.log('Database seeded with test data');
};
