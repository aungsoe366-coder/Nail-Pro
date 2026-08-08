import re

with open("src/AppCore.tsx", "r", encoding="utf-8") as f:
    content = f.read()

pattern = re.compile(
    r'const stats = \[\s*\{ label: "Today\'s Sales".*?\},'
    r'\s*\{ label: "Today\'s Expenses".*?\},'
    r'\s*\{ label: "Net Profit".*?\},'
    r'\s*\{ label: "Appointments".*?\},'
    r'\s*\];',
    re.DOTALL
)

match = pattern.search(content)
if match:
    original = match.group(0)
    lines = original.split('\n')
    sales_line = lines[1]
    expenses_line = lines[2]
    profit_line = lines[3]
    appts_line = lines[4]
    
    new_stats = f"""const stats = [
{sales_line}
    ...((isAdmin || isCashier) ? [
{expenses_line}
{profit_line}
    ] : []),
{appts_line}
  ];"""
    
    content = content.replace(original, new_stats)
    with open("src/AppCore.tsx", "w", encoding="utf-8") as f:
        f.write(content)
    print("Success")
else:
    print("Not found")

