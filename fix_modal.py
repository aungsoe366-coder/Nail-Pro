import re

with open('src/AppCore.tsx', 'r') as f:
    text = f.read()

# Add Transaction ID to modal
# Find the start of the modal grid
grid_start = '<div className="bg-background/50 p-5 rounded-2xl border border-border/50 grid grid-cols-2 gap-5 [.midnight_&]:bg-[#1A1613] [.midnight_&]:border-[#3D322C]">'

txn_id_element = """
                <div className="space-y-1 col-span-2">
                  <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest block">Transaction ID (Txn ID)</span>
                  <span className="text-[10px] font-mono text-muted-foreground [.midnight_&]:text-[#9C9086] truncate block">{selectedExpense.id}</span>
                </div>
"""

# Let's insert the txn id right inside the grid
if grid_start in text:
    text = text.replace(grid_start, grid_start + txn_id_element)

# Add the Delete Button to the Modal
# Ensure isAdmin logic exists, maybe `profile?.role === 'super_admin' || profile?.role === 'owner'`
delete_btn_code = """
            <div className="flex gap-3">
              {(profile?.role === 'super_admin' || profile?.role === 'owner') && (
                <button 
                  onClick={() => {
                    setSelectedExpense(null);
                    setShowConfirm({ coll: 'expenses', id: selectedExpense.id! });
                  }}
                  className="py-4 px-6 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white font-bold uppercase tracking-widest text-xs rounded-[1.5rem] transition-colors border border-red-500/20 shadow-sm flex items-center justify-center"
                  title="Delete Expense"
                >
                  <Trash2 size={18} />
                </button>
              )}
              <button 
                onClick={() => setSelectedExpense(null)}
                className="flex-1 py-4 bg-muted hover:bg-muted/80 text-foreground font-bold uppercase tracking-widest text-xs rounded-[1.5rem] transition-colors border border-border/50 shadow-sm [.midnight_&]:bg-[#2E2520] [.midnight_&]:hover:bg-[#3A2F28] [.midnight_&]:text-[#E6DFD9] [.midnight_&]:border-[#D4AF37]/30"
              >
                Close Details
              </button>
            </div>
"""

old_close_btn = """
            <button 
              onClick={() => setSelectedExpense(null)}
              className="w-full py-4 bg-muted hover:bg-muted/80 text-foreground font-bold uppercase tracking-widest text-xs rounded-[1.5rem] transition-colors border border-border/50 shadow-sm [.midnight_&]:bg-[#2E2520] [.midnight_&]:hover:bg-[#3A2F28] [.midnight_&]:text-[#E6DFD9] [.midnight_&]:border-[#D4AF37]/30"
            >
              Close Details
            </button>
"""

if old_close_btn in text:
    text = text.replace(old_close_btn, delete_btn_code)
else:
    print("Old close button not found!")


with open('src/AppCore.tsx', 'w') as f:
    f.write(text)
print("Updated modal.")
