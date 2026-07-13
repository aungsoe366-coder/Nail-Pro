with open('src/AppCore.tsx', 'rb') as f:
    text = f.read().decode('utf-8')

with open('/tmp/expense_component_fixed.tsx', 'r') as f:
    new_expense = f.read()

start = text.find('export const ExpenseListPage: React.FC = () => {')
end = text.find('export const HistoryPage: React.FC = () => {')

if start != -1 and end != -1:
    new_text = text[:start] + new_expense + text[end:]
    with open('src/AppCore.tsx', 'w') as f:
        f.write(new_text)
    print("Replaced in AppCore")
else:
    print("Could not find boundaries")
