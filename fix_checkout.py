import re

with open('src/AppCore.tsx', 'r') as f:
    content = f.read()

target = """    const mappedItems = cart.map(item => {
      // Determine staff for this specific item
      const itemStaffEmail = item.staffEmail || globalStaff.email;
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
      }"""

replacement = """    const mappedItems = cart.map(item => {
      let finalAssignments = item.staffAssignments ? [...item.staffAssignments] : [];
      let itemStaffEmail = item.staffEmail;
      let itemStaffName = item.staffName;

      if (finalAssignments.length > 0) {
        itemStaffEmail = "";
        itemStaffName = "";
      } else if (!itemStaffEmail) {
        itemStaffEmail = globalStaff.email;
        itemStaffName = globalStaff.name;
      }

      const itemStaff = staff.find(s => s.email === itemStaffEmail) || globalStaff;
      const itemSubtotal = item.price * item.qty * (1 - item.disP / 100);
      let itemCommission = 0;
      
      if (item.allowCommission !== false) {
        const proportion = subTotal > 0 ? (itemSubtotal / subTotal) : 0;
        const effectivePointsDiscount = pointsDiscount * proportion;
        const commissionableValue = Math.max(0, itemSubtotal - effectivePointsDiscount);
        
        if (finalAssignments.length > 0) {
          itemCommission = finalAssignments.reduce((sum, a, aIdx) => {
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
      }"""

new_content = content.replace(target, replacement)
if new_content == content:
    print("NO CHANGE - CHECKOUT")
else:
    with open('src/AppCore.tsx', 'w') as f:
        f.write(new_content)
    print("SUCCESS - CHECKOUT")

