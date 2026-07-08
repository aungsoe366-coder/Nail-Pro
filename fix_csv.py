import re

with open('src/AppCore.tsx', 'r') as f:
    content = f.read()

target = "[...new Set(s.items?.map(i => i.staffName || s.staff) || [s.staff])].join(', ')"
replacement = "[...new Set(s.items?.flatMap(i => (i.staffAssignments && i.staffAssignments.length > 0) ? i.staffAssignments.map(a => a.name) : [i.staffName || s.staff]) || [s.staff])].join(', ')"

new_content = content.replace(target, replacement)
if new_content == content:
    print("NO CHANGE - CSV")
else:
    with open('src/AppCore.tsx', 'w') as f:
        f.write(new_content)
    print("SUCCESS - CSV")

