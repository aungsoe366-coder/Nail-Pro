import re

with open('src/AppCore.tsx', 'r') as f:
    text = f.read()

old_modal = """
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

new_modal = """
      <Modal 
        isOpen={!!selectedExpense} 
        onClose={() => setSelectedExpense(null)} 
        title="Expense Details"
        maxWidth="max-w-md"
      >
        {selectedExpense && (
          <div className="space-y-6">
            <div className="bg-muted/30 p-6 rounded-[2rem] border border-border/50 space-y-6 shadow-inner [.midnight_&]:bg-[#221C18]/50 [.midnight_&]:border-[#D4AF37]/10">
              <div className="bg-background/50 p-5 rounded-2xl border border-border/50 grid grid-cols-2 gap-5 [.midnight_&]:bg-[#1A1613] [.midnight_&]:border-[#3D322C]">
                <div className="space-y-1">
                  <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest block">Category</span>
                  <span className="text-sm font-medium text-foreground [.midnight_&]:text-[#E6DFD9]">{selectedExpense.category || 'General'}</span>
                </div>
                {selectedExpense.assignedStaff && (
                  <div className="space-y-1">
                    <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest block">Paid To</span>
                    <span className="text-sm font-medium text-foreground [.midnight_&]:text-[#D4AF37]">{selectedExpense.assignedStaff}</span>
                  </div>
                )}
                <div className="space-y-1">
                  <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest block">Maker</span>
                  <span className="text-sm font-medium text-foreground [.midnight_&]:text-[#9C9086]">{selectedExpense.createdBy || 'Unknown'}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest block">Date & Time</span>
                  <span className="text-[11px] font-mono text-muted-foreground [.midnight_&]:text-[#9C9086]">
                    {formatDisplayDate(selectedExpense.date)} {new Date(selectedExpense.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest block flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary [.midnight_&]:bg-[#D4AF37]" />
                  Note / Description
                </span>
                <div className="bg-background/50 p-4 rounded-xl border border-border/50 min-h-[80px] [.midnight_&]:bg-[#1A1613] [.midnight_&]:border-[#3D322C]">
                  <span className="text-sm font-medium text-foreground leading-relaxed whitespace-pre-wrap [.midnight_&]:text-[#E6DFD9]">
                    {selectedExpense.desc || 'No description provided.'}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-border/30 flex justify-between items-end [.midnight_&]:border-[#3D322C]">
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Total Amount</span>
                <span className="text-3xl font-mono font-bold text-red-500 [.midnight_&]:text-[#F3C853] tracking-tighter drop-shadow-sm">
                  {selectedExpense.amount.toLocaleString()} <span className="text-sm font-sans font-normal opacity-50">Ks</span>
                </span>
              </div>
            </div>
            <button 
              onClick={() => setSelectedExpense(null)}
              className="w-full py-4 bg-muted hover:bg-muted/80 text-foreground font-bold uppercase tracking-widest text-xs rounded-[1.5rem] transition-colors border border-border/50 shadow-sm [.midnight_&]:bg-[#2E2520] [.midnight_&]:hover:bg-[#3A2F28] [.midnight_&]:text-[#E6DFD9] [.midnight_&]:border-[#D4AF37]/30"
            >
              Close Details
            </button>
          </div>
        )}
      </Modal>
"""

if old_modal in text:
    text = text.replace(old_modal, new_modal)
    with open('src/AppCore.tsx', 'w') as f:
        f.write(text)
    print("Modal updated successfully")
else:
    print("Old modal not found!")
    with open('/tmp/search.txt', 'w') as f:
        f.write(old_modal)
