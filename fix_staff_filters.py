import re

with open('src/AppCore.tsx', 'r') as f:
    content = f.read()

target = "const itemStaffNames = Array.from(new Set(s.items?.map(i => i.staffName).filter(Boolean)));"
replacement = "const itemStaffNames = Array.from(new Set(s.items?.flatMap(i => (i.staffAssignments && i.staffAssignments.length > 0) ? i.staffAssignments.map(a => a.name) : [i.staffName]).filter(Boolean)));"

new_content = content.replace(target, replacement)

if new_content == content:
    print("NO CHANGE - STAFF FILTERS")
else:
    with open('src/AppCore.tsx', 'w') as f:
        f.write(new_content)
    print("SUCCESS - STAFF FILTERS")

