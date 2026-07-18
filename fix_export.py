with open('src/AppCore.tsx', 'r') as f:
    text = f.read()

# Replace .csv with .xlsx in exportToCSVAndShare calls
text = text.replace('`.csv`', '`.xlsx`')
text = text.replace('".csv"', '".xlsx"')
text = text.replace("'.csv'", "'.xlsx'")
text = text.replace('Monthly_Summary_${year}.csv', 'Monthly_Summary_${year}.xlsx')
text = text.replace('Expense_Report_${dateFrom}_to_${dateTo}.csv', 'Expense_Report_${dateFrom}_to_${dateTo}.xlsx')
text = text.replace('Sales_Report_${dateFrom}_to_${dateTo}.csv', 'Sales_Report_${dateFrom}_to_${dateTo}.xlsx')
text = text.replace('Staff_Commissions_${dateFrom}_to_${dateTo}.csv', 'Staff_Commissions_${dateFrom}_to_${dateTo}.xlsx')
text = text.replace('Sales_Report_${year}.csv', 'Sales_Report_${year}.xlsx')

# Also fix the title of the buttons from "Export to CSV" to "Export to Excel"
text = text.replace('title="Export to CSV"', 'title="Export to Excel"')

with open('src/AppCore.tsx', 'w') as f:
    f.write(text)
print("Updated AppCore.tsx exports to .xlsx")
