function generateReceiptText(sale, settings) {
  let text = '';
  const C = 32; // max characters per line for 58mm printer
  const pad = (str, len, align='left') => {
    if (str.length >= len) return str.substring(0, len);
    if (align === 'right') return str.padStart(len, ' ');
    if (align === 'center') return str.padStart(Math.floor((len - str.length)/2) + str.length, ' ').padEnd(len, ' ');
    return str.padEnd(len, ' ');
  };
  
  if (settings?.receiptHeader) {
    text += settings.receiptHeader.split('\n').map(l => pad(l, C, 'center')).join('\n') + '\n';
  }
  if (!settings?.hideShopNameOnReceipt) {
    text += pad(settings?.name || "NAIL PRO BEAUTY STUDIO", C, 'center') + '\n';
  }
  if (settings?.addr) {
    text += settings.addr.split('\n').map(l => pad(l, C, 'center')).join('\n') + '\n';
  }
  if (settings?.ph) {
    text += pad(`Ph: ${settings.ph}`, C, 'center') + '\n';
  }
  text += '-'.repeat(C) + '\n';
  
  if (!settings?.hideDateTimeOnReceipt) {
    text += `Date: ${new Date(sale.dateTime).toLocaleString()}\n`;
  }
  if (!settings?.hideStaffNameOnReceipt) {
    let itemStaffNames = [];
    sale.items.forEach((item) => {
      if (item.staffAssignments && item.staffAssignments.length > 0) {
        itemStaffNames.push(...item.staffAssignments.map((a) => a.name));
      } else if (item.staffName) {
        itemStaffNames.push(item.staffName);
      }
    });
    const uniqueStaff = Array.from(new Set(itemStaffNames.filter(Boolean)));
    if (uniqueStaff.length > 0) {
      text += `Staff: ${uniqueStaff.join(', ')}\n`;
    } else if (sale.staff) {
      text += `Staff: ${sale.staff}\n`;
    }
  }
  
  text += '-'.repeat(C) + '\n';
  text += pad('Item', 14) + pad('Qty', 4, 'center') + pad('Price', 6, 'right') + pad('Amt', 8, 'right') + '\n';
  text += '-'.repeat(C) + '\n';
  
  let subTotal = 0;
  let totalDiscount = 0;
  sale.items.forEach(item => {
    const sub = item.price * item.qty;
    const netSub = sub - (sub * ((item.disP || 0) / 100));
    subTotal += sub;
    totalDiscount += (sub - netSub);
    
    // Print item name on first line
    let name = item.name.substring(0, 14);
    text += pad(name, 14) + pad(String(item.qty), 4, 'center') + pad(String(item.price), 6, 'right') + pad(String(netSub), 8, 'right') + '\n';
    if ((item.disP || 0) > 0) {
      text += `  (-${item.disP}%)\n`;
    }
  });
  text += '-'.repeat(C) + '\n';
  
  if (totalDiscount > 0) {
    text += pad('Sub Total', 20, 'right') + pad(`${subTotal} Ks`, 12, 'right') + '\n';
    text += pad('Discount', 20, 'right') + pad(`-${totalDiscount} Ks`, 12, 'right') + '\n';
  }
  
  text += pad('NET TOTAL', 20, 'right') + pad(`${sale.total} Ks`, 12, 'right') + '\n';
  
  if (!settings?.hideLoyaltyPointsOnReceipt && (sale.pointsEarned || sale.pointsRedeemed)) {
    if (sale.pointsEarned) text += pad('Pts Earned', 20, 'right') + pad(`+${sale.pointsEarned}`, 12, 'right') + '\n';
    if (sale.pointsRedeemed) text += pad('Pts Redeemed', 20, 'right') + pad(`-${sale.pointsRedeemed}`, 12, 'right') + '\n';
  }
  
  text += '-'.repeat(C) + '\n';
  
  const footerText = settings?.receiptFooter || "Thank You! Please Come Again";
  text += footerText.split('\n').map(l => pad(l, C, 'center')).join('\n') + '\n';
  
  // Add some padding at the end for the cutter
  text += '\n\n';
  
  return text;
}
console.log(generateReceiptText({
  dateTime: new Date().toISOString(),
  total: 5000,
  staff: 'Alice',
  items: [
    { name: 'Manicure', qty: 1, price: 5000, disP: 0 }
  ]
}, { name: 'My Shop' }));
