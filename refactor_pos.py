import re

with open('src/AppCore.tsx', 'r') as f:
    content = f.read()

# Find the start of POSPage return
return_start = content.find('  return (\n    <div className="flex flex-col lg:flex-row h-auto lg:h-[calc(100vh-73px)] overflow-y-auto lg:overflow-hidden bg-background">')
if return_start == -1:
    print("Could not find start of POSPage return block")
    exit(1)

# The POSPage start
pos_page_start = content.find('export const POSPage: React.FC = () => {')

# Insert state
content = content[:pos_page_start] + content[pos_page_start:].replace(
    '  const [loadingPOS, setLoadingPOS] = useState(true);\n',
    "  const [loadingPOS, setLoadingPOS] = useState(true);\n  const [currentStep, setCurrentStep] = useState<'services' | 'cart' | 'checkout'>('services');\n"
)

# Refetch after replace
return_start = content.find('  return (\n    <div className="flex flex-col lg:flex-row h-auto lg:h-[calc(100vh-73px)] overflow-y-auto lg:overflow-hidden bg-background">')

left_side_start = content.find('      {/* Left Side: Services Selection */}', return_start)
right_side_start = content.find('      {/* Right Side: Cart & Checkout */}', return_start)
loyalty_prompt_start = content.find('      {/* Loyalty Discount Prompt Modal */}', return_start)

services_content = content[left_side_start:right_side_start]

# We need to split the Right Side into Cart and Checkout
right_side_content = content[right_side_start:loyalty_prompt_start]

# In right side:
# 1. Header (p-6 border-b ...)
# 2. Cart Items list (flex-none lg:flex-1 overflow-y-visible lg:overflow-y-auto p-6 space-y-6 scrollbar-hide)
# 3. Checkout Panel (p-6 bg-card border-t ...)

header_start = right_side_content.find('        <div className="p-6 border-b border-border/50 flex justify-between items-center">')
cart_list_start = right_side_content.find('        <div className="flex-none lg:flex-1 overflow-y-visible lg:overflow-y-auto p-6 space-y-6 scrollbar-hide">')
checkout_panel_start = right_side_content.find('        <div className="p-6 bg-card border-t border-border/50 space-y-6 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">')

header_end = cart_list_start
cart_list_end = checkout_panel_start
# checkout_panel_end is the end of right_side_content minus the closing div of right side
checkout_panel_end = right_side_content.rfind('      </div>\n', 0, len(right_side_content) - 5)

header_content = right_side_content[header_start:header_end]
cart_list_content = right_side_content[cart_list_start:cart_list_end]
checkout_content = right_side_content[checkout_panel_start:checkout_panel_end]

# Now let's assemble the new return block
new_return = """  return (
    <div className="flex flex-col h-[calc(100vh-73px)] bg-background">
      {/* Top Wizard Navigation */}
      <div className="flex justify-center items-center p-4 bg-card border-b border-border/50 shrink-0 gap-2 sm:gap-4 z-10 overflow-x-auto shadow-sm">
        <button 
          onClick={() => setCurrentStep('services')} 
          className={cn("px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2", currentStep === 'services' ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-muted/10 text-muted-foreground hover:bg-primary/10 hover:text-primary")}
        >
          <LayoutGrid size={14} />
          1. Services
        </button>
        <ChevronRight size={16} className="text-muted-foreground/30 shrink-0" />
        <button 
          onClick={() => setCurrentStep('cart')} 
          className={cn("px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2", currentStep === 'cart' ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-muted/10 text-muted-foreground hover:bg-primary/10 hover:text-primary")}
        >
          <ShoppingCart size={14} />
          2. Cart
          {cart.length > 0 && (
            <span className={cn("px-2 py-0.5 rounded-full text-[10px]", currentStep === 'cart' ? "bg-white/20" : "bg-primary/10 text-primary")}>
              {cart.length}
            </span>
          )}
        </button>
        <ChevronRight size={16} className="text-muted-foreground/30 shrink-0" />
        <button 
          onClick={() => setCurrentStep('checkout')} 
          className={cn("px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2", currentStep === 'checkout' ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-muted/10 text-muted-foreground hover:bg-primary/10 hover:text-primary")}
        >
          <CreditCard size={14} />
          3. Checkout
        </button>
      </div>

      <div className="flex-1 overflow-hidden relative">
        {currentStep === 'services' && (
          <div className="absolute inset-0 flex flex-col bg-background animate-in fade-in duration-300 z-10">
""" + services_content.replace('      <div className="flex-none lg:flex-1 flex flex-col min-w-0 border-r border-border/50">', '      <div className="flex-1 flex flex-col min-w-0 max-w-5xl mx-auto w-full border-x border-border/50 bg-card/10">').replace('        <div className="flex-none lg:flex-1 overflow-y-visible lg:overflow-y-auto p-4 scrollbar-hide">', '        <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">') + """
            <div className="p-4 bg-card border-t border-border/50 shrink-0 flex justify-end max-w-5xl mx-auto w-full border-x border-border/50">
              <button onClick={() => setCurrentStep('cart')} className="bg-primary text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-sm hover:scale-[1.02] transition-all flex items-center gap-2 shadow-lg shadow-primary/20">
                Proceed to Cart ({cart.length}) <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {currentStep === 'cart' && (
          <div className="absolute inset-0 flex flex-col bg-background animate-in fade-in duration-300 z-10">
            <div className="flex-1 flex flex-col min-w-0 max-w-3xl mx-auto w-full border-x border-border/50 bg-card/50 shadow-[-10px_0_30px_rgba(0,0,0,0.05)]">
""" + header_content + cart_list_content.replace('        <div className="flex-none lg:flex-1 overflow-y-visible lg:overflow-y-auto p-6 space-y-6 scrollbar-hide">', '        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">') + """
              <div className="p-6 bg-card border-t border-border/50 shrink-0 flex justify-between gap-4">
                <button onClick={() => setCurrentStep('services')} className="bg-muted/10 text-muted-foreground hover:text-foreground px-6 py-3 rounded-xl font-black uppercase tracking-widest text-sm transition-all flex items-center gap-2">
                  <ChevronLeft size={16} /> Back
                </button>
                <button onClick={() => setCurrentStep('checkout')} className="bg-primary text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-sm hover:scale-[1.02] transition-all flex items-center gap-2 shadow-lg shadow-primary/20">
                  Proceed to Checkout <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        {currentStep === 'checkout' && (
          <div className="absolute inset-0 flex flex-col bg-background animate-in fade-in duration-300 z-10">
            <div className="flex-1 flex flex-col min-w-0 max-w-3xl mx-auto w-full border-x border-border/50 bg-card shadow-[0_-10px_30px_rgba(0,0,0,0.05)] overflow-y-auto scrollbar-hide">
""" + checkout_content.replace('        <div className="p-6 bg-card border-t border-border/50 space-y-6 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">', '        <div className="p-6 space-y-6">') + """
              <div className="p-6 bg-card shrink-0 flex justify-start pb-10">
                <button onClick={() => setCurrentStep('cart')} className="bg-muted/10 text-muted-foreground hover:text-foreground px-6 py-3 rounded-xl font-black uppercase tracking-widest text-sm transition-all flex items-center gap-2">
                  <ChevronLeft size={16} /> Back to Cart
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

""" + content[loyalty_prompt_start:]

new_content = content[:return_start] + new_return

with open('src/AppCore.tsx', 'w') as f:
    f.write(new_content)

print("Refactored AppCore.tsx successfully")
