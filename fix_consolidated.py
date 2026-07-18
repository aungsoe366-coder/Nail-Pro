import re

with open('src/AppCore.tsx', 'r') as f:
    text = f.read()

new_html = """const generateConsolidatedReceiptHTML = (sales: Sale[], settings: ShopSettings | null, from: string, to: string) => {
  let html = `<div style="font-family: sans-serif; font-size: 12px; color: #000; width: 100%; max-width: 320px; margin: 0 auto;">`;
  
  // Header
  html += `<div style="text-align: center; margin-bottom: 12px;">`;
  if (settings?.receiptHeader) {
    html += `<div style="font-weight: bold; font-size: 14px; margin-bottom: 4px;">${settings.receiptHeader.replace(/\\n/g, '<br/>')}</div>`;
  }
  if (!settings?.hideShopNameOnReceipt) {
    html += `<div style="font-weight: bold; font-size: 16px; margin-bottom: 4px;">${settings?.name || "NAIL PRO BEAUTY STUDIO"}</div>`;
  }
  html += `<div style="font-weight: bold; font-size: 14px; margin-bottom: 4px;">CONSOLIDATED SALES REPORT</div>`;
  html += `<div>From: ${from}</div>`;
  html += `<div>To: ${to}</div>`;
  html += `</div>`;

  html += `<hr style="border: 0; border-top: 1px dashed #000; margin: 8px 0;" />`;

  let grandTotal = 0;
  
  sales.forEach((sale, idx) => {
    html += `<div style="margin-bottom: 4px; font-weight: bold;">Sale #${idx + 1}</div>`;
    html += `<div style="margin-bottom: 8px;">`;
    if (!settings?.hideDateTimeOnReceipt) {
      html += `<div><strong>Time:</strong> ${new Date(sale.dateTime).toLocaleTimeString()}</div>`;
    }
    if (!settings?.hideStaffNameOnReceipt) {
      let itemStaffNames: string[] = [];
      sale.items.forEach((item) => {
        if (item.staffAssignments && item.staffAssignments.length > 0) {
          itemStaffNames.push(...item.staffAssignments.map((a: any) => a.name));
        } else if (item.staffName) {
          itemStaffNames.push(item.staffName);
        }
      });
      const uniqueStaff = Array.from(new Set(itemStaffNames.filter(Boolean)));
      if (uniqueStaff.length > 0) {
        html += `<div><strong>Staff:</strong> ${uniqueStaff.join(', ')}</div>`;
      } else if (sale.staff) {
        html += `<div><strong>Staff:</strong> ${sale.staff}</div>`;
      }
    }
    html += `</div>`;
    
    html += `<table style="width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 8px;">`;
    html += `<thead>`;
    html += `<tr>`;
    html += `<th style="text-align: left; width: 40%; padding: 4px 0; border-bottom: 1px solid #000;">Item</th>`;
    html += `<th style="text-align: center; width: 15%; padding: 4px 0; border-bottom: 1px solid #000;">Qty</th>`;
    html += `<th style="text-align: right; width: 20%; padding: 4px 0; border-bottom: 1px solid #000;">Price</th>`;
    html += `<th style="text-align: right; width: 25%; padding: 4px 0; border-bottom: 1px solid #000;">Amount</th>`;
    html += `</tr>`;
    html += `</thead>`;
    html += `<tbody>`;
    
    sale.items.forEach(item => {
      const sub = item.price * item.qty;
      const netSub = sub - (sub * ((item.disP || 0) / 100));
      let fullItemName = item.name + ((item.disP || 0) > 0 ? ` <br/><small>(-${item.disP}%)</small>` : "");
      html += `<tr>`;
      html += `<td style="text-align: left; padding: 6px 0; word-wrap: break-word; vertical-align: top;">${fullItemName}</td>`;
      html += `<td style="text-align: center; padding: 6px 0; vertical-align: top;">${item.qty}</td>`;
      html += `<td style="text-align: right; padding: 6px 0; vertical-align: top;">${item.price.toLocaleString()}</td>`;
      html += `<td style="text-align: right; padding: 6px 0; vertical-align: top;">${netSub.toLocaleString()}</td>`;
      html += `</tr>`;
    });
    
    html += `<tr><td colspan="4" style="border-top: 1px dashed #000; padding-top: 4px;"></td></tr>`;
    html += `<tr style="font-weight: bold;">`;
    html += `<td colspan="3" style="text-align: right; padding: 4px 0; padding-right: 8px;">Sale Total</td>`;
    html += `<td style="text-align: right; padding: 4px 0;">${sale.total.toLocaleString()} Ks</td>`;
    html += `</tr>`;
    html += `</tbody>`;
    html += `</table>`;
    html += `<hr style="border: 0; border-top: 1px dashed #000; margin: 8px 0;" />`;
    
    grandTotal += sale.total;
  });

  html += `<table style="width: 100%; border-collapse: collapse; font-size: 14px; font-weight: bold; margin-top: 12px; margin-bottom: 12px;">`;
  html += `<tr>`;
  html += `<td style="text-align: left; padding: 6px 0;">GRAND TOTAL</td>`;
  html += `<td style="text-align: right; padding: 6px 0;">${grandTotal.toLocaleString()} Ks</td>`;
  html += `</tr>`;
  html += `</table>`;

  html += `<div style="text-align: center; font-style: italic; color: #666; margin-bottom: 12px;">Generated on: ${new Date().toLocaleString()}</div>`;
  
  if (settings?.receiptFooter) {
    html += `<div style="text-align: center;">${settings.receiptFooter.replace(/\\n/g, '<br/>')}</div>`;
  }
  
  html += `</div>`;
  return html;
};"""

pattern = r"const generateConsolidatedReceiptText = \(.*?return text;\n\};"
match = re.search(pattern, text, re.DOTALL)
if match:
    text = text.replace(match.group(0), new_html)
    print("Replaced generateConsolidatedReceiptText successfully.")
else:
    print("Could not find generateConsolidatedReceiptText.")

text = text.replace('generateConsolidatedReceiptText(filteredSales, shopSettings, dateFrom, dateTo)', 'generateConsolidatedReceiptHTML(filteredSales, shopSettings, dateFrom, dateTo)')

with open('src/AppCore.tsx', 'w') as f:
    f.write(text)

print("Done")
