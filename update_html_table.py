import re

with open('src/AppCore.tsx', 'r') as f:
    text = f.read()

new_receipt_html = """const generateReceiptHTML = (sale: Omit<Sale, 'id'>, settings: ShopSettings | null) => {
  let html = `<div style="font-family: sans-serif; font-size: 12px; color: #000; width: 100%; max-width: 320px; margin: 0 auto;">`;
  
  // Header
  html += `<div style="text-align: center; margin-bottom: 12px;">`;
  if (settings?.receiptHeader) {
    html += `<div style="font-weight: bold; font-size: 14px; margin-bottom: 4px;">${settings.receiptHeader.replace(/\\n/g, '<br/>')}</div>`;
  }
  if (!settings?.hideShopNameOnReceipt) {
    html += `<div style="font-weight: bold; font-size: 16px; margin-bottom: 4px;">${settings?.name || "NAIL PRO BEAUTY STUDIO"}</div>`;
  }
  if (settings?.addr) {
    html += `<div style="margin-bottom: 2px;">${settings.addr.replace(/\\n/g, '<br/>')}</div>`;
  }
  if (settings?.ph) {
    html += `<div>Ph: ${settings.ph}</div>`;
  }
  html += `</div>`;

  html += `<hr style="border: 0; border-top: 1px dashed #000; margin: 8px 0;" />`;

  // Info
  html += `<div style="margin-bottom: 8px;">`;
  if (!settings?.hideDateTimeOnReceipt) {
    html += `<div><strong>Date:</strong> ${new Date(sale.dateTime).toLocaleString()}</div>`;
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

  html += `<hr style="border: 0; border-top: 1px dashed #000; margin: 8px 0;" />`;

  // Items Table
  html += `<table style="width: 100%; border-collapse: collapse; font-size: 12px;">`;
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
  
  // Empty row for spacing before totals
  html += `<tr><td colspan="4" style="border-top: 1px dashed #000; padding-top: 8px;"></td></tr>`;
  
  // Totals
  html += `<tr style="font-weight: bold;">`;
  html += `<td colspan="3" style="text-align: right; padding: 4px 0; padding-right: 8px;">NET TOTAL</td>`;
  html += `<td style="text-align: right; padding: 4px 0;">${sale.total.toLocaleString()} Ks</td>`;
  html += `</tr>`;
  
  if (!settings?.hideLoyaltyPointsOnReceipt && (sale.pointsEarned || sale.pointsRedeemed)) {
    if (sale.pointsEarned) {
      html += `<tr>`;
      html += `<td colspan="3" style="text-align: right; padding: 4px 0; padding-right: 8px;">Points Earned</td>`;
      html += `<td style="text-align: right; padding: 4px 0;">+${sale.pointsEarned}</td>`;
      html += `</tr>`;
    }
    if (sale.pointsRedeemed) {
      html += `<tr>`;
      html += `<td colspan="3" style="text-align: right; padding: 4px 0; padding-right: 8px;">Points Redeemed</td>`;
      html += `<td style="text-align: right; padding: 4px 0;">-${sale.pointsRedeemed}</td>`;
      html += `</tr>`;
    }
  }
  html += `</tbody>`;
  html += `</table>`;

  html += `<hr style="border: 0; border-top: 1px dashed #000; margin: 8px 0;" />`;

  // Footer
  html += `<div style="text-align: center; margin-top: 12px;">`;
  const footerText = settings?.receiptFooter || "Thank You! Please Come Again";
  html += `<div>${footerText.replace(/\\n/g, '<br/>')}</div>`;
  html += `</div>`;
  
  html += `</div>`;
  return html;
};"""

pattern = r"const generateReceiptHTML = \(.*?return html;\n\};"
match = re.search(pattern, text, re.DOTALL)
if match:
    text = text.replace(match.group(0), new_receipt_html)
    print("Replaced generateReceiptHTML successfully.")
else:
    print("Could not find generateReceiptHTML.")

with open('src/AppCore.tsx', 'w') as f:
    f.write(text)

print("Done")
