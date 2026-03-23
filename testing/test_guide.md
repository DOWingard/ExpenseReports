# Test Configurations

This directory contains test setups for verifying the reporting logic and data groups.

## Test Cases

### 1. Monthly Automation (NOW)
The logic in `src/utils/autoReport.js` is set to trigger if `settings.reportDay` matches the current date. For testing purposes, it is also set to fire on every load if a report for the current month doesn't exist yet.

### 2. Group Verification
Check that expenses are correctly categorized:
- **Personnel**: Salary, Wage
- **Infrastructure**: Hosting, Server
- **Vendors**: Suppliers, SaaS
- **Field Expenses**: Travel, Meals

## Seed Scripts
You can use the built-in "Beaker" icon in the bottom right of the app UI to seed the database with sample data.

### Sample Payload
```json
{
  "name": "Software Engineer - Level 3",
  "category": "Personnel",
  "price": 8500,
  "isRecurring": true,
  "frequency": "monthly"
}
```
