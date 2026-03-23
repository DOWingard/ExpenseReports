import { addExpense, db } from '../db';

export const seedDatabase = async (orgId) => {
    if (!orgId) {
        console.error('No organization selected for seeding');
        return;
    }

    // Clear existing data for this organization to ensure clean test state
    await db.expenses.where('orgId').equals(orgId).delete();
    await db.reports.where('orgId').equals(orgId).delete();

    const sampleExpenses = [
        {
            orgId,
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
            orgId,
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
            orgId,
            name: 'Office Rent - Main St',
            description: '',
            date: new Date().toISOString().split('T')[0],
            price: 3200,
            category: 'Personnel',
            isRecurring: true,
            frequency: 'monthly',
            recurringDay: '1'
        },
        {
            orgId,
            name: 'New Monitor Set',
            description: 'Equipment for new hire',
            date: new Date().toISOString().split('T')[0],
            price: 450.00,
            category: 'Vendors',
            isRecurring: false
        },
        {
            orgId,
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

    console.log(`Database seeded with test data for org: ${orgId}`);
};
