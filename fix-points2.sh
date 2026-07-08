#!/bin/bash
sed -i -e '/value={pointsToRedeem}/,/className="w-full p-2 text-xs border/c\
                              value={pointsToRedeem}\
                              onChange={(e) => {\
                                const val = Math.min(Number(e.target.value), (customers.find(c => c.id === selectedCustId)?.points || 0));\
                                setPointsToRedeem(Math.max(0, val));\
                              }}\
                              className="w-full p-2 text-xs border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 bg-input text-foreground [.midnight_&]:text-slate-200 shadow-inner font-bold"' src/AppCore.tsx
