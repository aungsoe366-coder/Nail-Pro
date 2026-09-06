const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

const target1 = `    const sale: Omit<Sale, 'id'> = {
      date: localDateStr,
      dateTime: now.toISOString(),
      staff: finalSaleStaffName,
      staffNames: uniqueSaleStaffNames.length > 0 ? uniqueSaleStaffNames : [globalStaff.name],
      staffNamesArray: uniqueSaleStaffNames.length > 0 ? uniqueSaleStaffNames : [globalStaff.name],
      staffEmail: globalStaff.email,
      customerName: selectedCustomer?.name || '',
      customerPhone: selectedCustomer?.phone || '',
      total: netTotal,
      payments: finalPayments,
      method: finalPayments.map(p => p.method).join(', '),
      commission: totalSaleCommission,
      pointsEarned,
      pointsRedeemed: pointsToRedeem,
      items: mappedItems
    };`;

const repl1 = `    const sale: Omit<Sale, 'id'> = {
      date: localDateStr,
      dateTime: now.toISOString(),
      staff: finalSaleStaffName,
      staffNames: uniqueSaleStaffNames.length > 0 ? uniqueSaleStaffNames : [globalStaff.name],
      staffNamesArray: uniqueSaleStaffNames.length > 0 ? uniqueSaleStaffNames : [globalStaff.name],
      staffEmail: globalStaff.email,
      makerName: profile?.displayName || profile?.name || profile?.email || 'System',
      customerName: selectedCustomer?.name || '',
      customerPhone: selectedCustomer?.phone || '',
      total: netTotal,
      payments: finalPayments,
      method: finalPayments.map(p => p.method).join(', '),
      commission: totalSaleCommission,
      pointsEarned,
      pointsRedeemed: pointsToRedeem,
      items: mappedItems
    };`;

code = code.replace(target1, repl1);
fs.writeFileSync('src/AppCore.tsx', code);
