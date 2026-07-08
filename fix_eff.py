import re

with open('src/AppCore.tsx', 'r') as f:
    content = f.read()

target = """export const getEffectiveStaffItems = (s: any, staffName: string) => {
  return s.items?.map((item: any) => {
    if (item.staffAssignments && item.staffAssignments.length > 0) {
      const assignment = item.staffAssignments.find((a: any) => a.name === staffName);
      if (assignment) {
        return { ...item, qty: assignment.qty, commission: assignment.commission };
      }
      return null;
    } else if (item.staffName) {
      if (item.staffName === staffName) return item;
      return null;
    } else {
      const hasSpecificStaff = s.items?.some((i: any) => (i.staffAssignments && i.staffAssignments.length > 0) || i.staffName);
      if (!hasSpecificStaff && s.staff === staffName) return item;
      return null;
    }
  }).filter(Boolean) || [];
};"""

replacement = """export const getEffectiveStaffItems = (s: any, staffName: string) => {
  return s.items?.map((item: any) => {
    if (item.staffAssignments && item.staffAssignments.length > 0) {
      const assignment = item.staffAssignments.find((a: any) => a.name === staffName);
      if (assignment) {
        return { 
          ...item, 
          qty: assignment.qty, 
          commission: assignment.commission, 
          originalQty: item.qty,
          originalCommission: item.commission
        };
      }
      return null;
    } else if (item.staffName) {
      if (item.staffName === staffName) {
        return { ...item, originalQty: item.qty, originalCommission: item.commission };
      }
      return null;
    } else {
      let hasSpecificStaff = false;
      if (s.items) {
        hasSpecificStaff = s.items.some((i: any) => (i.staffAssignments && i.staffAssignments.length > 0) || i.staffName);
      }
      if (!hasSpecificStaff && s.staff === staffName) {
        return { ...item, originalQty: item.qty, originalCommission: item.commission };
      }
      return null;
    }
  }).filter(Boolean) || [];
};"""

new_content = content.replace(target, replacement)
if new_content == content:
    print("NO CHANGE - EFF")
else:
    with open('src/AppCore.tsx', 'w') as f:
        f.write(new_content)
    print("SUCCESS - EFF")

