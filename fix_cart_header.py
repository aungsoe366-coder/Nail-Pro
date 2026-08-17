import re

with open('src/AppCore.tsx', 'r') as f:
    content = f.read()

lines = content.split('\n')
start_idx = -1
end_idx = -1

for i, line in enumerate(lines):
    if ") : (" in line and start_idx == -1:
        if i + 1 < len(lines) and "div className=\"space-y-4\"" in lines[i+1]:
            start_idx = i

if start_idx != -1:
    for i in range(start_idx, len(lines)):
        if "Clear All" in lines[i] and "</button>" in lines[i+1]:
            end_idx = i + 2
            break

print("Start idx", start_idx)
print("End idx", end_idx)

if start_idx != -1 and end_idx != -1:
    replacement = """          ) : (
            <div className="space-y-5">
              <div className="flex justify-between items-center bg-card/60 border-2 border-border/50 p-4 sm:p-5 rounded-2xl backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
                    <ShoppingCart size={20} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="font-black text-foreground text-sm sm:text-base tracking-tight">
                      Order Items
                    </h3>
                    <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">
                      {cart.length} {cart.length === 1 ? 'Service' : 'Services'} Selected
                    </p>
                  </div>
                </div>
                <button 
                  type="button"
                  onClick={handleClearAllCart} 
                  disabled={cart.length === 0}
                  className="text-xs text-red-500/70 font-black uppercase tracking-widest hover:bg-red-500/10 hover:text-red-500 px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 disabled:opacity-40 disabled:pointer-events-none active:scale-95 border border-transparent hover:border-red-500/20"
                >
                  <Trash2 size={14} strokeWidth={2.5} /> <span className="hidden sm:inline">Clear All</span>
                </button>
              </div>"""

    new_content = "\n".join(lines[:start_idx]) + "\n" + replacement + "\n" + "\n".join(lines[end_idx:])
    with open('src/AppCore.tsx', 'w') as f:
        f.write(new_content)
    print("Replaced!")

