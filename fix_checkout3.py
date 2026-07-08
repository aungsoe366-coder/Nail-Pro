import re

with open('src/AppCore.tsx', 'r') as f:
    content = f.read()

pattern = r"staffName: itemStaffName,\s*commission: itemCommission"
replacement = "staffName: itemStaffName,\n        staffAssignments: finalAssignments,\n        commission: itemCommission"

new_content = re.sub(pattern, replacement, content, count=1)
if new_content == content:
    print("No change made!")
else:
    with open('src/AppCore.tsx', 'w') as f:
        f.write(new_content)
    print("Success!")
