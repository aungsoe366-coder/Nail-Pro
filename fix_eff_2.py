import re

with open('src/AppCore.tsx', 'r') as f:
    content = f.read()

target = """    } else {
      let hasSpecificStaff = false;
      if (s.items) {
        hasSpecificStaff = s.items.some((i: any) => (i.staffAssignments && i.staffAssignments.length > 0) || i.staffName);
      }
      if (!hasSpecificStaff && s.staff === staffName) {
        return { ...item, originalQty: item.qty, originalCommission: item.commission };
      }
      return null;
    }"""

replacement = """    } else {
      let hasSpecificStaff = false;
      if (s.items) {
        hasSpecificStaff = s.items.some((i: any) => (i.staffAssignments && i.staffAssignments.length > 0) || i.staffName);
      }
      if (!hasSpecificStaff && (s.staff === staffName || s.staffEmail === staffName)) {
        return { ...item, originalQty: item.qty, originalCommission: item.commission };
      }
      return null;
    }"""

new_content = content.replace(target, replacement)
if new_content == content:
    print("NO CHANGE - EFF2")
else:
    with open('src/AppCore.tsx', 'w') as f:
        f.write(new_content)
    print("SUCCESS - EFF2")

