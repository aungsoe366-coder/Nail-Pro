import re

with open('src/AppCore.tsx', 'r') as f:
    text = f.read()

old_card_header = """
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-bold text-foreground uppercase tracking-widest [.midnight_&]:text-[#E6DFD9]">
                              {e.category || 'General'}
                            </span>
                            {e.assignedStaff && (
                              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border flex items-center gap-1 [.midnight_&]:bg-[#2E2520] [.midnight_&]:text-[#D4AF37] [.midnight_&]:border-[#D4AF37]/30">
                                <UserIcon size={10} /> {e.assignedStaff}
                              </span>
                            )}
                          </div>
"""

new_card_header = """
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-bold text-foreground uppercase tracking-widest [.midnight_&]:text-[#E6DFD9]">
                              {e.assignedStaff ? `${e.category || 'General'} - ${e.assignedStaff}` : (e.category || 'General')}
                            </span>
                          </div>
"""

if old_card_header.strip() in text:
    text = text.replace(old_card_header.strip(), new_card_header.strip())
    with open('src/AppCore.tsx', 'w') as f:
        f.write(text)
    print("Card header updated")
else:
    # Try Regex or simpler replace
    print("Old card header not found perfectly. Trying regex.")
    old_card_header2 = r'<div className="flex items-center gap-2 flex-wrap">\s*<span className="text-sm font-bold text-foreground uppercase tracking-widest \[\.midnight_&\]:text-\[#E6DFD9\]">\s*\{e\.category \|\| \'General\'\}\s*</span>\s*\{e\.assignedStaff && \(\s*<span className="text-xs font-medium px-2 py-0\.5 rounded-full bg-muted text-muted-foreground border border-border flex items-center gap-1 \[\.midnight_&\]:bg-\[#2E2520\] \[\.midnight_&\]:text-\[#D4AF37\] \[\.midnight_&\]:border-\[#D4AF37\]/30">\s*<UserIcon size=\{10\} /> \{e\.assignedStaff\}\s*</span>\s*\)\}\s*</div>'
    match = re.search(old_card_header2, text)
    if match:
        text = text.replace(match.group(0), new_card_header.strip())
        with open('src/AppCore.tsx', 'w') as f:
            f.write(text)
        print("Card header updated via regex")
    else:
        print("Regex failed too.")
