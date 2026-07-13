import re

with open('src/AppCore.tsx', 'r') as f:
    text = f.read()

start = text.find('export const ExpenseListPage: React.FC = () => {')
end = text.find('export const HistoryPage: React.FC = () => {')

with open('/tmp/expense_component.tsx', 'w') as f:
    f.write(text[start:end])
print("Extracted to /tmp/expense_component.tsx")
