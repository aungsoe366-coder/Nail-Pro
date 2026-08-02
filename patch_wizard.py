import re

with open('src/AppCore.tsx', 'r') as f:
    content = f.read()

start = content.find('{/* Top Wizard Navigation */}')
end = content.find('      <div className="flex-1 overflow-hidden relative">')

wizard = """      {/* Top Wizard Navigation */}
      <div className="flex justify-center items-center p-4 bg-card border-b border-border/50 shrink-0 z-10 w-full relative">
        <div className="flex items-center w-full max-w-2xl mx-auto justify-between relative px-4 sm:px-10">
          {/* Progress Line */}
          <div className="absolute top-5 left-8 right-8 sm:left-14 sm:right-14 h-[2px] bg-border/50 -translate-y-1/2 z-0 rounded-full" />
          <div className="absolute top-5 left-8 sm:left-14 h-[2px] bg-primary -translate-y-1/2 z-0 rounded-full transition-all duration-500" style={{ width: currentStep === 'services' ? '0%' : currentStep === 'cart' ? '50%' : '100%' }} />

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
                className="relative z-10 flex flex-col items-center gap-2 group outline-none w-16 sm:w-20"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${stateClass} bg-card`}>
                  <step.icon size={18} className={isActive ? "animate-pulse" : ""} />
                  {step.id === 'cart' && cart.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-background shadow-sm">
                      {cart.length}
                    </span>
                  )}
                </div>
                <span className={`text-[10px] sm:text-xs font-black uppercase tracking-widest transition-colors text-center ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                  {step.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>

"""

content = content[:start] + wizard + content[end:]

with open('src/AppCore.tsx', 'w') as f:
    f.write(content)
