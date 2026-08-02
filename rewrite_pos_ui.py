import re

with open('src/AppCore.tsx', 'r') as f:
    content = f.read()

# 1. Fix h-[calc(100vh-73px)] to h-[calc(100dvh-73px)]
content = content.replace('className="flex flex-col h-[calc(100vh-73px)] bg-background"', 'className="flex flex-col h-[calc(100dvh-73px)] bg-background"')

# 2. Top Wizard Navigation
wizard_start = content.find('      {/* Top Wizard Navigation */}')
wizard_end = content.find('      <div className="flex-1 overflow-hidden relative">')

new_wizard = """      {/* Top Wizard Navigation */}
      <div className="flex justify-center items-center p-3 sm:p-4 bg-card border-b border-border/50 shrink-0 z-10 w-full">
        <div className="flex items-center w-full max-w-3xl mx-auto justify-between relative px-2">
          {/* Progress Line */}
          <div className="absolute top-1/2 left-0 w-full h-[2px] bg-border/50 -translate-y-1/2 z-0 rounded-full" />
          <div className="absolute top-1/2 left-0 h-[2px] bg-primary -translate-y-1/2 z-0 rounded-full transition-all duration-500" style={{ width: currentStep === 'services' ? '0%' : currentStep === 'cart' ? '50%' : '100%' }} />

          {/* Steps */}
          {[
            { id: 'services', icon: LayoutGrid, label: 'Services' },
            { id: 'cart', icon: ShoppingCart, label: 'Cart' },
            { id: 'checkout', icon: CreditCard, label: 'Checkout' }
          ].map((step, idx) => {
            const isActive = currentStep === step.id;
            const isPast = ['services', 'cart', 'checkout'].indexOf(currentStep) > idx;
            const isCompleted = isPast;
            const stateClass = isActive ? "bg-primary text-white shadow-[0_0_15px_rgba(var(--primary),0.4)] border-primary scale-110" : isCompleted ? "bg-primary/20 text-primary border-primary/30" : "bg-card text-muted-foreground border-border/50";
            
            return (
              <button
                key={step.id}
                onClick={() => setCurrentStep(step.id as any)}
                className="relative z-10 flex flex-col items-center gap-1.5 sm:gap-2 group outline-none"
              >
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${stateClass}`}>
                  <step.icon size={16} className={isActive ? "animate-pulse" : ""} />
                  {step.id === 'cart' && cart.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-red-500 text-white text-[9px] sm:text-[10px] font-black flex items-center justify-center rounded-full border-2 border-background shadow-sm">
                      {cart.length}
                    </span>
                  )}
                </div>
                <span className={`text-[9px] sm:text-[11px] font-black uppercase tracking-widest transition-colors ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                  {step.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>\n\n"""

content = content[:wizard_start] + new_wizard + content[wizard_end:]

# 3. Services List bottom padding and bottom button absolute positioning
# Let's find:
# <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
#   <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
content = content.replace(
    '<div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">',
    '<div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 pb-28">'
)

# And replace the "Proceed to Cart" container with absolute bottom container
proceed_cart_start = content.find('            <div className="p-4 bg-card border-t border-border/50 shrink-0 flex justify-end max-w-5xl mx-auto w-full border-x border-border/50">')
proceed_cart_end = content.find('          </div>\n        )}', proceed_cart_start)

# We need to change the parent of the services to relative if it's not already, actually `absolute inset-0` is already relative/absolute so its children can be positioned relative to it.
new_proceed_cart = """            <div className="absolute bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-md border-t border-border/50 shrink-0 flex justify-center w-full shadow-[0_-10px_30px_rgba(0,0,0,0.05)] z-20">
              <div className="w-full max-w-5xl mx-auto flex justify-end">
                <button onClick={() => setCurrentStep('cart')} className="bg-primary text-primary-foreground [.midnight_&]:text-primary [.midnight_&]:bg-secondary [.midnight_&]:border [.midnight_&]:border-primary px-8 py-3.5 rounded-2xl font-black uppercase tracking-[0.2em] text-sm hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3 shadow-2xl shadow-primary/30 group">
                  PROCEED TO CART <div className="bg-white/20 px-2 py-0.5 rounded-full text-xs group-hover:bg-white/30 transition-colors">{cart.length}</div> <ChevronRight size={18} />
                </button>
              </div>
            </div>\n"""

content = content[:proceed_cart_start] + new_proceed_cart + content[proceed_cart_end:]

# Same for Cart -> Proceed to checkout? The prompt said "Ensure the PROCEED TO CART sticky button at the bottom stays fixed beautifully". It didn't explicitly mention checkout, but let's apply a similar fix to cart just in case.
# Wait, Cart step has:
# <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
# Let's add pb-28 there too
content = content.replace(
    '<div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">',
    '<div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide pb-28">'
)

proceed_checkout_start = content.find('              <div className="p-6 bg-card border-t border-border/50 shrink-0 flex justify-between gap-4">')
proceed_checkout_end = content.find('            </div>\n          </div>\n        )}', proceed_checkout_start)
if proceed_checkout_start != -1 and proceed_checkout_end != -1:
    new_proceed_checkout = """              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-background/80 backdrop-blur-md border-t border-border/50 shrink-0 flex justify-between gap-4 w-full shadow-[0_-10px_30px_rgba(0,0,0,0.05)] z-20">
                <div className="w-full max-w-3xl mx-auto flex justify-between gap-4">
                  <button onClick={() => setCurrentStep('services')} className="bg-muted/10 text-muted-foreground hover:text-foreground px-6 py-3.5 rounded-2xl font-black uppercase tracking-[0.2em] text-sm transition-all flex items-center gap-2 hover:bg-muted/20">
                    <ChevronLeft size={16} /> Back
                  </button>
                  <button onClick={() => setCurrentStep('checkout')} className="bg-primary text-primary-foreground [.midnight_&]:text-primary [.midnight_&]:bg-secondary [.midnight_&]:border [.midnight_&]:border-primary px-8 py-3.5 rounded-2xl font-black uppercase tracking-[0.2em] text-sm hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3 shadow-2xl shadow-primary/30">
                    CHECKOUT <ChevronRight size={18} />
                  </button>
                </div>
              </div>\n"""
    content = content[:proceed_checkout_start] + new_proceed_checkout + content[proceed_checkout_end:]

# 4. Same for Checkout Back to Cart? Wait, checkout has the Checkout button directly inside it. And a "Back to Cart" at the bottom.
checkout_back_start = content.find('              <div className="p-6 bg-card shrink-0 flex justify-start pb-10">')
checkout_back_end = content.find('            </div>\n          </div>\n        )}', checkout_back_start)
if checkout_back_start != -1 and checkout_back_end != -1:
    new_checkout_back = """              <div className="p-6 bg-card shrink-0 flex justify-start pb-28">
                <button onClick={() => setCurrentStep('cart')} className="bg-muted/10 text-muted-foreground hover:text-foreground px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-sm transition-all flex items-center gap-2 hover:bg-muted/20">
                  <ChevronLeft size={16} /> Back to Cart
                </button>
              </div>\n"""
    content = content[:checkout_back_start] + new_checkout_back + content[checkout_back_end:]


with open('src/AppCore.tsx', 'w') as f:
    f.write(content)
