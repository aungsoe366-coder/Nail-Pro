import re

with open('/tmp/expense_component.tsx', 'r') as f:
    text = f.read()

# Add selectedExpense state
state_match = "const [isExporting, setIsExporting] = useState(false);\n"
if state_match in text:
    text = text.replace(state_match, state_match + "  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);\n")

# Modify card UI
card_regex = r'(<div [^>]*className="group bg-card border border-border rounded-2xl p-5 flex items-center justify-between shadow-sm hover:shadow-md hover:border-primary/30 transition-all relative overflow-hidden \[\.midnight_&\]:bg-\[#221C18\] \[\.midnight_&\]:border-\[#3D322C\] \[\.midnight_&\]:hover:border-\[#D4AF37\]/50"([^>]*)>)'
def card_replacer(match):
    # we need to add onClick and cursor-pointer
    class_name_part = match.group(1)
    if 'cursor-pointer' not in class_name_part:
        new_class_name_part = class_name_part.replace('transition-all relative overflow-hidden', 'transition-all relative overflow-hidden cursor-pointer')
        new_class_name_part = new_class_name_part.replace('<div ', '<div \n                      onClick={() => setSelectedExpense(e)}\n                      ')
        return new_class_name_part
    return match.group(1)

text = re.sub(card_regex, card_replacer, text)

# Modify left flex to min-w-0
text = text.replace('<div className="space-y-1">', '<div className="space-y-1 flex-1 min-w-0">')
text = text.replace('<div className="flex items-start gap-4">', '<div className="flex items-start gap-4 flex-1 min-w-0">')

# Modify right flex to whitespace-nowrap shrink-0
right_side_match = r'(<div className="flex flex-col items-end gap-2 shrink-0 pl-4">)'
text = re.sub(right_side_match, r'\1', text) # we just make sure we don't duplicate. Wait, let's replace the whole right block carefully.

text = text.replace('<div className="text-right">', '<div className="text-right whitespace-nowrap shrink-0">')

# Stop propagation on delete button
text = text.replace('onClick={() => setShowConfirm({ coll: \'expenses\', id: e.id })}', 'onClick={(ev) => { ev.stopPropagation(); setShowConfirm({ coll: \'expenses\', id: e.id }); }}')

# Add Modal
modal_code = """
      <Modal 
        isOpen={!!selectedExpense} 
        onClose={() => setSelectedExpense(null)} 
        title="Expense Details"
      >
        {selectedExpense && (
          <div className="space-y-4">
            <div className="bg-muted/30 p-6 rounded-2xl border border-border/50 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest block">Expense Category</span>
                  <span className="text-sm font-medium text-foreground">{selectedExpense.category || 'General'}</span>
                </div>
                {selectedExpense.assignedStaff && (
                  <div className="space-y-1">
                    <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest block">Paid To (Staff)</span>
                    <span className="text-sm font-medium text-foreground">{selectedExpense.assignedStaff}</span>
                  </div>
                )}
                <div className="space-y-1">
                  <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest block">Added By (Maker)</span>
                  <span className="text-sm font-medium text-foreground">{selectedExpense.createdBy || 'Unknown'}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest block">Date & Time</span>
                  <span className="text-sm font-medium text-foreground">
                    {formatDisplayDate(selectedExpense.date)} {new Date(selectedExpense.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
              
              <div className="pt-4 border-t border-border/30">
                <div className="space-y-1">
                  <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest block">Note / Description</span>
                  <span className="text-sm font-medium text-foreground leading-relaxed whitespace-pre-wrap">
                    {selectedExpense.desc || 'No description provided.'}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-border/30 flex justify-between items-end">
                <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">Total Amount</span>
                <span className="text-2xl font-mono font-bold text-red-500 [.midnight_&]:text-[#F3C853]">
                  {selectedExpense.amount.toLocaleString()} <span className="text-xs font-sans font-normal opacity-50">Ks</span>
                </span>
              </div>
            </div>
            <button 
              onClick={() => setSelectedExpense(null)}
              className="w-full py-3 bg-muted hover:bg-muted/80 text-foreground font-bold uppercase tracking-widest text-xs rounded-xl transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </Modal>
"""

# Insert modal before the final closing div
last_div = text.rfind('</div>\n    </div>\n  );\n};')
if last_div != -1:
    text = text[:last_div] + modal_code + text[last_div:]

with open('/tmp/expense_component_fixed.tsx', 'w') as f:
    f.write(text)

print("Modified expense component")
