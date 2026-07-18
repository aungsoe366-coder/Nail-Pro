import re

# 1. Update types.ts
with open('src/types.ts', 'r') as f:
    text = f.read()

text = text.replace('  date: string;\n  desc: string;', '  date: string;\n  dateTime?: string;\n  desc: string;')

with open('src/types.ts', 'w') as f:
    f.write(text)


# 2. Update AppCore.tsx
with open('src/AppCore.tsx', 'r') as f:
    text = f.read()

# Fix handleAddExpense
text = text.replace("""const newExpense: any = {
         date: localDateStr,
         desc: expDesc,""", """const newExpense: any = {
         date: localDateStr,
         dateTime: now.toISOString(),
         desc: expDesc,""")

# Fix time displays
text = text.replace("""<Clock size={10} /> {new Date(e.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}""", """<Clock size={10} /> {new Date(e.dateTime || e.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}""")

text = text.replace("""{formatDisplayDate(selectedExpense.date)} {new Date(selectedExpense.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}""", """{formatDisplayDate(selectedExpense.date)} {new Date(selectedExpense.dateTime || selectedExpense.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}""")

# Remove the delete button from the card list view
old_card_action = """<div className="flex flex-col items-end gap-2 shrink-0 pl-4">
                        <div className="text-right whitespace-nowrap shrink-0">
                          <span className="text-lg sm:text-xl font-mono font-bold text-red-500 group-hover:text-red-600 transition-colors [.midnight_&]:text-[#D4AF37] [.midnight_&]:group-hover:text-[#F3C853]">
                            {e.amount.toLocaleString()} <span className="text-[10px] sm:text-xs font-sans font-normal opacity-50">Ks</span>
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {isAdmin && (
                            <button 
                              onClick={(ev) => { ev.stopPropagation(); setShowConfirm({ coll: 'expenses', id: e.id }); }} 
                              className="w-8 h-8 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm opacity-0 group-hover:opacity-100"
                              title="Delete Expense"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </div>"""

new_card_action = """<div className="flex flex-col items-end gap-2 shrink-0 pl-4">
                        <div className="text-right whitespace-nowrap shrink-0">
                          <span className="text-lg sm:text-xl font-mono font-bold text-red-500 group-hover:text-red-600 transition-colors [.midnight_&]:text-[#D4AF37] [.midnight_&]:group-hover:text-[#F3C853]">
                            {e.amount.toLocaleString()} <span className="text-[10px] sm:text-xs font-sans font-normal opacity-50">Ks</span>
                          </span>
                        </div>
                      </div>"""

text = text.replace(old_card_action, new_card_action)

with open('src/AppCore.tsx', 'w') as f:
    f.write(text)

print("Updates applied.")
