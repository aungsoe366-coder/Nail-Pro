#!/bin/bash
sed -i -e '/const itemStaffEmail = item.staffEmail || globalStaff.email;/i\
      let itemCommission = 0;\
      let finalAssignments = item.staffAssignments ? [...item.staffAssignments] : [];\
      if (item.allowCommission !== false \&\& item.staffAssignments \&\& item.staffAssignments.length > 0) {\
        const itemSubtotal = item.price * item.qty * (1 - item.disP / 100);\
        const proportion = subTotal > 0 ? (itemSubtotal / subTotal) : 0;\
        const effectivePointsDiscount = pointsDiscount * proportion;\
        const commissionableValue = Math.max(0, itemSubtotal - effectivePointsDiscount);\
        \
        itemCommission = item.staffAssignments.reduce((sum, a, aIdx) => {\
           const s = staff.find(st => st.name === a.name);\
           let aComm = 0;\
           if (s) {\
              const aCommValue = commissionableValue * (a.qty / item.qty);\
              aComm = Math.round(aCommValue * ((s.commission || 0) / 100));\
           }\
           finalAssignments[aIdx] = { ...a, commission: aComm };\
           return sum + aComm;\
        }, 0);\
      }' src/AppCore.tsx

sed -i -e '/let itemCommission = 0;/d' src/AppCore.tsx
sed -i -e '/if (item.allowCommission !== false) {/,/}/c\
      if (item.allowCommission !== false \&\& (!item.staffAssignments || item.staffAssignments.length === 0)) {\
        const itemSubtotal = item.price * item.qty * (1 - item.disP / 100);\
        const proportion = subTotal > 0 ? (itemSubtotal / subTotal) : 0;\
        const effectivePointsDiscount = pointsDiscount * proportion;\
        const commissionableValue = Math.max(0, itemSubtotal - effectivePointsDiscount);\
        itemCommission = Math.round(commissionableValue * ((itemStaff.commission || 0) / 100));\
      }\
      totalSaleCommission += itemCommission;' src/AppCore.tsx

