import re

with open('src/AppCore.tsx', 'r') as f:
    text = f.read()

# For generateReceiptHTML
old_receipt_loop = """  sale.items.forEach(item => {
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
  html += `</tr>`;"""

new_receipt_loop = """  let subTotal = 0;
  let totalDiscount = 0;
  sale.items.forEach(item => {
    const sub = item.price * item.qty;
    const netSub = sub - (sub * ((item.disP || 0) / 100));
    subTotal += sub;
    totalDiscount += (sub - netSub);
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
  
  if (totalDiscount > 0) {
    html += `<tr>`;
    html += `<td colspan="3" style="text-align: right; padding: 4px 0; padding-right: 8px;">Sub Total</td>`;
    html += `<td style="text-align: right; padding: 4px 0;">${subTotal.toLocaleString()} Ks</td>`;
    html += `</tr>`;
    html += `<tr>`;
    html += `<td colspan="3" style="text-align: right; padding: 4px 0; padding-right: 8px;">Total Discount</td>`;
    html += `<td style="text-align: right; padding: 4px 0;">-${totalDiscount.toLocaleString()} Ks</td>`;
    html += `</tr>`;
  }
  
  // Totals
  html += `<tr style="font-weight: bold;">`;
  html += `<td colspan="3" style="text-align: right; padding: 4px 0; padding-right: 8px;">NET TOTAL</td>`;
  html += `<td style="text-align: right; padding: 4px 0;">${sale.total.toLocaleString()} Ks</td>`;
  html += `</tr>`;"""

text = text.replace(old_receipt_loop, new_receipt_loop)

# For generateConsolidatedReceiptHTML
old_cons_loop = """    sale.items.forEach(item => {
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
    html += `</tr>`;"""

new_cons_loop = """    let subTotal = 0;
    let totalDiscount = 0;
    sale.items.forEach(item => {
      const sub = item.price * item.qty;
      const netSub = sub - (sub * ((item.disP || 0) / 100));
      subTotal += sub;
      totalDiscount += (sub - netSub);
      let fullItemName = item.name + ((item.disP || 0) > 0 ? ` <br/><small>(-${item.disP}%)</small>` : "");
      html += `<tr>`;
      html += `<td style="text-align: left; padding: 6px 0; word-wrap: break-word; vertical-align: top;">${fullItemName}</td>`;
      html += `<td style="text-align: center; padding: 6px 0; vertical-align: top;">${item.qty}</td>`;
      html += `<td style="text-align: right; padding: 6px 0; vertical-align: top;">${item.price.toLocaleString()}</td>`;
      html += `<td style="text-align: right; padding: 6px 0; vertical-align: top;">${netSub.toLocaleString()}</td>`;
      html += `</tr>`;
    });
    
    html += `<tr><td colspan="4" style="border-top: 1px dashed #000; padding-top: 4px;"></td></tr>`;
    
    if (totalDiscount > 0) {
      html += `<tr>`;
      html += `<td colspan="3" style="text-align: right; padding: 4px 0; padding-right: 8px;">Sub Total</td>`;
      html += `<td style="text-align: right; padding: 4px 0;">${subTotal.toLocaleString()} Ks</td>`;
      html += `</tr>`;
      html += `<tr>`;
      html += `<td colspan="3" style="text-align: right; padding: 4px 0; padding-right: 8px;">Total Discount</td>`;
      html += `<td style="text-align: right; padding: 4px 0;">-${totalDiscount.toLocaleString()} Ks</td>`;
      html += `</tr>`;
    }
    
    html += `<tr style="font-weight: bold;">`;
    html += `<td colspan="3" style="text-align: right; padding: 4px 0; padding-right: 8px;">Sale Total</td>`;
    html += `<td style="text-align: right; padding: 4px 0;">${sale.total.toLocaleString()} Ks</td>`;
    html += `</tr>`;"""

text = text.replace(old_cons_loop, new_cons_loop)

with open('src/AppCore.tsx', 'w') as f:
    f.write(text)
print("Updated AppCore.tsx")
