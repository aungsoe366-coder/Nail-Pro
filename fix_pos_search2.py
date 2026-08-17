import re

with open('src/AppCore.tsx', 'r') as f:
    content = f.read()

target = """            {/* Search and Category Filter */}
            <div className="bg-card border border-border rounded-2xl p-4 space-y-4">
              <div className="relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search services..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-input border border-border rounded-xl pl-12 pr-10 py-3.5 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition-all font-medium"
                />
                {search && (
                  <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-red-500 transition-colors">
                    <X size={18} />
                  </button>
                )}
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {categoryList.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`whitespace-nowrap px-3 md:px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all shrink-0 ${
                      selectedCategory === cat 
                        ? 'bg-primary text-primary-foreground shadow-primary/20' 
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>"""

target = target.strip()

import textwrap

# Try a more resilient replace
lines = content.split('\\n')
start_idx = -1
end_idx = -1
for i, line in enumerate(lines):
    if "{/* Search and Category Filter */}" in line:
        start_idx = i
        break

if start_idx != -1:
    for i in range(start_idx, len(lines)):
        if "filteredServices.length === 0" in lines[i]:
            end_idx = i - 1
            break

if start_idx != -1 and end_idx != -1:
    # Check if it contains the old code
    snippet = "\\n".join(lines[start_idx:end_idx])
    if "Search services..." in snippet:
        # We replace
        replacement = """            {/* Search and Category Filter */}
            <div className="flex flex-col gap-5 mb-8">
              {/* Search Bar */}
              <div className="relative max-w-2xl mx-auto w-full group">
                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                  <Search size={22} strokeWidth={2} />
                </div>
                <input
                  type="text"
                  placeholder="Search for a service..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-card border-2 border-border/60 rounded-full pl-14 pr-14 py-4 text-base font-medium text-foreground placeholder-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all shadow-sm hover:border-border/80"
                />
                {search && (
                  <button 
                    onClick={() => setSearch('')} 
                    className="absolute inset-y-0 right-4 flex items-center text-muted-foreground hover:text-red-500 transition-colors"
                  >
                    <div className="p-1.5 bg-muted rounded-full group-hover:bg-muted/80">
                      <X size={16} strokeWidth={2.5} />
                    </div>
                  </button>
                )}
              </div>

              {/* Category Chips */}
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide md:flex-wrap md:justify-center px-1">
                {categoryList.map(cat => {
                  const isSelected = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`whitespace-nowrap px-5 py-2.5 rounded-full font-bold text-[11px] uppercase tracking-widest transition-all shrink-0 border ${
                        isSelected 
                          ? 'bg-primary border-primary text-primary-foreground shadow-md shadow-primary/25 scale-[1.02]' 
                          : 'bg-card border-border text-muted-foreground hover:border-primary/40 hover:text-foreground hover:bg-muted/30 active:scale-95'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>"""
        
        new_content = "\\n".join(lines[:start_idx]) + "\\n" + replacement + "\\n" + "\\n".join(lines[end_idx+1:])
        with open('src/AppCore.tsx', 'w') as f:
            f.write(new_content)
        print("Success regex")
    else:
        print("Already replaced or not found")
else:
    print("Could not find boundaries")

