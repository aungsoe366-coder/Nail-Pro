import re

with open('src/AppCore.tsx', 'r') as f:
    content = f.read()

pattern = r"const itemStaffEmail = item\.staffEmail \|\| globalStaff\.email;\s*const itemStaffName = item\.staffName \|\| globalStaff\.name;\s*const itemStaff = staff\.find\(s => s\.email === itemStaffEmail\) \|\| globalStaff;\s*const itemSubtotal = item\.price \* item\.qty \* \(1 - item\.disP / 100\);\s*let itemCommission = 0;\s*if \(item\.allowCommission !== false\) \{\s*const proportion = subTotal > 0 \? \(itemSubtotal / subTotal\) : 0;\s*const effectivePointsDiscount = pointsDiscount \* proportion;\s*const commissionableValue = Math\.max\(0, itemSubtotal - effectivePointsDiscount\);\s*itemCommission = Math\.round\(commissionableValue \* \(\(itemStaff\.commission \|\| 0\) / 100\)\);\s*totalSaleCommission \+= itemCommission;\s*\}\s*return \{"

replacement = """const itemStaffEmail = item.staffEmail || globalStaff.email;
      const itemStaffName = item.staffName || globalStaff.name;
      const itemStaff = staff.find(s => s.email === itemStaffEmail) || globalStaff;
      const itemSubtotal = item.price * item.qty * (1 - item.disP / 100);
      let itemCommission = 0;
      let finalAssignments = item.staffAssignments ? [...item.staffAssignments] : [];
      
      if (item.allowCommission !== false) {
        const proportion = subTotal > 0 ? (itemSubtotal / subTotal) : 0;
        const effectivePointsDiscount = pointsDiscount * proportion;
        const commissionableValue = Math.max(0, itemSubtotal - effectivePointsDiscount);
        
        if (item.staffAssignments && item.staffAssignments.length > 0) {
          itemCommission = item.staffAssignments.reduce((sum, a, aIdx) => {
             const s = staff.find(st => st.name === a.name);
             let aComm = 0;
             if (s) {
                const aCommValue = commissionableValue * (a.qty / item.qty);
                aComm = Math.round(aCommValue * ((s.commission || 0) / 100));
             }
             finalAssignments[aIdx] = { ...a, commission: aComm };
             return sum + aComm;
          }, 0);
        } else {
          itemCommission = Math.round(commissionableValue * ((itemStaff.commission || 0) / 100));
        }
        totalSaleCommission += itemCommission;
      }

      return {"""

new_content = re.sub(pattern, replacement, content)
if new_content == content:
    print("No change made!")
else:
    with open('src/AppCore.tsx', 'w') as f:
        f.write(new_content)
    print("Success!")
