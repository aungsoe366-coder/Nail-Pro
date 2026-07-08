#!/bin/bash
sed -i -e '2960i\
export const getEffectiveStaffItems = (s: any, staffName: string) => {\
  return s.items?.map((item: any) => {\
    if (item.staffAssignments \&\& item.staffAssignments.length > 0) {\
      const assignment = item.staffAssignments.find((a: any) => a.name === staffName);\
      if (assignment) {\
        return { ...item, qty: assignment.qty };\
      }\
      return null;\
    } else if (item.staffName) {\
      if (item.staffName === staffName) return item;\
      return null;\
    } else {\
      const hasSpecificStaff = s.items?.some((i: any) => (i.staffAssignments \&\& i.staffAssignments.length > 0) || i.staffName);\
      if (!hasSpecificStaff \&\& s.staff === staffName) return item;\
      return null;\
    }\
  }).filter(Boolean) || [];\
};\
' src/AppCore.tsx
