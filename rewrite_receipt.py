import re

with open('src/AppCore.tsx', 'r') as f:
    text = f.read()

# Let's locate the generateReceiptText function using regex
pattern = r"const generateReceiptText = \(.*?return text;\n\};"
match = re.search(pattern, text, re.DOTALL)
if match:
    # the new html function string
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
  html += `</tbody>`;
  html += `</table>`;

  html += `<hr style="border: 0; border-top: 1px dashed #000; margin: 8px 0;" />`;

  // Totals
  html += `<table style="width: 100%; border-collapse: collapse; font-size: 12px; font-weight: bold;">`;
  html += `<tr>`;
  html += `<td style="text-align: left; padding: 4px 0; width: 55%;">NET TOTAL</td>`;
  html += `<td style="text-align: right; padding: 4px 0; width: 45%;">${sale.total.toLocaleString()} Ks</td>`;
  html += `</tr>`;
  
  if (!settings?.hideLoyaltyPointsOnReceipt && (sale.pointsEarned || sale.pointsRedeemed)) {
    if (sale.pointsEarned) {
      html += `<tr>`;
      html += `<td style="text-align: left; padding: 4px 0; font-weight: normal;">Points Earned</td>`;
      html += `<td style="text-align: right; padding: 4px 0; font-weight: normal;">+${sale.pointsEarned}</td>`;
      html += `</tr>`;
    }
    if (sale.pointsRedeemed) {
      html += `<tr>`;
      html += `<td style="text-align: left; padding: 4px 0; font-weight: normal;">Points Redeemed</td>`;
      html += `<td style="text-align: right; padding: 4px 0; font-weight: normal;">-${sale.pointsRedeemed}</td>`;
      html += `</tr>`;
    }
  }
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

    text = text.replace(match.group(0), new_receipt_html)
    print("Replaced generateReceiptText with generateReceiptHTML successfully.")
else:
    print("Regex for generateReceiptText failed.")

text = text.replace('generateReceiptText(sale, shopSettings)', 'generateReceiptHTML(sale, shopSettings)')
text = text.replace('generateReceiptText(pendingSaleParams.sale, shopSettings)', 'generateReceiptHTML(pendingSaleParams.sale, shopSettings)')

# Fix PrintPreviewModal
preview_pattern = r"const PrintPreviewModal: React\.FC<\{.*?\}\> = \(\{.*?\}\) => \{.*?if \(!isOpen\) return null;.*?return \(.*?<pre className=\"font-mono text-\[12px\] leading-\[1\.4\] whitespace-pre-wrap font-medium\">\s*\{text\}\s*</pre>.*?</div>\s*</motion\.div>\s*</div>\s*\);\s*\};"
match_modal = re.search(preview_pattern, text, re.DOTALL)
if match_modal:
    new_modal = match_modal.group(0).replace(
        '<pre className="font-mono text-[12px] leading-[1.4] whitespace-pre-wrap font-medium">\n              {text}\n            </pre>',
        '<div dangerouslySetInnerHTML={{ __html: text }} />'
    )
    text = text.replace(match_modal.group(0), new_modal)
    print("Updated PrintPreviewModal successfully via regex.")
else:
    print("Regex for PrintPreviewModal failed. Let's try simpler replacement.")
    if '<pre className="font-mono text-[12px] leading-[1.4] whitespace-pre-wrap font-medium">\n              {text}\n            </pre>' in text:
        text = text.replace(
            '<pre className="font-mono text-[12px] leading-[1.4] whitespace-pre-wrap font-medium">\n              {text}\n            </pre>',
            '<div dangerouslySetInnerHTML={{ __html: text }} />'
        )
        print("Updated PrintPreviewModal simply.")
    else:
        print("Could not find the pre tag in PrintPreviewModal.")

with open('src/AppCore.tsx', 'w') as f:
    f.write(text)

print("Done")
