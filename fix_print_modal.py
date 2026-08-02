import sys

with open('src/AppCore.tsx', 'r') as f:
    content = f.read()

# Replace <PrintView inside POSPage with <PrintPreviewModal
# Need to be careful to only replace the one with `onClose`
old_modal = """<PrintView
          sale={pendingSaleParams.sale}
          settings={shopSettings}
          onClose={() => {
            setShowPrintPreview(false);
            setPendingSaleParams(null);
          }}
          text={generateReceiptHTML(pendingSaleParams.sale, shopSettings)}
          onPrint={() => confirmCheckout(true)}
          onSkipPrint={() => confirmCheckout(false)}
          title="Checkout & Print Preview"
        />"""

new_modal = """<PrintPreviewModal
          isOpen={true}
          onClose={() => {
            setShowPrintPreview(false);
            setPendingSaleParams(null);
          }}
          text={generateReceiptHTML(pendingSaleParams.sale, shopSettings)}
          onPrint={() => confirmCheckout(true)}
          onSkipPrint={() => confirmCheckout(false)}
          title="Checkout & Print Preview"
        />"""

if old_modal in content:
    content = content.replace(old_modal, new_modal)
else:
    print("Old modal string not found exactly. Falling back to simple replace.")
    content = content.replace("<PrintView\n          sale={pendingSaleParams.sale}\n          settings={shopSettings}\n          onClose=", "<PrintPreviewModal\n          isOpen={true}\n          onClose=")

with open('src/AppCore.tsx', 'w') as f:
    f.write(content)

print("Fixed PrintPreviewModal.")
