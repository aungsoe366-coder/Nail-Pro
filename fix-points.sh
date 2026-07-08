#!/bin/bash
sed -i -e '/value={pointsToRedeem || '"'"''"'"'}/,/className="w-full bg-input/c\
                      value={pointsToRedeem || '"'"''"'"'}\
                      onChange={(e) => {\
                        const val = Math.min(Number(e.target.value), (selectedCustomer?.points || 0));\
                        setPointsToRedeem(Math.max(0, val));\
                      }}\
                      className="w-full bg-input border border-border/50 rounded-xl pl-4 pr-12 py-2.5 text-xs font-black text-foreground focus:border-primary outline-none transition-all"' src/AppCore.tsx
