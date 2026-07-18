import re

with open('src/AppCore.tsx', 'r') as f:
    text = f.read()

# Replace generateReceiptText with generateReceiptHTML
old_receipt_text = """const generateReceiptText = (sale: Omit<Sale, 'id'>, settings: ShopSettings | null) => {
  const pad = (str: string, len: number) => str.length >= len ? str.substring(0, len) : str + ' '.repeat(len - str.length);
  const padL = (str: string, len: number) => str.length >= len ? str.substring(0, len) : ' '.repeat(len - str.length) + str;
  const center = (str: string, len: number) => {
    if(str.length >= len) return str.substring(0, len);
    const left = Math.floor((len - str.length) / 2);
    return ' '.repeat(left) + str + ' '.repeat(len - str.length - left);
  };
  let text = "";
  
  if (settings?.receiptHeader) {
    const headerLines = settings.receiptHeader.match(/.{1,32}/g) || [settings.receiptHeader];
    headerLines.forEach(l => text += center(l.trim(), 32) + "\\n");
  }
  if (!settings?.hideShopNameOnReceipt) {
    text += center(settings?.name || "NAIL PRO BEAUTY STUDIO", 32) + "\\n";
  }
  const address = settings?.addr || "";
  const addrLines = address.match(/.{1,32}/g) || [address];
  addrLines.forEach(l => text += center(l.trim(), 32) + "\\n");
  text += center("Ph: " + (settings?.ph || ""), 32) + "\\n";
  text += "-".repeat(32) + "\\n";
  
  if (!settings?.hideDateTimeOnReceipt) {
    text += `Date   : ${new Date(sale.dateTime).toLocaleString()}\\n`;
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
      text += `Staff  : ${uniqueStaff.join(', ')}\\n`;
    } else if (sale.staff) {
      text += `Staff  : ${sale.staff}\\n`;
    }
  }
  text += "-".repeat(32) + "\\n";
  text += "Item           Qty Price  Total\\n";
  text += "-".repeat(32) + "\\n";
  sale.items.forEach(item => {
    const sub = item.price * item.qty;
    const netSub = sub - (sub * (item.disP / 100));
    let fullItemName = item.name + (item.disP > 0 ? `(-${item.disP}%)` : "");
    let nameChunks = fullItemName.match(/.{1,14}/g) || [fullItemName];
    text += pad(nameChunks[0], 14) + " " + padL(item.qty.toString(), 3) + " " + padL(item.price.toString(), 6) + " " + padL(netSub.toString(), 6) + "\\n";
    if (nameChunks.length > 1) {
      for (let i = 1; i < nameChunks.length; i++) { text += pad(nameChunks[i], 14) + "\\n"; }
    }
  });
  text += "-".repeat(32) + "\\n";
  text += pad("NET TOTAL", 18) + padL(sale.total.toLocaleString() + " Ks", 14) + "\\n";
  if (!settings?.hideLoyaltyPointsOnReceipt && (sale.pointsEarned || sale.pointsRedeemed)) {
    text += "-".repeat(32) + "\\n";
    if (sale.pointsEarned) text += pad("Points Earned", 18) + padL("+" + sale.pointsEarned, 14) + "\\n";
    if (sale.pointsRedeemed) text += pad("Points Redeemed", 18) + padL("-" + sale.pointsRedeemed, 14) + "\\n";
  }
  text += "-".repeat(32) + "\\n";
  
  const footerText = settings?.receiptFooter || "Thank You! Please Come Again";
  const footerLines = footerText.match(/.{1,32}/g) || [footerText];
  footerLines.forEach(l => text += center(l.trim(), 32) + "\\n");
  text += "\\n\\n\\n";
  return text;
};"""

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
  html += `<td style="text-align: left; padding: 4px 0;">NET TOTAL</td>`;
  html += `<td style="text-align: right; padding: 4px 0;">${sale.total.toLocaleString()} Ks</td>`;
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

if old_receipt_text in text:
    text = text.replace(old_receipt_text, new_receipt_html)
    print("Replaced generateReceiptText with generateReceiptHTML successfully.")
else:
    print("Could not find old_receipt_text perfectly. Will use regex or manual replace.")

# Now replace usages of generateReceiptText
text = text.replace('generateReceiptText(sale, shopSettings)', 'generateReceiptHTML(sale, shopSettings)')
text = text.replace('generateReceiptText(pendingSaleParams.sale, shopSettings)', 'generateReceiptHTML(pendingSaleParams.sale, shopSettings)')

# In the Capacitor/Native platform block, replace replacing tags with rendering the HTML directly
old_capacitor_print = """        if (Capacitor.isNativePlatform()) {
          const htmlStr = "<html><body style='margin:0;padding:10px;'><pre style='font-family:monospace;font-size:12px;'>" + printText.replace(/</g, '&lt;').replace(/>/g, '&gt;') + "</pre></body></html>";
          CapPrinter.printHtml({ name: 'Receipt', html: htmlStr }).catch(e => {"""
new_capacitor_print = """        if (Capacitor.isNativePlatform()) {
          const htmlStr = `<html><body style='margin:0;padding:10px;'>${printText}</body></html>`;
          CapPrinter.printHtml({ name: 'Receipt', html: htmlStr }).catch(e => {"""
if old_capacitor_print in text:
    text = text.replace(old_capacitor_print, new_capacitor_print)
    print("Updated Capacitor print logic.")
else:
    print("Could not find old_capacitor_print.")

# In PrintPreviewModal, replace the <pre> tag with dangerouslySetInnerHTML
old_preview_modal = """const PrintPreviewModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  text: string;
  onPrint: () => void;
  onSkipPrint?: () => void;
  title?: string;
  printLabel?: string;
  skipLabel?: string;
}> = ({ isOpen, onClose, text, onPrint, onSkipPrint, title = "Print Preview", printLabel = "Process & Print", skipLabel = "Complete Without Printing" }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[30000] flex items-center justify-center p-4 bg-black/60 ">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-card w-full max-w-md rounded-[2rem] shadow-2xl border border-border flex flex-col overflow-hidden max-h-[calc(100dvh-40px)]"
      >
        <div className="p-6 border-b border-border flex justify-between items-center bg-muted/10 shrink-0">
          <h3 className="font-bold text-lg tracking-tight flex items-center gap-2">
            <Printer size={20} className="text-primary [.midnight_&]:text-amber-400" />
            {title}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-xl transition-colors"><X size={20} /></button>
        </div>
        
        <div className="p-6 overflow-y-auto bg-muted/20 flex-1 flex justify-center custom-scrollbar">
          <div className="bg-white text-black  p-6 shadow-md shadow-black/5" style={{ minWidth: '320px' }}>
            <pre className="font-mono text-[12px] leading-[1.4] whitespace-pre-wrap font-medium">
              {text}
            </pre>
          </div>
        </div>
        <div className="p-6 border-t border-border bg-card shrink-0 space-y-3">
          <button
            onClick={() => { onPrint(); onClose(); }}
            className="w-full bg-primary text-primary-foreground [.midnight_&]:bg-secondary [.midnight_&]:text-primary [.midnight_&]:border [.midnight_&]:border-primary py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/20"
          >
            <Printer size={20} />
            {printLabel}
          </button>
          
          {onSkipPrint && (
            <button
              onClick={() => { onSkipPrint(); onClose(); }}
              className="w-full bg-muted text-muted-foreground [.midnight_&]:text-slate-300 hover:text-foreground [.midnight_&]:hover:text-slate-200 py-4 rounded-2xl font-bold transition-colors"
            >
              {skipLabel}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};"""

new_preview_modal = """const PrintPreviewModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  text: string;
  onPrint: () => void;
  onSkipPrint?: () => void;
  title?: string;
  printLabel?: string;
  skipLabel?: string;
}> = ({ isOpen, onClose, text, onPrint, onSkipPrint, title = "Print Preview", printLabel = "Process & Print", skipLabel = "Complete Without Printing" }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[30000] flex items-center justify-center p-4 bg-black/60 ">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-card w-full max-w-md rounded-[2rem] shadow-2xl border border-border flex flex-col overflow-hidden max-h-[calc(100dvh-40px)]"
      >
        <div className="p-6 border-b border-border flex justify-between items-center bg-muted/10 shrink-0">
          <h3 className="font-bold text-lg tracking-tight flex items-center gap-2">
            <Printer size={20} className="text-primary [.midnight_&]:text-amber-400" />
            {title}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-xl transition-colors"><X size={20} /></button>
        </div>
        
        <div className="p-6 overflow-y-auto bg-muted/20 flex-1 flex justify-center custom-scrollbar">
          <div className="bg-white text-black p-6 shadow-md shadow-black/5 flex justify-center" style={{ minWidth: '320px' }}>
            <div dangerouslySetInnerHTML={{ __html: text }} />
          </div>
        </div>
        <div className="p-6 border-t border-border bg-card shrink-0 space-y-3">
          <button
            onClick={() => { onPrint(); onClose(); }}
            className="w-full bg-primary text-primary-foreground [.midnight_&]:bg-secondary [.midnight_&]:text-primary [.midnight_&]:border [.midnight_&]:border-primary py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/20"
          >
            <Printer size={20} />
            {printLabel}
          </button>
          
          {onSkipPrint && (
            <button
              onClick={() => { onSkipPrint(); onClose(); }}
              className="w-full bg-muted text-muted-foreground [.midnight_&]:text-slate-300 hover:text-foreground [.midnight_&]:hover:text-slate-200 py-4 rounded-2xl font-bold transition-colors"
            >
              {skipLabel}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};"""

if old_preview_modal in text:
    text = text.replace(old_preview_modal, new_preview_modal)
    print("Updated PrintPreviewModal successfully.")
else:
    print("Could not find old_preview_modal.")

with open('src/AppCore.tsx', 'w') as f:
    f.write(text)

print("Done updating receipt logic.")
