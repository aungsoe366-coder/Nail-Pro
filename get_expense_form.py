import re

with open('src/AppCore.tsx', 'r') as f:
    text = f.read()

start = text.find('export const AddExpensePage: React.FC = () => {')
end = text.find('export const ExpenseListPage: React.FC = () => {')

with open('/tmp/expense_form.tsx', 'w') as f:
    f.write(text[start:end])
print("Extracted to /tmp/expense_form.tsx")
