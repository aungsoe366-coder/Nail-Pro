const pad = (str, len, align='left') => {
  str = String(str);
  if (str.length >= len) return str.substring(0, len);
  if (align === 'right') return str.padStart(len, ' ');
  if (align === 'center') return str.padStart(Math.floor((len - str.length)/2) + str.length, ' ').padEnd(len, ' ');
  return str.padEnd(len, ' ');
};

const generateConsolidatedReceiptText = (sales, settings, from, to) => {
  let text = '';
  const C = 32;
  if (settings?.receiptHeader) {
    text += settings.receiptHeader.split('\n').map(l => pad(l, C, 'center')).join('\n') + '\n';
  }
  if (!settings?.hideShopNameOnReceipt) {
    text += pad(settings?.name || "NAIL PRO BEAUTY STUDIO", C, 'center') + '\n';
  }
  text += pad("CONSOLIDATED SALES REPORT", C, 'center') + '\n';
  text += `From: ${from}\n`;
  text += `To: ${to}\n`;
  text += '-'.repeat(C) + '\n';
  
  let grandTotal = 0;
  sales.forEach((sale, idx) => {
    text += `Sale #${idx + 1}\n`;
    if (!settings?.hideDateTimeOnReceipt) text += `Time: ${new Date(sale.dateTime).toLocaleTimeString()}\n`;
    
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
      if (uniqueStaff.length > 0) text += `Staff: ${uniqueStaff.join(', ')}\n`;
      else if (sale.staff) text += `Staff: ${sale.staff}\n`;
    }
    
    text += pad('Item', 14) + pad('Qty', 4, 'center') + pad('Price', 6, 'right') + pad('Amt', 8, 'right') + '\n';
    text += '-'.repeat(C) + '\n';
    
    let subTotal = 0;
    let totalDiscount = 0;
    sale.items.forEach(item => {
      const sub = item.price * item.qty;
      const netSub = sub - (sub * ((item.disP || 0) / 100));
      subTotal += sub;
      totalDiscount += (sub - netSub);
      let name = item.name.substring(0, 14);
      text += pad(name, 14) + pad(String(item.qty), 4, 'center') + pad(String(item.price), 6, 'right') + pad(String(netSub), 8, 'right') + '\n';
      if ((item.disP || 0) > 0) {
        text += `  (-${item.disP}%)\n`;
      }
    });
    
    if (totalDiscount > 0) {
      text += pad('Sub Total', 20, 'right') + pad(`${subTotal} Ks`, 12, 'right') + '\n';
      text += pad('Discount', 20, 'right') + pad(`-${totalDiscount} Ks`, 12, 'right') + '\n';
    }
    text += pad('Sale Total', 20, 'right') + pad(`${sale.total} Ks`, 12, 'right') + '\n';
    text += '-'.repeat(C) + '\n';
    grandTotal += sale.total;
  });
  
  text += pad('GRAND TOTAL', 16) + pad(`${grandTotal} Ks`, 16, 'right') + '\n';
  text += '-'.repeat(C) + '\n';
  const footerText = settings?.receiptFooter || "Thank You! Please Come Again";
  text += footerText.split('\n').map(l => pad(l, C, 'center')).join('\n') + '\n';
  text += '\n\n';
  return text;
};


try {
  const text = generateConsolidatedReceiptText([], {}, "A", "B");
  console.log("TEXT:\n" + text);
} catch (e) {
  console.log("ERR: " + e);
}
